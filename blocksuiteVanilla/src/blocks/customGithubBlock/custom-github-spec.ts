
import { BlockSpec } from '@blocksuite/block-std';


export const CustomGithubBlockSpec: BlockSpec = {
  schema: {
    version: 0,
    model: {
      flavour: '',
      role: 'root',
      children: undefined,
      parent: undefined,
      props: undefined,
      toModel: undefined
    },
    transformer: undefined,
    onUpgrade: undefined
  },
  view: undefined
}
