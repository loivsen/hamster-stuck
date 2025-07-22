import { LitElement, css, html, nothing } from 'lit'
import { map } from 'lit-html/directives/map.js';
import { customElement, query, state } from 'lit/decorators.js'
import { range } from 'lit/directives/range.js';
//import './components/hello-world'

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('my-element')
export class MyElement extends LitElement {

  @state()
  private _from = 0

  @state()
  private _to = 0

  @state()
  private _isDivisble?: boolean;


  @query('#from')
  private _fromInput!: HTMLInputElement;
  
  @query('#to')
  private _toInput!: HTMLInputElement;

  
  @query('#num')
  private _numInput!: HTMLInputElement;
  
  @query('#divBy')
  private _divByInput!: HTMLInputElement;
  
  
  // #URL = 'https://preview-4-9.zegeba.com/fizz-buzz/is-divisible';
  
  // async _apiRequest() {
  //   fetch(this.#URL, {
  //     method: 'POST',
  //     body: ''
  //   })
  //   .then((response) => response.json())
  //   .then((json) => console.log(json));
  // }

  #print() {
    this._from = Number(this._fromInput.value);
    this._to = Number(this._toInput.value);
    
    // while(index <= end) {
    //   console.log(index);
    //   index++;
    // } 
  }

  #check() {
    const number = Number(this._numInput.value);
    const divisibleBy = Number(this._divByInput.value);

    this.#request(number, divisibleBy)
  }

  async #request(number: number, divisibleBy: number) {
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
        this.#request(number, divisibleBy); // Just retry?
        throw new Error("Hamster stuck");
      }

      const json = await response.json();
      this._isDivisble = json.isDivisible;
    } catch(e) {
      console.log('meow',e);
    }
  
  }
  
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

  render() {
    return html`
    <div>
      <input id="from" type="number" placeholder="From" value="10">
      <input id="to" type="number" placeholder="To" value="30">
      <button @click=${() => this.#print()}>Fizzbuzz</button>
      ${this.#renderLoop()}
    </div>
    <div>
      <input id="num" type="number" placeholder="number">
      <input id="divBy" type="number" placeholder="Divisible by">
      <button @click=${() => this.#check()}>Check</button>
      ${this._isDivisble}
    </div>
    `;
  }


  #renderLoop() {
    if (this._from >= this._to) return;

    return map(range(this._from, this._to + 1), (i: number) => html`
      <div>${this.#renderFizzbuzz(i)}</div>
    `)
  }


  #renderFizzbuzz(num: number) {
    if (num % 3 === 0 && num % 5 === 0) return 'Both';
    if (num % 3 === 0) return 'Fizz';
    if (num % 5 === 0) return 'Buzz';
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

    @media (prefers-color-scheme: light) {
      a:hover {
        color: #747bff;
      }
      button {
        background-color: #f9f9f9;
      }
    }
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'my-element': MyElement
  }
}
