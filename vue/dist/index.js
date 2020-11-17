'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var vue = require('vue');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

// const logger = console
var logger =  console ;
/**
 * Special symbol which is used as a property to switch
 * between [StateMethods](#interfacesstatemethodsmd) and the corresponding [State](#state).
 *
 * [Learn more...](https://vue3.dev/docs/nested-state)
 */
var self = Symbol('self');
/**
 * Special symbol which might be returned by onPromised callback of [StateMethods.map](#map) function.
 *
 * [Learn more...](https://vue3.dev/docs/asynchronous-state#executing-an-action-when-state-is-loaded)
 */
var postpone = Symbol('postpone');
/**
 * Special symbol which might be used to delete properties
 * from an object calling [StateMethods.set](#set) or [StateMethods.merge](#merge).
 *
 * [Learn more...](https://vue3.dev/docs/nested-state#deleting-existing-element)
 */
var none = Symbol('none');
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
    var methods = createStore(initial).toMethods();
    var devtools = createState[DevToolsID];
    if (devtools) {
        methods.attach(devtools);
    }
    return methods[self];
}
function useState(source) {
    var parentMethods = typeof source === 'object' && source !== null ?
        source[self] :
        undefined;
    if (parentMethods) {
        if (parentMethods.isMounted) {
            // Scoped state mount
            logger.log('%c create vue ref (scoped)', 'background: #222; color: #bada55');
            return useSubscribedStateMethods(parentMethods.state, parentMethods.path, parentMethods, parentMethods.onGetUsed)[self];
        }
        else {
            // Global state mount or destroyed link
            logger.log('create vue ref (global)');
            return useSubscribedStateMethods(parentMethods.state, parentMethods.path, parentMethods.state)[self];
        }
    }
    else {
        // Local state mount
        logger.log('create vue ref (local)');
        var store_1 = createStore(source);
        vue.onUnmounted(function () { return store_1.destroy(); });
        var result = useSubscribedStateMethods(store_1, RootPath, store_1);
        var devtools = useState[DevToolsID];
        if (devtools) {
            result.attach(devtools);
        }
        return result[self];
    }
}
// TODO StateFragment is applicable in Vue3 too, it should go to it's own Vue component
/**
 * Allows to use a state without defining a functional react component.
 * It can be also used in class-based React components. It is also
 * particularly usefull for creating *scoped* states.
 *
 * [Learn more...](https://vue3.dev/docs/using-without-statehook)
 *
 * @typeparam S Type of a value of a state
 */
// export function StateFragment<S>(
//     props: {
//         state: State<S>,
//         children: (state: State<S>) => React.ReactElement,
//     }
// ): React.ReactElement;
/**
 * Allows to use a state without defining a functional react component.
 * See more at [StateFragment](#statefragment)
 *
 * [Learn more...](https://vue3.dev/docs/using-without-statehook)
 *
 * @typeparam S Type of a value of a state
 */
// export function StateFragment<S>(
//     props: {
//         state: SetInitialStateAction<S>,
//         children: (state: State<S>) => React.ReactElement,
//     }
// ): React.ReactElement;
// export function StateFragment<S>(
//     props: {
//         state: State<S> | SetInitialStateAction<S>,
//         children: (state: State<S>) => React.ReactElement,
//     }
// ): React.ReactElement {
//     const scoped = useState(props.state as State<S>);
//     return props.children(scoped);
// }
function StateFragment(props) {
    var scoped = useState(props.state);
    return props.children(scoped);
}
/**
 * A plugin which allows to opt-out from usage of Javascript proxies for
 * state usage tracking. It is useful for performance tuning.
 *
 * [Learn more...](https://vue3.dev/docs/performance-managed-rendering#downgraded-plugin)
 */
function Downgraded() {
    // TODO Vue specific makes Downgrade affecting behaviour
    // In React Downgrade does not change the results of rendering
    // In Vue Downgrade effectively converts customRef to shallowRef Vue hook,
    // which might result in missed rendering for nested components
    // This is likely a documentation issue only
    return {
        id: DowngradedID
    };
}
/**
 * For plugin developers only.
 * Reserved plugin ID for developers tools extension.
 *
 * @hidden
 * @ignore
 */
var DevToolsID = Symbol('DevTools');
/**
 * Returns access to the development tools for a given state.
 * Development tools are delivered as optional plugins.
 * You can activate development tools from `@appstate-fast/devtools`package,
 * for example. If no development tools are activated,
 * it returns an instance of dummy tools, which do nothing, when called.
 *
 * [Learn more...](https://vue3.dev/docs/devtools)
 *
 * @param state A state to relate to the extension.
 *
 * @returns Interface to interact with the development tools for a given state.
 *
 * @typeparam S Type of a value of a state
 */
function DevTools(state) {
    var plugin = state[self].attach(DevToolsID);
    if (plugin[0] instanceof Error) {
        return EmptyDevToolsExtensions;
    }
    return plugin[0];
}
///
/// INTERNAL SYMBOLS (LIBRARY IMPLEMENTATION)
///
var EmptyDevToolsExtensions = {
    label: function () { },
    log: function () { }
};
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
var StateInvalidUsageError = /** @class */ (function (_super) {
    __extends(StateInvalidUsageError, _super);
    function StateInvalidUsageError(path, id, details) {
        return _super.call(this, "Error: APPSTATE-FAST-" + id + " [path: /" + path.join('/') + (details ? ", details: " + details : '') + "]. " +
            ("See https://vue3.dev/docs/exceptions#appastate-fast-" + id)) || this;
    }
    return StateInvalidUsageError;
}(Error));
var DowngradedID = Symbol('Downgraded');
var SelfMethodsID = Symbol('ProxyMarker');
var RootPath = [];
var DestroyedEdition = -1;
var Store = /** @class */ (function () {
    function Store(_value) {
        this._value = _value;
        this._edition = 0;
        this._subscribers = new Set();
        this._setSubscribers = new Set();
        this._destroySubscribers = new Set();
        this._batchStartSubscribers = new Set();
        this._batchFinishSubscribers = new Set();
        this._plugins = new Map();
        this._batches = 0;
        if (typeof _value === 'object' &&
            Promise.resolve(_value) === _value) {
            this._promised = this.createPromised(_value);
            this._value = none;
        }
        else if (_value === none) {
            this._promised = this.createPromised(undefined);
        }
    }
    Store.prototype.createPromised = function (newValue) {
        var _this = this;
        var promised = new Promised(newValue ? Promise.resolve(newValue) : undefined, function (r) {
            if (_this.promised === promised && _this.edition !== DestroyedEdition) {
                _this._promised = undefined;
                _this.set(RootPath, r, undefined);
                _this.update([RootPath]);
            }
        }, function () {
            if (_this.promised === promised && _this.edition !== DestroyedEdition) {
                _this._edition += 1;
                _this.update([RootPath]);
            }
        }, function () {
            if (_this._batchesPendingActions &&
                _this._value !== none &&
                _this.edition !== DestroyedEdition) {
                var actions = _this._batchesPendingActions;
                _this._batchesPendingActions = undefined;
                actions.forEach(function (a) { return a(); });
            }
        });
        return promised;
    };
    Object.defineProperty(Store.prototype, "edition", {
        get: function () {
            return this._edition;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Store.prototype, "promised", {
        get: function () {
            return this._promised;
        },
        enumerable: false,
        configurable: true
    });
    Store.prototype.get = function (path) {
        var result = this._value;
        if (result === none) {
            return result;
        }
        path.forEach(function (p) {
            result = result[p];
        });
        return result;
    };
    Store.prototype.set = function (path, value, mergeValue) {
        if (this._edition < 0) {
            throw new StateInvalidUsageError(path, ErrorId.SetStateWhenDestroyed);
        }
        if (path.length === 0) {
            // Root value UPDATE case,
            var onSetArg = {
                path: path,
                state: value,
                value: value,
                previous: this._value,
                merged: mergeValue
            };
            if (value === none) {
                this._promised = this.createPromised(undefined);
                delete onSetArg.value;
                delete onSetArg.state;
            }
            else if (typeof value === 'object' && Promise.resolve(value) === value) {
                this._promised = this.createPromised(value);
                value = none;
                delete onSetArg.value;
                delete onSetArg.state;
            }
            else if (this._promised && !this._promised.resolver) {
                throw new StateInvalidUsageError(path, ErrorId.SetStateWhenPromised);
            }
            var prevValue = this._value;
            if (prevValue === none) {
                delete onSetArg.previous;
            }
            this._value = value;
            this.afterSet(onSetArg);
            if (prevValue === none && this._value !== none &&
                this.promised && this.promised.resolver) {
                this.promised.resolver();
            }
            return path;
        }
        if (typeof value === 'object' && Promise.resolve(value) === value) {
            throw new StateInvalidUsageError(path, ErrorId.SetStateNestedToPromised);
        }
        var target = this._value;
        for (var i = 0; i < path.length - 1; i += 1) {
            target = target[path[i]];
        }
        var p = path[path.length - 1];
        if (p in target) {
            if (value !== none) {
                // Property UPDATE case
                var prevValue = target[p];
                target[p] = value;
                this.afterSet({
                    path: path,
                    state: this._value,
                    value: value,
                    previous: prevValue,
                    merged: mergeValue
                });
                return path;
            }
            else {
                // Property DELETE case
                var prevValue = target[p];
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
                    merged: mergeValue
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
                merged: mergeValue
            });
            // if an array of object is about to be extended by new property
            // we consider it is the whole object is changed
            // which is identified by upper path
            return path.slice(0, -1);
        }
        // Non-existing property DELETE case
        // no-op
        return path;
    };
    Store.prototype.update = function (paths) {
        logger.log('update paths', paths);
        if (this._batches) {
            this._batchesPendingPaths = this._batchesPendingPaths || [];
            this._batchesPendingPaths = this._batchesPendingPaths.concat(paths);
            return;
        }
        var actions = [];
        this._subscribers.forEach(function (s) { return s.onSet(paths, actions); });
        actions.forEach(function (a) { return a(); });
    };
    Store.prototype.afterSet = function (params) {
        if (this._edition !== DestroyedEdition) {
            this._edition += 1;
            this._setSubscribers.forEach(function (cb) { return cb(params); });
        }
    };
    Store.prototype.startBatch = function (path, options) {
        this._batches += 1;
        var cbArgument = {
            path: path
        };
        if (options && 'context' in options) {
            cbArgument.context = options.context;
        }
        if (this._value !== none) {
            cbArgument.state = this._value;
        }
        this._batchStartSubscribers.forEach(function (cb) { return cb(cbArgument); });
    };
    Store.prototype.finishBatch = function (path, options) {
        var cbArgument = {
            path: path
        };
        if (options && 'context' in options) {
            cbArgument.context = options.context;
        }
        if (this._value !== none) {
            cbArgument.state = this._value;
        }
        this._batchFinishSubscribers.forEach(function (cb) { return cb(cbArgument); });
        this._batches -= 1;
        if (this._batches === 0) {
            if (this._batchesPendingPaths) {
                var paths = this._batchesPendingPaths;
                this._batchesPendingPaths = undefined;
                this.update(paths);
            }
        }
    };
    Store.prototype.postponeBatch = function (action) {
        this._batchesPendingActions = this._batchesPendingActions || [];
        this._batchesPendingActions.push(action);
    };
    Store.prototype.getPlugin = function (pluginId) {
        return this._plugins.get(pluginId);
    };
    Store.prototype.register = function (plugin) {
        var existingInstance = this._plugins.get(plugin.id);
        if (existingInstance) {
            return;
        }
        var pluginCallbacks = plugin.init ? plugin.init(this.toMethods()[self]) : {};
        this._plugins.set(plugin.id, pluginCallbacks);
        if (pluginCallbacks.onSet) {
            this._setSubscribers.add(function (p) { return pluginCallbacks.onSet(p); });
        }
        if (pluginCallbacks.onDestroy) {
            this._destroySubscribers.add(function (p) { return pluginCallbacks.onDestroy(p); });
        }
        if (pluginCallbacks.onBatchStart) {
            this._batchStartSubscribers.add(function (p) { return pluginCallbacks.onBatchStart(p); });
        }
        if (pluginCallbacks.onBatchFinish) {
            this._batchFinishSubscribers.add(function (p) { return pluginCallbacks.onBatchFinish(p); });
        }
    };
    Store.prototype.toMethods = function () {
        return new StateMethodsImpl(this, RootPath, this.get(RootPath), this.edition, OnGetUsedNoAction, OnSetUsedNoAction);
    };
    Store.prototype.subscribe = function (l) {
        this._subscribers.add(l);
    };
    Store.prototype.unsubscribe = function (l) {
        this._subscribers.delete(l);
    };
    Store.prototype.destroy = function () {
        var _this = this;
        this._destroySubscribers.forEach(function (cb) { return cb(_this._value !== none ? { state: _this._value } : {}); });
        this._edition = DestroyedEdition;
    };
    Store.prototype.toJSON = function () {
        throw new StateInvalidUsageError(RootPath, ErrorId.ToJson_Value);
    };
    return Store;
}());
var Promised = /** @class */ (function () {
    function Promised(promise, onResolve, onReject, onPostResolve) {
        var _this = this;
        this.promise = promise;
        if (!promise) {
            promise = new Promise(function (resolve) {
                _this.resolver = resolve;
            });
        }
        this.promise = promise
            .then(function (r) {
            _this.fullfilled = true;
            if (!_this.resolver) {
                onResolve(r);
            }
        })
            .catch(function (err) {
            _this.fullfilled = true;
            _this.error = err;
            onReject();
        })
            .then(function () { return onPostResolve(); });
    }
    return Promised;
}());
// use symbol property to allow for easier reference finding
var ValueCacheProperty = Symbol('ValueCache');
function OnGetUsedNoAction() { }
function OnSetUsedNoAction() { }
// use symbol to mark that a function has no effect anymore
var UnmountedMarker = Symbol('UnmountedMarker');
OnGetUsedNoAction[UnmountedMarker] = true;
OnSetUsedNoAction[UnmountedMarker] = true;
var StateMethodsImpl = /** @class */ (function () {
    function StateMethodsImpl(state, path, valueSource, valueEdition, onGetUsed, onSetUsed) {
        this.state = state;
        this.path = path;
        this.valueSource = valueSource;
        this.valueEdition = valueEdition;
        this.onGetUsed = onGetUsed;
        this.onSetUsed = onSetUsed;
    }
    StateMethodsImpl.prototype.resetTracesBeforeRerender = function () {
        delete this[ValueCacheProperty];
        delete this.childrenCache;
        delete this.selfCache;
    };
    StateMethodsImpl.prototype.getUntracked = function (allowPromised) {
        this.onGetUsed();
        if (this.valueEdition !== this.state.edition) {
            this.valueSource = this.state.get(this.path);
            this.valueEdition = this.state.edition;
            if (this.isMounted) {
                // this link is still mounted to a component
                // populate cache again to ensure correct tracking of usage
                // when React scans which states to rerender on update
                if (ValueCacheProperty in this) {
                    delete this[ValueCacheProperty];
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
                delete this[ValueCacheProperty];
                delete this.childrenCache;
                delete this.selfCache;
            }
        }
        if (this.valueSource === none && !allowPromised) {
            if (this.state.promised && this.state.promised.error) {
                throw this.state.promised.error;
            }
            throw new StateInvalidUsageError(this.path, ErrorId.GetStateWhenPromised);
        }
        return this.valueSource;
    };
    StateMethodsImpl.prototype.get = function (allowPromised) {
        var currentValue = this.getUntracked(allowPromised);
        if (!(ValueCacheProperty in this)) {
            if (this.isDowngraded) {
                this[ValueCacheProperty] = currentValue;
            }
            else if (Array.isArray(currentValue)) {
                this[ValueCacheProperty] = this.valueArrayImpl(currentValue);
            }
            else if (typeof currentValue === 'object' && currentValue !== null) {
                this[ValueCacheProperty] = this.valueObjectImpl(currentValue);
            }
            else {
                this[ValueCacheProperty] = currentValue;
            }
        }
        return this[ValueCacheProperty];
    };
    Object.defineProperty(StateMethodsImpl.prototype, "value", {
        get: function () {
            return this.get();
        },
        enumerable: false,
        configurable: true
    });
    StateMethodsImpl.prototype.setUntracked = function (newValue, mergeValue) {
        if (typeof newValue === 'function') {
            newValue = newValue(this.getUntracked());
        }
        if (typeof newValue === 'object' && newValue !== null && newValue[SelfMethodsID]) {
            throw new StateInvalidUsageError(this.path, ErrorId.SetStateToValueFromState);
        }
        return [this.state.set(this.path, newValue, mergeValue)];
    };
    StateMethodsImpl.prototype.set = function (newValue) {
        this.state.update(this.setUntracked(newValue));
    };
    StateMethodsImpl.prototype.mergeUntracked = function (sourceValue) {
        var currentValue = this.getUntracked();
        if (typeof sourceValue === 'function') {
            sourceValue = sourceValue(currentValue);
        }
        var updatedPaths;
        var deletedOrInsertedProps = false;
        if (Array.isArray(currentValue)) {
            if (Array.isArray(sourceValue)) {
                return this.setUntracked(currentValue.concat(sourceValue), sourceValue);
            }
            else {
                var deletedIndexes_1 = [];
                Object.keys(sourceValue).sort().forEach(function (i) {
                    var index = Number(i);
                    var newPropValue = sourceValue[index];
                    if (newPropValue === none) {
                        deletedOrInsertedProps = true;
                        deletedIndexes_1.push(index);
                    }
                    else {
                        deletedOrInsertedProps = deletedOrInsertedProps || !(index in currentValue);
                        currentValue[index] = newPropValue;
                    }
                });
                // indexes are ascending sorted as per above
                // so, delete one by one from the end
                // this way index positions do not change
                deletedIndexes_1.reverse().forEach(function (p) {
                    currentValue.splice(p, 1);
                });
                updatedPaths = this.setUntracked(currentValue, sourceValue);
            }
        }
        else if (typeof currentValue === 'object' && currentValue !== null) {
            Object.keys(sourceValue).forEach(function (key) {
                var newPropValue = sourceValue[key];
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
        var updatedPath = updatedPaths[0];
        return Object.keys(sourceValue).map(function (p) { return updatedPath.slice().concat(p); });
    };
    StateMethodsImpl.prototype.merge = function (sourceValue) {
        this.state.update(this.mergeUntracked(sourceValue));
    };
    StateMethodsImpl.prototype.rerender = function (paths) {
        this.state.update(paths);
    };
    StateMethodsImpl.prototype.destroy = function () {
        this.state.destroy();
    };
    StateMethodsImpl.prototype.subscribe = function (l) {
        if (this.subscribers === undefined) {
            this.subscribers = new Set();
        }
        this.subscribers.add(l);
    };
    StateMethodsImpl.prototype.unsubscribe = function (l) {
        this.subscribers.delete(l);
    };
    Object.defineProperty(StateMethodsImpl.prototype, "isMounted", {
        get: function () {
            return !this.onSetUsed[UnmountedMarker];
        },
        enumerable: false,
        configurable: true
    });
    StateMethodsImpl.prototype.onUnmount = function () {
        this.onSetUsed[UnmountedMarker] = true;
    };
    StateMethodsImpl.prototype.onSet = function (paths, actions) {
        var _this = this;
        var update = function () {
            if (_this.isDowngraded && (ValueCacheProperty in _this)) {
                actions.push(_this.onSetUsed);
                return true;
            }
            for (var _i = 0, paths_1 = paths; _i < paths_1.length; _i++) {
                var path = paths_1[_i];
                var firstChildKey = path[_this.path.length];
                if (firstChildKey === undefined) {
                    if (ValueCacheProperty in _this) {
                        actions.push(_this.onSetUsed);
                        return true;
                    }
                }
                else {
                    var firstChildValue = _this.childrenCache && _this.childrenCache[firstChildKey];
                    if (firstChildValue && firstChildValue.onSet(paths, actions)) {
                        return true;
                    }
                }
            }
            return false;
        };
        var updated = update();
        if (!updated && this.subscribers !== undefined) {
            this.subscribers.forEach(function (s) {
                s.onSet(paths, actions);
            });
        }
        return updated;
    };
    Object.defineProperty(StateMethodsImpl.prototype, "keys", {
        get: function () {
            var value = this.get();
            if (Array.isArray(value)) {
                return Object.keys(value).map(function (i) { return Number(i); }).filter(function (i) { return Number.isInteger(i); });
            }
            if (typeof value === 'object' && value !== null) {
                return Object.keys(value);
            }
            return undefined;
        },
        enumerable: false,
        configurable: true
    });
    StateMethodsImpl.prototype.child = function (key) {
        // if this state is not mounted to a hook,
        // we do not cache children to avoid unnecessary memory leaks
        if (this.isMounted) {
            this.childrenCache = this.childrenCache || {};
            var cachehit = this.childrenCache[key];
            if (cachehit) {
                return cachehit;
            }
        }
        var r = new StateMethodsImpl(this.state, this.path.slice().concat(key), this.valueSource[key], this.valueEdition, this.onGetUsed, this.onSetUsed);
        if (this.isDowngraded) {
            r.isDowngraded = true;
        }
        if (this.childrenCache) {
            this.childrenCache[key] = r;
        }
        return r;
    };
    StateMethodsImpl.prototype.valueArrayImpl = function (currentValue) {
        var _this = this;
        return proxyWrap(this.path, currentValue, function () { return currentValue; }, function (target, key) {
            if (key === 'length') {
                return target.length;
            }
            if (key in Array.prototype) {
                return Array.prototype[key];
            }
            if (key === SelfMethodsID) {
                return _this;
            }
            if (typeof key === 'symbol') {
                // allow clients to associate hidden cache with state values
                return target[key];
            }
            var index = Number(key);
            if (!Number.isInteger(index)) {
                return undefined;
            }
            return _this.child(index).get();
        }, function (target, key, value) {
            if (typeof key === 'symbol') {
                // allow clients to associate hidden cache with state values
                target[key] = value;
                return true;
            }
            throw new StateInvalidUsageError(_this.path, ErrorId.SetProperty_Value);
        }, true);
    };
    StateMethodsImpl.prototype.valueObjectImpl = function (currentValue) {
        var _this = this;
        return proxyWrap(this.path, currentValue, function () { return currentValue; }, function (target, key) {
            if (key === SelfMethodsID) {
                return _this;
            }
            if (typeof key === 'symbol') {
                // allow clients to associate hidden cache with state values
                return target[key];
            }
            return _this.child(key).get();
        }, function (target, key, value) {
            if (typeof key === 'symbol') {
                // allow clients to associate hidden cache with state values
                target[key] = value;
                return true;
            }
            throw new StateInvalidUsageError(_this.path, ErrorId.SetProperty_Value);
        }, true);
    };
    Object.defineProperty(StateMethodsImpl.prototype, self, {
        get: function () {
            var _this = this;
            if (this.selfCache) {
                return this.selfCache;
            }
            this.selfCache = proxyWrap(this.path, this.valueSource, function () {
                _this.get(); // get latest & mark used
                return _this.valueSource;
            }, function (_, key) {
                if (typeof key === 'symbol') {
                    if (key === self) {
                        return _this;
                    }
                    else {
                        return undefined;
                    }
                }
                else {
                    if (key === 'toJSON') {
                        // TODO in React it is explicitly forbidden to serialize state to JSON;
                        // A client is required to serialize state values instead
                        // In Vue, enabling custom toJSON returning a value (not a string as required by spec)
                        // allows to replace {{ state.value }} by {{ state }} in Vue html templates
                        // This enables nice syntax sugar, but are there negative side effects
                        // from violating the expeciations of return type from toJSON?
                        // Note: Returning undefined here, makes Vue thinking that states of primitive values
                        // are objects without properties, so it renders '{}' instead of an action primitive state.value
                        return function () { return _this.value; };
                        // throw new StateInvalidUsageError(this.path, ErrorId.ToJson_State);
                    }
                    // TODO this allows to unwrap state from props proxy,
                    // but what other negative side effects it might have?
                    if (key === "__v_raw") {
                        return _this;
                    }
                    var currentValue = _this.getUntracked(true);
                    if ( // if currentValue is primitive type
                    (typeof currentValue !== 'object' || currentValue === null) &&
                        // if promised, it will be none
                        currentValue !== none) {
                        switch (key) {
                            case 'path':
                                return _this.path;
                            case 'keys':
                                return _this.keys;
                            case 'value':
                                return _this.value;
                            case 'get':
                                return function () { return _this.get(); };
                            case 'set':
                                return function (p) { return _this.set(p); };
                            case 'merge':
                                return function (p) { return _this.merge(p); };
                            case 'map':
                                // tslint:disable-next-line: no-any
                                return function () {
                                    var args = [];
                                    for (var _i = 0; _i < arguments.length; _i++) {
                                        args[_i] = arguments[_i];
                                    }
                                    return _this.map(args[0], args[1], args[2], args[3]);
                                };
                            case 'attach':
                                return function (p) { return _this.attach(p); };
                            // TODO for consistency, it is possible to enable
                            // Symbol.toPrimitive with similar behavior.
                            // But it is only minor performance enhancement for Vue
                            // when state is used in expressions like {{ state + 1 }}
                            // Also, it is unclear if such constructions should be allowed.
                            // Currently it is allowed for consistency with enabled toJSON for a state
                            case 'valueOf':
                                return function () { return _this.value; };
                            // TODO same questions as for valueOf above
                            // Currently it is allowed for consistency with enabled toJSON for a state
                            case 'toString':
                                // toString for a number can come with an argument
                                return function (arg) {
                                    if (arg !== undefined && _this.value) {
                                        return _this.value.toString(arg);
                                    }
                                    return String(_this.value);
                                };
                            default:
                                // Overall it is an error that users asks props of a primitive state,
                                // but we need to enable Vue rendering:
                                // when Vue encounters and object in template,
                                // it asks for 2 known properties:
                                if (key === '__v_isRef' || key === '__v_isReadonly') {
                                    return undefined;
                                }
                                _this.get(); // mark used
                                throw new StateInvalidUsageError(_this.path, ErrorId.GetStatePropertyWhenPrimitive);
                        }
                    }
                    // TODO if this is promised state
                    // it will throw, better to add new error code
                    // and explain that state.map(...) should be replaced by state[self].map(...)
                    // which is the most common oversight with promised states.
                    _this.get(); // mark used
                    if (Array.isArray(currentValue)) {
                        if (key === 'length') {
                            // logger.log('called get for array length', key)
                            return currentValue.length;
                        }
                        if (key in Array.prototype) {
                            // logger.log('called get for array prototype', key)
                            return Array.prototype[key];
                        }
                        var index = Number(key);
                        if (!Number.isInteger(index)) {
                            // logger.log('called get for array named prop', key)
                            return undefined;
                        }
                        // logger.log('called get for array index', key)
                        return _this.child(index)[self];
                    }
                    // logger.log('called get return child', key)
                    return _this.child(key.toString())[self];
                }
            }, function (_, key, value) {
                throw new StateInvalidUsageError(_this.path, ErrorId.SetProperty_State);
            }, false);
            return this.selfCache;
        },
        enumerable: false,
        configurable: true
    });
    StateMethodsImpl.prototype.map = function (action, onPromised, onError, context) {
        var _this = this;
        var promised = function () {
            var currentValue = _this.get(true); // marks used
            if (currentValue === none && _this.state.promised && !_this.state.promised.fullfilled) {
                return true;
            }
            return false;
        };
        var error = function () {
            var currentValue = _this.get(true); // marks used
            if (currentValue === none) {
                if (_this.state.promised && _this.state.promised.fullfilled) {
                    return _this.state.promised.error;
                }
                _this.get(); // will throw 'read while promised' exception
            }
            return undefined;
        };
        if (!action) {
            if (promised()) {
                return [true, undefined, undefined];
            }
            if (error()) {
                return [false, error(), undefined];
            }
            return [false, undefined, this.value];
        }
        var contextArg = typeof onPromised === 'function'
            ? (typeof onError === 'function' ? context : onError)
            : onPromised;
        var runBatch = (function (actionArg) {
            if (contextArg !== undefined) {
                var opts = { context: contextArg };
                try {
                    _this.state.startBatch(_this.path, opts);
                    return actionArg();
                }
                finally {
                    _this.state.finishBatch(_this.path, opts);
                }
            }
            else {
                return actionArg();
            }
        });
        if (typeof onPromised === 'function' && promised()) {
            return runBatch(function () {
                var r = onPromised(_this[self]);
                if (r === postpone) {
                    // tslint:disable-next-line: no-any
                    _this.state.postponeBatch(function () { return _this.map(action, onPromised, onError, context); });
                }
                return r;
            });
        }
        if (typeof onError === 'function' && error()) {
            return runBatch(function () { return onError(error(), _this[self]); });
        }
        return runBatch(function () { return action(_this[self]); });
    };
    Object.defineProperty(StateMethodsImpl.prototype, "ornull", {
        get: function () {
            var value = this.get();
            if (value === null || value === undefined) {
                return value;
            }
            return this[self];
        },
        enumerable: false,
        configurable: true
    });
    StateMethodsImpl.prototype.attach = function (p) {
        if (typeof p === 'function') {
            var pluginMeta = p();
            if (pluginMeta.id === DowngradedID) {
                this.isDowngraded = true;
                return this[self];
            }
            this.state.register(pluginMeta);
            return this[self];
        }
        else {
            return [
                this.state.getPlugin(p) ||
                    (new StateInvalidUsageError(this.path, ErrorId.GetUnknownPlugin, p.toString())),
                this
            ];
        }
    };
    return StateMethodsImpl;
}());
function proxyWrap(path, 
// tslint:disable-next-line: no-any
targetBootstrap, 
// tslint:disable-next-line: no-any
targetGetter, 
// tslint:disable-next-line: no-any
propertyGetter, 
// tslint:disable-next-line: no-any
propertySetter, isValueProxy) {
    var onInvalidUsage = function (op) {
        throw new StateInvalidUsageError(path, op);
    };
    if (typeof targetBootstrap !== 'object' || targetBootstrap === null) {
        targetBootstrap = {};
    }
    return new Proxy(targetBootstrap, {
        getPrototypeOf: function (target) {
            logger.log('called getPrototypeOf');
            // should satisfy the invariants:
            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/getPrototypeOf#Invariants
            var targetReal = targetGetter();
            if (targetReal === undefined || targetReal === null) {
                return null;
            }
            return Object.getPrototypeOf(targetReal);
        },
        setPrototypeOf: function (target, v) {
            logger.log('called setPrototypeOf');
            return onInvalidUsage(isValueProxy ?
                ErrorId.SetPrototypeOf_State :
                ErrorId.SetPrototypeOf_Value);
        },
        isExtensible: function (target) {
            logger.log('called isExtensible');
            // should satisfy the invariants:
            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/isExtensible#Invariants
            return true; // required to satisfy the invariants of the getPrototypeOf
            // return Object.isExtensible(target);
        },
        preventExtensions: function (target) {
            logger.log('called preventExtensions');
            return onInvalidUsage(isValueProxy ?
                ErrorId.PreventExtensions_State :
                ErrorId.PreventExtensions_Value);
        },
        getOwnPropertyDescriptor: function (target, p) {
            logger.log('called getOwnPropertyDescriptor', p);
            var targetReal = targetGetter();
            if (targetReal === undefined || targetReal === null) {
                return undefined;
            }
            var origin = Object.getOwnPropertyDescriptor(targetReal, p);
            if (origin && Array.isArray(targetReal) && p in Array.prototype) {
                return origin;
            }
            return origin && {
                configurable: true,
                enumerable: origin.enumerable,
                get: function () { return propertyGetter(targetReal, p); },
                set: undefined
            };
        },
        has: function (target, p) {
            logger.log('called has', p);
            if (typeof p === 'symbol') {
                return false;
            }
            var targetReal = targetGetter();
            if (typeof targetReal === 'object' && targetReal !== null) {
                return p in targetReal;
            }
            return false;
        },
        get: function (target, p) {
            logger.log('called get', p);
            return propertyGetter(target, p);
        },
        set: function (target, p, v, r) {
            logger.log('called set', p, v);
            return propertySetter(target, p, v, r);
        },
        deleteProperty: function (target, p) {
            logger.log('called deleteProperty');
            return onInvalidUsage(isValueProxy ?
                ErrorId.DeleteProperty_State :
                ErrorId.DeleteProperty_Value);
        },
        defineProperty: function (target, p, attributes) {
            logger.log('called defineProperty', p, attributes);
            // TODO temporary allow to mark objects as Vue raw
            if (p === "__v_skip") {
                return Object.defineProperty(target, p, attributes);
            }
            if (p === "__v_reactive") {
                return Object.defineProperty(target, p, attributes);
            }
            return onInvalidUsage(isValueProxy ?
                ErrorId.DefineProperty_State :
                ErrorId.DefineProperty_Value);
        },
        enumerate: function (target) {
            logger.log('called enumerate');
            var targetReal = targetGetter();
            if (Array.isArray(targetReal)) {
                return Object.keys(targetReal).concat('length');
            }
            if (targetReal === undefined || targetReal === null) {
                return [];
            }
            return Object.keys(targetReal);
        },
        ownKeys: function (target) {
            logger.log('called ownKeys');
            var targetReal = targetGetter();
            if (Array.isArray(targetReal)) {
                return Object.keys(targetReal).concat('length');
            }
            if (targetReal === undefined || targetReal === null) {
                return [];
            }
            return Object.keys(targetReal);
        },
        apply: function (target, thisArg, argArray) {
            logger.log('called apply');
            return onInvalidUsage(isValueProxy ?
                ErrorId.Apply_State :
                ErrorId.Apply_Value);
        },
        construct: function (target, argArray, newTarget) {
            logger.log('called construct');
            return onInvalidUsage(isValueProxy ?
                ErrorId.Construct_State :
                ErrorId.Construct_Value);
        }
    });
}
function createStore(initial) {
    var initialValue = initial;
    if (typeof initial === 'function') {
        initialValue = initial();
    }
    if (typeof initialValue === 'object' && initialValue !== null && initialValue[SelfMethodsID]) {
        throw new StateInvalidUsageError(RootPath, ErrorId.InitStateToValueFromState);
    }
    return new Store(initialValue);
}
function useSubscribedStateMethods(state, path, subscribeTarget, parentOnGetUsed) {
    var capturedTrack;
    var capturedTrigger;
    vue.customRef(function (track, trigger) {
        capturedTrack = track;
        capturedTrigger = trigger;
        return { get: function () { }, set: function () { } };
    });
    var renderTimes = 0;
    var renderWatcher = vue.computed(function () {
        renderTimes += 1;
        capturedTrack();
        logger.warn('called renderWatcher', renderTimes);
        // TODO need to disable this and rethink cache clean up strategy
        // because this leaves broken chain to nested states which are not
        // "rebuilt" like in react during rerender from parent to child
        // link.resetTracesBeforeRerender()
        return renderTimes;
    });
    var link = new StateMethodsImpl(state, path, state.get(path), state.edition, function () {
        // TODO not sure how efficient it will be for Vue
        // but it is the only way to force rerender for nested components
        // when parent is rerendered
        // (effectively this line ensures that the customRef from parent
        // is also tracked when child's scoped state is used,
        // which is correct - child's state is a substate of a parent's state)
        parentOnGetUsed && parentOnGetUsed();
        // TODO if link.resetTracesBeforeRerender is not used above
        // it is possible to use here
        // capturedTrack(),
        // instead of renderWatcher.value below
        // but keep the current scheme until things get 100% clear
        // regarding cache clean up strategy
        // TODO call to value has got a side effect, although it is a property
        // need to make sure this is not deleted by an optimizer,
        // which might decide the return value is not used.
        // but how?
        renderWatcher.value;
    }, capturedTrigger);
    // in vue this is executed only once during setup
    subscribeTarget.subscribe(link);
    // and this will be executed when unmounted, which also happens only once
    vue.onUnmounted(function () { return subscribeTarget.unsubscribe(link); });
    return link;
}

exports.DevTools = DevTools;
exports.DevToolsID = DevToolsID;
exports.Downgraded = Downgraded;
exports.StateFragment = StateFragment;
exports.createState = createState;
exports.none = none;
exports.postpone = postpone;
exports.self = self;
exports.useState = useState;
//# sourceMappingURL=index.js.map
