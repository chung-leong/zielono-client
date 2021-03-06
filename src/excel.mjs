import { Image } from './image.mjs';
import { createElement, createRichText, getChildProps, getDOMClass } from './dom.mjs';

class Workbook {
  #title;
  #keywords;
  #description;
  #subject;
  #category;
  #status;
  #sheets = [];
  #location;
  #locales;

  get title() { return this.#title }
  get keywords() { return this.#keywords }
  get description() { return this.#description }
  get subject() { return this.#subject }
  get category() { return this.#category }
  get status() { return this.#status }
  get sheets() { return this.#sheets }
  get location() { return this.#location }
  get locales() {
    if (!this.#locales) {
      this.#locales = [];
      for (let sheet of this.#sheets) {
        for (let locale of sheet.locales) {
          if (!this.#locales.includes(locale)) {
            this.#locales.push(locale);
          }
        }
      }
    }
    return this.#locales;
  }

  constructor(json, location) {
    const {
      keywords = '',
      title = '',
      description = '',
      subject = '',
      category = '',
      status = '',
      sheets = [],
    } = json;
    this.#title = title;
    this.#keywords = keywords;
    this.#description = description;
    this.#subject = subject;
    this.#category = category;
    this.#status = status;
    this.#location = location;
    for (let [ index, sheet ] of sheets.entries()) {
      this.#sheets.push(new Sheet(this, sheet, index));
    }
    attachProperties(this.#sheets);
  }

  sheet(name) {
    return findByName(this.sheets, name);
  }

  filter(flags) {
    return new WorkbookView(this, flags);
  }
}

class WorkbookView {
  #workbook;
  #sheets = [];

  get title() { return this.#workbook.title }
  get keywords() { return this.#workbook.keywords }
  get description() { return this.#workbook.description }
  get subject() { return this.#workbook.subject }
  get category() { return this.#workbook.category }
  get status() { return this.#workbook.status }
  get sheets() { return this.#sheets }

  constructor(workbook, flags) {
    this.#workbook = workbook;
    const { sheets } = workbook;
    for (let sheet of filterObjects(sheets, flags)) {
      this.#sheets.push(sheet.filter(flags));
    }
    attachProperties(this.#sheets);
  }

  sheet(name) {
    return findByName(this.sheets, name);
  }
}

class Sheet {
  #workbook;
  #name;
  #nameCC;
  #nameKC;
  #flags;
  #index;
  #rows = [];
  #columns = [];
  #locales;

  get workbook() { return this.#workbook }
  get name() { return this.#name }
  get nameCC() { return this.#nameCC }
  get nameKC() {
    if (!this.#nameKC) {
      this.#nameKC = kebabCase(this.#nameCC);
    }
    return this.#nameKC;
  }
  get flags() { return this.#flags }
  get index() { return this.#index }
  get number() { return this.#index + 1 }
  get rows() { return this.#rows }
  get columns() { return this.#columns }
  get locales() {
    if (!this.#locales) {
      this.#locales = [];
      for (let column of this.#columns) {
        for (let locale of column.locales) {
          if (!this.#locales.includes(locale)) {
            this.#locales.push(locale);
          }
        }
      }
    }
    return this.#locales;
  }

  constructor(workbook, json, index) {
    const {
      name = '',
      nameCC = '',
      flags = [],
      rows = [],
      columns = [],
    } = json;
    this.#workbook = workbook;
    this.#name = name;
    this.#nameCC = nameCC;
    this.#flags = flags;
    this.#index = index;
    for (let [ index, column ] of columns.entries()) {
      this.#columns.push(new Column(this, column, index));
    }
    const firstCol = this.#columns[0];
    const rowCount = (firstCol) ? firstCol.cells.length : 0;
    for (let i = 0; i < rowCount; i++) {
      this.#rows.push(new Row(this, i));
    }
    attachProperties(this.#columns);
  }

  column(name) {
    return findByName(this.columns, name);
  }

  cell(colIndex, rowIndex) {
    const column = this.columns[colIndex];
    if (rowIndex < 0) {
      return column.headers[column.headers.length + rowIndex];
    } else {
      return column.cells[rowIndex];
    }
  }

  get(types) {
    const objects = [];
    for (let row of this.rows) {
      objects.push(row.get(types));
    }
    return objects;
  }

  filter(flags) {
    return new SheetView(this, flags);
  }

  render(props) {
    const { tagName = 'table', ...others } = props;
    let children;
    if (tagName === 'table') {
      const thead = this.renderTableHead();
      const tbody = this.renderTableBody();
      children = (thead) ? [ thead, tbody ] : [ tbody ];
    } else {
      const childProps = getChildProps(tagName, others)
      children = [];
      for (let [ index, row ] of this.rows.entries()) {
        children.push(row.render({ key: index, ...childProps }));
      }
    }
    return createElement(tagName, others, children);
  }

  renderTableHead() {
    const rowCount = this.columns[0].headers.length;
    if (rowCount > 0) {
      const rows = [];
      for (let i = 0; i < rowCount; i++) {
        const children = [];
        for (let [ index, column ] of this.columns.entries()) {
          const header = column.headers[i];
          children.push(header.render({ key: index, tagName: 'th' }));
        }
        rows.push(createElement('tr', { key: i }, children));
      }
      return createElement('thead', {}, rows);
    }
  }

  renderTableBody() {
    const children = [];
    for (let [ index, row ] of this.rows.entries()) {
      children.push(row.render({ key: index, tagName: 'tr' }));
    }
    return createElement('tbody', {}, children);
  }
}

class SheetView {
  #sheet;
  #columns = [];
  #rows = [];

  get workbook() { return this.#sheet.workbook }
  get name() { return this.#sheet.name }
  get nameCC() { return this.#sheet.nameCC }
  get nameKC() { return this.#sheet.nameKC }
  get flags() { return this.#sheet.flags }
  get index() { return this.#sheet.index }
  get number() { return this.#sheet.number }
  get rows() { return this.#rows }
  get columns() { return this.#columns }

  constructor(sheet, flags) {
    this.#sheet = sheet;
    const { columns, rows } = sheet;
    for (let column of filterObjects(columns, flags)) {
      this.#columns.push(column);
    }
    for (let i = 0; i < rows.length; i++) {
      this.#rows.push(new Row(this, i));
    }
    attachProperties(this.#columns);
  }

  column(name) {
    return findByName(this.columns, name);
  }

  render(props) {
    const f = Sheet.prototype.render;
    return f.call(this, props);
  }
}

class Column {
  #sheet;
  #name;
  #nameCC;
  #nameKC;
  #flags;
  #index;
  #headers = [];
  #cells = [];
  #locales;

  get sheet() { return this.#sheet }
  get name() { return this.#name }
  get nameCC() { return this.#nameCC }
  get nameKC() {
    if (!this.#nameKC) {
      this.#nameKC = kebabCase(this.#nameCC);
    }
    return this.#nameKC;
  }
  get flags() { return this.#flags }
  get headers() { return this.#headers }
  get index() { return this.#index }
  get number() { return this.#index + 1 }
  get cells() { return this.#cells }
  get locales() {
    if (!this.#locales) {
      this.#locales = [];
      for (let flag of this.#flags) {
        const [ language, country ] = parseLocale(flag);
        if (language || country) {
          if (!this.#locales.includes(flag)) {
            this.#locales.push(flag);
          }
        }
      }
    }
    return this.#locales;
  }

  constructor(sheet, json, index) {
    const {
      name = '',
      nameCC = '',
      flags = [],
      headers = [],
      cells = [],
    } = json;
    this.#sheet = sheet;
    this.#name = name;
    this.#nameCC = nameCC;
    this.#flags = flags;
    this.#index = index;
    for (let [ headerIndex, header ] of headers.entries()) {
      const rowIndex = headerIndex - headers.length;
      this.#headers.push(new Cell(sheet, header, index, rowIndex));
    }
    for (let [ rowIndex, cell ] of cells.entries()) {
      this.#cells.push(new Cell(sheet, cell, index, rowIndex));
    }
  }

  get(type) {
    const values = [];
    for (let cell of this.cells) {
      const value = cell.get(type);
      values.push(value) ;
    }
    return values;
  }

  render(props) {
    const { tagName = 'ul', ...others } = props || {};
    const childProps = getChildProps(tagName, others);
    const children = [];
    for (let [ index, cell ] of this.cells.entries()) {
      children.push(cell.render({ key: index, ...childProps }));
    }
    return createElement(tagName, others, children);
  }
}

class Row {
  #sheet;
  #index;
  #cells = [];

  get sheet() { return this.#sheet }
  get index() { return this.#index }
  get number() { return this.#index + 1 }
  get cells() { return this.#cells }
  get locales() { return this.#sheet.locales }

  constructor(sheet, index) {
    this.#sheet = sheet;
    this.#index = index;
    const { columns } = sheet;
    for (let column of columns) {
      this.#cells.push(column.cells[this.#index]);
    }
    attachProperties(this.#cells);
  }

  cell(name) {
    return findByName(this.cells, name);
  }

  get(types) {
    const object = {};
    for (let [ name, type ] of Object.entries(types)) {
      const cell = this.cells[name];
      if (!cell) {
        const msg = `Sheet "${this.sheet.nameCC}" does not have the column "${name}"`;
        throw new TypeError(msg);
      }
      object[name] = cell.get(type);
    }
    return object;
  }

  render(props) {
    const { tagName = 'ul', ...others } = props || {};
    const childProps = getChildProps(tagName, others);
    const children = this.cells.entries.map(([ index, cell ]) => {
      return cell.render({ key: index, ...childProps });
    });
    return createElement(tagName, others, children);
  }
}

class Cell {
  #sheet;
  #value;
  #text;
  #richText = null;
  #style;
  #image;
  #rowIndex;
  #colIndex;
  #master;
  #masterIndices;

  get sheet() { return this.#sheet }
  get value() { this.#copy(); return this.#value }
  get text() { this.#copy(); return this.#text }
  get richText() {
    this.#copy();
    if (!this.#richText) {
      const tokens = (this.#value instanceof Array) ? this.#value : this.#text;
      this.#richText = createRichText(tokens, this.#style);
    }
    return this.#richText;
  }
  get image() { this.#copy(); return this.#image }
  get style() { this.#copy(); return this.#style }
  get rowIndex() { return this.#rowIndex }
  get rowNumber() { return this.#rowIndex + 1 }
  get column() { return this.#sheet.columns[this.#colIndex] }
  get columnIndex() { return this.#colIndex }
  get columnNumber() { return this.#colIndex + 1 }
  get name() { return this.column.name }
  get nameCC() { return this.column.nameCC }
  get nameKC() { return this.column.nameKC }
  get locales() { return this.column.locales }
  get master() { this.#copy(); return this.#master }

  constructor(sheet, json, colIndex, rowIndex) {
    this.#sheet = sheet;
    this.#colIndex = colIndex;
    this.#rowIndex = rowIndex;
    if (json.master) {
      this.#masterIndices = json.master;
    } else {
      const {
        value = null,
        text,
        style = {},
        image,
        master,
      } = json;
      this.#value = value;
      this.#text = text || stringifyValue(value);
      this.#style = style;
      if (image) {
        this.#image = new Image(image, sheet.workbook.location);
      }
    }
  }

  #copy() {
    if (this.#masterIndices && !this.#master) {
      const { col, row } = this.#masterIndices;
      const cell = this.#sheet.cell(col, row);
      if (cell) {
        this.#value = cell.value;
        this.#text = cell.text;
        this.#style = cell.style;
        this.#richText = cell.richText;
        this.#image = cell.image;
        this.#master = cell;
      }
    }
  }

  get(type) {
    if (type === String) {
      return this.text;
    } else if (type === Number) {
      return (typeof(this.value) === 'number') ? this.value : NaN;
    } else if (type === Date) {
      return (this.value instanceof Date) ? this.value : new Date(NaN);
    } else if (type === Image) {
      return this.image;
    } else if (type === getDOMClass()) {
      return this.richText;
    } else {
      const msg = `Unable to map type "${type.name}" to a property`;
      throw new TypeError(msg);
    }
  }

  render(props) {
    const {
      tagName = 'div',
      style: otherStyle,
      image: imageProps,
      ...others
    } = props || {};
    const style = { ...this.style, ...otherStyle };
    const tokens = (this.value instanceof Array) ? this.value : this.text;
    const richText = createRichText(tokens, null);
    let children;
    if (this.image) {
      if (this.text) {
        const img = this.image.render({ key: 0, ...imageProps });
        const legend = createElement('figcaption', { key: 1 }, richText);
        children = createElement('figure', {}, [ img, legend ]);
      } else {
        children = this.image.render(imageProps);
      }
    } else {
      children = richText;
    }
    return createElement(tagName, { style, ...others }, children);
  }
}

function attachProperties(objects) {
  for (let object of objects) {
    if (!objects[object.nameCC]) {
      objects[object.nameCC] = object;
    }
  }
}

function filterObjects(objects, flags) {
  const slots = {};
  for (let object of objects) {
    // see how closely is the match
    const score = calculateMatch(object.flags, flags);
    const slot = slots[object.nameCC];
    if (slot) {
      if (slot.score < score) {
        slot.object = object;
        slot.score = score;
      }
    } else {
      slots[object.nameCC] = { object, score };
    }
  }
  const remaining = [];
  for (let object of objects) {
    const slot = slots[object.nameCC];
    if (slot.object === object) {
        remaining.push(object)
    }
  }
  return remaining;
}

function calculateMatch(objFlags, flags) {
  let overallScore = 0;
  for (let flag of flags) {
    let flagScore = 0;
    for (let objFlag of objFlags) {
      let score = 0;
      if (objFlag === flag) {
        score = 1;
      } else if (flagScore === 0) {
        const [ objLang, objCountry ] = parseLocale(objFlag);
        const [ lang, country ] = parseLocale(flag);
        if (lang && objLang === lang) {
          // score is lower on conflict
          score = (country && objCountry) ? 0.25 : 0.5;
        } else if (country && objCountry === country) {
          score = (lang && objLang) ? 0.25 : 0.5;
        }
      }
      if (score > flagScore) {
        flagScore = score;
      }
    }
    overallScore += flagScore;
  }
  return overallScore;
}

function parseLocale(locale) {
  let m, language, country;
  if (m = /^([a-z]{2})-([A-Z]{2})$/.exec(locale)) {
    language = m[1];
    country = m[2];
  } else if (m = /^[a-z]{2}$/.exec(locale)) {
    language = m[0];
  } else if (m = /^[A-Z]{2}$/.exec(locale)) {
    country = m[0];
  }
  return [ language, country ]
}

function stringifyValue(value) {
  if (typeof(value) === 'string') {
    return value;
  } else if (typeof(value) === 'number') {
    return value.toLocaleString();
  } else if (value instanceof Date) {
    const options = { dateStyle: 'short', timeStyle: 'short' };
    return value.toLocaleDateString(undefined, options);
  } else if (value instanceof Array) {
    return value.map((t) => t.text).join('');
  } else if (value && value.error) {
    return '#ERR';
  } else {
    return '';
  }
}

function kebabCase(nameCC) {
  return nameCC.replace(/[A-Z]/g, (m0) => '-' + m0.toLowerCase());
}

function findByName(objects, name) {
  for (let [ index, object ] of objects.entries()) {
    if (index === name || object.nameCC === name || object.nameKC === name) {
      return object;
    }
  }
}

export {
  Workbook,
  WorkbookView,
  Sheet,
  SheetView,
  Row,
  Column,
  Cell,
};
