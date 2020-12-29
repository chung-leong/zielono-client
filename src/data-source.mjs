import { EventEmitter, GenericEvent } from 'relaks-event-emitter';
import { Workbook } from './excel.mjs';

class DataSource extends EventEmitter {
  constructor(options) {
    super();
    const {
      baseURL = '/',
      refresh = 60,
      retry = 10,
      stale = 1,
    } = options;
    this.baseURL = baseURL + (baseURL.endsWith('/') ? '' : '/');
    this.intervals = { refresh, retry, stale };
    this.queries = [];
    this.updateTime = null;
    this.updateTimeout = 0;
    this.stopped = false;
  }

  async fetchWorkbook(name) {
    return this.fetch(Workbook, name);
  }

  async fetchJSON(name) {
    return this.fetch(Object, name);
  }

  activate() {
    if (this.stopped) {
      this.stopped = false;
      this.scheduleNextUpdate();
    }
  }

  deactivate() {
    if (!this.stopped) {
      this.stopped = true;
      if (this.updateTimeout) {
        clearTimeout(this.updateTimeout);
        this.updateTime = null;
        this.updateTimeout = 0;
      }
    }
  }

  async fetch(type, name) {
    const query = this.getQuery(type, name);
    await query.retrieval;
    return query.result;
  }

  getQuery(type, name) {
    let query = this.queries.find((q) => q.type === type && q.name === name);
    if (query) {
      if (query.error) {
        const now = new Date;
        if (query.refreshTime && now > query.refreshTime) {
          query.retrieval = this.runQuery(query);
        }
      }
    } else {
      query = {
        type,
        name,
        etag: '',
        result: null,
        retrieval: null,
        refreshTime: null,
        error: null,
      };
      this.queries.push(query);
      query.retrieval = this.runQuery(query);
    }
    return query;
  }

  async runQuery(query) {
    try {
      query.error = null;
      const { type, name } = query;
      const url = this.getURL(name);
      const res = await fetch(url);
      if (!res.ok) {
        const text = await res.text();
        throw new DataSourceError(res.status, res.statusText, text);
      }
      const etag = res.headers.get('etag');
      const status = res.headers.get('x-cache-status');
      let changed = false;
      if (!etag || etag !== query.etag) {
        const json = await res.json();
        const location = { name, url, baseURL: this.baseURL };
        query.result = (type === Object) ? json : new type(json, location);
        query.etag = etag;
        changed = true;
      }
      const refreshType = (status === 'STALE' || status === 'UPDATING') ? 'stale' : 'refresh';
      query.refreshTime = this.scheduleUpdate(refreshType);
      query.retrieval = null;
      return changed;
    } catch (err) {
      query.error = err;
      if (!(400 <= err.status && err.status <= 499)) {
        query.refreshTime = this.scheduleUpdate('retry');
      }
      throw err;
    }
  }

  scheduleUpdate(type) {
    const interval = this.intervals[type];
    if (interval === false) {
      return;
    }
    const now = new Date;
    const later = new Date(now.getTime() + interval * 1000);
    if (!this.updateTime || this.updateTime > later) {
      this.rescheduleUpdate(later);
    }
    return later;
  }

  rescheduleUpdate(later) {
    const now = new Date;
    if (this.updateTimeout) {
      clearTimeout(this.updateTimeout);
    }
    this.updateTime = later;
    this.updateTimeout = setTimeout(() => {
      this.updateTime = null;
      this.updateTimeout = 0;
      this.update();
    }, later - now);
  }

  scheduleNextUpdate() {
    let earliest;
    for (let query of this.queries) {
      if (!earliest || earliest > query.refreshTime) {
        earliest = query.refreshTime;
      }
    }
    if (earliest) {
      if (!this.updateTime || this.updateTime > earliest) {
        this.rescheduleUpdate(earliest);
      }
    }
  }

  scheduleUpdateOnEvent(target, event) {
    const listener = (evt) => {
      target.removeEventListener(event, listener);
      this.update();
    };
    target.addEventListener(event, listener);
  }

  async update() {
    if (this.stopped) {
      return;
    }
    if (typeof(Window) === 'function') {
      if (document.hidden === false) {
        this.scheduleUpdateOnEvent(document, 'visibilitychange');
        return;
      } else if (navigator.onLine === false) {
        this.scheduleUpdateOnEvent(window, 'online');
        return;
      }
    }
    const now = new Date;
    let changed = false;
    for (let query of this.queries) {
      if (Math.abs(now - query.refreshTime) < 1000) {
        try {
          if (await this.runQuery(query)) {
            changed = true;
          }
        } catch (err) {
        }
      }
    }
    this.scheduleNextUpdate();
    if (changed) {
      this.triggerEvent(new DataSourceEvent('change'));
    }
  }

  getURL(name) {
    return `${this.baseURL}-/data/${name}`;
  }
}

class DataSourceEvent extends GenericEvent {
}

class DataSourceError extends Error {
  constructor(status, statusText, text) {
    super(`${status} ${statusText}`);
    this.status = status;
    this.statusText = statusText;
    this.text = text;
  }
}

class DataSourceProxy {
  constructor(dataSource) {
    this.dataSource = dataSource;
  }

  async fetchWorkbook(name) {
    return this.dataSource.fetchWorkbook(name);
  }

  async fetchJSON(name) {
    return this.dataSource.fetchJSON(name);
  }
}

export {
  DataSource,
  DataSourceEvent,
  DataSourceError,
  DataSourceProxy,
};
