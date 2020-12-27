import { ReactElement, Fragment, createElement } from 'react';
import { DataSource, DataSourceEvent, DataSourceError } from './data-source.mjs';
import { Workbook, WorkbookView, Sheet, SheetView, Row, Column, Cell } from './excel.mjs';
import { Image } from './image.mjs';
import { setDOMHandler } from './dom.mjs';

setDOMHandler({
  element: ReactElement,
  container: Fragment,
  create: createElement,
});

export {
  DataSource,
  DataSourceEvent,
  DataSourceError,
  Workbook,
  WorkbookView,
  Sheet,
  SheetView,
  Row,
  Column,
  Cell,
  Image,
};
