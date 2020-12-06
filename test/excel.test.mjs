import Chai from 'chai'; const { expect } = Chai;

import {
  Cell,
  setDOMHandler
} from '../src/excel.mjs';

class TestElement {}
class TestContainer {}

function createElement(tag, props, children) {
  return { tag, props, children };
}

describe('Excel objects', function() {
  before(function() {
    setDOMHandler({
      element: TestElement,
      container: TestContainer,
      create: createElement,
    });
    process.env.TZ = 'Europe/Warsaw';
  })
  describe('#Cell', function() {
    it ('should handle plain text value correctly', function() {
      const sheet = {};
      const cell = new Cell(sheet, { value: 'Hello' }, 0, 0);
      expect(cell.sheet).to.equal(sheet);
      expect(cell.value).to.equal('Hello');
      expect(cell.text).to.equal('Hello');
      expect(cell.richText).to.eql({
        tag: TestContainer,
        props: {},
        children: [
          {
            tag: 'span',
            props: { style: {} },
            children: 'Hello'
          }
        ]
      })
      expect(cell.columnNumber).to.equal(1);
      expect(cell.rowNumber).to.equal(1);
    })
    it ('should handle rich text value correctly', function() {
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
      ]
      const cell = new Cell(null, { value: richText }, 0, 0);
      expect(cell.value).to.equal(richText);
      expect(cell.text).to.equal('This is a test!');
      expect(cell.richText).to.eql({
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
    it ('should handle numeric value correctly', function() {
      const cell = new Cell(null, { value: 50000.23 }, 0, 0);
      expect(cell.value).to.equal(50000.23);
      expect(cell.text).to.equal('50,000.23');
    })
    it ('should handle date value correctly', function() {
      const cell = new Cell(null, { value: new Date(0) }, 0, 0);
      expect(cell.value).to.eql(new Date(0));
      expect(cell.text).to.equal('1/1/70, 1:00 AM');
    })
    it ('should handle null value correctly', function() {
      const cell = new Cell(null, { value: null }, 0, 0);
      expect(cell.value).to.equal(null);
      expect(cell.text).to.equal('');
    })
  })
});
