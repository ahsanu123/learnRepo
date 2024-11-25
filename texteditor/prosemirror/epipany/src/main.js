import { keymap } from "prosemirror-keymap"
import { EditorState, Selection, NodeSelection } from "prosemirror-state"
import { EditorView } from "prosemirror-view"
import { DOMParser } from "prosemirror-model"
import 'prosemirror-view/style/prosemirror.css'
import 'prosemirror-menu/style/menu.css'
import 'prosemirror-gapcursor/style/gapcursor.css'
import './style.css'
import { baseKeymap } from "prosemirror-commands"
import TagsView from "./tags"
import GalleryView from "./gallery"
import EquationView from "./equation"
import { gapCursor } from "prosemirror-gapcursor"
import textSchema from "./textschema"
import EquationManager from "./equation_manager"
import InlineEquationView from "./inline_equation"
import EquationRefView from "./equation_ref"
import VideoView from "./video"
import TwitterView from "./twitter"
import { history } from "prosemirror-history"
import { buildKeymap } from "./keymap"
import { dropCursor } from "prosemirror-dropcursor"
import CodeBlockView from "./code"
import limpidPlugin from "./limpid_plugin"
import trailingSpacePlugin from "./trailing_space_plugin"
import { Tree } from "./tree"
import menuPlugin from "./slashmenu"
import formatterPlugin from "./formatter_view"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { findParentNode } from "@tiptap/core";
import UpdateTimer from "./update_timer"
import { createId } from '@paralleldrive/cuid2';
import { djot2prosemirror, prosemirror2djot } from './djot'
import * as djot from '@djot/djot'
import { tauri_invoke, tauri_dialog } from "./tauri_mock"
//https://pictogrammers.com/library/mdi/

dayjs.extend(relativeTime);
let tree = null;
let menuFolded = false;
let workspaceData = null;
let currentLoadedNodeId = null;

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

document.getElementById("main").style.backgroundImage = `url('/bg${getRandomInt(12)}.png')`;
let equationManager = new EquationManager();

function arrowHandler(dir) {
  return (state, dispatch, view) => {
    if (state.selection.empty && view.endOfTextblock(dir)) {
      let side = dir == "left" || dir == "up" ? -1 : 1
      let $head = state.selection.$head
      let nextPos = Selection.near(
        state.doc.resolve(side > 0 ? $head.after() : $head.before()), side)
      if (nextPos.$head && nextPos.$head.parent.type.name == "code_block") {
        dispatch(state.tr.setSelection(nextPos))
        return true
      }
    }
    return false
  }
}

let editorElm = document.querySelector("#editor");
let updateContentTimer = null;

function scrollHeadingIntoViewById(id) {
  window.editorView.state.doc.forEach((node, offset, index) => {
    if (node.type.name === 'heading' && node.attrs.id === id) {
      let ns = NodeSelection.create(window.editorView.state.doc, offset);
      window.editorView.focus();
      let tr = window.editorView.state.tr.setSelection(ns).scrollIntoView();
      window.editorView.dispatch(tr);
      return false;
    }
  })
}

function updateContent() {
  let containerElem = document.getElementById('toc-container-list');

  while (containerElem.firstChild) {
    containerElem.removeChild(containerElem.firstChild);
  }

  let indentation = 0;
  let currentLevel = 2;
  for (let i = 0; i < window.editorView.state.doc.content.content.length; ++i) {
    let node = window.editorView.state.doc.content.content[i];
    if (node.type.name === 'heading') {

      if (node.attrs.level > currentLevel) {
        indentation += 10;
        currentLevel = node.attrs.level;
      }
      else if (node.attrs.level < currentLevel) {
        indentation -= 10;
        currentLevel = node.attrs.level;
      }

      let elem = document.createElement('div');
      elem.classList.add('toc-container-item');
      const id = node.attrs.id;
      elem.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setTimeout(() => {
          scrollHeadingIntoViewById(id);
        }, 100);
      }
      elem.style.paddingLeft = (16 + indentation) + 'px';
      let span = document.createElement('span');
      span.innerText = node.textContent;
      elem.appendChild(span);
      containerElem.appendChild(elem);
    }
  }
}

const arrowHandlers = keymap({
  ArrowLeft: arrowHandler("left"),
  ArrowRight: arrowHandler("right"),
  ArrowUp: arrowHandler("up"),
  ArrowDown: arrowHandler("down")
})

const findHeading = findParentNode(
  (node) => node.type.name === "heading"
);

let updateTimer = null;
let docUpdateDelay = null;

window.editorView = new EditorView(editorElm, {
  state: EditorState.create({
    doc: DOMParser.fromSchema(textSchema).parse('<h1>test</h1><tags></tags><p>test</p>'),
    plugins: [
      menuPlugin(equationManager),
      formatterPlugin(),
      keymap(buildKeymap(textSchema)),
      keymap(baseKeymap),
      arrowHandlers,
      gapCursor(),
      dropCursor(),
      limpidPlugin(equationManager),
      trailingSpacePlugin(),
      history()
    ]
  }),
  nodeViews: {
    tags(node, view, getPos) { return new TagsView(node, view, getPos); },
    gallery(node, view, getPos) { return new GalleryView(node, view, getPos); },
    equation(node, view, getPos) { return new EquationView(node, view, getPos, equationManager); },
    inline_equation(node, view, getPos) { return new InlineEquationView(node, view, getPos); },
    equation_ref(node, view, getPos) {
      return new EquationRefView(node, view, getPos, equationManager);
    },
    video(node, view, getPos) {
      return new VideoView(node, view, getPos);
    },
    twitter(node, view, getPos) {
      return new TwitterView(node, view, getPos);
    },
    code_block(node, view, getPos) { return new CodeBlockView(node, view, getPos); }
  },
  dispatchTransaction: (tr) => {
    const state = window.editorView.state.apply(tr);
    window.editorView.updateState(state);

    if (tr.steps.length == 0) {
      return;
    }

    function rebuildContentTable() {
      if (updateContentTimer) {
        clearTimeout(updateContentTimer);
        updateContentTimer = null;
      }

      updateContentTimer = setTimeout(() => {
        updateContentTimer = null;
        updateContent();
      }, 3000);
    }

    function notifyTimerDocumentUpdate() {
      if (docUpdateDelay) {
        clearTimeout(docUpdateDelay);
        docUpdateDelay = null;
      }

      docUpdateDelay = setTimeout(() => {
        docUpdateDelay = null;
        if (updateTimer) {
          const now = Math.floor(Date.now() / 1000);
          updateTimer.documentUpdated(now);
        }

        saveDocument(currentLoadedNodeId);
      }, 3000);
    }

    notifyTimerDocumentUpdate();

    for (let i = 0; i < tr.steps.length; ++i) {
      if (tr.steps[i].slice) {
        if (!tr.steps[i].slice.content || tr.steps[i].slice.content.size == 0) {
          rebuildContentTable();
          return;
        }

        for (let e = 0; e < tr.steps[i].slice.content.content.length; ++e) {
          let node = tr.steps[i].slice.content.content[e];
          if (node.type.name === 'heading') {
            rebuildContentTable();
            return;
          }
          else if (node.type.name === 'text') {
            const headingNode = findHeading(tr.selection)
            if (headingNode) {
              rebuildContentTable();
              return;
            }
          }
        }
      }
    }
  }
})

editorElm.onclick = (e) => {
  if (e.target !== editorElm) {
    return;
  }
  e.preventDefault();
  let rpos = window.editorView.state.doc.resolve(window.editorView.state.doc.nodeSize - 2);
  let selection = Selection.near(rpos, 1)
  let tr = window.editorView.state.tr.setSelection(selection).scrollIntoView()
  setTimeout(() => {
    window.editorView.dispatch(tr)
    window.editorView.focus()
  }, 100);

  e.stopImmediatePropagation();
  e.stopPropagation();
}

function getDraggableBlockFromCoords(
  coords,
  view
) {
  let pos = view.posAtCoords(coords);
  if (!pos) {
    return undefined;
  }
  let node = view.domAtPos(pos.pos).node;

  if (node === view.dom) {
    // mouse over root
    return undefined;
  }

  while (
    node &&
    node.parentNode &&
    node.parentNode !== view.dom &&
    !node.hasAttribute("data-id")
  ) {
    node = node.parentNode;
  }
  if (!node) {
    return undefined;
  }
  return { node, id: node.getAttribute("data-id") };
}

document.body.addEventListener(
  "mousemove",
  (event) => {
    return;
    /*if (this.menuFrozen) {
      return;
    }*/

    // Editor itself may have padding or other styling which affects size/position, so we get the boundingRect of
    // the first child (i.e. the blockGroup that wraps all blocks in the editor) for a more accurate bounding box.
    const editorBoundingBox = window.editorView.dom.firstChild.getBoundingClientRect();

    let horizontalPosAnchor = editorBoundingBox.x;

    // Gets block at mouse cursor's vertical position.
    const coords = {
      left: editorBoundingBox.left + editorBoundingBox.width / 2, // take middle of editor
      top: event.clientY,
    };
    const block = getDraggableBlockFromCoords(coords, window.editorView);

    // Closes the menu if the mouse cursor is beyond the editor vertically.
    if (!block) {
      /*if (this.menuOpen) {
        this.menuOpen = false;
        this.blockMenu.hide();
      }
*/
      return;
    }

    // Doesn't update if the menu is already open and the mouse cursor is still hovering the same block.
    /*if (
      this.menuOpen &&
      this.hoveredBlockContent?.hasAttribute("data-id") &&
      this.hoveredBlockContent?.getAttribute("data-id") === block.id
    ) {
      return;
    }*/

    // Gets the block's content node, which lets to ignore child blocks when determining the block menu's position.


    const blockContent = block.node.firstChild;
    let hoveredBlockContent = blockContent;


    console.log("mouse hover block", window.editorView.posAtDOM(blockContent, 0));
    console.log("maybe child", window.editorView.state.doc.nodeAt(window.editorView.posAtDOM(blockContent, 0) - 1))
    if (!blockContent) {
      return;
    }

    // Shows or updates elements.
    /*if (!this.menuOpen) {
      this.menuOpen = true;
      this.blockMenu.render(this.getDynamicParams(), true);
    } else {
      this.blockMenu.render(this.getDynamicParams(), false);
    }*/

  },
  true
);

const data = {
  children: [
    {
      name: 'fruits', children: [
        { name: 'apples', children: [] },
        {
          name: 'oranges', children: [
            { name: 'tangerines', children: [] },
            { name: 'mandarins', children: [] },
            { name: 'pomelo', children: [] },
            { name: 'blood orange', children: [] },
          ]
        }
      ]
    },
    {
      name: 'vegetables', children: [
        { name: 'brocolli', children: [] },
      ]
    },
  ]
}


document.getElementById('fold-menu-button').onclick = (e) => {
  if (!menuFolded) {
    document.getElementById('sidebar-container').visibility = 'hidden';
    document.getElementById('fold-menu-button').innerHTML = '<i class="icon icon-left-open-1">&#x31;</i>';
    document.getElementById('fold-menu-button').style.transition = 'width 0.5s';
    menuFolded = true;
    document.getElementById('sidebar-container').style.transition = 'width 0.5s';
    document.getElementById('sidebar-container').style.width = '0px';
    document.getElementById('editor-top-padding').style.display = 'inline-block';
  }
  else {
    document.getElementById('sidebar-container').visibility = 'visible';
    document.getElementById('fold-menu-button').innerHTML = '<i class="icon icon-right-open">&#x31;</i>';

    menuFolded = false;
    document.getElementById('editor-top-padding').style.display = 'none';
    document.getElementById('sidebar-container').style.transition = 'width 0.5s';
    document.getElementById('sidebar-container').style.width = '66px';
    document.getElementById('fold-menu-button').style.transition = 'width 0.5s';
  }
}


async function setupTree(workspaceData) {
  tree = new Tree({ children: workspaceData.content_table }, { parent: document.getElementById('tree-container') });

  if (workspaceData.content_table.length > 0) {
    const leaf = { data: workspaceData.content_table[0] };
    const noteDjot = await tauri_invoke('load_note', { filename: leaf.data.filename });

    console.log("load data", noteDjot);
    const parsedDjot = djot.parse(noteDjot, { sourcePositions: true });
    const prosemirrorDoc = djot2prosemirror(parsedDjot, leaf.data.id, leaf.data);

    console.log("prosemirrorDoc", prosemirrorDoc);
    reloadDoc({
      doc: prosemirrorDoc, selection: {
        anchor: 1,
        head: 1,
        type: "text"
      }
    });
    updateTimer = new UpdateTimer(document.getElementById('editor-top-doc-time'), leaf.data.created_at);

    currentLoadedNodeId = leaf.data.id;

  }

  tree.on('update', async (leaf, tree) => {
    console.log("================ update", workspaceData.content_table)
    console.log(leaf);
    let clonedWorkspace = deepClone(workspaceData);
    console.log("cloned workspace", clonedWorkspace)
    await tauri_invoke('update_workspace_content', { newWorkspaceContent: clonedWorkspace });

  })

  tree.on('clicked', async (leaf, e, tree) => {
    if (leaf.data.id !== currentLoadedNodeId) {
      const noteDjot = await tauri_invoke('load_note', { filename: leaf.data.filename });

      console.log("load data", noteDjot);
      const parsedDjot = djot.parse(noteDjot, { sourcePositions: true });
      const prosemirrorDoc = djot2prosemirror(parsedDjot, leaf.data.id, leaf.data);

      console.log("prosemirrorDoc", prosemirrorDoc);
      reloadDoc({
        doc: prosemirrorDoc, selection: {
          anchor: 1,
          head: 1,
          type: "text"
        }
      });

      currentLoadedNodeId = leaf.data.id;
    }
  })

}

function reloadDoc(newDoc) {
  equationManager = new EquationManager();
  const state = EditorState.fromJSON({
    schema: textSchema,
    plugins: [
      menuPlugin(equationManager),
      formatterPlugin(),
      keymap(buildKeymap(textSchema)),
      keymap(baseKeymap),
      arrowHandlers,
      gapCursor(),
      dropCursor(),
      limpidPlugin(equationManager),
      trailingSpacePlugin(),
      history()
    ]
  }, newDoc);
  window.editorView.updateState(state);
  setTimeout(() => { updateContent(); equationManager.recount(); }, 3000);
}

document.getElementById("open-folder-dialog").onclick = async (e) => {
  const selected = await tauri_dialog().open({
    multiple: false,
    directory: true,
    title: 'Choose a directory for notes'
  });

  console.log('folder selected', selected);

  if (selected) {
    workspaceData = await tauri_invoke('first_time_setup', { workspacePath: selected });
    document.getElementById('welcome').parentNode.removeChild(document.getElementById('welcome'))
    setupTree(workspaceData);
    document.getElementById('sidebar').style.visibility = 'visible';
    document.getElementById('editor-container').style.visibility = 'visible';
  }
}

const deepClone = obj => {
  if (obj === null) return null;
  let clone = Object.assign({}, obj);
  if (clone.parent) {
    delete clone.parent;
  }
  Object.keys(clone).forEach(
    key =>
    (clone[key] =
      typeof obj[key] === 'object' ? deepClone(obj[key]) : obj[key])
  );
  if (Array.isArray(obj)) {
    clone.length = obj.length;
    return Array.from(clone);
  }
  return clone;
};

function findLeafHelper(node, id) {
  if (node.id === id) {
    return node;
  }
  else if (node.children.length > 0) {
    for (let c of node.children) {
      const r = findLeafHelper(c, id);
      if (r) {
        return r;
      }
    }
  }
  return null;
}

async function saveDocument(currentLoadedNodeId) {
  let leaf = null;
  for (let c of workspaceData.content_table) {
    leaf = findLeafHelper(c, currentLoadedNodeId);

    if (leaf) {
      break;
    }
  }

  if (leaf) {
    const djotAST = prosemirror2djot(window.editorView.state.doc.toJSON(), Math.floor(Date.now() / 1000), Math.floor(Date.now() / 1000));
    const djotStr = djot.renderDjot(djotAST.compiled);

    try {
      let newFilename = await tauri_invoke('save_file', {
        id: leaf.id, title: djotAST.title, currentFilename: leaf.filename,
        content: djotStr
      });
      if (leaf.filename !== newFilename) {
        leaf.filename = newFilename;
      }
      leaf.modified_at = Math.floor(Date.now() / 1000);
      if (leaf.name !== djotAST.title) {
        leaf.name = djotAST.title;
      }
      let clonedWorkspace = deepClone(workspaceData);
      console.log("cloned workspace", clonedWorkspace)
      await tauri_invoke('update_workspace_content', { newWorkspaceContent: clonedWorkspace });
      tree.update();

      console.log("saved!")
    }
    catch (err) {
      console.log(err);
    }
  }
}


document.getElementById("new-page-button").onclick = async (e) => {
  if (tree && workspaceData) {
    try {
      const cuid = createId();
      await tauri_invoke('create_new_file', { newFileId: cuid });
      workspaceData.content_table.push({ name: 'Unnamed Note', id: cuid, children: [], filename: cuid + '.djot' });
      tree.update();
      let clonedWorkspace = deepClone(workspaceData);
      console.log("before saving", clonedWorkspace);
      await tauri_invoke('update_workspace_content', { newWorkspaceContent: clonedWorkspace });
    }
    catch (err) {
      console.log(err);
    }
  }
}

(async () => {
  try {
    workspaceData = await tauri_invoke('load_config');
    document.getElementById('welcome').parentNode.removeChild(document.getElementById('welcome'));
    setupTree(workspaceData);
    document.getElementById('sidebar').style.visibility = 'visible';
    document.getElementById('editor-container').style.visibility = 'visible';
  }
  catch (err) {
    console.log('load config error', err);
    document.getElementById('welcome').style.visibility = 'visible';
  }
})();

const resizeBar = document.getElementById('resize-bar');
let resizeBarMouseX = 0;

let resizeBarOnMouseMove = function (e) {
  e.stopPropagation();
  e.preventDefault();
  const dx = e.screenX - resizeBarMouseX;
  const panelLeft = document.getElementById('sidebar-container').getBoundingClientRect().width;
  let left = panelLeft + dx;
  if (left > 240) {
    left = 240;
  }

  document.getElementById('sidebar-container').style.width = `${left}px`;

  if (left <= 60) {
    document.getElementById('fold-menu-button').style.marginLeft = `${60 - left + 6}px`;
  }
  else {
    document.getElementById('fold-menu-button').style.marginLeft = `${6}px`;
  }
  resizeBarMouseX = e.screenX;
};

let resizeBarOnMouseUp = function (event) {
  event.stopPropagation();
  event.preventDefault();
  document.removeEventListener("mousemove", resizeBarOnMouseMove);
  document.removeEventListener("mouseup", resizeBarOnMouseUp);

  const panelLeft = document.getElementById('sidebar-container').getBoundingClientRect().width;
  if (panelLeft < 80) {



    document.getElementById('sidebar-container').visibility = 'hidden';
    document.getElementById('sidebar-container').style.transition = 'width 0.5s';
    document.getElementById('sidebar-container').style.width = '0px';

    document.getElementById('fold-menu-button').innerHTML = '<i class="icon icon-right-open">&#x31;</i>';
    document.getElementById('fold-menu-button').style.transition = 'width 0.5s';

    menuFolded = true;
    document.getElementById('editor-top-padding').style.display = 'inline-block';
  }
  else if (panelLeft > 160) {
    document.getElementById('sidebar-container').visibility = 'visible';
    document.getElementById('fold-menu-button').innerHTML = '<i class="icon icon-left-open-1">&#x31;</i>';
    document.getElementById('fold-menu-button').style.transition = 'width 0.5s';

    menuFolded = false;
    document.getElementById('editor-top-padding').style.display = 'none';
    document.getElementById('sidebar-container').style.transition = 'width 0.5s';
    document.getElementById('sidebar-container').style.width = '240px';
  }

};

resizeBar.onmousedown = (e) => {
  resizeBarMouseX = e.screenX;
  document.addEventListener("mousemove", resizeBarOnMouseMove);
  document.addEventListener("mouseup", resizeBarOnMouseUp);
  e.stopPropagation();
  e.preventDefault();
  document.getElementById('sidebar-container').style.display = 'flex';
  document.getElementById('sidebar-container').style.transition = null;
  document.getElementById('fold-menu-button').style.transition = null;
}

