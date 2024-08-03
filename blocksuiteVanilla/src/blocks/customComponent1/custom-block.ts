import { customElement } from 'lit/decorators.js'
import { BlockComponent } from '@blocksuite/blocks/src/_common/components/block-component'
import { defineBlockSchema, SchemaToModel } from '@blocksuite/store'
import { BlockService, BlockSpec } from '@blocksuite/block-std'
import { literal } from 'lit/static-html.js'

export type ParagType =
  | 'text'
  | 'h1'
  | 'h2'


export const ParagBlockSchema = defineBlockSchema({
  flavour: 'custom:parag',
  props: internal => ({
    text: internal.Text(),
    type: 'h2' as ParagType
  }),
  metadata: {
    version: 1,
    role: 'content',
    parent: [
      'affine:note',
      'affine:database',
      'affine:paragraph',
      'affine:list',
      'affine:edgeless-text',
    ],
  }
})

export type ParagBlockModel = SchemaToModel<typeof ParagBlockSchema>

export class ParagBlockService extends BlockService<ParagBlockModel> {

}

@customElement('custom-component-block')
export class ParagComponentBlock extends BlockComponent<
  ParagBlockModel,
  ParagBlockService
> {

  override render() {

  }
}


export const ParagBlockSpec: BlockSpec = {
  schema: ParagBlockSchema,
  view: {
    component: literal`parag-parag`
  }
}


declare global {
  interface HTMLElementTagNameMap {
    'custom-componet-block': ParagComponentBlock
  }
  namespace BlockSuite {
    interface BlockModels {
      'parag:parag': ParagComponentBlock
    }
  }
}
