let elementClass;
let containerClass;
let createElementHandler;

function setDOMHandler(config) {
  elementClass = config.element;
  containerClass = config.container;
  createElementHandler = config.create;
}

function getDOMClass() {
  return elementClass;
}

function createRichText(tokens) {
  const children = [];
  for (let [ index, token ] of tokens.entries()) {
    const { text, style = {} } = token;
    children.push(createElement('span', { key: index, style }, text));
  }
  return createElement(containerClass, {}, children);
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
  getDOMClass,
  createElement,
  createRichText,
  getChildProps,
};
