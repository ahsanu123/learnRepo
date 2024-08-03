import { ShadowlessElement, WithDisposable } from "@blocksuite/block-std";
import { AbstractEditor, DocMode } from "@blocksuite/blocks";
import { RefNodeSlots } from "@blocksuite/blocks/dist/_common/inline/presets/nodes/reference-node/reference-node.js";
import { Doc, Slot } from "@blocksuite/store";
import { customElement } from "lit/decorators.js";

type SlotsType = RefNodeSlots & {
  editorModeSwitched: Slot<DocMode>;
  docUpdated: Slot<{
    newDocId: string;
  }>;
};

@customElement('custom-editor-container')
export class CustomEditorContainer
  extends WithDisposable(ShadowlessElement)
  implements AbstractEditor {

  accessor doc!: Doc;
  mode: DocMode = 'page';

  slots: SlotsType = {
    docLinkClicked: new Slot(),
    editorModeSwitched: new Slot(),
    docUpdated: new Slot(),
    tagClicked: new Slot<{ tagId: string }>(),
  }

}

