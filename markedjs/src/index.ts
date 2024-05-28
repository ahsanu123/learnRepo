import { MarkedExtension, RendererObject, Token, Tokenizer, TokenizerAndRendererExtension, Tokens, marked } from 'marked'

const descriptionList: TokenizerAndRendererExtension = {
  name: 'descriptionList',
  level: 'block',                                     // Is this a block-level or inline-level tokenizer?
  start(src) { return src.match(/:[^:\n]/)?.index; }, // Hint to Marked.js to stop and check for a match
  tokenizer(src, tokens) {
    const rule = /^(?::[^:\n]+:[^:\n]*(?:\n|$))+/;    // Regex for the complete token, anchor to string start
    const match = rule.exec(src);

    if (match) {
      console.log(match[0].trim());

      const token = {                                 // Token to generate
        type: 'descriptionList',                      // Should match "name" above
        raw: match[0],                                // Text to consume from the source
        text: match[0].trim(),                        // Additional custom properties
        tokens: []                                    // Array where child inline tokens will be generated
      } as Tokens.Generic;
      this.lexer.inline(token.text, token.tokens);    // Queue this data to be processed for inline tokens
      return token;
    }
    return undefined;
  },
  renderer(token) {
    return `<dl>${this.parser.parseInline(token.tokens!)}\n</dl>`; // parseInline to turn child tokens into HTML
  }
};

const description: TokenizerAndRendererExtension = {
  name: 'description',
  level: 'inline',                                 // Is this a block-level or inline-level tokenizer?
  start(src) { return src.match(/:/)?.index; },    // Hint to Marked.js to stop and check for a match
  tokenizer(src, tokens) {
    const rule = /^:([^:\n]+):([^:\n]*)(?:\n|$)/;  // Regex for the complete token, anchor to string start
    const match = rule.exec(src);
    if (match) {
      return {                                         // Token to generate
        type: 'description',                           // Should match "name" above
        raw: match[0],                                 // Text to consume from the source
        dt: this.lexer.inlineTokens(match[1].trim()),  // Additional custom properties, including
        dd: this.lexer.inlineTokens(match[2].trim())   //   any further-nested inline tokens
      } as Tokens.Generic;
    }
    return undefined;
  },
  renderer(token) {
    return `\n<dt>${this.parser.parseInline(token.dt)}</dt><dd>${this.parser.parseInline(token.dd)}</dd>`;
  },
  childTokens: ['dt', 'dd'],                 // Any child tokens to be visited by walkTokens
};

const hr = (src: string) => {
  const match = src.match(/^\$+([^\$\n]+?)\$+/);
  if (match) {
    console.log(match);
    return {
      type: 'hr',
      raw: match[0],
      text: match[1].trim()
    } as Tokens.Hr;
  }
  return undefined;
}
const renderer: RendererObject = {
  heading(text, level) {

    console.log(text);
    const escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');

    return `
            <h${level}>
              <a name="${escapedText}" class="anchor" href="#${escapedText}">
                <span class="header-link"></span>
              </a>
              ${text}
            </h${level}>`;
  },
};

const extension: MarkedExtension = {
  renderer: renderer,
}

// marked.use(extension)
//
// marked.use({
//   tokenizer: {
//     hr: hr,
//   }
// })

marked.use({
  extensions: [
    descriptionList,
    description
  ]
})

// Run marked
console.log(marked.parse(`
# heading+ \n haha

$ latex code $\n\n

<div clas="fucking-class">
  thiss content
</div>

other code 

A Description List:\n
:   Topic 1   :  Description 1\n
: **Topic 2** : *Description 2*\n

`));

