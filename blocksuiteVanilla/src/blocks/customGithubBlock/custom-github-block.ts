import { customElement } from "lit/decorators.js";
import { EmbedBlockElement } from '@blocksuite/blocks'
import { CustomGithubModel } from "./custom-github-model";
import { html } from "lit";

@customElement('custom-github-block')
export class CustomGithubBlock extends EmbedBlockElement<
  CustomGithubModel
> {

  override renderBlock() {
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

declare global {
  interface HTMLElementTagNameMap {
    'custom-github-block': CustomGithubBlock
  }
}
