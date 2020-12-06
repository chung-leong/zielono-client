import { createElement } from './dom.mjs';

class Image {
  #hash;
  #width;
  #height;
  #location;

  get hash() { return this.#hash }
  get width() { return this.#width }
  get height() { return this.#height }

  constructor(json, location) {
    const {
      hash = '',
      width,
      height ,
    } = json;
    this.#hash = hash;
    this.#width = width;
    this.#height = height;
    this.#location = location;
  }

  render(props) {
    // TODO
  }
}

export {
  Image,
};
