import Chai from 'chai'; const { expect } = Chai;

import {
  setDOMHandler,
  createElement,
  createRichText,
  getChildProps,
} from '../src/dom.mjs';

class TestElement {}
class TestContainer {}

function createTestElement(tag, props, children) {
  return { tag, props, children };
}

describe('DOM utilities', function() {
  before(function() {
    setDOMHandler({
      element: TestElement,
      container: TestContainer,
      create: createTestElement,
    });
  })
  describe('createElement()', function() {
    it('should invoke the function registered using setDOMHandler()', function() {
      const children = [ 'Hello' ];
      const props = {};
      const result = createElement('div', props, children);
      expect(result).to.have.property('tag', 'div');
      expect(result).to.have.property('props', props);
      expect(result).to.have.property('children', children);
    })
  })
  describe('createRichText()', function() {
    it('should create an object from a list of tokens', function() {
      const richText = [
        {
          text: 'This is a '
        },
        {
          text: 'test',
          style: { fontWeight: 'bold' }
        },
        {
          text: '!'
        }
      ];
      const result = createRichText(richText);
      expect(result).to.eql({
        tag: TestContainer,
        props: {},
        children: [
          {
            tag: 'span',
            props: { style: {} },
            children: 'This is a '
          },
          {
            tag: 'span',
            props: { style: { fontWeight: 'bold' } },
            children: 'test'
          },
          {
            tag: 'span',
            props: { style: {} },
            children: '!'
          }
        ]
      })
    })
  })
  describe('getChildProps()', function() {
    it('should return the tag name "td" when the parent tag is "tr"', function() {
      expect(getChildProps('tr')).to.eql({ tagName: 'td' });
    })
    it('should return the tag name "li" when the parent tag is "ul" or "ol"', function() {
      expect(getChildProps('ul')).to.eql({ tagName: 'li' });
      expect(getChildProps('ol')).to.eql({ tagName: 'li' });
    })
    it('should not suggest a tag name when the parent tag is not recognized', function() {
      expect(getChildProps('div')).to.eql({});
    })
  })
});
