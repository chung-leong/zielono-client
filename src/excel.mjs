class Workbook {
  #title;
  #keywords;
  #description;
  #subject;
  #category;
  #status;
  #sheets = [];

  get title() { return this.#title }
  get keywords() { return this.#keywords }
  get description() { return this.#description }
  get subject() { return this.#subject }
  get category() { return this.#category }
  get status() { return this.#status }
  get sheets() { return this.#sheets }

  constructor(json) {
    const {
      keywords = '',
      title = '',
      description = '',
      subject = '',
      category = '',
      status = '',
      sheets,
    } = json;
    this.#title = title;
    this.#keywords = keywords;
    this.#description = description;
    this.#subject = subject;
    this.#category = category;
    this.#status = status;
    for (let [ index, sheet ] of sheets.entries()) {
      this.#sheets.push(new Sheet(this, sheet, index));
    }
    attachProperties(this.#sheets);
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
}

class Sheet {
  #workbook;
  #name;
  #nameCC;
  #flags;
  #index;
  #rows = [];
  #columns = [];

  get workbook() { return this.#workbook }
  get name() { return this.#name }
  get nameCC() { return this.#nameCC }
  get flags() { return this.#flags }
  get index() { return this.#index }
  get number() { return this.#index + 1 }
  get rows() { return this.#rows }
  get columns() { return this.#columns }

  constructor(workbook, json, index) {
    const {
      name,
      nameCC,
      flags = [],
      rows,
      columns
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
      children = this.rows.map((c) => c.render(childProps));
    }
    return createElement(tagName, others, children);
  }

  renderTableHead() {
    const headers = this.columns.map((c) => c.header).filter((h) => h);
    if (headers.length > 0) {
      const childProps = { tagName: 'th' };
      const children = headers.map((c) => c.render(childProps));
      const row = createElement('tr', {}, children);
      return createElement('thead', {}, [ row ]);
    }
  }

  renderTableBody() {
    const childProps = { tagName: 'tr' };
    const children = this.rows.map((c) => c.render(childProps));
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
}

class Column {
  #sheet;
  #name;
  #nameCC;
  #flags;
  #header;
  #index;
  #cells = [];

  get sheet() { return this.#sheet }
  get name() { return this.#name }
  get nameCC() { return this.#nameCC }
  get flags() { return this.#flags }
  get header() { return this.#header }
  get index() { return this.#index }
  get number() { return this.#index + 1 }
  get cells() { return this.#cells }

  constructor(sheet, json, index) {
    const {
      name,
      nameCC,
      flags = [],
      header,
      cells,
    } = json;
    this.#sheet = sheet;
    this.#name = name;
    this.#nameCC = nameCC;
    this.#flags = flags;
    this.#index = index;
    if (header) {
      this.#header = new Cell(sheet, header, index, -1);
    }
    for (let [ rowIndex, cell ] of cells.entries()) {
      this.#cells.push(new Cell(sheet, cell, index, rowIndex))
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
    const children = this.cells.map((c) => c.render(childProps));
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

  constructor(sheet, index) {
    this.#sheet = sheet;
    this.#index = index;
    const { columns } = sheet;
    for (let column of columns) {
      this.#cells.push(column.cells[this.#index]);
    }
    attachProperties(this.#cells);
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
    const { tagName = 'div', ...others } = props || {};
    const childProps = getChildProps(tagName, others);
    const children = this.cells.map((c) => c.render(childProps));
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

  get sheet() { return this.#sheet }
  get value() { return this.#value }
  get text() { return this.#text }
  get richText() {
    if (!this.#richText) {
      const { value, text } = this;
      if (value instanceof Array) {
        return createRichText(value);
      } else {
        return createRichText([ { text } ]);
      }
    }
    return this.#richText;
  }
  get image() { return this.#image }
  get style() { return this.#style }
  get rowIndex() { return this.#rowIndex }
  get rowNumber() { return this.#rowIndex + 1 }
  get column() { return this.#sheet.columns[this.#colIndex] }
  get columnIndex() { return this.#colIndex }
  get columnNumber() { return this.#colIndex + 1 }
  get name() { return this.column.name }
  get nameCC() { return this.column.nameCC }

  constructor(sheet, json, colIndex, rowIndex) {
    const {
      value,
      text,
      style = {},
      image,
    } = json;
    this.#sheet = sheet;
    this.#value = value;
    this.#text = text || stringifyValue(value);
    this.#style = style;
    this.#colIndex = colIndex;
    this.#rowIndex = rowIndex;
    if (image) {
      this.#image = new Image(sheet.workbook, image);
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
    } else if (type === Element) {
      return this.richText;
    } else {
      const msg = `Unable to map type "${type.name}" to a property`;
      throw new TypeError(msg);
    }
  }


  render(props) {
    const { tagName = 'div', style: otherStyle, ...others } = props || {};
    const style = { ...this.style, ...otherStyle };
    return createElement(tagName, { style, ...others }, this.richText);
  }
}

class Image {
  #workbook;
  #hash;
  #width;
  #height;

  constructor(workbook, json) {
    const {
      hash,
      width,
      height,
    } = json;
    this.#workbook = workbook;
    this.#width = width;
    this.#height = height;
  }
}

let Element;
let Container;
let createElementHandler;

function setDOMHandler(config) {
  Element = config.element;
  Container = config.container;
  createElementHandler = config.create;
}

function createRichText(tokens) {
  const children = [];
  for (let token of tokens) {
    const { text, style = {} } = token;
    children.push(createElement('span', { style }, text));
  }
  return createElement(Container, {}, children);
}

function createElement(tagName, props, children) {
  if (!createElementHandler) {
    throw new Error('No DOM handler');
  }
  return createElementHandler(tagName, props, children);
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

function getChildProps(tagName, props) {
  if (tagName === 'ul' || tagName === 'ol') {
    return { tagName: 'li' };
  } else if (tagName === 'tr') {
    return { tagName: 'td' };
  } else {
    return {};
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
  Image,
  setDOMHandler,
};
