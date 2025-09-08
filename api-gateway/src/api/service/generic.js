class MultiStore {
    constructor() {
      this._stores = {}; // holds all namespaces
    }
  
    // Set value(s) for a namespace
    set(namespace, keyOrObj, value) {
      if (!this._stores[namespace]) this._stores[namespace] = {};
  
      if (typeof keyOrObj === 'object' && keyOrObj !== null) {
        Object.assign(this._stores[namespace], keyOrObj);
      } else {
        this._stores[namespace][keyOrObj] = value;
      }
  
      return this;
    }
  
    // Get value(s) for a namespace
    get(namespace, keys) {
      if (!this._stores[namespace]) return null;
  
      const store = this._stores[namespace];
  
      if (Array.isArray(keys)) {
        const result = {};
        keys.forEach(k => {
          result[k] = store.hasOwnProperty(k) ? store[k] : null;
        });
        return result;
      } else if (keys) {
        return store.hasOwnProperty(keys) ? store[keys] : null;
      } else {
        return { ...store }; // return whole namespace if exists
      }
    }
  
    // Remove keys from a namespace
    remove(namespace, keys) {
      if (!this._stores[namespace]) return this;
  
      const store = this._stores[namespace];
      if (!Array.isArray(keys)) keys = [keys];
      keys.forEach(k => {
        if (store.hasOwnProperty(k)) delete store[k];
      });
  
      // Delete namespace if empty
      if (Object.keys(store).length === 0) delete this._stores[namespace];
  
      return this;
    }
  
    // Clear a namespace or all namespaces
    clear(namespace) {
      if (namespace) {
        delete this._stores[namespace];
      } else {
        this._stores = {};
      }
      return this;
    }
  
    // Check if a key exists in a namespace
    has(namespace, key) {
      return this._stores[namespace] && this._stores[namespace].hasOwnProperty(key);
    }
  
    // Get all namespaces
    all() {
      return { ...this._stores };
    }
  }
  
  export const genericStore = new MultiStore(); 