import Chai from 'chai'; const { expect } = Chai;
import { setDOMHandler } from '../src/dom.mjs';

import {
  Image,
} from '../src/image.mjs';

class TestElement {}
class TestContainer {}

function createTestElement(tag, props, children) {
  return { tag, props, children };
}

describe('Image', function() {
  before(function() {
    setDOMHandler({
      element: TestElement,
      container: TestContainer,
      create: createTestElement,
    });
  })
  const location = { baseURL: '/site1' };
  it('should process JSON data correctly', function() {
    const json = {
      hash: '1a1e9e305b5a132560e861531430f9b881b35cd1',
      width: 800,
      height: 600,
      format: 'jpeg'
    };
    const image = new Image(json, location);
    expect(image).to.have.property('hash', '1a1e9e305b5a132560e861531430f9b881b35cd1');
    expect(image).to.have.property('width', 800);
    expect(image).to.have.property('height', 600);
    expect(image).to.have.property('format', 'jpeg');
    expect(image).to.have.property('url', '/site1/-/images/1a1e9e305b5a132560e861531430f9b881b35cd1');
  })
  it('should handle images that have been cropped', function() {
    const json = {
      hash: '1a1e9e305b5a132560e861531430f9b881b35cd1',
      width: 800,
      height: 600,
      crop: { left: 100, top: 100, width: 300, height: 200 },
      format: 'jpeg'
    };
    const image = new Image(json, location);
    expect(image).to.have.property('width', 300);
    expect(image).to.have.property('height', 200);
    expect(image).to.have.property('originalWidth', 800);
    expect(image).to.have.property('originalHeight', 600);
    expect(image).to.have.property('crop').to.eql({ left: 100, top: 100, width: 300, height: 200 });
  })
  describe('getURL()', function() {
    it('should yield URL for given dimensions and format', function() {
      const json = {
        hash: '1a1e9e305b5a132560e861531430f9b881b35cd1',
        width: 800,
        height: 600,
        format: 'jpeg'
      };
      const image = new Image(json, location);
      const url = image.getURL(400, 300, 'png');
      expect(url).to.equal('/site1/-/images/1a1e9e305b5a132560e861531430f9b881b35cd1/re400x300.png');
    })
    it('should return URL with cropping applied', function() {
      const json = {
        hash: '1a1e9e305b5a132560e861531430f9b881b35cd1',
        width: 800,
        height: 600,
        crop: { left: 100, top: 100, width: 300, height: 200 },
        format: 'jpeg'
      };
      const image = new Image(json, location);
      const url = image.getURL(150, 100, 'jpeg');
      expect(url).to.equal('/site1/-/images/1a1e9e305b5a132560e861531430f9b881b35cd1/cr100,100-300x200+re150x100.jpeg');
    })
    it('should add lossless filter', function() {
      const json = {
        hash: '1a1e9e305b5a132560e861531430f9b881b35cd1',
        width: 800,
        height: 600,
        format: 'jpeg'
      };
      const image = new Image(json, location);
      const url = image.getURL(150, 100, 'jpeg', true);
      expect(url).to.equal('/site1/-/images/1a1e9e305b5a132560e861531430f9b881b35cd1/re150x100+l.jpeg');
    })
  })
  describe('getDimensionSets()', function() {
    it('should return a set of dimensions corresponding to different pixel density', function() {
      const json = {
        hash: '1a1e9e305b5a132560e861531430f9b881b35cd1',
        width: 800,
        height: 600,
        crop: { left: 100, top: 100, width: 300, height: 200 },
        format: 'jpeg'
      };
      const image = new Image(json, location);
      const dimSets = image.getDimensionSets(30, 20);
      expect(dimSets).to.eql([
        { width: 30, height: 20 },
        { width: 45, height: 30 },
        { width: 60, height: 40 },
        { width: 75, height: 50 },
        { width: 90, height: 60 },
        { width: 105, height: 70 },
        { width: 120, height: 80 },
      ]);
    })
    it('should not return dimensions that exceed the actual image size', function() {
      const json = {
        hash: '1a1e9e305b5a132560e861531430f9b881b35cd1',
        width: 800,
        height: 600,
        format: 'jpeg'
      };
      const image = new Image(json, location);
      const dimSets = image.getDimensionSets(300, 200);
      expect(dimSets).to.eql([
        { width: 300, height: 200 },
        { width: 450, height: 300 },
        { width: 600, height: 400 },
        { width: 750, height: 500 },
        { width: 800, height: 533 },
      ]);
    })
  })
  describe('getSrcSet()', function() {
    it('should return a list of URL and widths', function() {
      const json = {
        hash: '1a1e9e305b5a132560e861531430f9b881b35cd1',
        width: 800,
        height: 600,
        format: 'jpeg'
      };
      const image = new Image(json, location);
      const dimSets = image.getDimensionSets(400, 300);
      const srcsetWebp = [
        '/site1/-/images/1a1e9e305b5a132560e861531430f9b881b35cd1/re400x300.webp 400w',
        '/site1/-/images/1a1e9e305b5a132560e861531430f9b881b35cd1/re600x450.webp 600w',
        '/site1/-/images/1a1e9e305b5a132560e861531430f9b881b35cd1/re800x600.webp 800w',
      ].join(', ');
      const srcset = image.getSrcSet(dimSets, 'webp', false);
      expect(srcset).to.equal(srcsetWebp);
    })
  })
  describe('render()', function() {
    it('should return a picture tag by default', function() {
      const json = {
        hash: '1a1e9e305b5a132560e861531430f9b881b35cd1',
        width: 800,
        height: 600,
        format: 'png'
      };
      const image = new Image(json, location);
      const srcsetWebp = [
        '/site1/-/images/1a1e9e305b5a132560e861531430f9b881b35cd1/re400x300+l.webp 400w',
        '/site1/-/images/1a1e9e305b5a132560e861531430f9b881b35cd1/re600x450+l.webp 600w',
        '/site1/-/images/1a1e9e305b5a132560e861531430f9b881b35cd1/re800x600+l.webp 800w',
      ].join(', ');
      const srcsetPng = [
        '/site1/-/images/1a1e9e305b5a132560e861531430f9b881b35cd1/re400x300.png 400w',
        '/site1/-/images/1a1e9e305b5a132560e861531430f9b881b35cd1/re600x450.png 600w',
        '/site1/-/images/1a1e9e305b5a132560e861531430f9b881b35cd1/re800x600.png 800w',
      ].join(', ');
      const result = image.render({ width: 400 });
      expect(result).to.eql({
        tag: 'picture',
        props: { key: undefined },
        children: [
          {
            tag: 'source',
            props: {
              key: 0,
              srcset: srcsetWebp,
              type: 'image/webp'
            },
            children: undefined
          },
          {
            tag: 'source',
            props: {
              key: 1,
              srcset: srcsetPng,
              type: 'image/png'
            },
            children: undefined
          },
          {
            tag: 'img',
            props: {
              key: 2,
              src: '/site1/-/images/1a1e9e305b5a132560e861531430f9b881b35cd1/re400x300.png',
              width: 400,
              height: 300,
            },
            children: undefined
          }
        ]
      });
    })
    it('should return a proper img tag if requested', function() {
      const json = {
        hash: '1a1e9e305b5a132560e861531430f9b881b35cd1',
        width: 800,
        height: 600,
        format: 'png'
      };
      const image = new Image(json, location);
      const srcsetPng = [
        '/site1/-/images/1a1e9e305b5a132560e861531430f9b881b35cd1/re400x300.png 400w',
        '/site1/-/images/1a1e9e305b5a132560e861531430f9b881b35cd1/re600x450.png 600w',
        '/site1/-/images/1a1e9e305b5a132560e861531430f9b881b35cd1/re800x600.png 800w',
      ].join(', ');
      const srcPng = '/site1/-/images/1a1e9e305b5a132560e861531430f9b881b35cd1/re400x300.png';
      const result = image.render({ tagName: 'img', width: 400 });
      expect(result).to.eql({
        tag: 'img',
        props: {
          width: 400,
          height: 300,
          src: srcPng,
          srcset: srcsetPng,
        },
        children: undefined
      });
    })
  })
})
