import { BlockSpec } from '@blocksuite/block-std'
import { defineBlockSchema } from '@blocksuite/store'
import { literal } from 'lit/static-html.js'

export const CEmbedGithubBlockSchema = defineBlockSchema({
  flavour: 'custom-me',
  metadata: {
    version: 1,
    role: 'content',
    parent: [
      'affine:note',
      'affine:database',
      'affine:list',
      'affine:paragraph',
      'affine:edgeless-text',
    ],
  },
})

export const CEmbedGithubBlockSpec: BlockSpec = {
  schema: CEmbedGithubBlockSchema,
  view:
  {
    component: literal`custom-github-block`,
  }
}
