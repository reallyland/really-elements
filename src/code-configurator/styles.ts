import { css } from 'lit';

export const codeConfigurationStyles = css`
:host {
  display: block;

  --_col-gap: var(--code-configurator-col-gap, 24px);
  --_col: var(--code-configurator-col, 2);
  --_cols-max-width: var(--code-configurator-configurators-max-width, 100%);
  --_config-gap: var(--code-configurator-configurator-gap, 2px);
  --_pre-lang-padding: var(--code-configurator-pre-lang-padding, 15px);
  --_row-gap: var(--code-configurator-row-gap, 16px);
}

input,
select {
  margin: 0;
}

* {
  box-sizing: border-box;
}

.configurators {
  display: grid;
  /**
   * NOTE(motss): 100% here will calculate based on current width of the container,
   * e.g. 100% of max-width.
   */
  grid-template-columns: repeat(var(--_col), minmax(1px, calc((100% - var(--_col-gap)) / var(--_col))));
  gap: var(--_row-gap) var(--_col-gap);

  max-width: var(--_cols-max-width);
  width: 100%;
}

.configurator {
  display: grid;
  grid-template-columns: minmax(1px, 1fr);
  grid-auto-flow: row;
  gap: var(--_config-gap);
}

.configurator > label {
  overflow-wrap: break-word;
  word-break: normal;
}

.code-container {
  position: relative;
}

.copy-btn {
  position: absolute;
  top: 8px;
  right: 8px;

  color: #fff;
  fill: #fff;
  z-index: 1;

  --mdc-theme-primary: #fff;
}

.copy-text {
  margin: 0 0 0 8px;
}
`;

export const prismVscodeStyles = css`
.token.property {
  color: #9cdcfe;
}

code[class*="language-"],
pre[class*="language-"] {
  -moz-tab-size: 2;
  -o-tab-size: 2;
  tab-size: 2;
  -webkit-hyphens: none;
  -moz-hyphens: none;
  -ms-hyphens: none;
  hyphens: none;
  white-space: pre;
  white-space: pre-wrap;
  word-wrap: normal;
  font-family: Consolas, Inconsolata ,"Courier New", monospace;
  font-size: 14px;
  color: #569cd6;
  text-shadow: none;
}
code[class="language-css"],
pre[class="language-css"] {
  color: #b5cea8;
}
pre[class*="language-"],
:not(pre)>code[class*="language-"] {
  background: #1e1e1e;
}
pre[class*="language-"] {
  padding: var(--_pre-lang-padding);
  border-radius: 4px;
  border: 1px solid #e1e1e8;
  overflow: auto;
}

pre[class*="language-"] {
  position: relative;
}
pre[class*="language-"] code {
  white-space: pre;
  display: block;
}

:not(pre)>code[class*="language-"] {
  padding: 0.15em 0.2em 0.05em;
  border-radius: .3em;
  border: 0.13em solid #7a6652;
  box-shadow: 1px 1px 0.3em -0.1em #000 inset;
}
.token.namespace {
  opacity: .7;
}
.token.comment,
.token.prolog,
.token.doctype,
.token.cdata {
  color: #6f705e;
}
.token.operator,
.token.boolean,
.token.number {
  color: #a77afe;
}
.token.attr-name,
.token.string {
  color: #9cdcfe;
}
.token.entity,
.token.url,
.language-css .token.string,
.style .token.string {
  color: #e6d06c;
}
.token.selector,
.token.inserted {
  color: #d7ba7d;
}
.token.atrule,
.token.attr-value,
.token.keyword,
.token.important,
.token.deleted {
  color: #ce9178
}
.token.regex,
.token.statement {
  color: #76d9e6;
}
.token.placeholder,
.token.variable {
  color: #fff;
}
.token.important,
.token.statement,
.token.bold {
  font-weight: bold;
}
.token.punctuation {
  color: #808080;
}
.token.entity {
  cursor: help;
}
.token.italic {
  font-style: italic;
}

code.language-markup {
  color: #f9f9f9;
}
code.language-markup .token.tag {
  color: #ef3b7d;
}
code.language-markup .token.attr-name {
  color: #a6e22d;
}
code.language-markup .token.attr-value {
  color: #e6d06c;
}
code.language-markup .token.style,
code.language-markup .token.script {
  color: #76d9e6;
}
code.language-markup .token.script .token.keyword {
  color: #76d9e6;
}

/** dark theme */
@media (prefers-color-scheme: dark) {
  pre[class*="language-"],
  :not(pre)>code[class*="language-"] {
    background-color: var(--really-code-configurator-pre-bg-color, #000);
    border: none;
  }
}

/* Line highlight plugin */
pre[class*="language-"][data-line] {
  position: relative;
  padding: 1em 0 1em 3em;
}
pre[data-line] .line-highlight {
  position: absolute;
  left: 0;
  right: 0;
  padding: 0;
  margin-top: 1em;
  background: rgba(255, 255, 255, 0.08);
  pointer-events: none;
  line-height: inherit;
  white-space: pre;
}
pre[data-line] .line-highlight:before,
pre[data-line] .line-highlight[data-end]:after {
  content: attr(data-start);
  position: absolute;
  top: .4em;
  left: .6em;
  min-width: 1em;
  padding: 0.2em 0.5em;
  background-color: rgba(255, 255, 255, 0.4);
  color: black;
  font: bold 65%/1 sans-serif;
  height: 1em;
  line-height: 1em;
  text-align: center;
  border-radius: 999px;
  text-shadow: none;
  box-shadow: 0 1px 1px rgba(255, 255, 255, 0.7);
}
pre[data-line] .line-highlight[data-end]:after {
  content: attr(data-end);
  top: auto;
  bottom: .4em;
}
`;
