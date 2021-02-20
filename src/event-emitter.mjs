class EventEmitter {
  /**
   * Constructor
   */
  constructor() {
    this.listeners = [];
    this.promises = [];
  }

  /**
   * Attach an event handler
   *
   * @param  {String} type
   * @param  {Function} handler
   * @param  {Boolean|undefined} beginning
   */
  addEventListener(type, handler, beginning) {
    if (beginning) {
      this.listeners.unshift({ type,  handler });
    } else {
      this.listeners.push({ type,  handler });
    }
  }

  /**
   * Remove an event handler
   *
   * @param  {String} type
   * @param  {Function} handler
   */
  removeEventListener(type, handler) {
    this.listeners = this.listeners.filter((listener) => {
      return !(listener.type === type && listener.handler === handler);
    });
  }

  /**
   * Send event to event listeners, returning true or false depending on whether
   * there were any listeners
   *
   * @param  {GenericEvent} evt
   *
   * @return {Boolean}
   */
  triggerEvent(evt) {
    const listeners = this.listeners.filter((listener) => {
      return (listener.type === evt.type);
    });
    if (listeners.length === 0) {
      return false;
    }
    for (var i = 0; i < listeners.length; i++) {
      const listener = listeners[i];
      listener.handler.call(evt.target, evt);
      if (evt.propagationStopped) {
        break;
      }
    }
    return true;
  }
}

class GenericEvent {
  /**
   * Constructor
   *
   * @param {string} type
   * @param {object} target
   * @param {object} [props]
   */
  constructor(type, target, props) {
    this.type = type;
    this.target = target;
    this.defaultPrevented = false;
    this.propagationStopped = false;
    Object.assign(this, props);
  }

  /**
   * Prevent default action
   */
  preventDefault() {
    this.defaultPrevented = true;
  }

  /**
   * Stop propagating event through listener chain
   */
  stopImmediatePropagation() {
    this.propagationStopped = true;
  }
}

export {
  EventEmitter,
  GenericEvent,
};
