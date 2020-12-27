import { EventEmitter, GenericEvent } from 'relaks-event-emitter';
import { Workbook } from './excel.mjs';

class DataSource extends EventEmitter {
  #baseURL;
  #intervals;
  #queries = [];
  #updateTime = null;
  #updateTimeout = 0;

  constructor(options) {
    const {
      baseURL = '/',
      refresh = 60,
      retry = 10,
      stale = 1,
    } = options;
    this.#baseURL = baseURL;
    this.#intervals = { refresh, retry, stale };
  }

  async fetchWorkbook(name) {
    return this.#fetch(Workbook, name);
  }

  async fetchJSON(name) {
    return this.#fetch(Object, name);
  }

  async #fetch(type, name) {
    const query = this.#getQuery(type, name);
    await query.retrieval;
    return query.result;
  }

  #getQuery(type, name) {
    let query = this.#queries.find((q) => q.type === type && q.name === name);
    if (query) {
      if (query.error) {
        const now = new Date;
        if (now > query.refreshTime) {
          query.retrieval = this.#runQuery(query);
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
      query.retrieval = this.#runQuery(query);
    }
    return query;
  }

  async #runQuery(query) {
    try {
      query.error = null;
      const { type, name } = query;
      const url = this.#getURL(name);
      const res = await fetch(url);
      if (!res.ok) {
        throw new DataSourceError(`${res.status} ${res.statusText}`);
      }
      const etag = res.headers.get('etag');
      const status = response.headers.get('x-cache-status');
      let changed = false;
      if (!etag || etag !== query.etag) {
        const json = await res.json();
        query.result = (type === Object) ? json : new type(json, url);
        query.etag = etag;
        changed = true;
      }
      const refreshType = (status === 'STALE' || status === 'UPDATING') ? 'stale' : 'refresh';
      query.refreshTime = this.#scheduleUpdate(refreshType);
      query.retrieval = null;
      return changed;
    } catch (err) {
      query.error = err;
      query.refreshTime = this.#scheduleUpdate('retry');
      throw err;
    }
  }

  #scheduleUpdate(type) {
    const interval = this.#intervals[type];
    if (interval === false) {
      return;
    }
    const now = new Date;
    const later = new Date(now.getTime() + interval * 1000);
    if (!this.#updateTime || this.#updateTime > later) {
      this.#rescheduleUpdate(later);
    }
    return later;
  }

  #rescheduleUpdate(later) {
    const now = new Date;
    if (this.#updateTimeout) {
      clearTimeout(this.#updateTimeout);
    }
    this.#updateTime = later;
    this.#updateTimeout = setTimeout(() => {
      this.#updateTime = null;
      this.#updateTimeout = 0;
      this.#update();
    }, later - now);
  }

  #scheduleNextUpdate() {
    let earliest;
    for (let query of this.#queries) {
      if (!earliest || earliest > query.refreshTime) {
        earliest = query.refreshTime;
      }
    }
    if (earliest) {
      if (!this.#updateTime || this.#updateTime > earliest) {
        this.#rescheduleUpdate(earliest);
      }
    }
  }

  async #update() {
    if (typeof(document) === 'object') {
      if (document.hidden === false) {
        const listener = (evt) => {
          document.removeEventListener('visibilitychange', listener);
          this.#update();
        };
        document.addEventListener('visibilitychange', listener);
        return;
      }
    }
    const now = new Date;
    let changed = false;
    for (let query of queries) {
      if (Math.abs(now - query.refreshTime) < 1000) {
        try {
          if (await this.#runQuery(query)) {
            changed = true;
          }
        } catch (err) {
        }
      }
    }
    this.#scheduleNextUpdate();
    if (changed) {
      this.triggerEvent(new DataSourceEvent('change'));
    }
  }

  #getURL(name) {
    return `${this.#baseURL}-/data/${name}`;
  }
}

class DataSourceEvent extends GenericEvent {
}

class DataSourceError extends Error {
}

export {
  DataSource,
  DataSourceEvent,
  DataSourceError,
};
