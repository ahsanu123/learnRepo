import { defineEmbedModel } from "@blocksuite/blocks";
import { BlockModel } from "@blocksuite/store";

export class CEmbedGithubModel extends defineEmbedModel<{
  owner: string;
  repo: string;
}>(BlockModel) {

}
