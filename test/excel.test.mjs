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
  })
  describe('#Cell', function() {
    it ('should handle plain text value correctly', function() {
      const sheet = {};
      const cell = new Cell(sheet, { value: 'Hello' });
      expect(cell.value).to.equal('Hello')
      expect(cell.sheet).to.equal(sheet);
    })
  })
});
