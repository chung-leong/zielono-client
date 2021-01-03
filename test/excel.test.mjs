import Chai from 'chai'; const { expect } = Chai;
import { setDOMHandler } from '../src/dom.mjs';
import { Image } from '../src/image.mjs';

import {
  Cell,
  Column,
  Sheet,
  Workbook,
} from '../src/excel.mjs';

class TestElement {}
class TestContainer {}

function createTestElement(tag, props, children) {
  return { tag, props, children };
}

describe('Excel objects', function() {
  before(function() {
    setDOMHandler({
      element: TestElement,
      container: TestContainer,
      create: createTestElement,
    });
    process.env.TZ = 'Europe/Warsaw';
  })
  describe('Cell', function() {
    const sheet = {
      columns: [ { name: 'Greeting', nameCC: 'greeting' } ],
      workbook: {
        location: { baseURL: '/site1' }
      }
    };
    it('should handle plain text value correctly', function() {
      const cell = new Cell(sheet, { value: 'Hello' }, 0, 0);
      expect(cell.sheet).to.equal(sheet);
      expect(cell.column).to.equal(sheet.columns[0]);
      expect(cell.name).to.equal('Greeting');
      expect(cell.nameCC).to.equal('greeting');
      expect(cell.value).to.equal('Hello');
      expect(cell.text).to.equal('Hello');
      expect(cell.richText).to.eql({
        tag: TestContainer,
        props: {},
        children: [ 'Hello' ],
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
        },
      ];
      const cell = new Cell(sheet, { value: richText }, 0, 0);
      expect(cell.value).to.equal(richText);
      expect(cell.text).to.equal('This is a test!');
      expect(cell.richText).to.eql({
        tag: TestContainer,
        props: {},
        children: [
          'This is a ',
          {
            tag: 'span',
            props: { key: 1, style: { fontWeight: 'bold' } },
            children: 'test'
          },
          '!',
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
    it('should retrieve values from master cell when merged', function() {
      const sheet = {
        cell(col, row) { return master }
      };
      const master = new Cell(sheet, { value: new Date(0), text: 'Jan 1 1970' }, 0, 0);
      const cell = new Cell(sheet, { master: { col: 3, row: 5 } }, 0, 0);
      expect(cell.master).to.equal(master);
      expect(cell.value).to.eql(new Date(0));
      expect(cell.text).to.equal('Jan 1 1970');
    })
    it('should transfer cell-level text style to plain text value', function() {
      const cell = new Cell(sheet, {
        value: 'Hello',
        style: {
          color: '#ff0000'
        },
      }, 0, 0);
      expect(cell.richText).to.eql({
        tag: TestContainer,
        props: {},
        children: [
          {
            tag: 'span',
            props: {
              key: 0,
              style: {
                color: '#ff0000'
              },
            },
            children: 'Hello'
          }
        ],
      })
    })
    it('should transfer cell-level text style to rich text value', function() {
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
        },
      ];
      const cell = new Cell(sheet, {
        value: richText,
        style: {
          color: '#ff0000'
        },
      }, 0, 0);
      expect(cell.richText).to.eql({
        tag: TestContainer,
        props: {},
        children: [
          {
            tag: 'span',
            props: { key: 0, style: { color: '#ff0000' } },
            children: 'This is a ',
          },
          {
            tag: 'span',
            props: { key: 1, style: { color: '#ff0000', fontWeight: 'bold' } },
            children: 'test'
          },
          {
            tag: 'span',
            props: { key: 2, style: { color: '#ff0000' } },
            children: '!',
          },
        ]
      })
    })
    it('should process image info', function() {
      const cell = new Cell(sheet, {
        value: 'Hello',
        image: {
          hash: 'ABCD',
          width: 300,
          height: 200,
          format: 'jpeg'
        },
        style: {
          color: '#ff0000',
          verticalAlign: 'top',
        },
      }, 0, 0);
      expect(cell.image).to.be.instanceOf(Image);
    })
    describe('render()', function() {
      it('should render a div element by default', function() {
        const cell = new Cell(sheet, {
          value: 'Hello',
          style: {
            color: '#ff0000',
            verticalAlign: 'top',
          },
        }, 0, 0);
        const result = cell.render();
        expect(result).to.eql({
          tag: 'div',
          props: { style: { color: '#ff0000', verticalAlign: 'top' } },
          children: {
            tag: TestContainer,
            props: {},
            children: [ 'Hello' ],
          }
        });
      })
      it('should use specified tag name', function() {
        const cell = new Cell(sheet, {
          value: 'Hello',
          style: {
            color: '#ff0000',
            verticalAlign: 'top',
          },
        }, 0, 0);
        const result = cell.render({ tagName: 'td' });
        expect(result).to.eql({
          tag: 'td',
          props: { style: { color: '#ff0000', verticalAlign: 'top' } },
          children: {
            tag: TestContainer,
            props: {},
            children: [ 'Hello' ],
          }
        });
      })
      it('should render image tag only when there is no text', function() {
        const cell = new Cell(sheet, {
          value: null,
          image: {
            hash: 'ABCD',
            width: 300,
            height: 200,
            format: 'jpeg'
          },
          style: {
            color: '#ff0000',
            verticalAlign: 'top',
          },
        }, 0, 0);
        const result = cell.render();
        expect(result).to.eql({
          tag: 'div',
          props: { style: { color: '#ff0000', verticalAlign: 'top' } },
          children: {
            tag: 'picture',
            props: {},
            children: [
              {
                tag: 'source',
                props: { key: 0, srcset: '/site1/-/images/ABCD/re300x200.webp 300w', type: 'image/webp' },
                children: undefined,
              },
              {
                tag: 'source',
                props: { key: 1, srcset: '/site1/-/images/ABCD/re300x200.jpeg 300w', type: 'image/jpeg' },
                children: undefined,
              },
              {
                tag: 'img',
                props: { key: 2, src: '/site1/-/images/ABCD/re300x200.jpeg', width: 300, height: 200 },
                children: undefined,
              },
            ],
          }
        });
      })
      it('should render figure tag only when there is text', function() {
        const cell = new Cell(sheet, {
          value: 'Hello',
          image: {
            hash: 'ABCD',
            width: 300,
            height: 200,
            format: 'jpeg'
          },
          style: {
            color: '#ff0000',
            verticalAlign: 'top',
          },
        }, 0, 0);
        const result = cell.render();
        expect(result).to.eql({
          tag: 'div',
          props: { style: { color: '#ff0000', verticalAlign: 'top' } },
          children: {
            tag: 'figure',
            props: {},
            children: [
              {
                tag: 'picture',
                props: { key: 0 },
                children: [
                  {
                    tag: 'source',
                    props: { key: 0, srcset: '/site1/-/images/ABCD/re300x200.webp 300w', type: 'image/webp' },
                    children: undefined,
                  },
                  {
                    tag: 'source',
                    props: { key: 1, srcset: '/site1/-/images/ABCD/re300x200.jpeg 300w', type: 'image/jpeg' },
                    children: undefined,
                  },
                  {
                    tag: 'img',
                    props: { key: 2, src: '/site1/-/images/ABCD/re300x200.jpeg', width: 300, height: 200 },
                    children: undefined,
                  },
                ],
              },
              {
                tag: 'figcaption',
                props: { key: 1 },
                children: {
                  tag: TestContainer,
                  props: {},
                  children: [ 'Hello' ],
                }
              }
            ]
          }
        });
      })
      it('should render image with given settings', function() {
        const cell = new Cell(sheet, {
          value: null,
          image: {
            hash: 'ABCD',
            width: 300,
            height: 200,
            format: 'jpeg'
          },
          style: {
            color: '#ff0000',
            verticalAlign: 'top',
          },
        }, 0, 0);
        const result = cell.render({ image: { width: 30 } });
        expect(result).to.eql({
          tag: 'div',
          props: { style: { color: '#ff0000', verticalAlign: 'top' } },
          children: {
            tag: 'picture',
            props: {},
            children: [
              {
                tag: 'source',
                props: { key: 0, srcset: '/site1/-/images/ABCD/re30x20.webp 30w, /site1/-/images/ABCD/re45x30.webp 45w, /site1/-/images/ABCD/re60x40.webp 60w, /site1/-/images/ABCD/re75x50.webp 75w, /site1/-/images/ABCD/re90x60.webp 90w, /site1/-/images/ABCD/re105x70.webp 105w, /site1/-/images/ABCD/re120x80.webp 120w', type: 'image/webp' },
                children: undefined,
              },
              {
                tag: 'source',
                props: { key: 1, srcset: '/site1/-/images/ABCD/re30x20.jpeg 30w, /site1/-/images/ABCD/re45x30.jpeg 45w, /site1/-/images/ABCD/re60x40.jpeg 60w, /site1/-/images/ABCD/re75x50.jpeg 75w, /site1/-/images/ABCD/re90x60.jpeg 90w, /site1/-/images/ABCD/re105x70.jpeg 105w, /site1/-/images/ABCD/re120x80.jpeg 120w', type: 'image/jpeg' },
                children: undefined,
              },
              {
                tag: 'img',
                props: { key: 2, src: '/site1/-/images/ABCD/re30x20.jpeg', width: 30, height: 20 },
                children: undefined,
              },
            ],
          }
        });
      })
    })
  })
  describe('Column', function() {
    const sheet = {};
    const json = {
      name: 'First name',
      nameCC: 'firstName',
      headers: [ { value: 'First name' } ],
      cells: [
        { value: 'Agnieszka' },
      ]
    };
    it('should process JSON data correctly', function() {
      const column = new Column(sheet, json, 1);
      expect(column.sheet).to.equal(sheet)
      expect(column.name).to.equal('First name');
      expect(column.nameCC).to.equal('firstName');
      expect(column.nameKC).to.equal('first-name');
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
          name: 'First name',
          nameCC: 'firstName',
          flags: [ 'en-US' ],
          headers: [
            { value: 'First name (en-US)' }
          ],
          cells: [
            { value: 'Agnes' }
          ]
        },
        {
          name: 'First name',
          nameCC: 'firstName',
          flags: [ 'pl-PL' ],
          headers: [
            { value: 'First name (pl-PL)' }
          ],
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
      expect(sheet.columns.firstName).to.be.instanceOf(Column);
      expect(sheet.columns.firstName.flags).to.eql([ 'en-US' ]);
      expect(sheet.rows).to.be.an('array').with.lengthOf(1);
    })
    describe('filter()', function() {
      it('should filter out other columns when there is exact match', function() {
        const sheet = new Sheet(workbook, json, 1);
        const view = sheet.filter([ 'pl-PL' ]);
        expect(view.workbook).to.equal(sheet.workbook);
        expect(view.name).to.equal(sheet.name);
        expect(view.nameCC).to.equal(sheet.nameCC);
        expect(view.number).to.equal(sheet.number);
        expect(view.columns).to.be.an('array').with.lengthOf(1);
        expect(view.columns.firstName.flags).to.eql([ 'pl-PL' ]);
      })
      it('should filter out other columns when language matches', function() {
        const sheet = new Sheet(workbook, json, 1);
        const view = sheet.filter([ 'pl' ]);
        expect(view.columns).to.be.an('array').with.lengthOf(1);
        expect(view.columns.firstName.flags).to.eql([ 'pl-PL' ]);
      })
      it('should filter out other columns when country matches', function() {
        const sheet = new Sheet(workbook, json, 1);
        const view = sheet.filter([ 'PL' ]);
        expect(view.columns).to.be.an('array').with.lengthOf(1);
        expect(view.columns.firstName.flags).to.eql([ 'pl-PL' ]);
      })
    })
    describe('column()', function() {
      it('should find column by number', function() {
        const sheet = new Sheet(workbook, json, 1);
        const column = sheet.column(1);
        expect(column).to.be.instanceOf(Column);
      })
      it('should find column by camelCase name', function() {
        const sheet = new Sheet(workbook, json, 1);
        const column = sheet.column('firstName');
        expect(column).to.be.instanceOf(Column);
      })
      it('should find column by kebab-case name', function() {
        const sheet = new Sheet(workbook, json, 1);
        const column = sheet.column('first-name');
        expect(column).to.be.instanceOf(Column);
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
      expect(workbook.locales).to.eql([ 'en-US', 'pl-PL' ]);
    })
    describe('filter()', function() {
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
    describe('sheet()', function() {
      it('should find sheet by camelCase name', function() {
        const workbook = new Workbook(json);
        const sheet = workbook.sheet('name');
        expect(sheet).to.be.instanceOf(Sheet);
      })
    })
  })
});
