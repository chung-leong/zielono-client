const { readFile, writeFile } = require('fs').promises;
const { resolve, dirname, basename, extname } = require('path');
const { platform } = require('os');
const { createInterface } = require('readline');
const { default: fetch, Response } = require('node-fetch').default;
const requireNodeModule = require;

module.exports = {
  before(app, server) {
    const fs = server.middleware.fileSystem;
    const contentBase = server.options.contentBase;
    // ask for or load base URL from file immediately after compilation
    const retrieveSiteInfo = async () => {
      await new Promise((cb) => server.middleware.waitUntilValid(cb));
      return getSiteInfo();
    };
    const siteInfoRetrieval = retrieveSiteInfo();
    // attach base extraction handler
    app.use(async (req, res, next) => {
      try {
        const site = await siteInfoRetrieval;
        const baseURL = new URL(site.url);
        const basePath = baseURL.pathname;
        if (req.url.startsWith(basePath)) {
          req.baseUrl = basePath.substr(0, basePath.length - 1);
          req.url = req.url.substr(basePath.length - 1);
          req.site = site;
          req.baseUrl = basePath;
        } else if (req.url === '/') {
          res.redirect(basePath);
          return;
        }
        next();
      } catch (err) {
        next(err);
      }
    });
    // attach locale extraction handler
    app.use((req, res, next) => {
      const { site, url, query, baseUrl } = req;
      if (site && site.locale && site.localization !== 'off') {
        const m = /^\/([a-z]{2}(\-[a-z]{2})?)\b/i.exec(url);
        if (m) {
          req.locale = m[1];
          req.url = url.substr(m[0].length);
        } else {
          req.locale = site.locale;
          // see if we should redirect to foreign language version
          const accepted = req.headers['accept-language'];
          const locales = [];
          if (accepted) {
            for (let token of accepted.split(/\s*,\s*/)) {
              const m = /([^;]+);q=(.*)/.exec(token);
              const code = (m) ? m[1] : token;
              const qFactor = (m) ? parseFloat(m[2]) : 1;
              const [ language, country ] = code.toLowerCase().split('-');
              if (site.localization === 'full') {
                // don't include country-less entry when there's one of that language already
                if (!country) {
                  if (locales.find((l) => l.language === language)) {
                    continue;
                  }
                }
              }
              locales.push({ language, country, qFactor });
            }
          }
          const [ siteLanguage, siteCountry ] = site.locale.toLowerCase().split('-');
          const match = locales.find(({ language, country }) => {
            if (site.localization === 'full' && country && siteCountry) {
              return (language === siteLanguage && country === siteCountry);
            } else {
              return (language === siteLanguage);
            }
          });
          if (!match && locales.length > 0) {
            locales.sort((a, b) => b.qFactor - a.qFactor);
            const { language, country } = locales[0];
            const prefix = (site.localization === 'full' && country) ? `/${language}-${country}` : `/${language}`;
            res.redirect(prefix + url);
            return;
          }
        }
      }
    })
    // attach static file handler
    app.get('/:filename(*.*)', async (req, res, next) => {
      const { site } = req;
      if (!site) {
        next();
        return;
      }
      const { filename } = req.params;
      try {
        const ext = extname(filename);
        const filePath = `${contentBase}/www/${filename}`;
        const buffer = fs.readFileSync(filePath);
        res.type(ext).send(buffer);
      } catch (err) {
        if (filename === 'favicon.ico') {
          res.sendStatus(204);
          return;
        }
        next(err);
      }
    });
    // attach page handler
    app.get('/:page(*)', async (req, res, next) => {
      const { site } = req;
      if (!site) {
        next();
        return;
      }
      const { page } = req.params;
      try {
        const baseURL = new URL(site.url);
        const codePath = `${contentBase}/ssr/index.js`;
        const module = compileCode(fs, codePath);
        const params = {
          url: req.originalURL,
          origin: baseURL.origin,
          basePath: baseURL.pathname,
          pagePath: page,
          query: req.query,
          ref: undefined,
          locale: req.locale,
        };
        const html = await module.render(params);
        res.type('html').send('<!DOCTYPE html>\n' + html);
      } catch (err) {
        next(err);
      }
    });
  },
};

/**
 * Obtain base URL of website from a link file, prompting the user to enter one if file is missing
 *
 * @return {object}
 */
async function getSiteInfo() {
  const exts = [ '.desktop', '.url' ];
  const info = {
    url: '',
    locale: undefined,
    localization: 'language',
  };
  for (let ext of exts) {
    const filename = `test-server${ext}`;
    const path = resolve(`./${filename}`);
    try {
      const text = await readFile(path, 'utf-8');
      const lines = text.split(/\r?\n/);
      for (let line of lines) {
        const [ name, value ] = line.split('=');
        if (name === 'URL') {
          info.url = value.trim();
          if (!info.url.endsWith('/')) {
            info.url += '/';
          }
        } else if (name === 'Locale') {
          info.locale = value.trim() || undefined;
        } else if (name === 'Localization') {
          info.localization = value.trim() || 'language';
        }
      }
      break;
    } catch (err) {
    }
  }
  if (!info.url) {
    const { stdin, stdout } = process;
    const rl = createInterface({ input: stdin, output: stdout, terminal: true });
    let url = '';
    do {
      url = await new Promise((resolve) => rl.question('Server URL: ', resolve));
      url = url.trim();
      try {
        url = (new URL(url)).href;
      } catch (err) {
        console.error(err.message);
        url = '';
      }
    } while(!url);
    rl.close();
    info.url = url;
    await saveSiteInfo(info);
  }
  return info;
}

/**
 * Save base URL into a link file
 *
 * @param  {object} url
 */
async function saveSiteInfo(info) {
  const { url, locale, localization } = info;
  const lines = [];
  let ext = '.url';
  let nl = '\n';
  switch (platform()) {
    case 'linux':
    case 'freebsd':
      lines.push(
        '[Desktop Entry]',
        'Encoding=UTF-8',
        'Name=Link to test server',
        'Type=Link',
        'Icon=text-html'
      );
      ext = '.desktop';
      break;
    default:
      lines.push('[InternetShortcut]');
      nl = '\r\n';
      break;
  }
  lines.push('URL=' + url);
  lines.push('Locale=' + locale);
  lines.push('Localization=' + localization);
  const text = lines.join(nl);
  const filename = `test-server${ext}`;
  const path = resolve(`./${filename}`);
  await writeFile(path, text);
}

/**
 * Compile a CommonJS module
 *
 * @param  {Ifs} fs
 * @param  {string} path
 *
 * @return {Object}
 */
function compileCode(fs, path) {
  const buffer = fs.readFileSync(path);
  const code = buffer.toString();
  const cjsHeader = '(function(require, exports, module, __dirname, __filename) {\n';
  const cjsTrailer = '\n})';
  const f = (function() { return eval(arguments[0]) })(cjsHeader + code + cjsTrailer);
  const require = (modulePath) => {
    let moduleFullPath = resolve(dirname(path), modulePath);
    let exists = fs.existsSync(moduleFullPath);
    if (!exists && extname(moduleFullPath) !== '.js') {
      moduleFullPath += '.js';
      exists = fs.existsSync(moduleFullPath);
    }
    if (exists) {
      return compileCode(fs, moduleFullPath);
    } else {
      return requireNodeModule(modulePath);
    }
  };
  const module = { exports: {} };
  f(require, module.exports, module, dirname(path), basename(path));
  return module.exports;
}

const cache = [];

/**
 * Perform HTTP request, returning cached result if not modified
 *
 * @param  {string} url
 * @param  {object} [options]
 *
 * @return {Response}
 */
async function fetchWithCaching(url, options) {
  const isCacheable = () => {
    if (options) {
      const { method = 'GET', headers = {} } = options;
      if (method.toUpperCase() !== 'GET') {
        return false;
      }
      const names = Object.keys(headers).map((k) => k.toLowerCase());
      if (names.includes('if-none-match') || names.includes('if-modified-since')) {
        return false;
      }
    }
    return true;
  };
  if (!isCacheable()) {
    return fetch(url, options);
  }
  let entry = cache.find((e) => e.url === url);
  if (!entry) {
    entry = { url };
    cache.push(entry);
    if (cache.length > 100) {
      cache.shift();
    }
  } else if (entry.headers) {
    const etag = entry.headers.get('etag');
    const mtime = entry.headers.get('last-modified');
    options = { ...options };
    options.headers = { ...options.headers };
    if (etag) {
      options.headers['if-none-match'] = etag;
    } else if (mtime) {
      options.headers['if-modified-since'] = mtime;
    }
  }
  if (!entry.retrieval) {
    const retrieve = async () => {
      try {
        const res = await fetch(url, options);
        if (res.status !== 304) {
          entry.status = res.status;
          entry.statusText = res.statusText;
          entry.headers = res.headers;
          entry.buffer = await res.buffer();
        }
      } finally {
        entry.retrieval = null;
      }
    };
    entry.retrieval = retrieve();
  }
  await entry.retrieval;
  const { status, statusText, headers, buffer } = entry;
  return new Response(buffer, { status, statusText, headers });
}

global.fetch = fetchWithCaching;
