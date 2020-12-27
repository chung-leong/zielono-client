import Chai from 'chai'; const { expect, AssertionError } = Chai;
import { Workbook } from '../src/excel.mjs';

import {
  DataSource,
  DataSourceEvent,
} from '../src/data-source.mjs';

describe('Data source', function() {
  let nextResponse = 404, lastRequest;
  const put = (response) => {
    nextResponse = response;
  };
  const fetch = async (url, options) => {
    const { status = 200, json = {}, headers = {} } = nextResponse || {};
    let statusText;
    switch (status) {
      case 200: statusText = 'OK'; break;
      case 404: statusText = 'Not found'; break;
      case 500: statusText = 'Internal Server Error'; break;
    }
    lastRequest = { url, options };
    return {
      ok: (status < 300),
      status,
      statusText,
      headers: {
        get(name) { return headers[name] }
      },
      async json() {
        return { ...json };
      },
      async text() {
        return '';
      }
    };
  };
  let ds;
  beforeEach(function() {
    nextResponse = lastRequest = ds = undefined;
  })
  afterEach(function() {
    if (ds) {
      ds.stop();
    }
  })
  let root, fetchBefore;
  before(function() {
    if (typeof(window) === 'object') {
      root = window;
    } else if (typeof(global) === 'object') {
      root = global;
    }
    fetchBefore = root.fetch;
    root.fetch = fetch;
  })
  after(function() {
    root.fetch = fetchBefore;
  })
  describe('fetchJSON()', function() {
    it('should retrieve a JSON object', async function() {
      ds = new DataSource({
        baseURL: 'http://localhost/site-1/',
      });
      try {
        put({
          headers: { etag: 'abcdef' },
          json: { hello: 'world' }
        });
        const result = await ds.fetchJSON('goat');
        expect(result).to.eql({ hello: 'world' });
        expect(lastRequest).to.have.property('url', 'http://localhost/site-1/-/data/goat')
      } finally {
        ds.stop();
      }
    })
    it('should return the same object when called a second time', async function() {
      ds = new DataSource({
        baseURL: 'http://localhost/site-1/',
      });
      put({
        headers: { etag: 'abcdef' },
        json: { hello: 'world' }
      });
      const result1 = await ds.fetchJSON('goat');
      const result2 = await ds.fetchJSON('goat');
      expect(ds.queries).to.have.lengthOf(1);
      expect(result2).to.equal(result1);
      const result3 = await ds.fetchJSON('sheep');
      expect(ds.queries).to.have.lengthOf(2);
      expect(result3).to.not.equal(result1);
    })
    it('should refresh object after certain amount of time', async function() {
      ds = new DataSource({
        baseURL: 'http://localhost/site-1/',
        refresh: 0.1,
      });
      let event;
      ds.addEventListener('change', (evt) => event = evt);
      put({
        headers: { etag: 'abcdef' },
        json: { hello: 'world' }
      });
      const result1 = await ds.fetchJSON('goat');
      expect(ds.updateTime).to.be.a('date');
      expect(ds.updateTime).to.not.equal(0);
      put({
        headers: { etag: 'f0f0f0' },
        json: { hello: 'WORLD!' }
      });
      await delay(200);
      expect(event).to.be.instanceOf(DataSourceEvent);
      const result2 = await ds.fetchJSON('goat');
      expect(result2).to.not.eql(result1);
    })
    it('should refresh object if cache entry is stale', async function() {
      ds = new DataSource({
        baseURL: 'http://localhost/site-1/',
        stale: 0.1,
      });
      let event;
      ds.addEventListener('change', (evt) => event = evt);
      put({
        headers: { etag: 'abcdef', 'x-cache-status': 'STALE' },
        json: { hello: 'world' }
      });
      const result1 = await ds.fetchJSON('goat');
      put({
        headers: { etag: 'f0f0f0', 'x-cache-status': 'UPDATING' },
        json: { hello: 'WORLD!' }
      });
      await delay(200);
      expect(event).to.be.instanceOf(DataSourceEvent);
      const result2 = await ds.fetchJSON('goat');
      expect(result2).to.not.eql(result1);
      event = undefined;
      put({
        headers: { etag: 'f1f1f1', 'x-cache-status': 'HIT' },
        json: { hello: 'WORLD!!!' }
      });
      await delay(200);
      expect(event).to.be.instanceOf(DataSourceEvent);
      const result3 = await ds.fetchJSON('goat');
      expect(result3).to.not.eql(result2);
      expect(result3).to.have.property('hello', 'WORLD!!!');
    })
    it('should not emit change event when etag is the same', async function() {
      ds = new DataSource({
        baseURL: 'http://localhost/site-1/',
        refresh: 0.1,
      });
      let event;
      ds.addEventListener('change', (evt) => event = evt);
      put({
        headers: { etag: 'abcdef' },
        json: { hello: 'world' }
      });
      const result1 = await ds.fetchJSON('goat');
      expect(ds.updateTime).to.be.a('date');
      expect(ds.updateTime).to.not.equal(0);
      put({
        headers: { etag: 'abcdef' },
        json: { hello: 'WORLD!' }
      });
      await delay(200);
      expect(event).to.be.undefined;
      const result2 = await ds.fetchJSON('goat');
      expect(result2).to.equal(result1);
    })
    it('should throw an error when a 404 occurred', async function() {
      ds = new DataSource({
        baseURL: 'http://localhost/site-1/',
      });
      put({ status: 404 });
      try {
        await ds.fetchJSON('goat');
        expect.fail();
      } catch (err) {
        expect(err).to.not.be.instanceOf(AssertionError);
      }
    })
    it('should retry query after certain amount of time', async function() {
      ds = new DataSource({
        baseURL: 'http://localhost/site-1/',
        retry: 0.1,
      });
      let event;
      ds.addEventListener('change', (evt) => event = evt);
      put({ status: 500 });
      try {
        const result1 = await ds.fetchJSON('goat');
        expect.fail();
      } catch (err) {
        expect(err).to.not.be.instanceOf(AssertionError);
      }
      put({
        headers: { etag: 'f0f0f0' },
        json: { hello: 'WORLD!' }
      });
      await delay(200);
      expect(event).to.be.instanceOf(DataSourceEvent);
      const result2 = await ds.fetchJSON('goat');
      expect(result2).to.be.an('object');
    })
    it('should not retry when error is 404', async function() {
      ds = new DataSource({
        baseURL: 'http://localhost/site-1/',
        retry: 0.1,
      });
      let event;
      ds.addEventListener('change', (evt) => event = evt);
      put({ status: 404 });
      try {
        const result1 = await ds.fetchJSON('goat');
        expect.fail();
      } catch (err) {
        expect(err).to.not.be.instanceOf(AssertionError);
      }
      put({
        headers: { etag: 'f0f0f0' },
        json: { hello: 'WORLD!' }
      });
      await delay(200);
      expect(event).to.be.undefined;
      try {
        const result2 = await ds.fetchJSON('goat');
        expect.fail();
      } catch (err) {
        expect(err).to.not.be.instanceOf(AssertionError);
      }
    })
  })
  describe('fetchWorkbook()', function() {
    const excelJSON = {
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
    it('should retrieve Excel workbook', async function() {
      ds = new DataSource({
        baseURL: 'http://localhost/site-1/',
      });
      put({
        headers: { etag: 'abcdef' },
        json: excelJSON,
      });
      const result = await ds.fetchWorkbook('goat');
      expect(result).to.be.instanceof(Workbook);
      expect(result).to.have.property('title', 'This is a title');
      expect(result).to.have.property('location').that.eql({
        name: 'goat',
        url: 'http://localhost/site-1/-/data/goat',
        baseURL: 'http://localhost/site-1/',
      })
    })
  })
})

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
