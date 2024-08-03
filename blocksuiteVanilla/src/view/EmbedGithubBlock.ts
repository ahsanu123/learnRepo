import { customElement } from "lit/decorators.js";
import { EmbedBlockElement } from "@blocksuite/blocks";
import { CEmbedGithubModel } from "../model";
import { html } from "lit";

@customElement('custom-github-block')
export class EmbedGithubBlock extends EmbedBlockElement<CEmbedGithubModel> {

  override render() {
    return this.renderEmbed(() => {
      return html`
        <div class="affine-embed-github-block">
          <h3>GitHub Card</h3>
          <div>${this.model.owner}/${this.model.repo}</div>
        </div>
      `;
    });
  }

}
