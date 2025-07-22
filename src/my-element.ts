import { LitElement, css, html } from 'lit'
import { map } from 'lit-html/directives/map.js';
import { customElement, query, state } from 'lit/decorators.js'
import { range } from 'lit/directives/range.js';
import { until } from 'lit/directives/until.js';

@customElement('my-element')
export class MyElement extends LitElement {
  @state()
  private _from = 0

  @state()
  private _to = 0

  @query('#from')
  private _fromInput!: HTMLInputElement;
  
  @query('#to')
  private _toInput!: HTMLInputElement;
  
  // Implement a simple UI which contains the following elements:
  // 1. Two input fields "From" and "To"
  // 2. A button with the caption "FizzBuzz"
  // 3. An output area where the result is printed
  
  // Implement the following logic:
  // a. When the FizzBuzz button is pressed, print the numbers starting with "From" up to and including "To" to the output area in sequence, except
  // b. if the number is divisible by 3 print "Fizz" instead of the number
  // c. if the number is divisible by 5 print "Buzz" instead of the number
  // d. use the server side endpoint https://preview-4-9.zegeba.com/fizz-buzz/is-divisible to determine if a number is divisible.
  // e. The server is a bit temperamental and will throw a 503 15% of the time, in which case simply retry.
  
  // Server API:
  // POST https://preview-4-9.zegeba.com/fizz-buzz/is-divisible
  // Body: { "number": A, "divisibleBy": B }
  // Response: { "isDivisible": <true or false> }
  
  // Will return true if A is divisible by B (A % B === 0).

  #print() {
    this._from = Number(this._fromInput.value);
    this._to = Number(this._toInput.value);
  }


  async #request(number: number, divisibleBy: number): Promise<any> {
    const url = 'https://preview-4-9.zegeba.com/fizz-buzz/is-divisible';
    try {
      const response = await fetch(url, {
        // I had to look up how to setup POST for fetch, as I couldn't remember it blindly.
        // I got it from here: https://jsonplaceholder.typicode.com/guide/
        method: "POST",
        body: JSON.stringify({number, divisibleBy}),
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
      });

      if (response.status === 503) {
        // Apparently there is a hamster stuck...
        return this.#request(number, divisibleBy);
      }

      return response.json();
    } catch(e) {
      console.log('Error:', e);
    }
  
  }

  render() {
    return html`
    <div>
      <input id="from" type="number" placeholder="From" value="10">
      <input id="to" type="number" placeholder="To" value="30">
      <button @click=${() => this.#print()}>Fizzbuzz</button>
      ${this.#renderLoop()}
    </div>
    `;
  }


  #renderLoop() {
    if (this._from >= this._to) return;

    return map(range(this._from, this._to + 1), (i: number) => html`
      <div>${until(this.#renderFizzbuzz(i))}</div>
    `)
  }


  async #renderFizzbuzz(num: number) {
    const isFizz = await this.#request(num, 3);
    const isBuzz = await this.#request(num, 5);

    if (isFizz.isDivisible && isBuzz.isDivisible) return "FizzBuzz" 
    if (isFizz.isDivisible) return "Fizz"
    if (isBuzz.isDivisible) return "Buzz"
    return num;
  }

  static styles = css`
    :host {
      max-width: 600px;
      margin: 0 auto;
      padding: 2rem;
      text-align: center;
    }

    button {
      border-radius: 8px;
      border: 1px solid transparent;
      padding: 0.6em 1.2em;
      font-size: 1em;
      font-weight: 500;
      font-family: inherit;
      background-color: #1a1a1a;
      cursor: pointer;
      transition: border-color 0.25s;
    }
    button:hover {
      border-color: #646cff;
    }
    button:focus,
    button:focus-visible {
      outline: 4px auto -webkit-focus-ring-color;
    }
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'my-element': MyElement
  }
}
