import { defineEmbedModel } from "@blocksuite/blocks";
import { BlockModel } from "@blocksuite/store";

export type CustomGithubModelProps = {
  owner: string;
  repo: string;
};

export class CustomGithubModel extends defineEmbedModel<CustomGithubModelProps>(BlockModel) {

}
