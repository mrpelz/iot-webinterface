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
    const { [key]: subscribers = [] } = this.subscribers;
    const { [key]: state = null } = this.state;

    if (state !== null) {
      subscribers.forEach((sub) => {
        sub(state);
      });
    }

    return state;
  }

  subscribe(key, callback) {
    const { [key]: existingSubscribers } = this.subscribers;
    const { [key]: state = null } = this.state;

    if (existingSubscribers) {
      existingSubscribers.push(callback);
    } else {
      this.subscribers[key] = [callback];
    }

    callback(state);

    return {
      unsubscribe: this._makeUnsubscribe(key, callback)
    };
  }

  get(key) {
    const { [key]: state = null } = this.state;
    return state;
  }

  set(key, value) {
    if (this.state[key] === value) return;

    this.state[key] = value;
    this._update(key);

    /* eslint-disable-next-line no-console */
    console.log('set', {
      [key]: value
    });
  }
}
