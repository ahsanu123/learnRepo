import { BlockSpec } from "@blocksuite/block-std"
import { literal } from "lit/static-html.js"

export const CustomGithubBlockSpec: BlockSpec = {
  schema: {
    version: 0,
    model: {
      flavour: 'custom-me',
      role: 'root',
      children: undefined,
      parent: undefined,
      props: undefined,
      toModel: undefined
    },
    transformer: undefined,
    onUpgrade: undefined
  },
  view: {

    component: literal`custom-github-block`
  }
}
