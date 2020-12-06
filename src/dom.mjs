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
  setDOMHandler,
  createElement,
  createRichText,
  getChildProps,
};
