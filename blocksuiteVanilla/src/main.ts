import '@blocksuite/presets/themes/affine.css';

import { AffineSchemas } from '@blocksuite/blocks';
import { AffineEditorContainer } from '@blocksuite/presets';
import { Schema } from '@blocksuite/store';
import { DocCollection, Text } from '@blocksuite/store';
import { IndexeddbPersistence } from 'y-indexeddb';
import { CustomEditorContainer } from './editor/custom-editor-container';
import { ParagBlockSchema, ParagBlockSpec } from './blocks/customComponent1/custom-block';

const customSchema = new Schema()
const customEditor = new CustomEditorContainer()


const schema = new Schema().register([...AffineSchemas, ParagBlockSchema]);
const collection = new DocCollection({
  schema: schema
});
collection.meta.initialize();

const doc = collection.createDoc();
const editor = new AffineEditorContainer();
editor.doc = doc;
editor.pageSpecs.push(ParagBlockSpec)
customEditor.doc = doc;
document.body.append(editor);

function createDoc() {
  new IndexeddbPersistence('provider-demo', doc.spaceDoc);

  doc.load(() => {
    const pageBlockId = doc.addBlock('affine:page', {
      title: new Text('Test'),
    });
    doc.addBlock('affine:surface', {}, pageBlockId);
    const noteId = doc.addBlock('affine:note', {}, pageBlockId);
    const helloId = doc.addBlock(
      'affine:paragraph',
      { text: new Text('Hello World!') },
      noteId
    );
    doc.addBlock('affine:divider', {}, helloId)
    doc.addBlock('parag:parag', {
      text: new Text("Parag Parag"),
      type: 'h2'
    }, helloId)
  });
}

function loadDoc() {
  const provider = new IndexeddbPersistence('provider-demo', doc.spaceDoc);
  provider.on('synced', () => doc.load());
}

const createBtn = <HTMLButtonElement>document.getElementById('create-doc');
createBtn.onclick = () => createDoc();

const loadBtn = <HTMLButtonElement>document.getElementById('load-doc');
loadBtn.onclick = () => loadDoc();

const clearBtn = <HTMLButtonElement>document.getElementById('clear');
clearBtn.onclick = () => {
  const request = indexedDB.deleteDatabase('provider-demo');
  request.onsuccess = () => console.log('IndexedDB cleared');
};
