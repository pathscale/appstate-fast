import { reactive, onUnmounted, onMounted } from 'vue';

/**
 * Special symbol which might be returned by onPromised callback of [StateMethods.map](#map) function.
 *
 * [Learn more...](https://hookstate.js.org/docs/asynchronous-state#executing-an-action-when-state-is-loaded)
 */
const postpone = Symbol('postpone');
/**
 * Special symbol which might be used to delete properties
 * from an object calling [StateMethods.set](#set) or [StateMethods.merge](#merge).
 *
 * [Learn more...](https://hookstate.js.org/docs/nested-state#deleting-existing-element)
 */
const none = Symbol('none');
/**
 * Creates new state and returns it.
 *
 * You can create as many global states as you need.
 *
 * When you the state is not needed anymore,
 * it should be destroyed by calling
 * `destroy()` method of the returned instance.
 * This is necessary for some plugins,
 * which allocate native resources,
 * like subscription to databases, broadcast channels, etc.
 * In most cases, a global state is used during
 * whole life time of an application and would not require
 * destruction. However, if you have got, for example,
 * a catalog of dynamically created and destroyed global states,
 * the states should be destroyed as advised above.
 *
 * @param initial Initial value of the state.
 * It can be a value OR a promise,
 * which asynchronously resolves to a value,
 * OR a function returning a value or a promise.
 *
 * @typeparam S Type of a value of the state
 *
 * @returns [State](#state) instance,
 * which can be used directly to get and set state value
 * outside of React components.
 * When you need to use the state in a functional `React` component,
 * pass the created state to [useState](#usestate) function and
 * use the returned result in the component's logic.
 */
function createState(initial) {
    const methods = createStore(initial).toMethods();
    // TODO: Figure out how this part works
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const devtools = createState[devToolsID];
    if (devtools)
        methods.attach(devtools);
    return methods.self;
}
/**
 * This function enables a functional React component to use a state,
 * created per component by [useState](#usestate) (*local* state).
 * In this case `useState` behaves similarly to `React.useState`,
 * but the returned instance of [State](#state)
 * has got more features.
 *
 * When a state is used by only one component, and maybe it's children,
 * it is recommended to use *local* state instead of *global*,
 * which is created by [createState](#createstate).
 *
 * *Local* (per component) state is created when a component is mounted
 * and automatically destroyed when a component is unmounted.
 *
 * The same as with the usage of a *global* state,
 * `useState` forces a component to rerender when:
 * - a segment/part of the state data is updated *AND only if*
 * - this segement was **used** by the component during or after the latest rendering.
 *
 * You can use as many local states within the same component as you need.
 *
 * @param source An initial value state.
 *
 * @returns an instance of [State](#state),
 * which **must be** used within the component (during rendering
 * or in effects) or it's children.
 */
function useState(source) {
    const parentMethods = typeof source === 'object' && source !== null
        ? source[self]
        : undefined;
    if (parentMethods) {
        if (parentMethods.isMounted) {
            // Scoped state mount
            return useSubscribedStateMethods(parentMethods.state, parentMethods.path, parentMethods)
                .self;
        }
        else {
            // Global state mount or destroyed link
            const value = reactive({ state: parentMethods.state });
            return useSubscribedStateMethods(value.state, parentMethods.path, value.state)
                .self;
        }
    }
    else {
        // Local state mount
        const value = reactive({ state: createStore(source) });
        const result = useSubscribedStateMethods(value.state, rootPath, value.state);
        onUnmounted(() => value.state.destroy());
        // TODO: Figure out how this part works
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const devtools = useState[devToolsID];
        if (devtools) {
            result.attach(devtools);
        }
        return result.self;
    }
}
/**
 * For plugin developers only.
 * Reserved plugin ID for developers tools extension.
 *
 * @hidden
 * @ignore
 */
const devToolsID = Symbol('devTools');
/**
 * Returns access to the development tools for a given state.
 * Development tools are delivered as optional plugins.
 * You can activate development tools from `@hookstate/devtools`package,
 * for example. If no development tools are activated,
 * it returns an instance of dummy tools, which do nothing, when called.
 *
 * [Learn more...](https://hookstate.js.org/docs/devtools)
 *
 * @param state A state to relate to the extension.
 *
 * @returns Interface to interact with the development tools for a given state.
 *
 * @typeparam S Type of a value of a state
 */
function devTools(state) {
    const plugin = state.attach(devToolsID);
    if (plugin[0] instanceof Error)
        return emptyDevToolsExtensions;
    return plugin[0];
}
///
/// INTERNAL SYMBOLS (LIBRARY IMPLEMENTATION)
///
const self = Symbol('self');
const emptyDevToolsExtensions = {
    label() {
        /* */
    },
    log() {
        /* */
    },
};
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
const selfMethodsID = Symbol('ProxyMarker');
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
                actions.forEach(a => a());
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
        if (result === none)
            return result;
        for (const p of path)
            result = result[p];
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
            this.afterSet({
                path: path,
                state: this._value,
                value: value,
                merged: mergeValue,
            });
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
            this._setSubscribers.forEach(cb => cb(params));
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
        return new StateMethodsImpl(this, rootPath, this.get(rootPath), this.edition);
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
// use symbol property to allow for easier reference finding
const valueUnusedMarker = Symbol('valueUnusedMarker');
class StateMethodsImpl {
    constructor(state, path, valueSource, valueEdition) {
        this.state = state;
        this.path = path;
        this.valueSource = valueSource;
        this.valueEdition = valueEdition;
        this.valueCache = valueUnusedMarker;
        this.isMounted = false;
        onMounted(() => (this.isMounted = true));
        onUnmounted(() => (this.isMounted = false));
    }
    getUntracked(allowPromised) {
        var _a;
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
            if ((_a = this.state.promised) === null || _a === void 0 ? void 0 : _a.error)
                throw this.state.promised.error;
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
        if (typeof sourceValue === 'function')
            // TODO: Proper types
            sourceValue = sourceValue(currentValue);
        let updatedPaths;
        let deletedOrInsertedProps = false;
        if (Array.isArray(currentValue)) {
            if (Array.isArray(sourceValue)) {
                return this.setUntracked(currentValue.concat(sourceValue), sourceValue);
            }
            else {
                const deletedIndexes = [];
                Object.keys(sourceValue)
                    .sort()
                    .forEach(i => {
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
                });
                // indexes are ascending sorted as per above
                // so, delete one by one from the end
                // this way index positions do not change
                deletedIndexes.reverse().forEach(p => {
                    currentValue.splice(p, 1);
                });
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
            this.subscribers.forEach(s => {
                s.onSet(paths, actions);
            });
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
            if (cachehit)
                return cachehit;
        }
        const r = new StateMethodsImpl(this.state, this.path.slice().concat(key), this.valueSource[key], this.valueEdition);
        if (this.childrenCache) {
            this.childrenCache[key] = r;
        }
        return r;
    }
    valueArrayImpl(currentValue) {
        return proxyWrap(this.path, currentValue, () => currentValue, (target, key) => {
            if (key === 'length')
                return target.length;
            if (key in Array.prototype)
                return Array.prototype[key];
            if (key === selfMethodsID)
                return this;
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
            if (key === selfMethodsID)
                return this;
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
                if (key === 'length')
                    return currentValue.length;
                if (key in Array.prototype)
                    return Array.prototype[key];
                const index = Number(key);
                if (!Number.isInteger(index))
                    return;
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
        const opts = { context: context };
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
            return [
                (_a = this.state.getPlugin(p)) !== null && _a !== void 0 ? _a : new StateInvalidUsageError(this.path, ErrorId.GetUnknownPlugin, p.toString()),
                this,
            ];
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
        getPrototypeOf: () => {
            // should satisfy the invariants:
            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/getPrototypeOf#Invariants
            const targetReal = targetGetter();
            if (targetReal === undefined || targetReal === null) {
                return null;
            }
            return Object.getPrototypeOf(targetReal);
        },
        setPrototypeOf: () => {
            return onInvalidUsage(isValueProxy ? ErrorId.SetPrototypeOf_State : ErrorId.SetPrototypeOf_Value);
        },
        isExtensible: () => {
            // should satisfy the invariants:
            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/isExtensible#Invariants
            return true; // required to satisfy the invariants of the getPrototypeOf
            // return Object.isExtensible(target);
        },
        preventExtensions: () => {
            return onInvalidUsage(isValueProxy ? ErrorId.PreventExtensions_State : ErrorId.PreventExtensions_Value);
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
        get: propertyGetter,
        set: propertySetter,
        deleteProperty: () => {
            return onInvalidUsage(isValueProxy ? ErrorId.DeleteProperty_State : ErrorId.DeleteProperty_Value);
        },
        defineProperty: () => {
            return onInvalidUsage(isValueProxy ? ErrorId.DefineProperty_State : ErrorId.DefineProperty_Value);
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
        apply: () => {
            return onInvalidUsage(isValueProxy ? ErrorId.Apply_State : ErrorId.Apply_Value);
        },
        construct: () => {
            return onInvalidUsage(isValueProxy ? ErrorId.Construct_State : ErrorId.Construct_Value);
        },
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
function useSubscribedStateMethods(state, path, subscribeTarget) {
    const link = new StateMethodsImpl(state, path, state.get(path), state.edition);
    onMounted(() => subscribeTarget.subscribe(link));
    onUnmounted(() => subscribeTarget.unsubscribe(link));
    return link;
}

export { createState, devTools, devToolsID, none, postpone, useState };
//# sourceMappingURL=index.mjs.map
