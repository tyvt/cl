import { parse } from "../packages/marked.esm.js";
class Markdown extends HTMLElement {
  constructor() {
    super();
  }

  readTextFile(path) {
    return new Promise((resolve, reject) => {
      fetch(path)
        .then((res) => res.text())
        .then((text) => {
          resolve(text);
        })
        .catch((e) => console.error(e));
    });
  }
  connectedCallback() {
    const shadow = this.attachShadow({ mode: "open" });
    const div = document.createElement("div");
    div.className = "markdown-container";
    shadow.appendChild(div);
    this.readTextFile(this.getAttribute("path")).then((res) => {
      div.innerHTML = parse(res);
    });
  }
}
customElements.define("markdown-container", Markdown);
