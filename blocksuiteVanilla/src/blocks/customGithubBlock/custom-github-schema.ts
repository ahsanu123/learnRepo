import { createEmbedBlockSchema } from '@blocksuite/blocks'
import { CustomGithubModel, CustomGithubModelProps } from './custom-github-model'

const defaultCustomGithubModel: CustomGithubModelProps = {
  owner: 'ahsanu',
  repo: 'ahsanu123'
}

export const CustomGithubBlockSchema = createEmbedBlockSchema({
  name: 'custom-github-schema',
  version: 1,
  toModel: () => new CustomGithubModel(),
  props: (): CustomGithubModelProps => defaultCustomGithubModel,
})
