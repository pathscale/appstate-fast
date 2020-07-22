'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var vue = require('vue');

const self = Symbol('self');
const selfMethodsID = Symbol('ProxyMarker');
const valueUnusedMarker = Symbol('valueUnusedMarker');
const unmountedMarker = Symbol('unmountedMarker');
const postpone = Symbol('postpone');
const none = Symbol('none');
const devToolsID = Symbol('devTools');
function createState(initial) {
    const methods = createStore(initial).toMethods();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const devtools = createState[devToolsID];
    if (devtools) {
        methods.attach(devtools);
    }
    return methods.self;
}
function useState(source) {
    const parentMethods = typeof source === 'object' && source !== null
        ? source[self]
        : undefined;
    if (parentMethods) {
        if (parentMethods.isMounted) {
            // Scoped state mount
            const link = new StateMethodsImpl(parentMethods.state, parentMethods.path, parentMethods.state.get(parentMethods.path), parentMethods.state.edition, () => {
                /*  */
            }, () => {
                /*  */
            });
            parentMethods.subscribe(link);
            vue.onUnmounted(() => parentMethods.unsubscribe(link));
            return link.self;
        }
        else {
            // Global state mount or destroyed link
            const state = vue.ref(parentMethods.state);
            const link = new StateMethodsImpl(state.value, parentMethods.path, state.value.get(parentMethods.path), state.value.edition, () => {
                /*  */
            }, () => {
                /*  */
            });
            state.value.subscribe(link);
            vue.onUnmounted(() => state.value.unsubscribe(link));
            return link.self;
        }
    }
    else {
        // Local state mount
        const state = vue.ref(createStore(source));
        const link = new StateMethodsImpl(state.value, rootPath, state.value.get(rootPath), state.value.edition, () => {
            /*  */
        }, () => {
            /*  */
        });
        state.value.subscribe(link);
        vue.onUnmounted(() => {
            state.value.unsubscribe(link);
            state.value.destroy();
        });
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const devtools = useState[devToolsID];
        if (devtools) {
            link.attach(devtools);
        }
        return link.self;
    }
}
function devTools(state) {
    const plugin = state.attach(devToolsID);
    if (plugin[0] instanceof Error) {
        return emptyDevToolsExtensions;
    }
    return plugin[0];
}
const emptyDevToolsExtensions = {
    label() {
        /* */
    },
    log() {
        /* */
    },
};
// TODO: Fix error names
/* eslint-disable @typescript-eslint/naming-convention */
var ErrorId;
(function (ErrorId) {
    ErrorId[ErrorId["InitStateToValueFromState"] = 101] = "InitStateToValueFromState";
    ErrorId[ErrorId["SetStateToValueFromState"] = 102] = "SetStateToValueFromState";
    ErrorId[ErrorId["GetStateWhenPromised"] = 103] = "GetStateWhenPromised";
    ErrorId[ErrorId["SetStateWhenPromised"] = 104] = "SetStateWhenPromised";
    ErrorId[ErrorId["SetStateNestedToPromised"] = 105] = "SetStateNestedToPromised";
    ErrorId[ErrorId["SetStateWhenDestroyed"] = 106] = "SetStateWhenDestroyed";
    ErrorId[ErrorId["GetStatePropertyWhenPrimitive"] = 107] = "GetStatePropertyWhenPrimitive";
    ErrorId[ErrorId["ToJson_Value"] = 108] = "ToJson_Value";
    ErrorId[ErrorId["ToJson_State"] = 109] = "ToJson_State";
    ErrorId[ErrorId["GetUnknownPlugin"] = 120] = "GetUnknownPlugin";
    ErrorId[ErrorId["SetProperty_State"] = 201] = "SetProperty_State";
    ErrorId[ErrorId["SetProperty_Value"] = 202] = "SetProperty_Value";
    ErrorId[ErrorId["SetPrototypeOf_State"] = 203] = "SetPrototypeOf_State";
    ErrorId[ErrorId["SetPrototypeOf_Value"] = 204] = "SetPrototypeOf_Value";
    ErrorId[ErrorId["PreventExtensions_State"] = 205] = "PreventExtensions_State";
    ErrorId[ErrorId["PreventExtensions_Value"] = 206] = "PreventExtensions_Value";
    ErrorId[ErrorId["DefineProperty_State"] = 207] = "DefineProperty_State";
    ErrorId[ErrorId["DefineProperty_Value"] = 208] = "DefineProperty_Value";
    ErrorId[ErrorId["DeleteProperty_State"] = 209] = "DeleteProperty_State";
    ErrorId[ErrorId["DeleteProperty_Value"] = 210] = "DeleteProperty_Value";
    ErrorId[ErrorId["Construct_State"] = 211] = "Construct_State";
    ErrorId[ErrorId["Construct_Value"] = 212] = "Construct_Value";
    ErrorId[ErrorId["Apply_State"] = 213] = "Apply_State";
    ErrorId[ErrorId["Apply_Value"] = 214] = "Apply_Value";
})(ErrorId || (ErrorId = {}));
/* eslint-enable @typescript-eslint/naming-convention */
class StateInvalidUsageError extends Error {
    constructor(path, id, details) {
        super(`Error: HOOKSTATE-${id} [path: /${path.join('/')}${details ? `, details: ${details}` : ''}]. ` + `See https://hookstate.js.org/docs/exceptions#hookstate-${id}`);
    }
}
const rootPath = [];
const destroyedEdition = -1;
class Store {
    constructor(_value) {
        this._value = _value;
        this._edition = 0;
        this._subscribers = new Set();
        this._setSubscribers = new Set();
        this._destroySubscribers = new Set();
        this._batchStartSubscribers = new Set();
        this._batchFinishSubscribers = new Set();
        this._plugins = new Map();
        this._batches = 0;
        if (typeof _value === 'object' && Promise.resolve(_value) === _value) {
            this._promised = this.createPromised(_value);
            this._value = none;
        }
        else if (_value === none) {
            this._promised = this.createPromised();
        }
    }
    createPromised(newValue) {
        const promised = new Promised(newValue ? Promise.resolve(newValue) : undefined, (r) => {
            if (this.promised === promised && this.edition !== destroyedEdition) {
                this._promised = undefined;
                this.set(rootPath, r);
                this.update([rootPath]);
            }
        }, () => {
            if (this.promised === promised && this.edition !== destroyedEdition) {
                this._edition += 1;
                this.update([rootPath]);
            }
        }, () => {
            if (this._batchesPendingActions &&
                this._value !== none &&
                this.edition !== destroyedEdition) {
                const actions = this._batchesPendingActions;
                this._batchesPendingActions = undefined;
                for (const a of actions) {
                    a();
                }
            }
        });
        return promised;
    }
    get edition() {
        return this._edition;
    }
    get promised() {
        return this._promised;
    }
    get(path) {
        let result = this._value;
        if (result === none) {
            return result;
        }
        for (const p of path) {
            result = result[p];
        }
        return result;
    }
    set(path, value, mergeValue) {
        if (this._edition < 0) {
            throw new StateInvalidUsageError(path, ErrorId.SetStateWhenDestroyed);
        }
        if (path.length === 0) {
            // Root value UPDATE case,
            const onSetArg = {
                path: path,
                state: value,
                value: value,
                previous: this._value,
                merged: mergeValue,
            };
            if (value === none) {
                this._promised = this.createPromised();
                delete onSetArg.value;
                delete onSetArg.state;
            }
            else if (typeof value === 'object' && Promise.resolve(value) === value) {
                this._promised = this.createPromised(value);
                value = none;
                delete onSetArg.value;
                delete onSetArg.state;
            }
            else if (this._promised && !this._promised.resolver && !this._promised.fullfilled) {
                throw new StateInvalidUsageError(path, ErrorId.SetStateWhenPromised);
            }
            const prevValue = this._value;
            if (prevValue === none) {
                delete onSetArg.previous;
            }
            this._value = value;
            this.afterSet(onSetArg);
            if (prevValue === none && this._value !== none && this.promised && this.promised.resolver) {
                this.promised.resolver();
            }
            return path;
        }
        if (typeof value === 'object' && Promise.resolve(value) === value) {
            throw new StateInvalidUsageError(path, ErrorId.SetStateNestedToPromised);
        }
        let target = this._value;
        for (let i = 0; i < path.length - 1; i += 1) {
            target = target[path[i]];
        }
        const p = path[path.length - 1];
        if (p in target) {
            if (value !== none) {
                // Property UPDATE case
                const prevValue = target[p];
                target[p] = value;
                this.afterSet({
                    path: path,
                    state: this._value,
                    value: value,
                    previous: prevValue,
                    merged: mergeValue,
                });
                return path;
            }
            else {
                // Property DELETE case
                const prevValue = target[p];
                if (Array.isArray(target) && typeof p === 'number') {
                    target.splice(p, 1);
                }
                else {
                    delete target[p];
                }
                this.afterSet({
                    path: path,
                    state: this._value,
                    previous: prevValue,
                    merged: mergeValue,
                });
                // if an array of object is about to loose existing property
                // we consider it is the whole object is changed
                // which is identified by upper path
                return path.slice(0, -1);
            }
        }
        if (value !== none) {
            // Property INSERT case
            target[p] = value;
            this.afterSet({ path, state: this._value, value, merged: mergeValue });
            // if an array of object is about to be extended by new property
            // we consider it is the whole object is changed
            // which is identified by upper path
            return path.slice(0, -1);
        }
        // Non-existing property DELETE case
        // no-op
        return path;
    }
    update(paths) {
        var _a;
        if (this._batches) {
            this._batchesPendingPaths = (_a = this._batchesPendingPaths) !== null && _a !== void 0 ? _a : [];
            this._batchesPendingPaths = this._batchesPendingPaths.concat(paths);
            return;
        }
        const actions = [];
        this._subscribers.forEach(s => s.onSet(paths, actions));
        actions.forEach(a => a());
    }
    afterSet(params) {
        if (this._edition !== destroyedEdition) {
            this._edition += 1;
            for (const cb of this._setSubscribers) {
                cb(params);
            }
        }
    }
    startBatch(path, options) {
        this._batches += 1;
        const cbArgument = {
            path: path,
        };
        if (options && 'context' in options) {
            cbArgument.context = options.context;
        }
        if (this._value !== none) {
            cbArgument.state = this._value;
        }
        this._batchStartSubscribers.forEach(cb => cb(cbArgument));
    }
    finishBatch(path, options) {
        const cbArgument = {
            path: path,
        };
        if (options && 'context' in options) {
            cbArgument.context = options.context;
        }
        if (this._value !== none) {
            cbArgument.state = this._value;
        }
        this._batchFinishSubscribers.forEach(cb => cb(cbArgument));
        this._batches -= 1;
        if (this._batches === 0) {
            if (this._batchesPendingPaths) {
                const paths = this._batchesPendingPaths;
                this._batchesPendingPaths = undefined;
                this.update(paths);
            }
        }
    }
    postponeBatch(action) {
        var _a;
        this._batchesPendingActions = (_a = this._batchesPendingActions) !== null && _a !== void 0 ? _a : [];
        this._batchesPendingActions.push(action);
    }
    getPlugin(pluginId) {
        return this._plugins.get(pluginId);
    }
    register(plugin) {
        const existingInstance = this._plugins.get(plugin.id);
        if (existingInstance) {
            return;
        }
        const pluginCallbacks = plugin.init ? plugin.init(this.toMethods().self) : {};
        this._plugins.set(plugin.id, pluginCallbacks);
        if (pluginCallbacks.onSet) {
            this._setSubscribers.add(p => { var _a; return (_a = pluginCallbacks.onSet) === null || _a === void 0 ? void 0 : _a.call(pluginCallbacks, p); });
        }
        if (pluginCallbacks.onDestroy) {
            this._destroySubscribers.add(p => { var _a; return (_a = pluginCallbacks.onDestroy) === null || _a === void 0 ? void 0 : _a.call(pluginCallbacks, p); });
        }
        if (pluginCallbacks.onBatchStart) {
            this._batchStartSubscribers.add(p => { var _a; return (_a = pluginCallbacks.onBatchStart) === null || _a === void 0 ? void 0 : _a.call(pluginCallbacks, p); });
        }
        if (pluginCallbacks.onBatchFinish) {
            this._batchFinishSubscribers.add(p => { var _a; return (_a = pluginCallbacks.onBatchFinish) === null || _a === void 0 ? void 0 : _a.call(pluginCallbacks, p); });
        }
    }
    toMethods() {
        return new StateMethodsImpl(this, rootPath, this.get(rootPath), this.edition, () => {
            /*  */
        }, () => {
            /*  */
        });
    }
    subscribe(l) {
        this._subscribers.add(l);
    }
    unsubscribe(l) {
        this._subscribers.delete(l);
    }
    destroy() {
        this._destroySubscribers.forEach(cb => cb(this._value !== none ? { state: this._value } : {}));
        this._edition = destroyedEdition;
    }
    toJSON() {
        throw new StateInvalidUsageError(rootPath, ErrorId.ToJson_Value);
    }
}
// TODO: Replace with hooks and refs
class Promised {
    constructor(promise, onResolve, onReject, onPostResolve) {
        this.promise = promise;
        if (!promise) {
            promise = new Promise(resolve => {
                this.resolver = resolve;
            });
        }
        this.promise = promise
            .then(r => {
            this.fullfilled = true;
            if (!this.resolver) {
                onResolve(r);
            }
        })
            .catch(error => {
            this.fullfilled = true;
            this.error = error;
            onReject();
        })
            .then(() => onPostResolve());
    }
}
class StateMethodsImpl {
    constructor(state, path, valueSource, valueEdition, onGetUsed, onSetUsed) {
        this.state = state;
        this.path = path;
        this.valueSource = valueSource;
        this.valueEdition = valueEdition;
        this.onGetUsed = onGetUsed;
        this.onSetUsed = onSetUsed;
        this.valueCache = valueUnusedMarker;
    }
    getUntracked(allowPromised) {
        var _a;
        this.onGetUsed();
        if (this.valueEdition !== this.state.edition) {
            this.valueSource = this.state.get(this.path);
            this.valueEdition = this.state.edition;
            if (this.isMounted) {
                // this link is still mounted to a component
                // populate cache again to ensure correct tracking of usage
                // when React scans which states to rerender on update
                if (this.valueCache !== valueUnusedMarker) {
                    this.valueCache = valueUnusedMarker;
                    this.get(true); // renew cache to keep it marked used
                }
            }
            else {
                // This link is not mounted to a component
                // for example, it might be global link or
                // a link which has been discarded after rerender
                // but still captured by some callback or an effect.
                // If we are here and if it was mounted before,
                // it means it has not been garbage collected
                // when a component unmounted.
                // We take this opportunity to clean up caches
                // to avoid memory leaks via stale children states cache.
                this.valueCache = valueUnusedMarker;
                delete this.childrenCache;
                delete this.selfCache;
            }
        }
        if (this.valueSource === none && !allowPromised) {
            if ((_a = this.state.promised) === null || _a === void 0 ? void 0 : _a.error) {
                throw this.state.promised.error;
            }
            throw new StateInvalidUsageError(this.path, ErrorId.GetStateWhenPromised);
        }
        return this.valueSource;
    }
    get(allowPromised) {
        const currentValue = this.getUntracked(allowPromised);
        if (this.valueCache === valueUnusedMarker) {
            if (Array.isArray(currentValue)) {
                this.valueCache = this.valueArrayImpl(currentValue);
            }
            else if (typeof currentValue === 'object' && currentValue !== null) {
                this.valueCache = this.valueObjectImpl(currentValue);
            }
            else {
                this.valueCache = currentValue;
            }
        }
        return this.valueCache;
    }
    get value() {
        return this.get();
    }
    setUntracked(newValue, mergeValue) {
        if (typeof newValue === 'function') {
            newValue = newValue(this.getUntracked());
        }
        if (typeof newValue === 'object' && newValue !== null && newValue[selfMethodsID]) {
            throw new StateInvalidUsageError(this.path, ErrorId.SetStateToValueFromState);
        }
        return [this.state.set(this.path, newValue, mergeValue)];
    }
    set(newValue) {
        this.state.update(this.setUntracked(newValue));
    }
    mergeUntracked(sourceValue) {
        const currentValue = this.getUntracked();
        if (typeof sourceValue === 'function') {
            // TODO: Proper types
            sourceValue = sourceValue(currentValue);
        }
        let updatedPaths;
        let deletedOrInsertedProps = false;
        if (Array.isArray(currentValue)) {
            if (Array.isArray(sourceValue)) {
                return this.setUntracked(currentValue.concat(sourceValue), sourceValue);
            }
            else {
                const deletedIndexes = [];
                for (const i of Object.keys(sourceValue).sort()) {
                    const index = Number(i);
                    // TODO: Proper types
                    const newPropValue = sourceValue[index];
                    if (newPropValue === none) {
                        deletedOrInsertedProps = true;
                        deletedIndexes.push(index);
                    }
                    else {
                        deletedOrInsertedProps = deletedOrInsertedProps || !(index in currentValue);
                        currentValue[index] = newPropValue;
                    }
                }
                // indexes are ascending sorted as per above
                // so, delete one by one from the end
                // this way index positions do not change
                for (const p of deletedIndexes.reverse()) {
                    currentValue.splice(p, 1);
                }
                updatedPaths = this.setUntracked(currentValue, sourceValue);
            }
        }
        else if (typeof currentValue === 'object' && currentValue !== null) {
            Object.keys(sourceValue).forEach(key => {
                // TODO: Proper types
                const newPropValue = sourceValue[key];
                if (newPropValue === none) {
                    deletedOrInsertedProps = true;
                    delete currentValue[key];
                }
                else {
                    deletedOrInsertedProps = deletedOrInsertedProps || !(key in currentValue);
                    currentValue[key] = newPropValue;
                }
            });
            updatedPaths = this.setUntracked(currentValue, sourceValue);
        }
        else if (typeof currentValue === 'string') {
            return this.setUntracked((currentValue + String(sourceValue)), sourceValue);
        }
        else {
            return this.setUntracked(sourceValue);
        }
        if (updatedPaths.length !== 1 || updatedPaths[0] !== this.path || deletedOrInsertedProps) {
            return updatedPaths;
        }
        const updatedPath = updatedPaths[0];
        return Object.keys(sourceValue).map(p => updatedPath.slice().concat(p));
    }
    merge(sourceValue) {
        this.state.update(this.mergeUntracked(sourceValue));
    }
    nested(key) {
        return this.child(key).self;
    }
    rerender(paths) {
        this.state.update(paths);
    }
    destroy() {
        this.state.destroy();
    }
    subscribe(l) {
        if (this.subscribers === undefined) {
            this.subscribers = new Set();
        }
        this.subscribers.add(l);
    }
    unsubscribe(l) {
        var _a;
        (_a = this.subscribers) === null || _a === void 0 ? void 0 : _a.delete(l);
    }
    get isMounted() {
        return !this.onSetUsed[unmountedMarker];
    }
    onUnmount() {
        this.onSetUsed[unmountedMarker] = true;
    }
    onSet(paths, actions) {
        const update = () => {
            var _a;
            for (const path of paths) {
                const firstChildKey = path[this.path.length];
                if (firstChildKey === undefined) {
                    if (this.valueCache !== valueUnusedMarker) {
                        return true;
                    }
                }
                else {
                    const firstChildValue = (_a = this.childrenCache) === null || _a === void 0 ? void 0 : _a[firstChildKey];
                    if (firstChildValue === null || firstChildValue === void 0 ? void 0 : firstChildValue.onSet(paths, actions)) {
                        return true;
                    }
                }
            }
            return false;
        };
        const updated = update();
        if (!updated && this.subscribers !== undefined) {
            for (const s of this.subscribers) {
                s.onSet(paths, actions);
            }
        }
        return updated;
    }
    get keys() {
        const value = this.get();
        if (Array.isArray(value)) {
            return Object.keys(value)
                .map(i => Number(i))
                .filter(i => Number.isInteger(i));
        }
        if (typeof value === 'object' && value !== null) {
            return Object.keys(value);
        }
        return undefined;
    }
    child(key) {
        var _a;
        // if this state is not mounted to a hook,
        // we do not cache children to avoid unnecessary memory leaks
        if (this.isMounted) {
            this.childrenCache = (_a = this.childrenCache) !== null && _a !== void 0 ? _a : {};
            const cachehit = this.childrenCache[key];
            if (cachehit) {
                return cachehit;
            }
        }
        const r = new StateMethodsImpl(this.state, this.path.slice().concat(key), this.valueSource[key], this.valueEdition, () => {
            /*  */
        }, () => {
            /*  */
        });
        if (this.childrenCache) {
            this.childrenCache[key] = r;
        }
        return r;
    }
    valueArrayImpl(currentValue) {
        return proxyWrap(this.path, currentValue, () => currentValue, (target, key) => {
            if (key === 'length') {
                return target.length;
            }
            if (key in Array.prototype) {
                return Array.prototype[key];
            }
            if (key === selfMethodsID) {
                return this;
            }
            if (typeof key === 'symbol') {
                // allow clients to associate hidden cache with state values
                // TODO: Figure out symbol indexing
                return target[key];
            }
            const index = Number(key);
            if (!Number.isInteger(index)) {
                return;
            }
            return this.child(index).get();
        }, (target, key, value) => {
            if (typeof key === 'symbol') {
                target[key] = value;
                return true;
            }
            throw new StateInvalidUsageError(this.path, ErrorId.SetProperty_Value);
        }, true);
    }
    valueObjectImpl(currentValue) {
        return proxyWrap(this.path, currentValue, () => currentValue, (target, key) => {
            if (key === selfMethodsID) {
                return this;
            }
            if (typeof key === 'symbol') {
                // allow clients to associate hidden cache with state values
                // TODO: Figure out symbol indexing
                return target[key];
            }
            return this.child(key).get();
        }, (target, key, value) => {
            if (typeof key === 'symbol') {
                target[key] = value;
                return true;
            }
            throw new StateInvalidUsageError(this.path, ErrorId.SetProperty_Value);
        }, true);
    }
    get self() {
        if (this.selfCache) {
            return this.selfCache;
        }
        const getter = (_, key) => {
            if (key === self) {
                return this;
            }
            if (typeof key === 'symbol') {
                return;
            }
            if (key === 'toJSON') {
                throw new StateInvalidUsageError(this.path, ErrorId.ToJson_State);
            }
            switch (key) {
                case 'path':
                    return this.path;
                case 'keys':
                    return this.keys;
                case 'value':
                    return this.value;
                case 'ornull':
                    return this.ornull;
                case 'promised':
                    return this.promised;
                case 'error':
                    return this.error;
                case 'get':
                    return () => this.get();
                case 'set':
                    return (p) => this.set(p);
                case 'merge':
                    return (p) => this.merge(p);
                case 'nested':
                    return (p) => this.nested(p);
                case 'batch':
                    // TODO: Figure out function types
                    // eslint-disable-next-line @typescript-eslint/ban-types
                    return (action, context) => this.batch(action, context);
                case 'attach':
                    return (p) => this.attach(p);
                case 'destroy': {
                    return () => this.destroy();
                }
                // fall down
            }
            const currentValue = this.get();
            if (
            // if currentValue is primitive type
            (typeof currentValue !== 'object' || currentValue === null) &&
                // if promised, it will be none
                currentValue !== none) {
                throw new StateInvalidUsageError(this.path, ErrorId.GetStatePropertyWhenPrimitive);
            }
            if (Array.isArray(currentValue)) {
                if (key === 'length') {
                    return currentValue.length;
                }
                if (key in Array.prototype) {
                    return Array.prototype[key];
                }
                const index = Number(key);
                if (!Number.isInteger(index)) {
                    return;
                }
                return this.nested(index);
            }
            return this.nested(key.toString());
        };
        this.selfCache = proxyWrap(this.path, this.valueSource, () => {
            this.get(); // get latest & mark used
            return this.valueSource;
        }, getter, () => {
            throw new StateInvalidUsageError(this.path, ErrorId.SetProperty_State);
        }, false);
        return this.selfCache;
    }
    get promised() {
        const currentValue = this.get(true); // marks used
        if (currentValue === none && this.state.promised && !this.state.promised.fullfilled) {
            return true;
        }
        return false;
    }
    get error() {
        var _a;
        const currentValue = this.get(true); // marks used
        if (currentValue === none) {
            if ((_a = this.state.promised) === null || _a === void 0 ? void 0 : _a.fullfilled) {
                return this.state.promised.error;
            }
            this.get(); // will throw 'read while promised' exception
        }
        return;
    }
    // TODO: Figure out function types
    // eslint-disable-next-line @typescript-eslint/ban-types
    batch(action, context) {
        const opts = { context };
        try {
            this.state.startBatch(this.path, opts);
            const result = action(this.self);
            if (result === postpone) {
                this.state.postponeBatch(() => this.batch(action, context));
            }
            return result;
        }
        finally {
            this.state.finishBatch(this.path, opts);
        }
    }
    get ornull() {
        const value = this.get();
        if (value === null || value === undefined) {
            return value;
        }
        return this.self;
    }
    attach(p) {
        var _a;
        if (typeof p === 'function') {
            const pluginMeta = p();
            this.state.register(pluginMeta);
            return this.self;
        }
        else {
            const plugin = (_a = this.state.getPlugin(p)) !== null && _a !== void 0 ? _a : new StateInvalidUsageError(this.path, ErrorId.GetUnknownPlugin, p.toString());
            return [plugin, this];
        }
    }
}
function proxyWrap(path, targetBootstrap, targetGetter, propertyGetter, propertySetter, isValueProxy) {
    const onInvalidUsage = (op) => {
        throw new StateInvalidUsageError(path, op);
    };
    if (typeof targetBootstrap !== 'object' || targetBootstrap === null) {
        targetBootstrap = {};
    }
    // TODO: Figure out proxy types
    return new Proxy(targetBootstrap, {
        get: propertyGetter,
        set: propertySetter,
        getPrototypeOf: () => {
            // should satisfy the invariants:
            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/getPrototypeOf#Invariants
            const targetReal = targetGetter();
            if (targetReal === undefined || targetReal === null) {
                return null;
            }
            return Object.getPrototypeOf(targetReal);
        },
        isExtensible: () => {
            // should satisfy the invariants:
            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/isExtensible#Invariants
            return true; // required to satisfy the invariants of the getPrototypeOf
        },
        getOwnPropertyDescriptor: (_, p) => {
            const targetReal = targetGetter();
            if (targetReal === undefined || targetReal === null) {
                return;
            }
            const origin = Object.getOwnPropertyDescriptor(targetReal, p);
            if (origin && Array.isArray(targetReal) && p in Array.prototype) {
                return origin;
            }
            return (origin && {
                configurable: true,
                enumerable: origin.enumerable,
                get: () => propertyGetter(targetReal, p),
                set: undefined,
            });
        },
        has: (_, p) => {
            if (typeof p === 'symbol') {
                return false;
            }
            const targetReal = targetGetter();
            if (typeof targetReal === 'object' && targetReal !== null) {
                return p in targetReal;
            }
            return false;
        },
        enumerate: () => {
            const targetReal = targetGetter();
            if (Array.isArray(targetReal)) {
                return Object.keys(targetReal).concat('length');
            }
            if (targetReal === undefined || targetReal === null) {
                return [];
            }
            return Object.keys(targetReal);
        },
        ownKeys: () => {
            const targetReal = targetGetter();
            if (Array.isArray(targetReal)) {
                return Object.keys(targetReal).concat('length');
            }
            if (targetReal === undefined || targetReal === null) {
                return [];
            }
            return Object.keys(targetReal);
        },
        apply: () => onInvalidUsage(isValueProxy ? ErrorId.Apply_State : ErrorId.Apply_Value),
        preventExtensions: () => onInvalidUsage(isValueProxy ? ErrorId.PreventExtensions_State : ErrorId.PreventExtensions_Value),
        setPrototypeOf: () => onInvalidUsage(isValueProxy ? ErrorId.SetPrototypeOf_State : ErrorId.SetPrototypeOf_Value),
        deleteProperty: () => onInvalidUsage(isValueProxy ? ErrorId.DeleteProperty_State : ErrorId.DeleteProperty_Value),
        defineProperty: () => onInvalidUsage(isValueProxy ? ErrorId.DefineProperty_State : ErrorId.DefineProperty_Value),
        construct: () => onInvalidUsage(isValueProxy ? ErrorId.Construct_State : ErrorId.Construct_Value),
    });
}
function createStore(initial) {
    let initialValue = initial;
    if (typeof initial === 'function') {
        initialValue = initial();
    }
    if (typeof initialValue === 'object' && initialValue !== null && initialValue[selfMethodsID]) {
        throw new StateInvalidUsageError(rootPath, ErrorId.InitStateToValueFromState);
    }
    return new Store(initialValue);
}

exports.createState = createState;
exports.devTools = devTools;
exports.devToolsID = devToolsID;
exports.none = none;
exports.postpone = postpone;
exports.useState = useState;
//# sourceMappingURL=index.js.map
