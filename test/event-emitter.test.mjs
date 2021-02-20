import { expect } from 'chai';
import { EventEmitter, GenericEvent } from '../src/event-emitter.mjs';

describe('EventEmitter', function() {
  describe('#triggerEvent()', function() {
    it('should fire multiple handlers', function() {
      const emitter = new EventEmitter;
      const called = [];
      emitter.addEventListener('change', (evt) => {
        called.push('a');
      });
      emitter.addEventListener('change', (evt) => {
        called.push('b');
      });
      emitter.addEventListener('change', (evt) => {
        called.push('c');
      });
      emitter.triggerEvent(new GenericEvent('change', emitter));
      expect(called).to.eql([ 'a', 'b', 'c' ]);
    })
    it('should call event handler with the instance as this', function() {
      const emitter = new EventEmitter;
      let self;
      emitter.addEventListener('change', function(evt) {
        self = this;
      });
      emitter.triggerEvent(new GenericEvent('change', emitter));
      expect(self).to.equal(emitter);
    })
    it('should return true when there are listeners for event', function() {
      const emitter = new EventEmitter;
      emitter.addEventListener('change', (evt) => {});
      const result = emitter.triggerEvent(new GenericEvent('change', emitter));
      expect(result).to.be.true;
    })
    it('should return false when there are no listeners for event', function() {
      const emitter = new EventEmitter;
      emitter.addEventListener('dingo', (evt) => {});
      const result = emitter.triggerEvent(new GenericEvent('change', emitter));
      expect(result).to.be.false;
    })
  })
})

describe('GenericEvent', function() {
  describe('#stopImmediatePropagation()', function() {
    it ('should keep additional handlers from being called', function() {
      const emitter = new EventEmitter;
      const called = [];
      emitter.addEventListener('change', (evt) => {
        called.push('a');
        evt.stopImmediatePropagation();
      });
      emitter.addEventListener('change', (evt) => {
        called.push('b');
      });
      emitter.addEventListener('change', (evt) => {
        called.push('c');
      });
      const event = new GenericEvent('change', emitter);
      expect(event).to.have.property('propagationStopped', false);
      emitter.triggerEvent(event);
      expect(called).to.eql([ 'a' ]);
      expect(event).to.have.property('propagationStopped', true);
    })
  })
  describe('#preventDefault()', function() {
    it ('should set defaultPrevented to true', function() {
      const emitter = new EventEmitter;
      emitter.addEventListener('change', (evt) => {
        evt.preventDefault();
      });
      const event = new GenericEvent('change', emitter);
      expect(event).to.have.property('defaultPrevented', false);
      emitter.triggerEvent(event);
      expect(event).to.have.property('defaultPrevented', true);
    })
  })
})
