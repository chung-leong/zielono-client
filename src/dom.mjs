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

function createRichText(tokens, parentStyle) {
  const children = [];
  if (typeof(tokens) === 'string') {
    tokens = [ { text: tokens } ];
  }
  for (let [ index, token ] of tokens.entries()) {
    const { text, style: spanStyle } = token;
    let hasStyle = false;
    if (text) {
      const style = {};
      if (parentStyle) {
        for (let [ name, value ] of Object.entries(parentStyle)) {
          switch (name) {
            case 'color':
            case 'fontFamily':
            case 'fontSize':
            case 'fontStyle':
            case 'fontWeight':
            case 'textDecoration':
            case 'textUnderlinePosition':
            case 'textStroke':
              style[name] = value;
              hasStyle = true;
              break;
          }
        }
      }
      if (spanStyle) {
        for (let [ name, value ] of Object.entries(spanStyle)) {
          style[name] = value;
          hasStyle = true;
        }
      }
      if (hasStyle) {
        children.push(createElement('span', { key: index, style }, text));
      } else {
        children.push(text);
      }
    }
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
