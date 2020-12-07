import { createElement } from './dom.mjs';

class Image {
  #hash;
  #width;
  #height;
  #originalWidth;
  #originalHeight;
  #format;
  #crop;
  #location;

  get hash() { return this.#hash }
  get width() { return this.#width }
  get height() { return this.#height }
  get originalWidth() { return this.#originalWidth }
  get originalHeight() { return this.#originalHeight }
  get format() { return this.#format }
  get crop() { return this.#crop }
  get url() { return `${this.#location.baseURL}/-/images/${this.hash}` }

  constructor(json, location) {
    const {
      hash = '',
      width,
      height,
      crop,
      format,
    } = json;
    this.#hash = hash;
    if (crop) {
      this.#width = crop.width;
      this.#height = crop.height;
      this.#originalWidth = width;
      this.#originalHeight = height;
      this.#crop = crop;
    } else {
      this.#width = width;
      this.#height = height;
      this.#originalWidth = width;
      this.#originalHeight = height;
    }
    this.#format = format;
    this.#location = location;
  }

  getURL(width, height, format, lossless) {
    const filters = [];
    if (this.crop) {
      const { left, top, width, height } = this.crop;
      filters.push(`cr${left},${top}-${width}x${height}`);
    }
    filters.push(`re${width}x${height}`);
    if (lossless) {
      filters.push('l');
    }
    return `${this.url}/${filters.join('+')}.${format}`;
  }

  getDimensionSets(width, height, maxPixelRatio = 4) {
    if (!width && !height) {
      width = this.width;
      height = this.height;
    } else if (width && !height) {
      height = width * (this.height / this.width);
    } else if (!width && height) {
      width = height * (this.width / this.height);
    }
    const dimSets = [];
    for (let ratio = 1; ratio <= maxPixelRatio; ratio += 0.5) {
      const srcWidth = Math.floor(width * ratio);
      const srcHeight = Math.floor(height * ratio);
      if (srcWidth <= this.width && srcHeight <= this.height) {
        dimSets.push({ width: srcWidth, height: srcHeight });
      } else {
        // use maximum size possible
        let maxWidth, maxHeight;
        if (this.width / this.height > width / height) {
          maxHeight = this.height;
          maxWidth = Math.floor(maxHeight * width / height);
        } else {
          maxWidth = this.width;
          maxHeight = Math.floor(maxWidth * height / width);
        }
        if (!dimSets.find((d) => d.width === maxWidth)) {
          dimSets.push({ width: maxWidth, height: maxHeight });
        }
        break;
      }
    }
    return dimSets;
  }

  getSrcSet(dimSets, format, lossless) {
    const srcs = [];
    for (let { width, height } of dimSets) {
      const url = this.getURL(width, height, format, lossless);
      srcs.push(`${url} ${width}w`);
    }
    return srcs.join(', ');
  }

  uncrop() {
    return new Image({
      hash: this.hash,
      width: this.width,
      height: this.height,
      format: this.format,
    }, this.#location);
  }

  render(props) {
    const { tagName = 'picture', width, height, ...others } = props;
    const dimSets = this.getDimensionSets(width, height);
    if (tagName === 'picture') {
      return this.renderPictureTag(dimSets, others);
    } else {
      return this.renderImgTag(dimSets, others);
    }
  }

  renderImgTag(dimSets, props) {
    const { width, height } = dimSets[0];
    const src = this.getURL(width, height, this.format);
    const srcset = this.getSrcSet(dimSets, this.format);
    return createElement('img', { width, height, src, srcset, ...props });
  }

  renderPictureTag(dimSets, props) {
    const { key, ...others } = props;
    const children = [];
    // add source tags
    if (this.format === 'png') {
      // provide lossless webp versions
      const srcset = this.getSrcSet(dimSets, 'webp', true);
      const srcProps = { key: children.length, srcset, type: 'image/webp' };
      children.push(createElement('source', srcProps));
    } else if (this.format === 'jpeg') {
      // provide lossly webp versions
      const srcset = this.getSrcSet(dimSets, 'webp', false);
      const srcProps = { key: children.length, srcset, type: 'image/webp' };
      children.push(createElement('source', srcProps));
    }
    const srcset = this.getSrcSet(dimSets, this.format);
    const srcProps = { key: children.length, srcset, type: `image/${this.format}` };
    children.push(createElement('source', srcProps));
    // add img tag
    const { width, height } = dimSets[0];
    const src = this.getURL(width, height, this.format);
    const imgProps = { key: children.length, width, height, src, ...others };
    children.push(createElement('img', imgProps));
    return createElement('picture', { key }, children);
  }
}

export {
  Image,
};
