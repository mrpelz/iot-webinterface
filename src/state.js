export class State {
  constructor() {
    this.state = {};
    this.subscribers = {};
  }

  _makeUnsubscribe(key, callback) {
    return () => {
      const { [key]: subscribers = [] } = this.subscribers;

      const subIndex = subscribers.findIndex((sub) => {
        return sub === callback;
      });
      if (subIndex < 0) return;

      subscribers.splice(subIndex, 1);
    };
  }

  _update(key) {
    if (key === '*') return undefined;

    const {
      [key]: subscribers = [],
      '*': globalSubscribers = []
    } = this.subscribers;
    const { [key]: state = null } = this.state;

    subscribers.forEach((sub) => {
      sub(state, key);
    });
    globalSubscribers.forEach((sub) => {
      sub(state, key);
    });

    return state;
  }

  subscribe(key, callback, initialCall = true) {
    const { [key]: existingSubscribers } = this.subscribers;

    if (existingSubscribers) {
      existingSubscribers.push(callback);
    } else {
      this.subscribers[key] = [callback];
    }

    if (initialCall) {
      if (key === '*') {
        Object.keys(this.state).forEach((numKey) => {
          const { [numKey]: state = null } = this.state;
          callback(state, numKey);
        });
      } else {
        const { [key]: state = null } = this.state;
        return callback(state, key);
      }
    }

    return {
      unsubscribe: this._makeUnsubscribe(key, callback)
    };
  }

  get(key) {
    if (key === '*') return undefined;

    const { [key]: state = null } = this.state;
    return state;
  }

  set(key, value = null) {
    if (key === '*') return;

    if (value !== null && this.state[key] === value) return;

    this.state[key] = value;
    this._update(key);
  }
}
