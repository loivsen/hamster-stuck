import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('hello-world-element')
export class HelloWorldElement extends LitElement {
  @property()
  docsHint = 'Click on the Vite and Lit logos to learn more'

  render() {
    return html`
      Hello World!<br>
      <slot></slot>
    `
  }

  static styles = css`
    :host {
      border: 1px solid red;
      margin: 0 auto;
      padding: 2rem;
      text-align: center;
    }
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'hello-world-element': HelloWorldElement
  }
}
