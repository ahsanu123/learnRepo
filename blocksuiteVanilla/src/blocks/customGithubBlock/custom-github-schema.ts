import { createEmbedBlockSchema } from '@blocksuite/blocks'
export const CustomGithubBlockSchema = createEmbedBlockSchema({
  name: 'custom-github-schema',
  version: 1,
  toModel: ()
})
