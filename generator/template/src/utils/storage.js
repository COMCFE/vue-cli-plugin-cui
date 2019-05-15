export default {
  store(session = false) {
    return session ? window.sessionStorage : window.localStorage;
  },

  write(name, value, session) {
    this.store(session).setItem(name, JSON.stringify(value));
    return this;
  },

  read(name, session) {
    return JSON.parse(this.store(session).getItem(name));
  },

  remove(name, session) {
    this.store(session).removeItem(name);
    return this;
  },

  clear() {
    this.store().clear();
    this.store(!0).clear();
  }
};
