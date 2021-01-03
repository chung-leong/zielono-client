const { readFile, writeFile } = require('fs').promises;
const { resolve, dirname, basename, extname } = require('path');
const { platform } = require('os');
const readline = require('readline');
const fetch = require('cross-fetch');
const requireNodeModule = require;

const server = {
  before(app, server) {
    const fs = server.middleware.fileSystem;
    const contentBase = server.options.contentBase;
    const waitUntilValid = () => new Promise((cb) => server.middleware.waitUntilValid(cb));
    const baseURLRetrieval = (async () => {
      await waitUntilValid();
      await getBaseURL();
    })();
    // attach static file handler
    app.get('/:path(*.*)', async (req, res, next) => {
      const { path } = req.params;
      try {
        await waitUntilValid();
        const ext = extname(path);
        const filePath = `${contentBase}/www/${path}`;
        const buffer = fs.readFileSync(filePath);
        res.type(ext).send(buffer);
      } catch (err) {
        if (path === 'favicon.ico') {
          res.sendStatus(204);
          return;
        }
        next(err);
      }
    });
    // attach static page handler
    app.get('/:path(*)', async (req, res, next) => {
      try {
        await waitUntilValid();
        const path = req.url;
        const codePath = `${contentBase}/ssr/index.js`;
        const lang = getPreferredLanguage(req);
        const baseURL = await baseURLRetrieval;
        const html = await generatePage(fs, codePath, path, lang, baseURL);
        res.type('html').send(html);
      } catch (err) {
        next(err);
      }
    });
  },
  after(app, server) {
    // attach error handler
    app.use((err, req, res, next) => {
      res.status(err.status || 500);
      if (err.html) {
        res.type('html').send(err.html);
      } else {
        res.type('text').send(err.stack);
      }
    });
  },
  inline: true,
};

/**
 * Obtain base URL of website from a link file, prompting the user to enter one if file is missing
 *
 * @return {string}
 */
async function getBaseURL() {
  const exts = [ '.desktop', '.url' ];
  for (let ext of exts) {
    const filename = `test-server${ext}`;
    const path = resolve(`./${filename}`);
    try {
      const text = await readFile(path, 'utf-8');
      const m = /^URL=(.*)$/mi.exec(text);
      if (m) {
        return m[1];
      }
    } catch (err) {
    }
  }
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true,
  });
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
  await saveBaseURL(url);
  return url;
}

/**
 * Save base URL into a link file
 *
 * @param  {string} url
 */
async function saveBaseURL(url) {
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
  const text = lines.join(nl);
  const filename = `test-server${ext}`;
  const path = resolve(`./${filename}`);
  await writeFile(path, text);
}

global.fetch = function(url, optionsGiven) {
  const options = { timeout: 5000, ...optionsGiven };
  return fetch(url, options);
};

/**
 * Generate an HTML page
 *
 * @param  {Ifs} fs
 * @param  {string} codePath
 * @param  {string} path
 * @param  {string} locale
 * @param  {string} baseURL
 *
 * @return {string}
 */
async function generatePage(fs, codePath, path, locale, baseURL) {
  const module = compileCode(fs, codePath);
  const options = { baseURL, path, locale, ssr: 'hydrate' };
  const html = await module.render(options);
  return '<!DOCTYPE html>\n' + html;
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

/**
 * Return language most preferred by visitor
 *
 * @param  {Request} req
 *
 * @return {string}
 */
function getPreferredLanguage(req) {
  const accept = req.headers['accept-language'] || 'en';
  const list = accept.split(/\s*,\s*/).map(function(token) {
    const m = /([^;]+);q=(.*)/.exec(token);
    const code = (m) ?  m[1] : token;
    const qFactor = (m) ? parseFloat(m[2]) : 1;
    return { code, qFactor };
  });
  list.sort((a, b) => b.qFactor - a.qFactor);
  return list[0].code;
}

const cache = [];

function fetchWithCaching(url, options) {
  const cacheable = () => {
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
  if (!cacheable()) {
    return fetch(url, options);
  }
  let entry = cache.find((e) => e.url === url);
  if (entry) {
    const etag = entry.headers['etag'];
    const mtime = entry.headers['last-modified'];
    options = { ...options };
    options.headers = { ...options.headers };
    if (etag) {
      options.headers['if-none-match'] = etag;
    } else if (mtime) {
      options.headers['if-modified-since'] = mtime;
    }
  } else {
    entry = { url };
    cache.push(entry);
    if (cache.length > 100) {
      cache.shift();
    }
  }
  if (!entry.retrieval) {
    const update = async () => {
      try {
        const res = await fetch(url, options);
        if (res.statusCode !== 304) {
          entry.status = res.status;
          entry.statusText = res.statusText;
          entry.headers = res.headers;
          entry.buffer = await res.buffer();
        }
      } finally {
        entry.retrieval = null;
      }
    };
    entry.retrieval = update();
  }
  await entry.retrieval;
  const { status, statusText, headers, buffer } = entry;
  return new Response(buffer, { status, statusText, headers });
}

module.exports = server;
