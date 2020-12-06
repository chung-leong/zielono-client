import Chai from 'chai'; const { expect } = Chai;

import {
  Cell,
  Column,
  Sheet,
  Workbook,
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
  describe('Cell', function() {
    const sheet = {};
    it('should handle plain text value correctly', function() {
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
      expect(cell.style).to.eql({});
      expect(cell.columnNumber).to.equal(1);
      expect(cell.rowNumber).to.equal(1);
    })
    it('should handle rich text value correctly', function() {
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
      const cell = new Cell(sheet, { value: richText }, 0, 0);
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
    it('should handle numeric value correctly', function() {
      const cell = new Cell(sheet, { value: 50000.23 }, 0, 0);
      expect(cell.value).to.equal(50000.23);
      expect(cell.text).to.equal('50,000.23');
    })
    it('should handle date value correctly', function() {
      const cell = new Cell(sheet, { value: new Date(0) }, 0, 0);
      expect(cell.value).to.eql(new Date(0));
      expect(cell.text).to.equal('1/1/70, 1:00 AM');
    })
    it('should handle null value correctly', function() {
      const cell = new Cell(sheet, { value: null }, 0, 0);
      expect(cell.value).to.equal(null);
      expect(cell.text).to.equal('');
    })
    it('should handle error value correctly', function() {
      const cell = new Cell(sheet, { value: { error: 'Bad' } }, 0, 0);
      expect(cell.text).to.equal('#ERR');
    })
    it('should contain preformatted text', function() {
      const cell = new Cell(sheet, { value: new Date(0), text: 'Jan 1 1970' }, 0, 0);
      expect(cell.value).to.eql(new Date(0));
      expect(cell.text).to.equal('Jan 1 1970');
    })
  })
  describe('Column', function() {
    const sheet = {};
    const json = {
      name: 'Name',
      nameCC: 'name',
      headers: [ { value: 'Name' } ],
      cells: [
        { value: 'Agnieszka' },
      ]
    };
    it('should process JSON data correctly', function() {
      const column = new Column(sheet, json, 1);
      expect(column.sheet).to.equal(sheet)
      expect(column.name).to.equal('Name');
      expect(column.nameCC).to.equal('name');
      expect(column.flags).to.eql([]);
      expect(column.headers).to.have.lengthOf(1);
      expect(column.headers[0]).to.be.an.instanceOf(Cell);
      expect(column.cells).to.be.an('array').with.lengthOf(1);
      expect(column.cells[0]).to.be.instanceOf(Cell);
      expect(column.number).to.equal(2);
    })
  })
  describe('Sheet', function() {
    const workbook = {};
    const json = {
      name: 'Sheet1',
      nameCC: 'sheet1',
      columns: [
        {
          name: 'Name',
          nameCC: 'name',
          flags: [ 'en-US' ],
          headers: [ { value: 'Name' } ],
          cells: [
            { value: 'Agnes' }
          ]
        },
        {
          name: 'Name',
          nameCC: 'name',
          flags: [ 'pl-PL' ],
          headers: [ { value: 'Name' } ],
          cells: [
            { value: 'Agnieszka' }
          ]
        }
      ],
    };
    it('should process JSON data correctly', function() {
      const sheet = new Sheet(workbook, json, 1);
      expect(sheet.workbook).to.equal(workbook);
      expect(sheet.name).to.equal('Sheet1');
      expect(sheet.nameCC).to.equal('sheet1');
      expect(sheet.flags).to.eql([]);
      expect(sheet.number).to.equal(2);
      expect(sheet.columns).to.be.an('array').with.lengthOf(2);
      expect(sheet.columns.name).to.be.instanceOf(Column);
      expect(sheet.columns.name.flags).to.eql([ 'en-US' ]);
      expect(sheet.rows).to.be.an('array').with.lengthOf(1);
    })
    describe('filter', function() {
      it('should filter out other columns when there is exact match', function() {
        const sheet = new Sheet(workbook, json, 1);
        const view = sheet.filter([ 'pl-PL' ]);
        expect(view.workbook).to.equal(sheet.workbook);
        expect(view.name).to.equal(sheet.name);
        expect(view.nameCC).to.equal(sheet.nameCC);
        expect(view.number).to.equal(sheet.number);
        expect(view.columns).to.be.an('array').with.lengthOf(1);
        expect(view.columns.name.flags).to.eql([ 'pl-PL' ]);
      })
      it('should filter out other columns when language matches', function() {
        const sheet = new Sheet(workbook, json, 1);
        const view = sheet.filter([ 'pl' ]);
        expect(view.columns).to.be.an('array').with.lengthOf(1);
        expect(view.columns.name.flags).to.eql([ 'pl-PL' ]);
      })
      it('should filter out other columns when country matches', function() {
        const sheet = new Sheet(workbook, json, 1);
        const view = sheet.filter([ 'PL' ]);
        expect(view.columns).to.be.an('array').with.lengthOf(1);
        expect(view.columns.name.flags).to.eql([ 'pl-PL' ]);
      })
    })
  })
  describe('Workbook', function() {
    const json = {
      keywords: 'key word',
      title: 'This is a title',
      description: 'This is a description',
      subject: 'Test',
      category: 'Good',
      status: 'ready',
      sheets: [
        {
          name: 'Name',
          nameCC: 'name',
          flags: [ 'first' ],
          columns: [
            {
              name: 'Name',
              nameCC: 'name',
              flags: [ 'en-US' ],
              headers: [ { value: 'Name' } ],
              cells: [
                { value: 'Agnes' }
              ]
            },
            {
              name: 'Name',
              nameCC: 'name',
              flags: [ 'pl-PL' ],
              headers: [ { value: 'Name' } ],
              cells: [
                { value: 'Agnieszka' }
              ]
            }
          ],
        },
        {
          name: 'Name',
          nameCC: 'name',
          flags: [ 'last' ],
          columns: [
            {
              name: 'Name',
              nameCC: 'name',
              headers: [ { value: 'Name' } ],
              cells: [
                { value: 'Osiecka' }
              ]
            },
          ],
        }
      ]
    };
    it('should process JSON data correctly', function() {
      const workbook = new Workbook(json);
      expect(workbook.keywords).to.equal('key word');
      expect(workbook.title).to.equal('This is a title');
      expect(workbook.description).to.equal('This is a description');
      expect(workbook.subject).to.equal('Test');
      expect(workbook.category).to.equal('Good');
      expect(workbook.status).to.equal('ready');
      expect(workbook.sheets).to.be.an('array').with.lengthOf(2);
      expect(workbook.sheets.name).to.be.an.instanceOf(Sheet);
    })
    describe('filter', function() {
      it('should filter out sheets and columns', function() {
        const workbook = new Workbook(json);
        const view1 = workbook.filter([ 'first', 'pl-PL' ]);
        expect(view1.keywords).to.equal(workbook.keywords);
        expect(view1.title).to.equal(workbook.title);
        expect(view1.description).to.equal(workbook.description);
        expect(view1.subject).to.equal(workbook.subject);
        expect(view1.category).to.equal(workbook.category);
        expect(view1.status).to.equal(workbook.status);
        expect(view1.sheets).to.be.an('array').with.lengthOf(1);
        expect(view1.sheets.name.flags).to.eql([ 'first' ]);
        expect(view1.sheets.name.columns.name.flags).to.eql([ 'pl-PL' ]);
        const view2 = workbook.filter([ 'last', 'pl-PL' ]);
        expect(view2.sheets.name.flags).to.eql([ 'last' ]);
      })
    })
  })
});
