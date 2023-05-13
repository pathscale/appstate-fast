
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
(function () {
  'use strict';

  function makeMap(str, expectsLowerCase) {
    const map = /* @__PURE__ */ Object.create(null);
    const list = str.split(",");
    for (let i = 0; i < list.length; i++) {
      map[list[i]] = true;
    }
    return expectsLowerCase ? (val) => !!map[val.toLowerCase()] : (val) => !!map[val];
  }

  const EMPTY_OBJ = Object.freeze({}) ;
  const EMPTY_ARR = Object.freeze([]) ;
  const NOOP = () => {
  };
  const NO = () => false;
  const onRE = /^on[^a-z]/;
  const isOn = (key) => onRE.test(key);
  const isModelListener = (key) => key.startsWith("onUpdate:");
  const extend = Object.assign;
  const remove = (arr, el) => {
    const i = arr.indexOf(el);
    if (i > -1) {
      arr.splice(i, 1);
    }
  };
  const hasOwnProperty$1 = Object.prototype.hasOwnProperty;
  const hasOwn = (val, key) => hasOwnProperty$1.call(val, key);
  const isArray$1 = Array.isArray;
  const isMap = (val) => toTypeString(val) === "[object Map]";
  const isSet = (val) => toTypeString(val) === "[object Set]";
  const isDate = (val) => toTypeString(val) === "[object Date]";
  const isRegExp = (val) => toTypeString(val) === "[object RegExp]";
  const isFunction = (val) => typeof val === "function";
  const isString = (val) => typeof val === "string";
  const isSymbol = (val) => typeof val === "symbol";
  const isObject$1 = (val) => val !== null && typeof val === "object";
  const isPromise$1 = (val) => {
    return isObject$1(val) && isFunction(val.then) && isFunction(val.catch);
  };
  const objectToString = Object.prototype.toString;
  const toTypeString = (value) => objectToString.call(value);
  const toRawType = (value) => {
    return toTypeString(value).slice(8, -1);
  };
  const isPlainObject$1 = (val) => toTypeString(val) === "[object Object]";
  const isIntegerKey = (key) => isString(key) && key !== "NaN" && key[0] !== "-" && "" + parseInt(key, 10) === key;
  const isReservedProp = /* @__PURE__ */ makeMap(
    // the leading comma is intentional so empty string "" is also included
    ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
  );
  const isBuiltInDirective = /* @__PURE__ */ makeMap(
    "bind,cloak,else-if,else,for,html,if,model,on,once,pre,show,slot,text,memo"
  );
  const cacheStringFunction = (fn) => {
    const cache = /* @__PURE__ */ Object.create(null);
    return (str) => {
      const hit = cache[str];
      return hit || (cache[str] = fn(str));
    };
  };
  const camelizeRE = /-(\w)/g;
  const camelize = cacheStringFunction((str) => {
    return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : "");
  });
  const hyphenateRE = /\B([A-Z])/g;
  const hyphenate = cacheStringFunction(
    (str) => str.replace(hyphenateRE, "-$1").toLowerCase()
  );
  const capitalize = cacheStringFunction(
    (str) => str.charAt(0).toUpperCase() + str.slice(1)
  );
  const toHandlerKey = cacheStringFunction(
    (str) => str ? `on${capitalize(str)}` : ``
  );
  const hasChanged = (value, oldValue) => !Object.is(value, oldValue);
  const invokeArrayFns = (fns, arg) => {
    for (let i = 0; i < fns.length; i++) {
      fns[i](arg);
    }
  };
  const def = (obj, key, value) => {
    Object.defineProperty(obj, key, {
      configurable: true,
      enumerable: false,
      value
    });
  };
  const looseToNumber = (val) => {
    const n = parseFloat(val);
    return isNaN(n) ? val : n;
  };
  const toNumber = (val) => {
    const n = isString(val) ? Number(val) : NaN;
    return isNaN(n) ? val : n;
  };
  let _globalThis;
  const getGlobalThis = () => {
    return _globalThis || (_globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
  };

  const GLOBALS_WHITE_LISTED = "Infinity,undefined,NaN,isFinite,isNaN,parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,BigInt,console";
  const isGloballyWhitelisted = /* @__PURE__ */ makeMap(GLOBALS_WHITE_LISTED);

  function normalizeStyle(value) {
    if (isArray$1(value)) {
      const res = {};
      for (let i = 0; i < value.length; i++) {
        const item = value[i];
        const normalized = isString(item) ? parseStringStyle(item) : normalizeStyle(item);
        if (normalized) {
          for (const key in normalized) {
            res[key] = normalized[key];
          }
        }
      }
      return res;
    } else if (isString(value)) {
      return value;
    } else if (isObject$1(value)) {
      return value;
    }
  }
  const listDelimiterRE = /;(?![^(]*\))/g;
  const propertyDelimiterRE = /:([^]+)/;
  const styleCommentRE = new RegExp("\\/\\*.*?\\*\\/", "gs");
  function parseStringStyle(cssText) {
    const ret = {};
    cssText.replace(styleCommentRE, "").split(listDelimiterRE).forEach((item) => {
      if (item) {
        const tmp = item.split(propertyDelimiterRE);
        tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim());
      }
    });
    return ret;
  }
  function normalizeClass(value) {
    let res = "";
    if (isString(value)) {
      res = value;
    } else if (isArray$1(value)) {
      for (let i = 0; i < value.length; i++) {
        const normalized = normalizeClass(value[i]);
        if (normalized) {
          res += normalized + " ";
        }
      }
    } else if (isObject$1(value)) {
      for (const name in value) {
        if (value[name]) {
          res += name + " ";
        }
      }
    }
    return res.trim();
  }
  function normalizeProps(props) {
    if (!props)
      return null;
    let { class: klass, style } = props;
    if (klass && !isString(klass)) {
      props.class = normalizeClass(klass);
    }
    if (style) {
      props.style = normalizeStyle(style);
    }
    return props;
  }

  const HTML_TAGS = "html,body,base,head,link,meta,style,title,address,article,aside,footer,header,hgroup,h1,h2,h3,h4,h5,h6,nav,section,div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,ruby,s,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,embed,object,param,source,canvas,script,noscript,del,ins,caption,col,colgroup,table,thead,tbody,td,th,tr,button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,output,progress,select,textarea,details,dialog,menu,summary,template,blockquote,iframe,tfoot";
  const SVG_TAGS = "svg,animate,animateMotion,animateTransform,circle,clipPath,color-profile,defs,desc,discard,ellipse,feBlend,feColorMatrix,feComponentTransfer,feComposite,feConvolveMatrix,feDiffuseLighting,feDisplacementMap,feDistantLight,feDropShadow,feFlood,feFuncA,feFuncB,feFuncG,feFuncR,feGaussianBlur,feImage,feMerge,feMergeNode,feMorphology,feOffset,fePointLight,feSpecularLighting,feSpotLight,feTile,feTurbulence,filter,foreignObject,g,hatch,hatchpath,image,line,linearGradient,marker,mask,mesh,meshgradient,meshpatch,meshrow,metadata,mpath,path,pattern,polygon,polyline,radialGradient,rect,set,solidcolor,stop,switch,symbol,text,textPath,title,tspan,unknown,use,view";
  const isHTMLTag = /* @__PURE__ */ makeMap(HTML_TAGS);
  const isSVGTag = /* @__PURE__ */ makeMap(SVG_TAGS);

  const specialBooleanAttrs = `itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly`;
  const isSpecialBooleanAttr = /* @__PURE__ */ makeMap(specialBooleanAttrs);
  function includeBooleanAttr(value) {
    return !!value || value === "";
  }

  function looseCompareArrays(a, b) {
    if (a.length !== b.length)
      return false;
    let equal = true;
    for (let i = 0; equal && i < a.length; i++) {
      equal = looseEqual(a[i], b[i]);
    }
    return equal;
  }
  function looseEqual(a, b) {
    if (a === b)
      return true;
    let aValidType = isDate(a);
    let bValidType = isDate(b);
    if (aValidType || bValidType) {
      return aValidType && bValidType ? a.getTime() === b.getTime() : false;
    }
    aValidType = isSymbol(a);
    bValidType = isSymbol(b);
    if (aValidType || bValidType) {
      return a === b;
    }
    aValidType = isArray$1(a);
    bValidType = isArray$1(b);
    if (aValidType || bValidType) {
      return aValidType && bValidType ? looseCompareArrays(a, b) : false;
    }
    aValidType = isObject$1(a);
    bValidType = isObject$1(b);
    if (aValidType || bValidType) {
      if (!aValidType || !bValidType) {
        return false;
      }
      const aKeysCount = Object.keys(a).length;
      const bKeysCount = Object.keys(b).length;
      if (aKeysCount !== bKeysCount) {
        return false;
      }
      for (const key in a) {
        const aHasKey = a.hasOwnProperty(key);
        const bHasKey = b.hasOwnProperty(key);
        if (aHasKey && !bHasKey || !aHasKey && bHasKey || !looseEqual(a[key], b[key])) {
          return false;
        }
      }
    }
    return String(a) === String(b);
  }
  function looseIndexOf(arr, val) {
    return arr.findIndex((item) => looseEqual(item, val));
  }

  const toDisplayString = (val) => {
    return isString(val) ? val : val == null ? "" : isArray$1(val) || isObject$1(val) && (val.toString === objectToString || !isFunction(val.toString)) ? JSON.stringify(val, replacer, 2) : String(val);
  };
  const replacer = (_key, val) => {
    if (val && val.__v_isRef) {
      return replacer(_key, val.value);
    } else if (isMap(val)) {
      return {
        [`Map(${val.size})`]: [...val.entries()].reduce((entries, [key, val2]) => {
          entries[`${key} =>`] = val2;
          return entries;
        }, {})
      };
    } else if (isSet(val)) {
      return {
        [`Set(${val.size})`]: [...val.values()]
      };
    } else if (isObject$1(val) && !isArray$1(val) && !isPlainObject$1(val)) {
      return String(val);
    }
    return val;
  };

  function warn$2(msg, ...args) {
    console.warn(`[Vue warn] ${msg}`, ...args);
  }

  let activeEffectScope;
  class EffectScope {
    constructor(detached = false) {
      this.detached = detached;
      /**
       * @internal
       */
      this._active = true;
      /**
       * @internal
       */
      this.effects = [];
      /**
       * @internal
       */
      this.cleanups = [];
      this.parent = activeEffectScope;
      if (!detached && activeEffectScope) {
        this.index = (activeEffectScope.scopes || (activeEffectScope.scopes = [])).push(
          this
        ) - 1;
      }
    }
    get active() {
      return this._active;
    }
    run(fn) {
      if (this._active) {
        const currentEffectScope = activeEffectScope;
        try {
          activeEffectScope = this;
          return fn();
        } finally {
          activeEffectScope = currentEffectScope;
        }
      } else {
        warn$2(`cannot run an inactive effect scope.`);
      }
    }
    /**
     * This should only be called on non-detached scopes
     * @internal
     */
    on() {
      activeEffectScope = this;
    }
    /**
     * This should only be called on non-detached scopes
     * @internal
     */
    off() {
      activeEffectScope = this.parent;
    }
    stop(fromParent) {
      if (this._active) {
        let i, l;
        for (i = 0, l = this.effects.length; i < l; i++) {
          this.effects[i].stop();
        }
        for (i = 0, l = this.cleanups.length; i < l; i++) {
          this.cleanups[i]();
        }
        if (this.scopes) {
          for (i = 0, l = this.scopes.length; i < l; i++) {
            this.scopes[i].stop(true);
          }
        }
        if (!this.detached && this.parent && !fromParent) {
          const last = this.parent.scopes.pop();
          if (last && last !== this) {
            this.parent.scopes[this.index] = last;
            last.index = this.index;
          }
        }
        this.parent = void 0;
        this._active = false;
      }
    }
  }
  function effectScope(detached) {
    return new EffectScope(detached);
  }
  function recordEffectScope(effect, scope = activeEffectScope) {
    if (scope && scope.active) {
      scope.effects.push(effect);
    }
  }
  function getCurrentScope() {
    return activeEffectScope;
  }
  function onScopeDispose(fn) {
    if (activeEffectScope) {
      activeEffectScope.cleanups.push(fn);
    } else {
      warn$2(
        `onScopeDispose() is called when there is no active effect scope to be associated with.`
      );
    }
  }

  const createDep = (effects) => {
    const dep = new Set(effects);
    dep.w = 0;
    dep.n = 0;
    return dep;
  };
  const wasTracked = (dep) => (dep.w & trackOpBit) > 0;
  const newTracked = (dep) => (dep.n & trackOpBit) > 0;
  const initDepMarkers = ({ deps }) => {
    if (deps.length) {
      for (let i = 0; i < deps.length; i++) {
        deps[i].w |= trackOpBit;
      }
    }
  };
  const finalizeDepMarkers = (effect) => {
    const { deps } = effect;
    if (deps.length) {
      let ptr = 0;
      for (let i = 0; i < deps.length; i++) {
        const dep = deps[i];
        if (wasTracked(dep) && !newTracked(dep)) {
          dep.delete(effect);
        } else {
          deps[ptr++] = dep;
        }
        dep.w &= ~trackOpBit;
        dep.n &= ~trackOpBit;
      }
      deps.length = ptr;
    }
  };

  const targetMap = /* @__PURE__ */ new WeakMap();
  let effectTrackDepth = 0;
  let trackOpBit = 1;
  const maxMarkerBits = 30;
  let activeEffect;
  const ITERATE_KEY = Symbol("iterate" );
  const MAP_KEY_ITERATE_KEY = Symbol("Map key iterate" );
  class ReactiveEffect {
    constructor(fn, scheduler = null, scope) {
      this.fn = fn;
      this.scheduler = scheduler;
      this.active = true;
      this.deps = [];
      this.parent = void 0;
      recordEffectScope(this, scope);
    }
    run() {
      if (!this.active) {
        return this.fn();
      }
      let parent = activeEffect;
      let lastShouldTrack = shouldTrack;
      while (parent) {
        if (parent === this) {
          return;
        }
        parent = parent.parent;
      }
      try {
        this.parent = activeEffect;
        activeEffect = this;
        shouldTrack = true;
        trackOpBit = 1 << ++effectTrackDepth;
        if (effectTrackDepth <= maxMarkerBits) {
          initDepMarkers(this);
        } else {
          cleanupEffect(this);
        }
        return this.fn();
      } finally {
        if (effectTrackDepth <= maxMarkerBits) {
          finalizeDepMarkers(this);
        }
        trackOpBit = 1 << --effectTrackDepth;
        activeEffect = this.parent;
        shouldTrack = lastShouldTrack;
        this.parent = void 0;
        if (this.deferStop) {
          this.stop();
        }
      }
    }
    stop() {
      if (activeEffect === this) {
        this.deferStop = true;
      } else if (this.active) {
        cleanupEffect(this);
        if (this.onStop) {
          this.onStop();
        }
        this.active = false;
      }
    }
  }
  function cleanupEffect(effect2) {
    const { deps } = effect2;
    if (deps.length) {
      for (let i = 0; i < deps.length; i++) {
        deps[i].delete(effect2);
      }
      deps.length = 0;
    }
  }
  function effect(fn, options) {
    if (fn.effect) {
      fn = fn.effect.fn;
    }
    const _effect = new ReactiveEffect(fn);
    if (options) {
      extend(_effect, options);
      if (options.scope)
        recordEffectScope(_effect, options.scope);
    }
    if (!options || !options.lazy) {
      _effect.run();
    }
    const runner = _effect.run.bind(_effect);
    runner.effect = _effect;
    return runner;
  }
  function stop(runner) {
    runner.effect.stop();
  }
  let shouldTrack = true;
  const trackStack = [];
  function pauseTracking() {
    trackStack.push(shouldTrack);
    shouldTrack = false;
  }
  function resetTracking() {
    const last = trackStack.pop();
    shouldTrack = last === void 0 ? true : last;
  }
  function track(target, type, key) {
    if (shouldTrack && activeEffect) {
      let depsMap = targetMap.get(target);
      if (!depsMap) {
        targetMap.set(target, depsMap = /* @__PURE__ */ new Map());
      }
      let dep = depsMap.get(key);
      if (!dep) {
        depsMap.set(key, dep = createDep());
      }
      const eventInfo = { effect: activeEffect, target, type, key } ;
      trackEffects(dep, eventInfo);
    }
  }
  function trackEffects(dep, debuggerEventExtraInfo) {
    let shouldTrack2 = false;
    if (effectTrackDepth <= maxMarkerBits) {
      if (!newTracked(dep)) {
        dep.n |= trackOpBit;
        shouldTrack2 = !wasTracked(dep);
      }
    } else {
      shouldTrack2 = !dep.has(activeEffect);
    }
    if (shouldTrack2) {
      dep.add(activeEffect);
      activeEffect.deps.push(dep);
      if (activeEffect.onTrack) {
        activeEffect.onTrack(
          extend(
            {
              effect: activeEffect
            },
            debuggerEventExtraInfo
          )
        );
      }
    }
  }
  function trigger(target, type, key, newValue, oldValue, oldTarget) {
    const depsMap = targetMap.get(target);
    if (!depsMap) {
      return;
    }
    let deps = [];
    if (type === "clear") {
      deps = [...depsMap.values()];
    } else if (key === "length" && isArray$1(target)) {
      const newLength = Number(newValue);
      depsMap.forEach((dep, key2) => {
        if (key2 === "length" || key2 >= newLength) {
          deps.push(dep);
        }
      });
    } else {
      if (key !== void 0) {
        deps.push(depsMap.get(key));
      }
      switch (type) {
        case "add":
          if (!isArray$1(target)) {
            deps.push(depsMap.get(ITERATE_KEY));
            if (isMap(target)) {
              deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
            }
          } else if (isIntegerKey(key)) {
            deps.push(depsMap.get("length"));
          }
          break;
        case "delete":
          if (!isArray$1(target)) {
            deps.push(depsMap.get(ITERATE_KEY));
            if (isMap(target)) {
              deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
            }
          }
          break;
        case "set":
          if (isMap(target)) {
            deps.push(depsMap.get(ITERATE_KEY));
          }
          break;
      }
    }
    const eventInfo = { target, type, key, newValue, oldValue, oldTarget } ;
    if (deps.length === 1) {
      if (deps[0]) {
        {
          triggerEffects(deps[0], eventInfo);
        }
      }
    } else {
      const effects = [];
      for (const dep of deps) {
        if (dep) {
          effects.push(...dep);
        }
      }
      {
        triggerEffects(createDep(effects), eventInfo);
      }
    }
  }
  function triggerEffects(dep, debuggerEventExtraInfo) {
    const effects = isArray$1(dep) ? dep : [...dep];
    for (const effect2 of effects) {
      if (effect2.computed) {
        triggerEffect(effect2, debuggerEventExtraInfo);
      }
    }
    for (const effect2 of effects) {
      if (!effect2.computed) {
        triggerEffect(effect2, debuggerEventExtraInfo);
      }
    }
  }
  function triggerEffect(effect2, debuggerEventExtraInfo) {
    if (effect2 !== activeEffect || effect2.allowRecurse) {
      if (effect2.onTrigger) {
        effect2.onTrigger(extend({ effect: effect2 }, debuggerEventExtraInfo));
      }
      if (effect2.scheduler) {
        effect2.scheduler();
      } else {
        effect2.run();
      }
    }
  }
  function getDepFromReactive(object, key) {
    var _a;
    return (_a = targetMap.get(object)) == null ? void 0 : _a.get(key);
  }

  const isNonTrackableKeys = /* @__PURE__ */ makeMap(`__proto__,__v_isRef,__isVue`);
  const builtInSymbols = new Set(
    /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((key) => key !== "arguments" && key !== "caller").map((key) => Symbol[key]).filter(isSymbol)
  );
  const get$1 = /* @__PURE__ */ createGetter();
  const shallowGet = /* @__PURE__ */ createGetter(false, true);
  const readonlyGet = /* @__PURE__ */ createGetter(true);
  const shallowReadonlyGet = /* @__PURE__ */ createGetter(true, true);
  const arrayInstrumentations = /* @__PURE__ */ createArrayInstrumentations();
  function createArrayInstrumentations() {
    const instrumentations = {};
    ["includes", "indexOf", "lastIndexOf"].forEach((key) => {
      instrumentations[key] = function(...args) {
        const arr = toRaw(this);
        for (let i = 0, l = this.length; i < l; i++) {
          track(arr, "get", i + "");
        }
        const res = arr[key](...args);
        if (res === -1 || res === false) {
          return arr[key](...args.map(toRaw));
        } else {
          return res;
        }
      };
    });
    ["push", "pop", "shift", "unshift", "splice"].forEach((key) => {
      instrumentations[key] = function(...args) {
        pauseTracking();
        const res = toRaw(this)[key].apply(this, args);
        resetTracking();
        return res;
      };
    });
    return instrumentations;
  }
  function hasOwnProperty(key) {
    const obj = toRaw(this);
    track(obj, "has", key);
    return obj.hasOwnProperty(key);
  }
  function createGetter(isReadonly2 = false, shallow = false) {
    return function get2(target, key, receiver) {
      if (key === "__v_isReactive") {
        return !isReadonly2;
      } else if (key === "__v_isReadonly") {
        return isReadonly2;
      } else if (key === "__v_isShallow") {
        return shallow;
      } else if (key === "__v_raw" && receiver === (isReadonly2 ? shallow ? shallowReadonlyMap : readonlyMap : shallow ? shallowReactiveMap : reactiveMap).get(target)) {
        return target;
      }
      const targetIsArray = isArray$1(target);
      if (!isReadonly2) {
        if (targetIsArray && hasOwn(arrayInstrumentations, key)) {
          return Reflect.get(arrayInstrumentations, key, receiver);
        }
        if (key === "hasOwnProperty") {
          return hasOwnProperty;
        }
      }
      const res = Reflect.get(target, key, receiver);
      if (isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) {
        return res;
      }
      if (!isReadonly2) {
        track(target, "get", key);
      }
      if (shallow) {
        return res;
      }
      if (isRef(res)) {
        return targetIsArray && isIntegerKey(key) ? res : res.value;
      }
      if (isObject$1(res)) {
        return isReadonly2 ? readonly(res) : reactive(res);
      }
      return res;
    };
  }
  const set$1 = /* @__PURE__ */ createSetter();
  const shallowSet = /* @__PURE__ */ createSetter(true);
  function createSetter(shallow = false) {
    return function set2(target, key, value, receiver) {
      let oldValue = target[key];
      if (isReadonly(oldValue) && isRef(oldValue) && !isRef(value)) {
        return false;
      }
      if (!shallow) {
        if (!isShallow(value) && !isReadonly(value)) {
          oldValue = toRaw(oldValue);
          value = toRaw(value);
        }
        if (!isArray$1(target) && isRef(oldValue) && !isRef(value)) {
          oldValue.value = value;
          return true;
        }
      }
      const hadKey = isArray$1(target) && isIntegerKey(key) ? Number(key) < target.length : hasOwn(target, key);
      const result = Reflect.set(target, key, value, receiver);
      if (target === toRaw(receiver)) {
        if (!hadKey) {
          trigger(target, "add", key, value);
        } else if (hasChanged(value, oldValue)) {
          trigger(target, "set", key, value, oldValue);
        }
      }
      return result;
    };
  }
  function deleteProperty(target, key) {
    const hadKey = hasOwn(target, key);
    const oldValue = target[key];
    const result = Reflect.deleteProperty(target, key);
    if (result && hadKey) {
      trigger(target, "delete", key, void 0, oldValue);
    }
    return result;
  }
  function has$1(target, key) {
    const result = Reflect.has(target, key);
    if (!isSymbol(key) || !builtInSymbols.has(key)) {
      track(target, "has", key);
    }
    return result;
  }
  function ownKeys(target) {
    track(target, "iterate", isArray$1(target) ? "length" : ITERATE_KEY);
    return Reflect.ownKeys(target);
  }
  const mutableHandlers = {
    get: get$1,
    set: set$1,
    deleteProperty,
    has: has$1,
    ownKeys
  };
  const readonlyHandlers = {
    get: readonlyGet,
    set(target, key) {
      {
        warn$2(
          `Set operation on key "${String(key)}" failed: target is readonly.`,
          target
        );
      }
      return true;
    },
    deleteProperty(target, key) {
      {
        warn$2(
          `Delete operation on key "${String(key)}" failed: target is readonly.`,
          target
        );
      }
      return true;
    }
  };
  const shallowReactiveHandlers = /* @__PURE__ */ extend(
    {},
    mutableHandlers,
    {
      get: shallowGet,
      set: shallowSet
    }
  );
  const shallowReadonlyHandlers = /* @__PURE__ */ extend(
    {},
    readonlyHandlers,
    {
      get: shallowReadonlyGet
    }
  );

  const toShallow = (value) => value;
  const getProto = (v) => Reflect.getPrototypeOf(v);
  function get(target, key, isReadonly = false, isShallow = false) {
    target = target["__v_raw"];
    const rawTarget = toRaw(target);
    const rawKey = toRaw(key);
    if (!isReadonly) {
      if (key !== rawKey) {
        track(rawTarget, "get", key);
      }
      track(rawTarget, "get", rawKey);
    }
    const { has: has2 } = getProto(rawTarget);
    const wrap = isShallow ? toShallow : isReadonly ? toReadonly : toReactive;
    if (has2.call(rawTarget, key)) {
      return wrap(target.get(key));
    } else if (has2.call(rawTarget, rawKey)) {
      return wrap(target.get(rawKey));
    } else if (target !== rawTarget) {
      target.get(key);
    }
  }
  function has(key, isReadonly = false) {
    const target = this["__v_raw"];
    const rawTarget = toRaw(target);
    const rawKey = toRaw(key);
    if (!isReadonly) {
      if (key !== rawKey) {
        track(rawTarget, "has", key);
      }
      track(rawTarget, "has", rawKey);
    }
    return key === rawKey ? target.has(key) : target.has(key) || target.has(rawKey);
  }
  function size(target, isReadonly = false) {
    target = target["__v_raw"];
    !isReadonly && track(toRaw(target), "iterate", ITERATE_KEY);
    return Reflect.get(target, "size", target);
  }
  function add(value) {
    value = toRaw(value);
    const target = toRaw(this);
    const proto = getProto(target);
    const hadKey = proto.has.call(target, value);
    if (!hadKey) {
      target.add(value);
      trigger(target, "add", value, value);
    }
    return this;
  }
  function set$2(key, value) {
    value = toRaw(value);
    const target = toRaw(this);
    const { has: has2, get: get2 } = getProto(target);
    let hadKey = has2.call(target, key);
    if (!hadKey) {
      key = toRaw(key);
      hadKey = has2.call(target, key);
    } else {
      checkIdentityKeys(target, has2, key);
    }
    const oldValue = get2.call(target, key);
    target.set(key, value);
    if (!hadKey) {
      trigger(target, "add", key, value);
    } else if (hasChanged(value, oldValue)) {
      trigger(target, "set", key, value, oldValue);
    }
    return this;
  }
  function deleteEntry(key) {
    const target = toRaw(this);
    const { has: has2, get: get2 } = getProto(target);
    let hadKey = has2.call(target, key);
    if (!hadKey) {
      key = toRaw(key);
      hadKey = has2.call(target, key);
    } else {
      checkIdentityKeys(target, has2, key);
    }
    const oldValue = get2 ? get2.call(target, key) : void 0;
    const result = target.delete(key);
    if (hadKey) {
      trigger(target, "delete", key, void 0, oldValue);
    }
    return result;
  }
  function clear() {
    const target = toRaw(this);
    const hadItems = target.size !== 0;
    const oldTarget = isMap(target) ? new Map(target) : new Set(target) ;
    const result = target.clear();
    if (hadItems) {
      trigger(target, "clear", void 0, void 0, oldTarget);
    }
    return result;
  }
  function createForEach(isReadonly, isShallow) {
    return function forEach(callback, thisArg) {
      const observed = this;
      const target = observed["__v_raw"];
      const rawTarget = toRaw(target);
      const wrap = isShallow ? toShallow : isReadonly ? toReadonly : toReactive;
      !isReadonly && track(rawTarget, "iterate", ITERATE_KEY);
      return target.forEach((value, key) => {
        return callback.call(thisArg, wrap(value), wrap(key), observed);
      });
    };
  }
  function createIterableMethod(method, isReadonly, isShallow) {
    return function(...args) {
      const target = this["__v_raw"];
      const rawTarget = toRaw(target);
      const targetIsMap = isMap(rawTarget);
      const isPair = method === "entries" || method === Symbol.iterator && targetIsMap;
      const isKeyOnly = method === "keys" && targetIsMap;
      const innerIterator = target[method](...args);
      const wrap = isShallow ? toShallow : isReadonly ? toReadonly : toReactive;
      !isReadonly && track(
        rawTarget,
        "iterate",
        isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY
      );
      return {
        // iterator protocol
        next() {
          const { value, done } = innerIterator.next();
          return done ? { value, done } : {
            value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value),
            done
          };
        },
        // iterable protocol
        [Symbol.iterator]() {
          return this;
        }
      };
    };
  }
  function createReadonlyMethod(type) {
    return function(...args) {
      {
        const key = args[0] ? `on key "${args[0]}" ` : ``;
        console.warn(
          `${capitalize(type)} operation ${key}failed: target is readonly.`,
          toRaw(this)
        );
      }
      return type === "delete" ? false : this;
    };
  }
  function createInstrumentations() {
    const mutableInstrumentations2 = {
      get(key) {
        return get(this, key);
      },
      get size() {
        return size(this);
      },
      has,
      add,
      set: set$2,
      delete: deleteEntry,
      clear,
      forEach: createForEach(false, false)
    };
    const shallowInstrumentations2 = {
      get(key) {
        return get(this, key, false, true);
      },
      get size() {
        return size(this);
      },
      has,
      add,
      set: set$2,
      delete: deleteEntry,
      clear,
      forEach: createForEach(false, true)
    };
    const readonlyInstrumentations2 = {
      get(key) {
        return get(this, key, true);
      },
      get size() {
        return size(this, true);
      },
      has(key) {
        return has.call(this, key, true);
      },
      add: createReadonlyMethod("add"),
      set: createReadonlyMethod("set"),
      delete: createReadonlyMethod("delete"),
      clear: createReadonlyMethod("clear"),
      forEach: createForEach(true, false)
    };
    const shallowReadonlyInstrumentations2 = {
      get(key) {
        return get(this, key, true, true);
      },
      get size() {
        return size(this, true);
      },
      has(key) {
        return has.call(this, key, true);
      },
      add: createReadonlyMethod("add"),
      set: createReadonlyMethod("set"),
      delete: createReadonlyMethod("delete"),
      clear: createReadonlyMethod("clear"),
      forEach: createForEach(true, true)
    };
    const iteratorMethods = ["keys", "values", "entries", Symbol.iterator];
    iteratorMethods.forEach((method) => {
      mutableInstrumentations2[method] = createIterableMethod(
        method,
        false,
        false
      );
      readonlyInstrumentations2[method] = createIterableMethod(
        method,
        true,
        false
      );
      shallowInstrumentations2[method] = createIterableMethod(
        method,
        false,
        true
      );
      shallowReadonlyInstrumentations2[method] = createIterableMethod(
        method,
        true,
        true
      );
    });
    return [
      mutableInstrumentations2,
      readonlyInstrumentations2,
      shallowInstrumentations2,
      shallowReadonlyInstrumentations2
    ];
  }
  const [
    mutableInstrumentations,
    readonlyInstrumentations,
    shallowInstrumentations,
    shallowReadonlyInstrumentations
  ] = /* @__PURE__ */ createInstrumentations();
  function createInstrumentationGetter(isReadonly, shallow) {
    const instrumentations = shallow ? isReadonly ? shallowReadonlyInstrumentations : shallowInstrumentations : isReadonly ? readonlyInstrumentations : mutableInstrumentations;
    return (target, key, receiver) => {
      if (key === "__v_isReactive") {
        return !isReadonly;
      } else if (key === "__v_isReadonly") {
        return isReadonly;
      } else if (key === "__v_raw") {
        return target;
      }
      return Reflect.get(
        hasOwn(instrumentations, key) && key in target ? instrumentations : target,
        key,
        receiver
      );
    };
  }
  const mutableCollectionHandlers = {
    get: /* @__PURE__ */ createInstrumentationGetter(false, false)
  };
  const shallowCollectionHandlers = {
    get: /* @__PURE__ */ createInstrumentationGetter(false, true)
  };
  const readonlyCollectionHandlers = {
    get: /* @__PURE__ */ createInstrumentationGetter(true, false)
  };
  const shallowReadonlyCollectionHandlers = {
    get: /* @__PURE__ */ createInstrumentationGetter(true, true)
  };
  function checkIdentityKeys(target, has2, key) {
    const rawKey = toRaw(key);
    if (rawKey !== key && has2.call(target, rawKey)) {
      const type = toRawType(target);
      console.warn(
        `Reactive ${type} contains both the raw and reactive versions of the same object${type === `Map` ? ` as keys` : ``}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`
      );
    }
  }

  const reactiveMap = /* @__PURE__ */ new WeakMap();
  const shallowReactiveMap = /* @__PURE__ */ new WeakMap();
  const readonlyMap = /* @__PURE__ */ new WeakMap();
  const shallowReadonlyMap = /* @__PURE__ */ new WeakMap();
  function targetTypeMap(rawType) {
    switch (rawType) {
      case "Object":
      case "Array":
        return 1 /* COMMON */;
      case "Map":
      case "Set":
      case "WeakMap":
      case "WeakSet":
        return 2 /* COLLECTION */;
      default:
        return 0 /* INVALID */;
    }
  }
  function getTargetType(value) {
    return value["__v_skip"] || !Object.isExtensible(value) ? 0 /* INVALID */ : targetTypeMap(toRawType(value));
  }
  function reactive(target) {
    if (isReadonly(target)) {
      return target;
    }
    return createReactiveObject(
      target,
      false,
      mutableHandlers,
      mutableCollectionHandlers,
      reactiveMap
    );
  }
  function shallowReactive(target) {
    return createReactiveObject(
      target,
      false,
      shallowReactiveHandlers,
      shallowCollectionHandlers,
      shallowReactiveMap
    );
  }
  function readonly(target) {
    return createReactiveObject(
      target,
      true,
      readonlyHandlers,
      readonlyCollectionHandlers,
      readonlyMap
    );
  }
  function shallowReadonly(target) {
    return createReactiveObject(
      target,
      true,
      shallowReadonlyHandlers,
      shallowReadonlyCollectionHandlers,
      shallowReadonlyMap
    );
  }
  function createReactiveObject(target, isReadonly2, baseHandlers, collectionHandlers, proxyMap) {
    if (!isObject$1(target)) {
      {
        console.warn(`value cannot be made reactive: ${String(target)}`);
      }
      return target;
    }
    if (target["__v_raw"] && !(isReadonly2 && target["__v_isReactive"])) {
      return target;
    }
    const existingProxy = proxyMap.get(target);
    if (existingProxy) {
      return existingProxy;
    }
    const targetType = getTargetType(target);
    if (targetType === 0 /* INVALID */) {
      return target;
    }
    const proxy = new Proxy(
      target,
      targetType === 2 /* COLLECTION */ ? collectionHandlers : baseHandlers
    );
    proxyMap.set(target, proxy);
    return proxy;
  }
  function isReactive(value) {
    if (isReadonly(value)) {
      return isReactive(value["__v_raw"]);
    }
    return !!(value && value["__v_isReactive"]);
  }
  function isReadonly(value) {
    return !!(value && value["__v_isReadonly"]);
  }
  function isShallow(value) {
    return !!(value && value["__v_isShallow"]);
  }
  function isProxy(value) {
    return isReactive(value) || isReadonly(value);
  }
  function toRaw(observed) {
    const raw = observed && observed["__v_raw"];
    return raw ? toRaw(raw) : observed;
  }
  function markRaw(value) {
    def(value, "__v_skip", true);
    return value;
  }
  const toReactive = (value) => isObject$1(value) ? reactive(value) : value;
  const toReadonly = (value) => isObject$1(value) ? readonly(value) : value;

  function trackRefValue(ref2) {
    if (shouldTrack && activeEffect) {
      ref2 = toRaw(ref2);
      {
        trackEffects(ref2.dep || (ref2.dep = createDep()), {
          target: ref2,
          type: "get",
          key: "value"
        });
      }
    }
  }
  function triggerRefValue(ref2, newVal) {
    ref2 = toRaw(ref2);
    const dep = ref2.dep;
    if (dep) {
      {
        triggerEffects(dep, {
          target: ref2,
          type: "set",
          key: "value",
          newValue: newVal
        });
      }
    }
  }
  function isRef(r) {
    return !!(r && r.__v_isRef === true);
  }
  function ref(value) {
    return createRef(value, false);
  }
  function shallowRef(value) {
    return createRef(value, true);
  }
  function createRef(rawValue, shallow) {
    if (isRef(rawValue)) {
      return rawValue;
    }
    return new RefImpl(rawValue, shallow);
  }
  class RefImpl {
    constructor(value, __v_isShallow) {
      this.__v_isShallow = __v_isShallow;
      this.dep = void 0;
      this.__v_isRef = true;
      this._rawValue = __v_isShallow ? value : toRaw(value);
      this._value = __v_isShallow ? value : toReactive(value);
    }
    get value() {
      trackRefValue(this);
      return this._value;
    }
    set value(newVal) {
      const useDirectValue = this.__v_isShallow || isShallow(newVal) || isReadonly(newVal);
      newVal = useDirectValue ? newVal : toRaw(newVal);
      if (hasChanged(newVal, this._rawValue)) {
        this._rawValue = newVal;
        this._value = useDirectValue ? newVal : toReactive(newVal);
        triggerRefValue(this, newVal);
      }
    }
  }
  function triggerRef(ref2) {
    triggerRefValue(ref2, ref2.value );
  }
  function unref(ref2) {
    return isRef(ref2) ? ref2.value : ref2;
  }
  function toValue(source) {
    return isFunction(source) ? source() : unref(source);
  }
  const shallowUnwrapHandlers = {
    get: (target, key, receiver) => unref(Reflect.get(target, key, receiver)),
    set: (target, key, value, receiver) => {
      const oldValue = target[key];
      if (isRef(oldValue) && !isRef(value)) {
        oldValue.value = value;
        return true;
      } else {
        return Reflect.set(target, key, value, receiver);
      }
    }
  };
  function proxyRefs(objectWithRefs) {
    return isReactive(objectWithRefs) ? objectWithRefs : new Proxy(objectWithRefs, shallowUnwrapHandlers);
  }
  class CustomRefImpl {
    constructor(factory) {
      this.dep = void 0;
      this.__v_isRef = true;
      const { get, set } = factory(
        () => trackRefValue(this),
        () => triggerRefValue(this)
      );
      this._get = get;
      this._set = set;
    }
    get value() {
      return this._get();
    }
    set value(newVal) {
      this._set(newVal);
    }
  }
  function customRef(factory) {
    return new CustomRefImpl(factory);
  }
  function toRefs(object) {
    if (!isProxy(object)) {
      console.warn(`toRefs() expects a reactive object but received a plain one.`);
    }
    const ret = isArray$1(object) ? new Array(object.length) : {};
    for (const key in object) {
      ret[key] = propertyToRef(object, key);
    }
    return ret;
  }
  class ObjectRefImpl {
    constructor(_object, _key, _defaultValue) {
      this._object = _object;
      this._key = _key;
      this._defaultValue = _defaultValue;
      this.__v_isRef = true;
    }
    get value() {
      const val = this._object[this._key];
      return val === void 0 ? this._defaultValue : val;
    }
    set value(newVal) {
      this._object[this._key] = newVal;
    }
    get dep() {
      return getDepFromReactive(toRaw(this._object), this._key);
    }
  }
  class GetterRefImpl {
    constructor(_getter) {
      this._getter = _getter;
      this.__v_isRef = true;
      this.__v_isReadonly = true;
    }
    get value() {
      return this._getter();
    }
  }
  function toRef(source, key, defaultValue) {
    if (isRef(source)) {
      return source;
    } else if (isFunction(source)) {
      return new GetterRefImpl(source);
    } else if (isObject$1(source) && arguments.length > 1) {
      return propertyToRef(source, key, defaultValue);
    } else {
      return ref(source);
    }
  }
  function propertyToRef(source, key, defaultValue) {
    const val = source[key];
    return isRef(val) ? val : new ObjectRefImpl(
      source,
      key,
      defaultValue
    );
  }

  class ComputedRefImpl {
    constructor(getter, _setter, isReadonly, isSSR) {
      this._setter = _setter;
      this.dep = void 0;
      this.__v_isRef = true;
      this["__v_isReadonly"] = false;
      this._dirty = true;
      this.effect = new ReactiveEffect(getter, () => {
        if (!this._dirty) {
          this._dirty = true;
          triggerRefValue(this);
        }
      });
      this.effect.computed = this;
      this.effect.active = this._cacheable = !isSSR;
      this["__v_isReadonly"] = isReadonly;
    }
    get value() {
      const self = toRaw(this);
      trackRefValue(self);
      if (self._dirty || !self._cacheable) {
        self._dirty = false;
        self._value = self.effect.run();
      }
      return self._value;
    }
    set value(newValue) {
      this._setter(newValue);
    }
  }
  function computed$1(getterOrOptions, debugOptions, isSSR = false) {
    let getter;
    let setter;
    const onlyGetter = isFunction(getterOrOptions);
    if (onlyGetter) {
      getter = getterOrOptions;
      setter = () => {
        console.warn("Write operation failed: computed value is readonly");
      } ;
    } else {
      getter = getterOrOptions.get;
      setter = getterOrOptions.set;
    }
    const cRef = new ComputedRefImpl(getter, setter, onlyGetter || !setter, isSSR);
    if (debugOptions && !isSSR) {
      cRef.effect.onTrack = debugOptions.onTrack;
      cRef.effect.onTrigger = debugOptions.onTrigger;
    }
    return cRef;
  }

  function pushWarningContext(vnode) {
  }
  function warn$1(msg, ...args) {
    return;
  }
  function assertNumber(val, type) {
    return;
  }

  const ErrorTypeStrings = {
    ["sp"]: "serverPrefetch hook",
    ["bc"]: "beforeCreate hook",
    ["c"]: "created hook",
    ["bm"]: "beforeMount hook",
    ["m"]: "mounted hook",
    ["bu"]: "beforeUpdate hook",
    ["u"]: "updated",
    ["bum"]: "beforeUnmount hook",
    ["um"]: "unmounted hook",
    ["a"]: "activated hook",
    ["da"]: "deactivated hook",
    ["ec"]: "errorCaptured hook",
    ["rtc"]: "renderTracked hook",
    ["rtg"]: "renderTriggered hook",
    [0]: "setup function",
    [1]: "render function",
    [2]: "watcher getter",
    [3]: "watcher callback",
    [4]: "watcher cleanup function",
    [5]: "native event handler",
    [6]: "component event handler",
    [7]: "vnode hook",
    [8]: "directive hook",
    [9]: "transition hook",
    [10]: "app errorHandler",
    [11]: "app warnHandler",
    [12]: "ref function",
    [13]: "async component loader",
    [14]: "scheduler flush. This is likely a Vue internals bug. Please open an issue at https://new-issue.vuejs.org/?repo=vuejs/core"
  };
  function callWithErrorHandling(fn, instance, type, args) {
    let res;
    try {
      res = args ? fn(...args) : fn();
    } catch (err) {
      handleError(err, instance, type);
    }
    return res;
  }
  function callWithAsyncErrorHandling(fn, instance, type, args) {
    if (isFunction(fn)) {
      const res = callWithErrorHandling(fn, instance, type, args);
      if (res && isPromise$1(res)) {
        res.catch((err) => {
          handleError(err, instance, type);
        });
      }
      return res;
    }
    const values = [];
    for (let i = 0; i < fn.length; i++) {
      values.push(callWithAsyncErrorHandling(fn[i], instance, type, args));
    }
    return values;
  }
  function handleError(err, instance, type, throwInDev = true) {
    const contextVNode = instance ? instance.vnode : null;
    if (instance) {
      let cur = instance.parent;
      const exposedInstance = instance.proxy;
      const errorInfo = ErrorTypeStrings[type] ;
      while (cur) {
        const errorCapturedHooks = cur.ec;
        if (errorCapturedHooks) {
          for (let i = 0; i < errorCapturedHooks.length; i++) {
            if (errorCapturedHooks[i](err, exposedInstance, errorInfo) === false) {
              return;
            }
          }
        }
        cur = cur.parent;
      }
      const appErrorHandler = instance.appContext.config.errorHandler;
      if (appErrorHandler) {
        callWithErrorHandling(
          appErrorHandler,
          null,
          10,
          [err, exposedInstance, errorInfo]
        );
        return;
      }
    }
    logError(err, type, contextVNode, throwInDev);
  }
  function logError(err, type, contextVNode, throwInDev = true) {
    {
      if (throwInDev) {
        throw err;
      } else {
        console.error(err);
      }
    }
  }

  let isFlushing = false;
  let isFlushPending = false;
  const queue = [];
  let flushIndex = 0;
  const pendingPostFlushCbs = [];
  let activePostFlushCbs = null;
  let postFlushIndex = 0;
  const resolvedPromise = /* @__PURE__ */ Promise.resolve();
  let currentFlushPromise = null;
  const RECURSION_LIMIT = 100;
  function nextTick(fn) {
    const p = currentFlushPromise || resolvedPromise;
    return fn ? p.then(this ? fn.bind(this) : fn) : p;
  }
  function findInsertionIndex(id) {
    let start = flushIndex + 1;
    let end = queue.length;
    while (start < end) {
      const middle = start + end >>> 1;
      const middleJobId = getId(queue[middle]);
      middleJobId < id ? start = middle + 1 : end = middle;
    }
    return start;
  }
  function queueJob(job) {
    if (!queue.length || !queue.includes(
      job,
      isFlushing && job.allowRecurse ? flushIndex + 1 : flushIndex
    )) {
      if (job.id == null) {
        queue.push(job);
      } else {
        queue.splice(findInsertionIndex(job.id), 0, job);
      }
      queueFlush();
    }
  }
  function queueFlush() {
    if (!isFlushing && !isFlushPending) {
      isFlushPending = true;
      currentFlushPromise = resolvedPromise.then(flushJobs);
    }
  }
  function invalidateJob(job) {
    const i = queue.indexOf(job);
    if (i > flushIndex) {
      queue.splice(i, 1);
    }
  }
  function queuePostFlushCb(cb) {
    if (!isArray$1(cb)) {
      if (!activePostFlushCbs || !activePostFlushCbs.includes(
        cb,
        cb.allowRecurse ? postFlushIndex + 1 : postFlushIndex
      )) {
        pendingPostFlushCbs.push(cb);
      }
    } else {
      pendingPostFlushCbs.push(...cb);
    }
    queueFlush();
  }
  function flushPreFlushCbs(seen, i = isFlushing ? flushIndex + 1 : 0) {
    {
      seen = seen || /* @__PURE__ */ new Map();
    }
    for (; i < queue.length; i++) {
      const cb = queue[i];
      if (cb && cb.pre) {
        if (checkRecursiveUpdates(seen, cb)) {
          continue;
        }
        queue.splice(i, 1);
        i--;
        cb();
      }
    }
  }
  function flushPostFlushCbs(seen) {
    if (pendingPostFlushCbs.length) {
      const deduped = [...new Set(pendingPostFlushCbs)];
      pendingPostFlushCbs.length = 0;
      if (activePostFlushCbs) {
        activePostFlushCbs.push(...deduped);
        return;
      }
      activePostFlushCbs = deduped;
      {
        seen = seen || /* @__PURE__ */ new Map();
      }
      activePostFlushCbs.sort((a, b) => getId(a) - getId(b));
      for (postFlushIndex = 0; postFlushIndex < activePostFlushCbs.length; postFlushIndex++) {
        if (checkRecursiveUpdates(seen, activePostFlushCbs[postFlushIndex])) {
          continue;
        }
        activePostFlushCbs[postFlushIndex]();
      }
      activePostFlushCbs = null;
      postFlushIndex = 0;
    }
  }
  const getId = (job) => job.id == null ? Infinity : job.id;
  const comparator = (a, b) => {
    const diff = getId(a) - getId(b);
    if (diff === 0) {
      if (a.pre && !b.pre)
        return -1;
      if (b.pre && !a.pre)
        return 1;
    }
    return diff;
  };
  function flushJobs(seen) {
    isFlushPending = false;
    isFlushing = true;
    {
      seen = seen || /* @__PURE__ */ new Map();
    }
    queue.sort(comparator);
    const check = (job) => checkRecursiveUpdates(seen, job) ;
    try {
      for (flushIndex = 0; flushIndex < queue.length; flushIndex++) {
        const job = queue[flushIndex];
        if (job && job.active !== false) {
          if ("development" !== "production" && check(job)) {
            continue;
          }
          callWithErrorHandling(job, null, 14);
        }
      }
    } finally {
      flushIndex = 0;
      queue.length = 0;
      flushPostFlushCbs(seen);
      isFlushing = false;
      currentFlushPromise = null;
      if (queue.length || pendingPostFlushCbs.length) {
        flushJobs(seen);
      }
    }
  }
  function checkRecursiveUpdates(seen, fn) {
    if (!seen.has(fn)) {
      seen.set(fn, 1);
    } else {
      const count = seen.get(fn);
      if (count > RECURSION_LIMIT) {
        const instance = fn.ownerInstance;
        instance && getComponentName(instance.type);
        return true;
      } else {
        seen.set(fn, count + 1);
      }
    }
  }

  let isHmrUpdating = false;
  const hmrDirtyComponents = /* @__PURE__ */ new Set();
  {
    getGlobalThis().__VUE_HMR_RUNTIME__ = {
      createRecord: tryWrap(createRecord),
      rerender: tryWrap(rerender),
      reload: tryWrap(reload)
    };
  }
  const map = /* @__PURE__ */ new Map();
  function registerHMR(instance) {
    const id = instance.type.__hmrId;
    let record = map.get(id);
    if (!record) {
      createRecord(id, instance.type);
      record = map.get(id);
    }
    record.instances.add(instance);
  }
  function unregisterHMR(instance) {
    map.get(instance.type.__hmrId).instances.delete(instance);
  }
  function createRecord(id, initialDef) {
    if (map.has(id)) {
      return false;
    }
    map.set(id, {
      initialDef: normalizeClassComponent(initialDef),
      instances: /* @__PURE__ */ new Set()
    });
    return true;
  }
  function normalizeClassComponent(component) {
    return isClassComponent(component) ? component.__vccOpts : component;
  }
  function rerender(id, newRender) {
    const record = map.get(id);
    if (!record) {
      return;
    }
    record.initialDef.render = newRender;
    [...record.instances].forEach((instance) => {
      if (newRender) {
        instance.render = newRender;
        normalizeClassComponent(instance.type).render = newRender;
      }
      instance.renderCache = [];
      isHmrUpdating = true;
      instance.update();
      isHmrUpdating = false;
    });
  }
  function reload(id, newComp) {
    const record = map.get(id);
    if (!record)
      return;
    newComp = normalizeClassComponent(newComp);
    updateComponentDef(record.initialDef, newComp);
    const instances = [...record.instances];
    for (const instance of instances) {
      const oldComp = normalizeClassComponent(instance.type);
      if (!hmrDirtyComponents.has(oldComp)) {
        if (oldComp !== record.initialDef) {
          updateComponentDef(oldComp, newComp);
        }
        hmrDirtyComponents.add(oldComp);
      }
      instance.appContext.propsCache.delete(instance.type);
      instance.appContext.emitsCache.delete(instance.type);
      instance.appContext.optionsCache.delete(instance.type);
      if (instance.ceReload) {
        hmrDirtyComponents.add(oldComp);
        instance.ceReload(newComp.styles);
        hmrDirtyComponents.delete(oldComp);
      } else if (instance.parent) {
        queueJob(instance.parent.update);
      } else if (instance.appContext.reload) {
        instance.appContext.reload();
      } else if (typeof window !== "undefined") {
        window.location.reload();
      } else {
        console.warn(
          "[HMR] Root or manually mounted instance modified. Full reload required."
        );
      }
    }
    queuePostFlushCb(() => {
      for (const instance of instances) {
        hmrDirtyComponents.delete(
          normalizeClassComponent(instance.type)
        );
      }
    });
  }
  function updateComponentDef(oldComp, newComp) {
    extend(oldComp, newComp);
    for (const key in oldComp) {
      if (key !== "__file" && !(key in newComp)) {
        delete oldComp[key];
      }
    }
  }
  function tryWrap(fn) {
    return (id, arg) => {
      try {
        return fn(id, arg);
      } catch (e) {
        console.error(e);
        console.warn(
          `[HMR] Something went wrong during Vue component hot-reload. Full reload required.`
        );
      }
    };
  }

  let devtools;
  let buffer = [];
  let devtoolsNotInstalled = false;
  function emit$1(event, ...args) {
    if (devtools) {
      devtools.emit(event, ...args);
    } else if (!devtoolsNotInstalled) {
      buffer.push({ event, args });
    }
  }
  function setDevtoolsHook(hook, target) {
    var _a, _b;
    devtools = hook;
    if (devtools) {
      devtools.enabled = true;
      buffer.forEach(({ event, args }) => devtools.emit(event, ...args));
      buffer = [];
    } else if (
      // handle late devtools injection - only do this if we are in an actual
      // browser environment to avoid the timer handle stalling test runner exit
      // (#4815)
      typeof window !== "undefined" && // some envs mock window but not fully
      window.HTMLElement && // also exclude jsdom
      !((_b = (_a = window.navigator) == null ? void 0 : _a.userAgent) == null ? void 0 : _b.includes("jsdom"))
    ) {
      const replay = target.__VUE_DEVTOOLS_HOOK_REPLAY__ = target.__VUE_DEVTOOLS_HOOK_REPLAY__ || [];
      replay.push((newHook) => {
        setDevtoolsHook(newHook, target);
      });
      setTimeout(() => {
        if (!devtools) {
          target.__VUE_DEVTOOLS_HOOK_REPLAY__ = null;
          devtoolsNotInstalled = true;
          buffer = [];
        }
      }, 3e3);
    } else {
      devtoolsNotInstalled = true;
      buffer = [];
    }
  }
  function devtoolsInitApp(app, version) {
    emit$1("app:init" /* APP_INIT */, app, version, {
      Fragment,
      Text,
      Comment,
      Static
    });
  }
  function devtoolsUnmountApp(app) {
    emit$1("app:unmount" /* APP_UNMOUNT */, app);
  }
  const devtoolsComponentAdded = /* @__PURE__ */ createDevtoolsComponentHook(
    "component:added" /* COMPONENT_ADDED */
  );
  const devtoolsComponentUpdated = /* @__PURE__ */ createDevtoolsComponentHook("component:updated" /* COMPONENT_UPDATED */);
  const _devtoolsComponentRemoved = /* @__PURE__ */ createDevtoolsComponentHook(
    "component:removed" /* COMPONENT_REMOVED */
  );
  const devtoolsComponentRemoved = (component) => {
    if (devtools && typeof devtools.cleanupBuffer === "function" && // remove the component if it wasn't buffered
    !devtools.cleanupBuffer(component)) {
      _devtoolsComponentRemoved(component);
    }
  };
  function createDevtoolsComponentHook(hook) {
    return (component) => {
      emit$1(
        hook,
        component.appContext.app,
        component.uid,
        component.parent ? component.parent.uid : void 0,
        component
      );
    };
  }
  const devtoolsPerfStart = /* @__PURE__ */ createDevtoolsPerformanceHook(
    "perf:start" /* PERFORMANCE_START */
  );
  const devtoolsPerfEnd = /* @__PURE__ */ createDevtoolsPerformanceHook(
    "perf:end" /* PERFORMANCE_END */
  );
  function createDevtoolsPerformanceHook(hook) {
    return (component, type, time) => {
      emit$1(hook, component.appContext.app, component.uid, component, type, time);
    };
  }
  function devtoolsComponentEmit(component, event, params) {
    emit$1(
      "component:emit" /* COMPONENT_EMIT */,
      component.appContext.app,
      component,
      event,
      params
    );
  }

  function emit(instance, event, ...rawArgs) {
    if (instance.isUnmounted)
      return;
    const props = instance.vnode.props || EMPTY_OBJ;
    {
      const {
        emitsOptions,
        propsOptions: [propsOptions]
      } = instance;
      if (emitsOptions) {
        if (!(event in emitsOptions) && true) {
          if (!propsOptions || !(toHandlerKey(event) in propsOptions)) {
            warn$1(
              `Component emitted event "${event}" but it is neither declared in the emits option nor as an "${toHandlerKey(event)}" prop.`
            );
          }
        } else {
          const validator = emitsOptions[event];
          if (isFunction(validator)) {
            validator(...rawArgs);
          }
        }
      }
    }
    let args = rawArgs;
    const isModelListener = event.startsWith("update:");
    const modelArg = isModelListener && event.slice(7);
    if (modelArg && modelArg in props) {
      const modifiersKey = `${modelArg === "modelValue" ? "model" : modelArg}Modifiers`;
      const { number, trim } = props[modifiersKey] || EMPTY_OBJ;
      if (trim) {
        args = rawArgs.map((a) => isString(a) ? a.trim() : a);
      }
      if (number) {
        args = rawArgs.map(looseToNumber);
      }
    }
    {
      devtoolsComponentEmit(instance, event, args);
    }
    {
      const lowerCaseEvent = event.toLowerCase();
      if (lowerCaseEvent !== event && props[toHandlerKey(lowerCaseEvent)]) {
        warn$1(
          `Event "${lowerCaseEvent}" is emitted in component ${formatComponentName(
          instance,
          instance.type
        )} but the handler is registered for "${event}". Note that HTML attributes are case-insensitive and you cannot use v-on to listen to camelCase events when using in-DOM templates. You should probably use "${hyphenate(event)}" instead of "${event}".`
        );
      }
    }
    let handlerName;
    let handler = props[handlerName = toHandlerKey(event)] || // also try camelCase event handler (#2249)
    props[handlerName = toHandlerKey(camelize(event))];
    if (!handler && isModelListener) {
      handler = props[handlerName = toHandlerKey(hyphenate(event))];
    }
    if (handler) {
      callWithAsyncErrorHandling(
        handler,
        instance,
        6,
        args
      );
    }
    const onceHandler = props[handlerName + `Once`];
    if (onceHandler) {
      if (!instance.emitted) {
        instance.emitted = {};
      } else if (instance.emitted[handlerName]) {
        return;
      }
      instance.emitted[handlerName] = true;
      callWithAsyncErrorHandling(
        onceHandler,
        instance,
        6,
        args
      );
    }
  }
  function normalizeEmitsOptions(comp, appContext, asMixin = false) {
    const cache = appContext.emitsCache;
    const cached = cache.get(comp);
    if (cached !== void 0) {
      return cached;
    }
    const raw = comp.emits;
    let normalized = {};
    let hasExtends = false;
    if (!raw && !hasExtends) {
      if (isObject$1(comp)) {
        cache.set(comp, null);
      }
      return null;
    }
    if (isArray$1(raw)) {
      raw.forEach((key) => normalized[key] = null);
    } else {
      extend(normalized, raw);
    }
    if (isObject$1(comp)) {
      cache.set(comp, normalized);
    }
    return normalized;
  }
  function isEmitListener(options, key) {
    if (!options || !isOn(key)) {
      return false;
    }
    key = key.slice(2).replace(/Once$/, "");
    return hasOwn(options, key[0].toLowerCase() + key.slice(1)) || hasOwn(options, hyphenate(key)) || hasOwn(options, key);
  }

  let currentRenderingInstance = null;
  let currentScopeId = null;
  function setCurrentRenderingInstance(instance) {
    const prev = currentRenderingInstance;
    currentRenderingInstance = instance;
    currentScopeId = instance && instance.type.__scopeId || null;
    return prev;
  }
  function pushScopeId(id) {
    currentScopeId = id;
  }
  function popScopeId() {
    currentScopeId = null;
  }
  const withScopeId = (_id) => withCtx;
  function withCtx(fn, ctx = currentRenderingInstance, isNonScopedSlot) {
    if (!ctx)
      return fn;
    if (fn._n) {
      return fn;
    }
    const renderFnWithContext = (...args) => {
      if (renderFnWithContext._d) {
        setBlockTracking(-1);
      }
      const prevInstance = setCurrentRenderingInstance(ctx);
      let res;
      try {
        res = fn(...args);
      } finally {
        setCurrentRenderingInstance(prevInstance);
        if (renderFnWithContext._d) {
          setBlockTracking(1);
        }
      }
      {
        devtoolsComponentUpdated(ctx);
      }
      return res;
    };
    renderFnWithContext._n = true;
    renderFnWithContext._c = true;
    renderFnWithContext._d = true;
    return renderFnWithContext;
  }

  let accessedAttrs = false;
  function markAttrsAccessed() {
    accessedAttrs = true;
  }
  function renderComponentRoot(instance) {
    const {
      type: Component,
      vnode,
      proxy,
      withProxy,
      props,
      propsOptions: [propsOptions],
      slots,
      attrs,
      emit,
      render,
      renderCache,
      data,
      setupState,
      ctx,
      inheritAttrs
    } = instance;
    let result;
    let fallthroughAttrs;
    const prev = setCurrentRenderingInstance(instance);
    {
      accessedAttrs = false;
    }
    try {
      if (vnode.shapeFlag & 4) {
        const proxyToUse = withProxy || proxy;
        result = normalizeVNode(
          render.call(
            proxyToUse,
            proxyToUse,
            renderCache,
            props,
            setupState,
            data,
            ctx
          )
        );
        fallthroughAttrs = attrs;
      } else {
        const render2 = Component;
        if ("development" !== "production" && attrs === props) {
          markAttrsAccessed();
        }
        result = normalizeVNode(
          render2.length > 1 ? render2(
            props,
            "development" !== "production" ? {
              get attrs() {
                markAttrsAccessed();
                return attrs;
              },
              slots,
              emit
            } : { attrs, slots, emit }
          ) : render2(
            props,
            null
            /* we know it doesn't need it */
          )
        );
        fallthroughAttrs = Component.props ? attrs : getFunctionalFallthrough(attrs);
      }
    } catch (err) {
      blockStack.length = 0;
      handleError(err, instance, 1);
      result = createVNode(Comment);
    }
    let root = result;
    let setRoot = void 0;
    if (result.patchFlag > 0 && result.patchFlag & 2048) {
      [root, setRoot] = getChildRoot(result);
    }
    if (fallthroughAttrs && inheritAttrs !== false) {
      const keys = Object.keys(fallthroughAttrs);
      const { shapeFlag } = root;
      if (keys.length) {
        if (shapeFlag & (1 | 6)) {
          if (propsOptions && keys.some(isModelListener)) {
            fallthroughAttrs = filterModelListeners(
              fallthroughAttrs,
              propsOptions
            );
          }
          root = cloneVNode(root, fallthroughAttrs);
        } else if (!accessedAttrs && root.type !== Comment) {
          const allAttrs = Object.keys(attrs);
          const eventAttrs = [];
          for (let i = 0, l = allAttrs.length; i < l; i++) {
            const key = allAttrs[i];
            if (isOn(key)) {
              if (!isModelListener(key)) {
                eventAttrs.push(key[2].toLowerCase() + key.slice(3));
              }
            }
          }
        }
      }
    }
    if (vnode.dirs) {
      if (!isElementRoot(root)) ;
      root = cloneVNode(root);
      root.dirs = root.dirs ? root.dirs.concat(vnode.dirs) : vnode.dirs;
    }
    if (vnode.transition) {
      if (!isElementRoot(root)) ;
      root.transition = vnode.transition;
    }
    if (setRoot) {
      setRoot(root);
    } else {
      result = root;
    }
    setCurrentRenderingInstance(prev);
    return result;
  }
  const getChildRoot = (vnode) => {
    const rawChildren = vnode.children;
    const dynamicChildren = vnode.dynamicChildren;
    const childRoot = filterSingleRoot(rawChildren);
    if (!childRoot) {
      return [vnode, void 0];
    }
    const index = rawChildren.indexOf(childRoot);
    const dynamicIndex = dynamicChildren ? dynamicChildren.indexOf(childRoot) : -1;
    const setRoot = (updatedRoot) => {
      rawChildren[index] = updatedRoot;
      if (dynamicChildren) {
        if (dynamicIndex > -1) {
          dynamicChildren[dynamicIndex] = updatedRoot;
        } else if (updatedRoot.patchFlag > 0) {
          vnode.dynamicChildren = [...dynamicChildren, updatedRoot];
        }
      }
    };
    return [normalizeVNode(childRoot), setRoot];
  };
  function filterSingleRoot(children) {
    let singleRoot;
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (isVNode(child)) {
        if (child.type !== Comment || child.children === "v-if") {
          if (singleRoot) {
            return;
          } else {
            singleRoot = child;
          }
        }
      } else {
        return;
      }
    }
    return singleRoot;
  }
  const getFunctionalFallthrough = (attrs) => {
    let res;
    for (const key in attrs) {
      if (key === "class" || key === "style" || isOn(key)) {
        (res || (res = {}))[key] = attrs[key];
      }
    }
    return res;
  };
  const filterModelListeners = (attrs, props) => {
    const res = {};
    for (const key in attrs) {
      if (!isModelListener(key) || !(key.slice(9) in props)) {
        res[key] = attrs[key];
      }
    }
    return res;
  };
  const isElementRoot = (vnode) => {
    return vnode.shapeFlag & (6 | 1) || vnode.type === Comment;
  };
  function shouldUpdateComponent(prevVNode, nextVNode, optimized) {
    const { props: prevProps, children: prevChildren, component } = prevVNode;
    const { props: nextProps, children: nextChildren, patchFlag } = nextVNode;
    const emits = component.emitsOptions;
    if ((prevChildren || nextChildren) && isHmrUpdating) {
      return true;
    }
    if (nextVNode.dirs || nextVNode.transition) {
      return true;
    }
    if (optimized && patchFlag >= 0) {
      if (patchFlag & 1024) {
        return true;
      }
      if (patchFlag & 16) {
        if (!prevProps) {
          return !!nextProps;
        }
        return hasPropsChanged(prevProps, nextProps, emits);
      } else if (patchFlag & 8) {
        const dynamicProps = nextVNode.dynamicProps;
        for (let i = 0; i < dynamicProps.length; i++) {
          const key = dynamicProps[i];
          if (nextProps[key] !== prevProps[key] && !isEmitListener(emits, key)) {
            return true;
          }
        }
      }
    } else {
      if (prevChildren || nextChildren) {
        if (!nextChildren || !nextChildren.$stable) {
          return true;
        }
      }
      if (prevProps === nextProps) {
        return false;
      }
      if (!prevProps) {
        return !!nextProps;
      }
      if (!nextProps) {
        return true;
      }
      return hasPropsChanged(prevProps, nextProps, emits);
    }
    return false;
  }
  function hasPropsChanged(prevProps, nextProps, emitsOptions) {
    const nextKeys = Object.keys(nextProps);
    if (nextKeys.length !== Object.keys(prevProps).length) {
      return true;
    }
    for (let i = 0; i < nextKeys.length; i++) {
      const key = nextKeys[i];
      if (nextProps[key] !== prevProps[key] && !isEmitListener(emitsOptions, key)) {
        return true;
      }
    }
    return false;
  }
  function updateHOCHostEl({ vnode, parent }, el) {
    while (parent && parent.subTree === vnode) {
      (vnode = parent.vnode).el = el;
      parent = parent.parent;
    }
  }

  const isSuspense = (type) => type.__isSuspense;
  const SuspenseImpl = {
    name: "Suspense",
    // In order to make Suspense tree-shakable, we need to avoid importing it
    // directly in the renderer. The renderer checks for the __isSuspense flag
    // on a vnode's type and calls the `process` method, passing in renderer
    // internals.
    __isSuspense: true,
    process(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, rendererInternals) {
      if (n1 == null) {
        mountSuspense(
          n2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          isSVG,
          slotScopeIds,
          optimized,
          rendererInternals
        );
      } else {
        patchSuspense(
          n1,
          n2,
          container,
          anchor,
          parentComponent,
          isSVG,
          slotScopeIds,
          optimized,
          rendererInternals
        );
      }
    },
    hydrate: hydrateSuspense,
    create: createSuspenseBoundary,
    normalize: normalizeSuspenseChildren
  };
  const Suspense = SuspenseImpl ;
  function triggerEvent(vnode, name) {
    const eventListener = vnode.props && vnode.props[name];
    if (isFunction(eventListener)) {
      eventListener();
    }
  }
  function mountSuspense(vnode, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, rendererInternals) {
    const {
      p: patch,
      o: { createElement }
    } = rendererInternals;
    const hiddenContainer = createElement("div");
    const suspense = vnode.suspense = createSuspenseBoundary(
      vnode,
      parentSuspense,
      parentComponent,
      container,
      hiddenContainer,
      anchor,
      isSVG,
      slotScopeIds,
      optimized,
      rendererInternals
    );
    patch(
      null,
      suspense.pendingBranch = vnode.ssContent,
      hiddenContainer,
      null,
      parentComponent,
      suspense,
      isSVG,
      slotScopeIds
    );
    if (suspense.deps > 0) {
      triggerEvent(vnode, "onPending");
      triggerEvent(vnode, "onFallback");
      patch(
        null,
        vnode.ssFallback,
        container,
        anchor,
        parentComponent,
        null,
        // fallback tree will not have suspense context
        isSVG,
        slotScopeIds
      );
      setActiveBranch(suspense, vnode.ssFallback);
    } else {
      suspense.resolve(false, true);
    }
  }
  function patchSuspense(n1, n2, container, anchor, parentComponent, isSVG, slotScopeIds, optimized, { p: patch, um: unmount, o: { createElement } }) {
    const suspense = n2.suspense = n1.suspense;
    suspense.vnode = n2;
    n2.el = n1.el;
    const newBranch = n2.ssContent;
    const newFallback = n2.ssFallback;
    const { activeBranch, pendingBranch, isInFallback, isHydrating } = suspense;
    if (pendingBranch) {
      suspense.pendingBranch = newBranch;
      if (isSameVNodeType(newBranch, pendingBranch)) {
        patch(
          pendingBranch,
          newBranch,
          suspense.hiddenContainer,
          null,
          parentComponent,
          suspense,
          isSVG,
          slotScopeIds,
          optimized
        );
        if (suspense.deps <= 0) {
          suspense.resolve();
        } else if (isInFallback) {
          patch(
            activeBranch,
            newFallback,
            container,
            anchor,
            parentComponent,
            null,
            // fallback tree will not have suspense context
            isSVG,
            slotScopeIds,
            optimized
          );
          setActiveBranch(suspense, newFallback);
        }
      } else {
        suspense.pendingId++;
        if (isHydrating) {
          suspense.isHydrating = false;
          suspense.activeBranch = pendingBranch;
        } else {
          unmount(pendingBranch, parentComponent, suspense);
        }
        suspense.deps = 0;
        suspense.effects.length = 0;
        suspense.hiddenContainer = createElement("div");
        if (isInFallback) {
          patch(
            null,
            newBranch,
            suspense.hiddenContainer,
            null,
            parentComponent,
            suspense,
            isSVG,
            slotScopeIds,
            optimized
          );
          if (suspense.deps <= 0) {
            suspense.resolve();
          } else {
            patch(
              activeBranch,
              newFallback,
              container,
              anchor,
              parentComponent,
              null,
              // fallback tree will not have suspense context
              isSVG,
              slotScopeIds,
              optimized
            );
            setActiveBranch(suspense, newFallback);
          }
        } else if (activeBranch && isSameVNodeType(newBranch, activeBranch)) {
          patch(
            activeBranch,
            newBranch,
            container,
            anchor,
            parentComponent,
            suspense,
            isSVG,
            slotScopeIds,
            optimized
          );
          suspense.resolve(true);
        } else {
          patch(
            null,
            newBranch,
            suspense.hiddenContainer,
            null,
            parentComponent,
            suspense,
            isSVG,
            slotScopeIds,
            optimized
          );
          if (suspense.deps <= 0) {
            suspense.resolve();
          }
        }
      }
    } else {
      if (activeBranch && isSameVNodeType(newBranch, activeBranch)) {
        patch(
          activeBranch,
          newBranch,
          container,
          anchor,
          parentComponent,
          suspense,
          isSVG,
          slotScopeIds,
          optimized
        );
        setActiveBranch(suspense, newBranch);
      } else {
        triggerEvent(n2, "onPending");
        suspense.pendingBranch = newBranch;
        suspense.pendingId++;
        patch(
          null,
          newBranch,
          suspense.hiddenContainer,
          null,
          parentComponent,
          suspense,
          isSVG,
          slotScopeIds,
          optimized
        );
        if (suspense.deps <= 0) {
          suspense.resolve();
        } else {
          const { timeout, pendingId } = suspense;
          if (timeout > 0) {
            setTimeout(() => {
              if (suspense.pendingId === pendingId) {
                suspense.fallback(newFallback);
              }
            }, timeout);
          } else if (timeout === 0) {
            suspense.fallback(newFallback);
          }
        }
      }
    }
  }
  let hasWarned = false;
  function createSuspenseBoundary(vnode, parentSuspense, parentComponent, container, hiddenContainer, anchor, isSVG, slotScopeIds, optimized, rendererInternals, isHydrating = false) {
    if (!hasWarned) {
      hasWarned = true;
      console[console.info ? "info" : "log"](
        `<Suspense> is an experimental feature and its API will likely change.`
      );
    }
    const {
      p: patch,
      m: move,
      um: unmount,
      n: next,
      o: { parentNode, remove }
    } = rendererInternals;
    let parentSuspenseId;
    const isSuspensible = isVNodeSuspensible(vnode);
    if (isSuspensible) {
      if (parentSuspense == null ? void 0 : parentSuspense.pendingBranch) {
        parentSuspenseId = parentSuspense.pendingId;
        parentSuspense.deps++;
      }
    }
    const timeout = vnode.props ? toNumber(vnode.props.timeout) : void 0;
    const suspense = {
      vnode,
      parent: parentSuspense,
      parentComponent,
      isSVG,
      container,
      hiddenContainer,
      anchor,
      deps: 0,
      pendingId: 0,
      timeout: typeof timeout === "number" ? timeout : -1,
      activeBranch: null,
      pendingBranch: null,
      isInFallback: true,
      isHydrating,
      isUnmounted: false,
      effects: [],
      resolve(resume = false, sync = false) {
        {
          if (!resume && !suspense.pendingBranch) {
            throw new Error(
              `suspense.resolve() is called without a pending branch.`
            );
          }
          if (suspense.isUnmounted) {
            throw new Error(
              `suspense.resolve() is called on an already unmounted suspense boundary.`
            );
          }
        }
        const {
          vnode: vnode2,
          activeBranch,
          pendingBranch,
          pendingId,
          effects,
          parentComponent: parentComponent2,
          container: container2
        } = suspense;
        if (suspense.isHydrating) {
          suspense.isHydrating = false;
        } else if (!resume) {
          const delayEnter = activeBranch && pendingBranch.transition && pendingBranch.transition.mode === "out-in";
          if (delayEnter) {
            activeBranch.transition.afterLeave = () => {
              if (pendingId === suspense.pendingId) {
                move(pendingBranch, container2, anchor2, 0);
              }
            };
          }
          let { anchor: anchor2 } = suspense;
          if (activeBranch) {
            anchor2 = next(activeBranch);
            unmount(activeBranch, parentComponent2, suspense, true);
          }
          if (!delayEnter) {
            move(pendingBranch, container2, anchor2, 0);
          }
        }
        setActiveBranch(suspense, pendingBranch);
        suspense.pendingBranch = null;
        suspense.isInFallback = false;
        let parent = suspense.parent;
        let hasUnresolvedAncestor = false;
        while (parent) {
          if (parent.pendingBranch) {
            parent.effects.push(...effects);
            hasUnresolvedAncestor = true;
            break;
          }
          parent = parent.parent;
        }
        if (!hasUnresolvedAncestor) {
          queuePostFlushCb(effects);
        }
        suspense.effects = [];
        if (isSuspensible) {
          if (parentSuspense && parentSuspense.pendingBranch && parentSuspenseId === parentSuspense.pendingId) {
            parentSuspense.deps--;
            if (parentSuspense.deps === 0 && !sync) {
              parentSuspense.resolve();
            }
          }
        }
        triggerEvent(vnode2, "onResolve");
      },
      fallback(fallbackVNode) {
        if (!suspense.pendingBranch) {
          return;
        }
        const { vnode: vnode2, activeBranch, parentComponent: parentComponent2, container: container2, isSVG: isSVG2 } = suspense;
        triggerEvent(vnode2, "onFallback");
        const anchor2 = next(activeBranch);
        const mountFallback = () => {
          if (!suspense.isInFallback) {
            return;
          }
          patch(
            null,
            fallbackVNode,
            container2,
            anchor2,
            parentComponent2,
            null,
            // fallback tree will not have suspense context
            isSVG2,
            slotScopeIds,
            optimized
          );
          setActiveBranch(suspense, fallbackVNode);
        };
        const delayEnter = fallbackVNode.transition && fallbackVNode.transition.mode === "out-in";
        if (delayEnter) {
          activeBranch.transition.afterLeave = mountFallback;
        }
        suspense.isInFallback = true;
        unmount(
          activeBranch,
          parentComponent2,
          null,
          // no suspense so unmount hooks fire now
          true
          // shouldRemove
        );
        if (!delayEnter) {
          mountFallback();
        }
      },
      move(container2, anchor2, type) {
        suspense.activeBranch && move(suspense.activeBranch, container2, anchor2, type);
        suspense.container = container2;
      },
      next() {
        return suspense.activeBranch && next(suspense.activeBranch);
      },
      registerDep(instance, setupRenderEffect) {
        const isInPendingSuspense = !!suspense.pendingBranch;
        if (isInPendingSuspense) {
          suspense.deps++;
        }
        const hydratedEl = instance.vnode.el;
        instance.asyncDep.catch((err) => {
          handleError(err, instance, 0);
        }).then((asyncSetupResult) => {
          if (instance.isUnmounted || suspense.isUnmounted || suspense.pendingId !== instance.suspenseId) {
            return;
          }
          instance.asyncResolved = true;
          const { vnode: vnode2 } = instance;
          handleSetupResult(instance, asyncSetupResult, false);
          if (hydratedEl) {
            vnode2.el = hydratedEl;
          }
          const placeholder = !hydratedEl && instance.subTree.el;
          setupRenderEffect(
            instance,
            vnode2,
            // component may have been moved before resolve.
            // if this is not a hydration, instance.subTree will be the comment
            // placeholder.
            parentNode(hydratedEl || instance.subTree.el),
            // anchor will not be used if this is hydration, so only need to
            // consider the comment placeholder case.
            hydratedEl ? null : next(instance.subTree),
            suspense,
            isSVG,
            optimized
          );
          if (placeholder) {
            remove(placeholder);
          }
          updateHOCHostEl(instance, vnode2.el);
          if (isInPendingSuspense && --suspense.deps === 0) {
            suspense.resolve();
          }
        });
      },
      unmount(parentSuspense2, doRemove) {
        suspense.isUnmounted = true;
        if (suspense.activeBranch) {
          unmount(
            suspense.activeBranch,
            parentComponent,
            parentSuspense2,
            doRemove
          );
        }
        if (suspense.pendingBranch) {
          unmount(
            suspense.pendingBranch,
            parentComponent,
            parentSuspense2,
            doRemove
          );
        }
      }
    };
    return suspense;
  }
  function hydrateSuspense(node, vnode, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, rendererInternals, hydrateNode) {
    const suspense = vnode.suspense = createSuspenseBoundary(
      vnode,
      parentSuspense,
      parentComponent,
      node.parentNode,
      document.createElement("div"),
      null,
      isSVG,
      slotScopeIds,
      optimized,
      rendererInternals,
      true
      /* hydrating */
    );
    const result = hydrateNode(
      node,
      suspense.pendingBranch = vnode.ssContent,
      parentComponent,
      suspense,
      slotScopeIds,
      optimized
    );
    if (suspense.deps === 0) {
      suspense.resolve(false, true);
    }
    return result;
  }
  function normalizeSuspenseChildren(vnode) {
    const { shapeFlag, children } = vnode;
    const isSlotChildren = shapeFlag & 32;
    vnode.ssContent = normalizeSuspenseSlot(
      isSlotChildren ? children.default : children
    );
    vnode.ssFallback = isSlotChildren ? normalizeSuspenseSlot(children.fallback) : createVNode(Comment);
  }
  function normalizeSuspenseSlot(s) {
    let block;
    if (isFunction(s)) {
      const trackBlock = isBlockTreeEnabled && s._c;
      if (trackBlock) {
        s._d = false;
        openBlock();
      }
      s = s();
      if (trackBlock) {
        s._d = true;
        block = currentBlock;
        closeBlock();
      }
    }
    if (isArray$1(s)) {
      const singleChild = filterSingleRoot(s);
      s = singleChild;
    }
    s = normalizeVNode(s);
    if (block && !s.dynamicChildren) {
      s.dynamicChildren = block.filter((c) => c !== s);
    }
    return s;
  }
  function queueEffectWithSuspense(fn, suspense) {
    if (suspense && suspense.pendingBranch) {
      if (isArray$1(fn)) {
        suspense.effects.push(...fn);
      } else {
        suspense.effects.push(fn);
      }
    } else {
      queuePostFlushCb(fn);
    }
  }
  function setActiveBranch(suspense, branch) {
    suspense.activeBranch = branch;
    const { vnode, parentComponent } = suspense;
    const el = vnode.el = branch.el;
    if (parentComponent && parentComponent.subTree === vnode) {
      parentComponent.vnode.el = el;
      updateHOCHostEl(parentComponent, el);
    }
  }
  function isVNodeSuspensible(vnode) {
    var _a;
    return ((_a = vnode.props) == null ? void 0 : _a.suspensible) != null && vnode.props.suspensible !== false;
  }

  function watchEffect(effect, options) {
    return doWatch(effect, null, options);
  }
  function watchPostEffect(effect, options) {
    return doWatch(
      effect,
      null,
      extend({}, options, { flush: "post" }) 
    );
  }
  function watchSyncEffect(effect, options) {
    return doWatch(
      effect,
      null,
      extend({}, options, { flush: "sync" }) 
    );
  }
  const INITIAL_WATCHER_VALUE = {};
  function watch(source, cb, options) {
    if (!isFunction(cb)) ;
    return doWatch(source, cb, options);
  }
  function doWatch(source, cb, { immediate, deep, flush, onTrack, onTrigger } = EMPTY_OBJ) {
    var _a;
    const instance = getCurrentScope() === ((_a = currentInstance) == null ? void 0 : _a.scope) ? currentInstance : null;
    let getter;
    let forceTrigger = false;
    let isMultiSource = false;
    if (isRef(source)) {
      getter = () => source.value;
      forceTrigger = isShallow(source);
    } else if (isReactive(source)) {
      getter = () => source;
      deep = true;
    } else if (isArray$1(source)) {
      isMultiSource = true;
      forceTrigger = source.some((s) => isReactive(s) || isShallow(s));
      getter = () => source.map((s) => {
        if (isRef(s)) {
          return s.value;
        } else if (isReactive(s)) {
          return traverse(s);
        } else if (isFunction(s)) {
          return callWithErrorHandling(s, instance, 2);
        } else ;
      });
    } else if (isFunction(source)) {
      if (cb) {
        getter = () => callWithErrorHandling(source, instance, 2);
      } else {
        getter = () => {
          if (instance && instance.isUnmounted) {
            return;
          }
          if (cleanup) {
            cleanup();
          }
          return callWithAsyncErrorHandling(
            source,
            instance,
            3,
            [onCleanup]
          );
        };
      }
    } else {
      getter = NOOP;
    }
    if (cb && deep) {
      const baseGetter = getter;
      getter = () => traverse(baseGetter());
    }
    let cleanup;
    let onCleanup = (fn) => {
      cleanup = effect.onStop = () => {
        callWithErrorHandling(fn, instance, 4);
      };
    };
    let ssrCleanup;
    if (isInSSRComponentSetup) {
      onCleanup = NOOP;
      if (!cb) {
        getter();
      } else if (immediate) {
        callWithAsyncErrorHandling(cb, instance, 3, [
          getter(),
          isMultiSource ? [] : void 0,
          onCleanup
        ]);
      }
      if (flush === "sync") {
        const ctx = useSSRContext();
        ssrCleanup = ctx.__watcherHandles || (ctx.__watcherHandles = []);
      } else {
        return NOOP;
      }
    }
    let oldValue = isMultiSource ? new Array(source.length).fill(INITIAL_WATCHER_VALUE) : INITIAL_WATCHER_VALUE;
    const job = () => {
      if (!effect.active) {
        return;
      }
      if (cb) {
        const newValue = effect.run();
        if (deep || forceTrigger || (isMultiSource ? newValue.some(
          (v, i) => hasChanged(v, oldValue[i])
        ) : hasChanged(newValue, oldValue)) || false) {
          if (cleanup) {
            cleanup();
          }
          callWithAsyncErrorHandling(cb, instance, 3, [
            newValue,
            // pass undefined as the old value when it's changed for the first time
            oldValue === INITIAL_WATCHER_VALUE ? void 0 : isMultiSource && oldValue[0] === INITIAL_WATCHER_VALUE ? [] : oldValue,
            onCleanup
          ]);
          oldValue = newValue;
        }
      } else {
        effect.run();
      }
    };
    job.allowRecurse = !!cb;
    let scheduler;
    if (flush === "sync") {
      scheduler = job;
    } else if (flush === "post") {
      scheduler = () => queuePostRenderEffect(job, instance && instance.suspense);
    } else {
      job.pre = true;
      if (instance)
        job.id = instance.uid;
      scheduler = () => queueJob(job);
    }
    const effect = new ReactiveEffect(getter, scheduler);
    {
      effect.onTrack = onTrack;
      effect.onTrigger = onTrigger;
    }
    if (cb) {
      if (immediate) {
        job();
      } else {
        oldValue = effect.run();
      }
    } else if (flush === "post") {
      queuePostRenderEffect(
        effect.run.bind(effect),
        instance && instance.suspense
      );
    } else {
      effect.run();
    }
    const unwatch = () => {
      effect.stop();
      if (instance && instance.scope) {
        remove(instance.scope.effects, effect);
      }
    };
    if (ssrCleanup)
      ssrCleanup.push(unwatch);
    return unwatch;
  }
  function traverse(value, seen) {
    if (!isObject$1(value) || value["__v_skip"]) {
      return value;
    }
    seen = seen || /* @__PURE__ */ new Set();
    if (seen.has(value)) {
      return value;
    }
    seen.add(value);
    if (isRef(value)) {
      traverse(value.value, seen);
    } else if (isArray$1(value)) {
      for (let i = 0; i < value.length; i++) {
        traverse(value[i], seen);
      }
    } else if (isSet(value) || isMap(value)) {
      value.forEach((v) => {
        traverse(v, seen);
      });
    } else if (isPlainObject$1(value)) {
      for (const key in value) {
        traverse(value[key], seen);
      }
    }
    return value;
  }

  function validateDirectiveName(name) {
    if (isBuiltInDirective(name)) ;
  }
  function withDirectives(vnode, directives) {
    const internalInstance = currentRenderingInstance;
    if (internalInstance === null) {
      return vnode;
    }
    const instance = getExposeProxy(internalInstance) || internalInstance.proxy;
    const bindings = vnode.dirs || (vnode.dirs = []);
    for (let i = 0; i < directives.length; i++) {
      let [dir, value, arg, modifiers = EMPTY_OBJ] = directives[i];
      if (dir) {
        if (isFunction(dir)) {
          dir = {
            mounted: dir,
            updated: dir
          };
        }
        if (dir.deep) {
          traverse(value);
        }
        bindings.push({
          dir,
          instance,
          value,
          oldValue: void 0,
          arg,
          modifiers
        });
      }
    }
    return vnode;
  }
  function invokeDirectiveHook(vnode, prevVNode, instance, name) {
    const bindings = vnode.dirs;
    const oldBindings = prevVNode && prevVNode.dirs;
    for (let i = 0; i < bindings.length; i++) {
      const binding = bindings[i];
      if (oldBindings) {
        binding.oldValue = oldBindings[i].value;
      }
      let hook = binding.dir[name];
      if (hook) {
        pauseTracking();
        callWithAsyncErrorHandling(hook, instance, 8, [
          vnode.el,
          binding,
          vnode,
          prevVNode
        ]);
        resetTracking();
      }
    }
  }

  function useTransitionState() {
    const state = {
      isMounted: false,
      isLeaving: false,
      isUnmounting: false,
      leavingVNodes: /* @__PURE__ */ new Map()
    };
    onMounted(() => {
      state.isMounted = true;
    });
    onBeforeUnmount(() => {
      state.isUnmounting = true;
    });
    return state;
  }
  const TransitionHookValidator = [Function, Array];
  const BaseTransitionPropsValidators = {
    mode: String,
    appear: Boolean,
    persisted: Boolean,
    // enter
    onBeforeEnter: TransitionHookValidator,
    onEnter: TransitionHookValidator,
    onAfterEnter: TransitionHookValidator,
    onEnterCancelled: TransitionHookValidator,
    // leave
    onBeforeLeave: TransitionHookValidator,
    onLeave: TransitionHookValidator,
    onAfterLeave: TransitionHookValidator,
    onLeaveCancelled: TransitionHookValidator,
    // appear
    onBeforeAppear: TransitionHookValidator,
    onAppear: TransitionHookValidator,
    onAfterAppear: TransitionHookValidator,
    onAppearCancelled: TransitionHookValidator
  };
  const BaseTransitionImpl = {
    name: `BaseTransition`,
    props: BaseTransitionPropsValidators,
    setup(props, { slots }) {
      const instance = getCurrentInstance();
      const state = useTransitionState();
      let prevTransitionKey;
      return () => {
        const children = slots.default && getTransitionRawChildren(slots.default(), true);
        if (!children || !children.length) {
          return;
        }
        let child = children[0];
        if (children.length > 1) {
          let hasFound = false;
          for (const c of children) {
            if (c.type !== Comment) {
              if (hasFound) {
                break;
              }
              child = c;
              hasFound = true;
              break;
            }
          }
        }
        const rawProps = toRaw(props);
        const { mode } = rawProps;
        if (state.isLeaving) {
          return emptyPlaceholder(child);
        }
        const innerChild = getKeepAliveChild(child);
        if (!innerChild) {
          return emptyPlaceholder(child);
        }
        const enterHooks = resolveTransitionHooks(
          innerChild,
          rawProps,
          state,
          instance
        );
        setTransitionHooks(innerChild, enterHooks);
        const oldChild = instance.subTree;
        const oldInnerChild = oldChild && getKeepAliveChild(oldChild);
        let transitionKeyChanged = false;
        const { getTransitionKey } = innerChild.type;
        if (getTransitionKey) {
          const key = getTransitionKey();
          if (prevTransitionKey === void 0) {
            prevTransitionKey = key;
          } else if (key !== prevTransitionKey) {
            prevTransitionKey = key;
            transitionKeyChanged = true;
          }
        }
        if (oldInnerChild && oldInnerChild.type !== Comment && (!isSameVNodeType(innerChild, oldInnerChild) || transitionKeyChanged)) {
          const leavingHooks = resolveTransitionHooks(
            oldInnerChild,
            rawProps,
            state,
            instance
          );
          setTransitionHooks(oldInnerChild, leavingHooks);
          if (mode === "out-in") {
            state.isLeaving = true;
            leavingHooks.afterLeave = () => {
              state.isLeaving = false;
              if (instance.update.active !== false) {
                instance.update();
              }
            };
            return emptyPlaceholder(child);
          } else if (mode === "in-out" && innerChild.type !== Comment) {
            leavingHooks.delayLeave = (el, earlyRemove, delayedLeave) => {
              const leavingVNodesCache = getLeavingNodesForType(
                state,
                oldInnerChild
              );
              leavingVNodesCache[String(oldInnerChild.key)] = oldInnerChild;
              el._leaveCb = () => {
                earlyRemove();
                el._leaveCb = void 0;
                delete enterHooks.delayedLeave;
              };
              enterHooks.delayedLeave = delayedLeave;
            };
          }
        }
        return child;
      };
    }
  };
  const BaseTransition = BaseTransitionImpl;
  function getLeavingNodesForType(state, vnode) {
    const { leavingVNodes } = state;
    let leavingVNodesCache = leavingVNodes.get(vnode.type);
    if (!leavingVNodesCache) {
      leavingVNodesCache = /* @__PURE__ */ Object.create(null);
      leavingVNodes.set(vnode.type, leavingVNodesCache);
    }
    return leavingVNodesCache;
  }
  function resolveTransitionHooks(vnode, props, state, instance) {
    const {
      appear,
      mode,
      persisted = false,
      onBeforeEnter,
      onEnter,
      onAfterEnter,
      onEnterCancelled,
      onBeforeLeave,
      onLeave,
      onAfterLeave,
      onLeaveCancelled,
      onBeforeAppear,
      onAppear,
      onAfterAppear,
      onAppearCancelled
    } = props;
    const key = String(vnode.key);
    const leavingVNodesCache = getLeavingNodesForType(state, vnode);
    const callHook = (hook, args) => {
      hook && callWithAsyncErrorHandling(
        hook,
        instance,
        9,
        args
      );
    };
    const callAsyncHook = (hook, args) => {
      const done = args[1];
      callHook(hook, args);
      if (isArray$1(hook)) {
        if (hook.every((hook2) => hook2.length <= 1))
          done();
      } else if (hook.length <= 1) {
        done();
      }
    };
    const hooks = {
      mode,
      persisted,
      beforeEnter(el) {
        let hook = onBeforeEnter;
        if (!state.isMounted) {
          if (appear) {
            hook = onBeforeAppear || onBeforeEnter;
          } else {
            return;
          }
        }
        if (el._leaveCb) {
          el._leaveCb(
            true
            /* cancelled */
          );
        }
        const leavingVNode = leavingVNodesCache[key];
        if (leavingVNode && isSameVNodeType(vnode, leavingVNode) && leavingVNode.el._leaveCb) {
          leavingVNode.el._leaveCb();
        }
        callHook(hook, [el]);
      },
      enter(el) {
        let hook = onEnter;
        let afterHook = onAfterEnter;
        let cancelHook = onEnterCancelled;
        if (!state.isMounted) {
          if (appear) {
            hook = onAppear || onEnter;
            afterHook = onAfterAppear || onAfterEnter;
            cancelHook = onAppearCancelled || onEnterCancelled;
          } else {
            return;
          }
        }
        let called = false;
        const done = el._enterCb = (cancelled) => {
          if (called)
            return;
          called = true;
          if (cancelled) {
            callHook(cancelHook, [el]);
          } else {
            callHook(afterHook, [el]);
          }
          if (hooks.delayedLeave) {
            hooks.delayedLeave();
          }
          el._enterCb = void 0;
        };
        if (hook) {
          callAsyncHook(hook, [el, done]);
        } else {
          done();
        }
      },
      leave(el, remove) {
        const key2 = String(vnode.key);
        if (el._enterCb) {
          el._enterCb(
            true
            /* cancelled */
          );
        }
        if (state.isUnmounting) {
          return remove();
        }
        callHook(onBeforeLeave, [el]);
        let called = false;
        const done = el._leaveCb = (cancelled) => {
          if (called)
            return;
          called = true;
          remove();
          if (cancelled) {
            callHook(onLeaveCancelled, [el]);
          } else {
            callHook(onAfterLeave, [el]);
          }
          el._leaveCb = void 0;
          if (leavingVNodesCache[key2] === vnode) {
            delete leavingVNodesCache[key2];
          }
        };
        leavingVNodesCache[key2] = vnode;
        if (onLeave) {
          callAsyncHook(onLeave, [el, done]);
        } else {
          done();
        }
      },
      clone(vnode2) {
        return resolveTransitionHooks(vnode2, props, state, instance);
      }
    };
    return hooks;
  }
  function emptyPlaceholder(vnode) {
    if (isKeepAlive(vnode)) {
      vnode = cloneVNode(vnode);
      vnode.children = null;
      return vnode;
    }
  }
  function getKeepAliveChild(vnode) {
    return isKeepAlive(vnode) ? vnode.children ? vnode.children[0] : void 0 : vnode;
  }
  function setTransitionHooks(vnode, hooks) {
    if (vnode.shapeFlag & 6 && vnode.component) {
      setTransitionHooks(vnode.component.subTree, hooks);
    } else if (vnode.shapeFlag & 128) {
      vnode.ssContent.transition = hooks.clone(vnode.ssContent);
      vnode.ssFallback.transition = hooks.clone(vnode.ssFallback);
    } else {
      vnode.transition = hooks;
    }
  }
  function getTransitionRawChildren(children, keepComment = false, parentKey) {
    let ret = [];
    let keyedFragmentCount = 0;
    for (let i = 0; i < children.length; i++) {
      let child = children[i];
      const key = parentKey == null ? child.key : String(parentKey) + String(child.key != null ? child.key : i);
      if (child.type === Fragment) {
        if (child.patchFlag & 128)
          keyedFragmentCount++;
        ret = ret.concat(
          getTransitionRawChildren(child.children, keepComment, key)
        );
      } else if (keepComment || child.type !== Comment) {
        ret.push(key != null ? cloneVNode(child, { key }) : child);
      }
    }
    if (keyedFragmentCount > 1) {
      for (let i = 0; i < ret.length; i++) {
        ret[i].patchFlag = -2;
      }
    }
    return ret;
  }

  function defineComponent(options, extraOptions) {
    return isFunction(options) ? (
      // #8326: extend call and options.name access are considered side-effects
      // by Rollup, so we have to wrap it in a pure-annotated IIFE.
      /* @__PURE__ */ (() => extend({ name: options.name }, extraOptions, { setup: options }))()
    ) : options;
  }

  const isAsyncWrapper = (i) => !!i.type.__asyncLoader;
  function defineAsyncComponent(source) {
    if (isFunction(source)) {
      source = { loader: source };
    }
    const {
      loader,
      loadingComponent,
      errorComponent,
      delay = 200,
      timeout,
      // undefined = never times out
      suspensible = true,
      onError: userOnError
    } = source;
    let pendingRequest = null;
    let resolvedComp;
    let retries = 0;
    const retry = () => {
      retries++;
      pendingRequest = null;
      return load();
    };
    const load = () => {
      let thisRequest;
      return pendingRequest || (thisRequest = pendingRequest = loader().catch((err) => {
        err = err instanceof Error ? err : new Error(String(err));
        if (userOnError) {
          return new Promise((resolve, reject) => {
            const userRetry = () => resolve(retry());
            const userFail = () => reject(err);
            userOnError(err, userRetry, userFail, retries + 1);
          });
        } else {
          throw err;
        }
      }).then((comp) => {
        if (thisRequest !== pendingRequest && pendingRequest) {
          return pendingRequest;
        }
        if (comp && (comp.__esModule || comp[Symbol.toStringTag] === "Module")) {
          comp = comp.default;
        }
        if (comp && !isObject$1(comp) && !isFunction(comp)) {
          throw new Error(`Invalid async component load result: ${comp}`);
        }
        resolvedComp = comp;
        return comp;
      }));
    };
    return defineComponent({
      name: "AsyncComponentWrapper",
      __asyncLoader: load,
      get __asyncResolved() {
        return resolvedComp;
      },
      setup() {
        const instance = currentInstance;
        if (resolvedComp) {
          return () => createInnerComp(resolvedComp, instance);
        }
        const onError = (err) => {
          pendingRequest = null;
          handleError(
            err,
            instance,
            13,
            !errorComponent
            /* do not throw in dev if user provided error component */
          );
        };
        if (suspensible && instance.suspense || isInSSRComponentSetup) {
          return load().then((comp) => {
            return () => createInnerComp(comp, instance);
          }).catch((err) => {
            onError(err);
            return () => errorComponent ? createVNode(errorComponent, {
              error: err
            }) : null;
          });
        }
        const loaded = ref(false);
        const error = ref();
        const delayed = ref(!!delay);
        if (delay) {
          setTimeout(() => {
            delayed.value = false;
          }, delay);
        }
        if (timeout != null) {
          setTimeout(() => {
            if (!loaded.value && !error.value) {
              const err = new Error(
                `Async component timed out after ${timeout}ms.`
              );
              onError(err);
              error.value = err;
            }
          }, timeout);
        }
        load().then(() => {
          loaded.value = true;
          if (instance.parent && isKeepAlive(instance.parent.vnode)) {
            queueJob(instance.parent.update);
          }
        }).catch((err) => {
          onError(err);
          error.value = err;
        });
        return () => {
          if (loaded.value && resolvedComp) {
            return createInnerComp(resolvedComp, instance);
          } else if (error.value && errorComponent) {
            return createVNode(errorComponent, {
              error: error.value
            });
          } else if (loadingComponent && !delayed.value) {
            return createVNode(loadingComponent);
          }
        };
      }
    });
  }
  function createInnerComp(comp, parent) {
    const { ref: ref2, props, children, ce } = parent.vnode;
    const vnode = createVNode(comp, props, children);
    vnode.ref = ref2;
    vnode.ce = ce;
    delete parent.vnode.ce;
    return vnode;
  }

  const isKeepAlive = (vnode) => vnode.type.__isKeepAlive;
  const KeepAliveImpl = {
    name: `KeepAlive`,
    // Marker for special handling inside the renderer. We are not using a ===
    // check directly on KeepAlive in the renderer, because importing it directly
    // would prevent it from being tree-shaken.
    __isKeepAlive: true,
    props: {
      include: [String, RegExp, Array],
      exclude: [String, RegExp, Array],
      max: [String, Number]
    },
    setup(props, { slots }) {
      const instance = getCurrentInstance();
      const sharedContext = instance.ctx;
      if (!sharedContext.renderer) {
        return () => {
          const children = slots.default && slots.default();
          return children && children.length === 1 ? children[0] : children;
        };
      }
      const cache = /* @__PURE__ */ new Map();
      const keys = /* @__PURE__ */ new Set();
      let current = null;
      {
        instance.__v_cache = cache;
      }
      const parentSuspense = instance.suspense;
      const {
        renderer: {
          p: patch,
          m: move,
          um: _unmount,
          o: { createElement }
        }
      } = sharedContext;
      const storageContainer = createElement("div");
      sharedContext.activate = (vnode, container, anchor, isSVG, optimized) => {
        const instance2 = vnode.component;
        move(vnode, container, anchor, 0, parentSuspense);
        patch(
          instance2.vnode,
          vnode,
          container,
          anchor,
          instance2,
          parentSuspense,
          isSVG,
          vnode.slotScopeIds,
          optimized
        );
        queuePostRenderEffect(() => {
          instance2.isDeactivated = false;
          if (instance2.a) {
            invokeArrayFns(instance2.a);
          }
          const vnodeHook = vnode.props && vnode.props.onVnodeMounted;
          if (vnodeHook) {
            invokeVNodeHook(vnodeHook, instance2.parent, vnode);
          }
        }, parentSuspense);
        {
          devtoolsComponentAdded(instance2);
        }
      };
      sharedContext.deactivate = (vnode) => {
        const instance2 = vnode.component;
        move(vnode, storageContainer, null, 1, parentSuspense);
        queuePostRenderEffect(() => {
          if (instance2.da) {
            invokeArrayFns(instance2.da);
          }
          const vnodeHook = vnode.props && vnode.props.onVnodeUnmounted;
          if (vnodeHook) {
            invokeVNodeHook(vnodeHook, instance2.parent, vnode);
          }
          instance2.isDeactivated = true;
        }, parentSuspense);
        {
          devtoolsComponentAdded(instance2);
        }
      };
      function unmount(vnode) {
        resetShapeFlag(vnode);
        _unmount(vnode, instance, parentSuspense, true);
      }
      function pruneCache(filter) {
        cache.forEach((vnode, key) => {
          const name = getComponentName(vnode.type);
          if (name && (!filter || !filter(name))) {
            pruneCacheEntry(key);
          }
        });
      }
      function pruneCacheEntry(key) {
        const cached = cache.get(key);
        if (!current || !isSameVNodeType(cached, current)) {
          unmount(cached);
        } else if (current) {
          resetShapeFlag(current);
        }
        cache.delete(key);
        keys.delete(key);
      }
      watch(
        () => [props.include, props.exclude],
        ([include, exclude]) => {
          include && pruneCache((name) => matches(include, name));
          exclude && pruneCache((name) => !matches(exclude, name));
        },
        // prune post-render after `current` has been updated
        { flush: "post", deep: true }
      );
      let pendingCacheKey = null;
      const cacheSubtree = () => {
        if (pendingCacheKey != null) {
          cache.set(pendingCacheKey, getInnerChild(instance.subTree));
        }
      };
      onMounted(cacheSubtree);
      onUpdated(cacheSubtree);
      onBeforeUnmount(() => {
        cache.forEach((cached) => {
          const { subTree, suspense } = instance;
          const vnode = getInnerChild(subTree);
          if (cached.type === vnode.type && cached.key === vnode.key) {
            resetShapeFlag(vnode);
            const da = vnode.component.da;
            da && queuePostRenderEffect(da, suspense);
            return;
          }
          unmount(cached);
        });
      });
      return () => {
        pendingCacheKey = null;
        if (!slots.default) {
          return null;
        }
        const children = slots.default();
        const rawVNode = children[0];
        if (children.length > 1) {
          current = null;
          return children;
        } else if (!isVNode(rawVNode) || !(rawVNode.shapeFlag & 4) && !(rawVNode.shapeFlag & 128)) {
          current = null;
          return rawVNode;
        }
        let vnode = getInnerChild(rawVNode);
        const comp = vnode.type;
        const name = getComponentName(
          isAsyncWrapper(vnode) ? vnode.type.__asyncResolved || {} : comp
        );
        const { include, exclude, max } = props;
        if (include && (!name || !matches(include, name)) || exclude && name && matches(exclude, name)) {
          current = vnode;
          return rawVNode;
        }
        const key = vnode.key == null ? comp : vnode.key;
        const cachedVNode = cache.get(key);
        if (vnode.el) {
          vnode = cloneVNode(vnode);
          if (rawVNode.shapeFlag & 128) {
            rawVNode.ssContent = vnode;
          }
        }
        pendingCacheKey = key;
        if (cachedVNode) {
          vnode.el = cachedVNode.el;
          vnode.component = cachedVNode.component;
          if (vnode.transition) {
            setTransitionHooks(vnode, vnode.transition);
          }
          vnode.shapeFlag |= 512;
          keys.delete(key);
          keys.add(key);
        } else {
          keys.add(key);
          if (max && keys.size > parseInt(max, 10)) {
            pruneCacheEntry(keys.values().next().value);
          }
        }
        vnode.shapeFlag |= 256;
        current = vnode;
        return isSuspense(rawVNode.type) ? rawVNode : vnode;
      };
    }
  };
  const KeepAlive = KeepAliveImpl;
  function matches(pattern, name) {
    if (isArray$1(pattern)) {
      return pattern.some((p) => matches(p, name));
    } else if (isString(pattern)) {
      return pattern.split(",").includes(name);
    } else if (isRegExp(pattern)) {
      return pattern.test(name);
    }
    return false;
  }
  function onActivated(hook, target) {
    registerKeepAliveHook(hook, "a", target);
  }
  function onDeactivated(hook, target) {
    registerKeepAliveHook(hook, "da", target);
  }
  function registerKeepAliveHook(hook, type, target = currentInstance) {
    const wrappedHook = hook.__wdc || (hook.__wdc = () => {
      let current = target;
      while (current) {
        if (current.isDeactivated) {
          return;
        }
        current = current.parent;
      }
      return hook();
    });
    injectHook(type, wrappedHook, target);
    if (target) {
      let current = target.parent;
      while (current && current.parent) {
        if (isKeepAlive(current.parent.vnode)) {
          injectToKeepAliveRoot(wrappedHook, type, target, current);
        }
        current = current.parent;
      }
    }
  }
  function injectToKeepAliveRoot(hook, type, target, keepAliveRoot) {
    const injected = injectHook(
      type,
      hook,
      keepAliveRoot,
      true
      /* prepend */
    );
    onUnmounted(() => {
      remove(keepAliveRoot[type], injected);
    }, target);
  }
  function resetShapeFlag(vnode) {
    vnode.shapeFlag &= ~256;
    vnode.shapeFlag &= ~512;
  }
  function getInnerChild(vnode) {
    return vnode.shapeFlag & 128 ? vnode.ssContent : vnode;
  }

  function injectHook(type, hook, target = currentInstance, prepend = false) {
    if (target) {
      const hooks = target[type] || (target[type] = []);
      const wrappedHook = hook.__weh || (hook.__weh = (...args) => {
        if (target.isUnmounted) {
          return;
        }
        pauseTracking();
        setCurrentInstance(target);
        const res = callWithAsyncErrorHandling(hook, target, type, args);
        unsetCurrentInstance();
        resetTracking();
        return res;
      });
      if (prepend) {
        hooks.unshift(wrappedHook);
      } else {
        hooks.push(wrappedHook);
      }
      return wrappedHook;
    } else {
      toHandlerKey(ErrorTypeStrings[type].replace(/ hook$/, ""));
    }
  }
  const createHook = (lifecycle) => (hook, target = currentInstance) => (
    // post-create lifecycle registrations are noops during SSR (except for serverPrefetch)
    (!isInSSRComponentSetup || lifecycle === "sp") && injectHook(lifecycle, (...args) => hook(...args), target)
  );
  const onBeforeMount = createHook("bm");
  const onMounted = createHook("m");
  const onBeforeUpdate = createHook("bu");
  const onUpdated = createHook("u");
  const onBeforeUnmount = createHook("bum");
  const onUnmounted = createHook("um");
  const onServerPrefetch = createHook("sp");
  const onRenderTriggered = createHook(
    "rtg"
  );
  const onRenderTracked = createHook(
    "rtc"
  );
  function onErrorCaptured(hook, target = currentInstance) {
    injectHook("ec", hook, target);
  }

  const COMPONENTS = "components";
  const DIRECTIVES = "directives";
  function resolveComponent(name, maybeSelfReference) {
    return resolveAsset(COMPONENTS, name, true, maybeSelfReference) || name;
  }
  const NULL_DYNAMIC_COMPONENT = Symbol.for("v-ndc");
  function resolveDynamicComponent(component) {
    if (isString(component)) {
      return resolveAsset(COMPONENTS, component, false) || component;
    } else {
      return component || NULL_DYNAMIC_COMPONENT;
    }
  }
  function resolveDirective(name) {
    return resolveAsset(DIRECTIVES, name);
  }
  function resolveAsset(type, name, warnMissing = true, maybeSelfReference = false) {
    const instance = currentRenderingInstance || currentInstance;
    if (instance) {
      const Component = instance.type;
      if (type === COMPONENTS) {
        const selfName = getComponentName(
          Component,
          false
          /* do not include inferred name to avoid breaking existing code */
        );
        if (selfName && (selfName === name || selfName === camelize(name) || selfName === capitalize(camelize(name)))) {
          return Component;
        }
      }
      const res = (
        // local registration
        // check instance[type] first which is resolved for options API
        resolve(instance[type] || Component[type], name) || // global registration
        resolve(instance.appContext[type], name)
      );
      if (!res && maybeSelfReference) {
        return Component;
      }
      if (warnMissing && !res) {
        const extra = type === COMPONENTS ? `
If this is a native custom element, make sure to exclude it from component resolution via compilerOptions.isCustomElement.` : ``;
        warn$1(`Failed to resolve ${type.slice(0, -1)}: ${name}${extra}`);
      }
      return res;
    } else {
      warn$1(
        `resolve${capitalize(type.slice(0, -1))} can only be used in render() or setup().`
      );
    }
  }
  function resolve(registry, name) {
    return registry && (registry[name] || registry[camelize(name)] || registry[capitalize(camelize(name))]);
  }

  function renderList(source, renderItem, cache, index) {
    let ret;
    const cached = cache && cache[index];
    if (isArray$1(source) || isString(source)) {
      ret = new Array(source.length);
      for (let i = 0, l = source.length; i < l; i++) {
        ret[i] = renderItem(source[i], i, void 0, cached && cached[i]);
      }
    } else if (typeof source === "number") {
      ret = new Array(source);
      for (let i = 0; i < source; i++) {
        ret[i] = renderItem(i + 1, i, void 0, cached && cached[i]);
      }
    } else if (isObject$1(source)) {
      if (source[Symbol.iterator]) {
        ret = Array.from(
          source,
          (item, i) => renderItem(item, i, void 0, cached && cached[i])
        );
      } else {
        const keys = Object.keys(source);
        ret = new Array(keys.length);
        for (let i = 0, l = keys.length; i < l; i++) {
          const key = keys[i];
          ret[i] = renderItem(source[key], key, i, cached && cached[i]);
        }
      }
    } else {
      ret = [];
    }
    if (cache) {
      cache[index] = ret;
    }
    return ret;
  }

  function createSlots(slots, dynamicSlots) {
    for (let i = 0; i < dynamicSlots.length; i++) {
      const slot = dynamicSlots[i];
      if (isArray$1(slot)) {
        for (let j = 0; j < slot.length; j++) {
          slots[slot[j].name] = slot[j].fn;
        }
      } else if (slot) {
        slots[slot.name] = slot.key ? (...args) => {
          const res = slot.fn(...args);
          if (res)
            res.key = slot.key;
          return res;
        } : slot.fn;
      }
    }
    return slots;
  }

  function renderSlot(slots, name, props = {}, fallback, noSlotted) {
    if (currentRenderingInstance.isCE || currentRenderingInstance.parent && isAsyncWrapper(currentRenderingInstance.parent) && currentRenderingInstance.parent.isCE) {
      if (name !== "default")
        props.name = name;
      return createVNode("slot", props, fallback && fallback());
    }
    let slot = slots[name];
    if (slot && slot.length > 1) {
      slot = () => [];
    }
    if (slot && slot._c) {
      slot._d = false;
    }
    openBlock();
    const validSlotContent = slot && ensureValidVNode(slot(props));
    const rendered = createBlock(
      Fragment,
      {
        key: props.key || // slot content array of a dynamic conditional slot may have a branch
        // key attached in the `createSlots` helper, respect that
        validSlotContent && validSlotContent.key || `_${name}`
      },
      validSlotContent || (fallback ? fallback() : []),
      validSlotContent && slots._ === 1 ? 64 : -2
    );
    if (!noSlotted && rendered.scopeId) {
      rendered.slotScopeIds = [rendered.scopeId + "-s"];
    }
    if (slot && slot._c) {
      slot._d = true;
    }
    return rendered;
  }
  function ensureValidVNode(vnodes) {
    return vnodes.some((child) => {
      if (!isVNode(child))
        return true;
      if (child.type === Comment)
        return false;
      if (child.type === Fragment && !ensureValidVNode(child.children))
        return false;
      return true;
    }) ? vnodes : null;
  }

  function toHandlers(obj, preserveCaseIfNecessary) {
    const ret = {};
    if (!isObject$1(obj)) {
      return ret;
    }
    for (const key in obj) {
      ret[preserveCaseIfNecessary && /[A-Z]/.test(key) ? `on:${key}` : toHandlerKey(key)] = obj[key];
    }
    return ret;
  }

  const getPublicInstance = (i) => {
    if (!i)
      return null;
    if (isStatefulComponent(i))
      return getExposeProxy(i) || i.proxy;
    return getPublicInstance(i.parent);
  };
  const publicPropertiesMap = (
    // Move PURE marker to new line to workaround compiler discarding it
    // due to type annotation
    /* @__PURE__ */ extend(/* @__PURE__ */ Object.create(null), {
      $: (i) => i,
      $el: (i) => i.vnode.el,
      $data: (i) => i.data,
      $props: (i) => shallowReadonly(i.props) ,
      $attrs: (i) => shallowReadonly(i.attrs) ,
      $slots: (i) => shallowReadonly(i.slots) ,
      $refs: (i) => shallowReadonly(i.refs) ,
      $parent: (i) => getPublicInstance(i.parent),
      $root: (i) => getPublicInstance(i.root),
      $emit: (i) => i.emit,
      $options: (i) => i.type,
      $forceUpdate: (i) => i.f || (i.f = () => queueJob(i.update)),
      $nextTick: (i) => i.n || (i.n = nextTick.bind(i.proxy)),
      $watch: (i) => NOOP
    })
  );
  const isReservedPrefix = (key) => key === "_" || key === "$";
  const hasSetupBinding = (state, key) => state !== EMPTY_OBJ && !state.__isScriptSetup && hasOwn(state, key);
  const PublicInstanceProxyHandlers = {
    get({ _: instance }, key) {
      const { ctx, setupState, data, props, accessCache, type, appContext } = instance;
      if (key === "__isVue") {
        return true;
      }
      let normalizedProps;
      if (key[0] !== "$") {
        const n = accessCache[key];
        if (n !== void 0) {
          switch (n) {
            case 1 /* SETUP */:
              return setupState[key];
            case 2 /* DATA */:
              return data[key];
            case 4 /* CONTEXT */:
              return ctx[key];
            case 3 /* PROPS */:
              return props[key];
          }
        } else if (hasSetupBinding(setupState, key)) {
          accessCache[key] = 1 /* SETUP */;
          return setupState[key];
        } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
          accessCache[key] = 2 /* DATA */;
          return data[key];
        } else if (
          // only cache other properties when instance has declared (thus stable)
          // props
          (normalizedProps = instance.propsOptions[0]) && hasOwn(normalizedProps, key)
        ) {
          accessCache[key] = 3 /* PROPS */;
          return props[key];
        } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
          accessCache[key] = 4 /* CONTEXT */;
          return ctx[key];
        } else {
          accessCache[key] = 0 /* OTHER */;
        }
      }
      const publicGetter = publicPropertiesMap[key];
      let cssModule, globalProperties;
      if (publicGetter) {
        if (key === "$attrs") {
          track(instance, "get", key);
          markAttrsAccessed();
        } else if (key === "$slots") {
          track(instance, "get", key);
        }
        return publicGetter(instance);
      } else if (
        // css module (injected by vue-loader)
        (cssModule = type.__cssModules) && (cssModule = cssModule[key])
      ) {
        return cssModule;
      } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
        accessCache[key] = 4 /* CONTEXT */;
        return ctx[key];
      } else if (
        // global properties
        globalProperties = appContext.config.globalProperties, hasOwn(globalProperties, key)
      ) {
        {
          return globalProperties[key];
        }
      } else if (currentRenderingInstance && (!isString(key) || // #1091 avoid internal isRef/isVNode checks on component instance leading
      // to infinite warning loop
      key.indexOf("__v") !== 0)) {
        if (data !== EMPTY_OBJ && isReservedPrefix(key[0]) && hasOwn(data, key)) {
          warn$1(
            `Property ${JSON.stringify(
            key
          )} must be accessed via $data because it starts with a reserved character ("$" or "_") and is not proxied on the render context.`
          );
        } else if (instance === currentRenderingInstance) {
          warn$1(
            `Property ${JSON.stringify(key)} was accessed during render but is not defined on instance.`
          );
        }
      }
    },
    set({ _: instance }, key, value) {
      const { data, setupState, ctx } = instance;
      if (hasSetupBinding(setupState, key)) {
        setupState[key] = value;
        return true;
      } else if (setupState.__isScriptSetup && hasOwn(setupState, key)) {
        return false;
      } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
        data[key] = value;
        return true;
      } else if (hasOwn(instance.props, key)) {
        return false;
      }
      if (key[0] === "$" && key.slice(1) in instance) {
        return false;
      } else {
        if (key in instance.appContext.config.globalProperties) {
          Object.defineProperty(ctx, key, {
            enumerable: true,
            configurable: true,
            value
          });
        } else {
          ctx[key] = value;
        }
      }
      return true;
    },
    has({
      _: { data, setupState, accessCache, ctx, appContext, propsOptions }
    }, key) {
      let normalizedProps;
      return !!accessCache[key] || data !== EMPTY_OBJ && hasOwn(data, key) || hasSetupBinding(setupState, key) || (normalizedProps = propsOptions[0]) && hasOwn(normalizedProps, key) || hasOwn(ctx, key) || hasOwn(publicPropertiesMap, key) || hasOwn(appContext.config.globalProperties, key);
    },
    defineProperty(target, key, descriptor) {
      if (descriptor.get != null) {
        target._.accessCache[key] = 0;
      } else if (hasOwn(descriptor, "value")) {
        this.set(target, key, descriptor.value, null);
      }
      return Reflect.defineProperty(target, key, descriptor);
    }
  };
  {
    PublicInstanceProxyHandlers.ownKeys = (target) => {
      return Reflect.ownKeys(target);
    };
  }
  const RuntimeCompiledPublicInstanceProxyHandlers = /* @__PURE__ */ extend(
    {},
    PublicInstanceProxyHandlers,
    {
      get(target, key) {
        if (key === Symbol.unscopables) {
          return;
        }
        return PublicInstanceProxyHandlers.get(target, key, target);
      },
      has(_, key) {
        const has = key[0] !== "_" && !isGloballyWhitelisted(key);
        if (!has && PublicInstanceProxyHandlers.has(_, key)) {
          warn$1(
            `Property ${JSON.stringify(
            key
          )} should not start with _ which is a reserved prefix for Vue internals.`
          );
        }
        return has;
      }
    }
  );
  function createDevRenderContext(instance) {
    const target = {};
    Object.defineProperty(target, `_`, {
      configurable: true,
      enumerable: false,
      get: () => instance
    });
    Object.keys(publicPropertiesMap).forEach((key) => {
      Object.defineProperty(target, key, {
        configurable: true,
        enumerable: false,
        get: () => publicPropertiesMap[key](instance),
        // intercepted by the proxy so no need for implementation,
        // but needed to prevent set errors
        set: NOOP
      });
    });
    return target;
  }
  function exposePropsOnRenderContext(instance) {
    const {
      ctx,
      propsOptions: [propsOptions]
    } = instance;
    if (propsOptions) {
      Object.keys(propsOptions).forEach((key) => {
        Object.defineProperty(ctx, key, {
          enumerable: true,
          configurable: true,
          get: () => instance.props[key],
          set: NOOP
        });
      });
    }
  }
  function exposeSetupStateOnRenderContext(instance) {
    const { ctx, setupState } = instance;
    Object.keys(toRaw(setupState)).forEach((key) => {
      if (!setupState.__isScriptSetup) {
        if (isReservedPrefix(key[0])) {
          warn$1(
            `setup() return property ${JSON.stringify(
            key
          )} should not start with "$" or "_" which are reserved prefixes for Vue internals.`
          );
          return;
        }
        Object.defineProperty(ctx, key, {
          enumerable: true,
          configurable: true,
          get: () => setupState[key],
          set: NOOP
        });
      }
    });
  }
  function defineProps() {
    return null;
  }
  function defineEmits() {
    return null;
  }
  function defineExpose(exposed) {
  }
  function defineOptions(options) {
  }
  function defineSlots() {
    return null;
  }
  function defineModel() {
  }
  function withDefaults(props, defaults) {
    return null;
  }
  function useSlots() {
    return getContext().slots;
  }
  function useAttrs() {
    return getContext().attrs;
  }
  function useModel(props, name, options) {
    const i = getCurrentInstance();
    if (!i) {
      return ref();
    }
    if (!i.propsOptions[0][name]) {
      return ref();
    }
    if (options && options.local) {
      const proxy = ref(props[name]);
      watch(
        () => props[name],
        (v) => proxy.value = v
      );
      watch(proxy, (value) => {
        if (value !== props[name]) {
          i.emit(`update:${name}`, value);
        }
      });
      return proxy;
    } else {
      return {
        __v_isRef: true,
        get value() {
          return props[name];
        },
        set value(value) {
          i.emit(`update:${name}`, value);
        }
      };
    }
  }
  function getContext() {
    const i = getCurrentInstance();
    return i.setupContext || (i.setupContext = createSetupContext(i));
  }
  function normalizePropsOrEmits(props) {
    return isArray$1(props) ? props.reduce(
      (normalized, p) => (normalized[p] = null, normalized),
      {}
    ) : props;
  }
  function mergeDefaults(raw, defaults) {
    const props = normalizePropsOrEmits(raw);
    for (const key in defaults) {
      if (key.startsWith("__skip"))
        continue;
      let opt = props[key];
      if (opt) {
        if (isArray$1(opt) || isFunction(opt)) {
          opt = props[key] = { type: opt, default: defaults[key] };
        } else {
          opt.default = defaults[key];
        }
      } else if (opt === null) {
        opt = props[key] = { default: defaults[key] };
      } else ;
      if (opt && defaults[`__skip_${key}`]) {
        opt.skipFactory = true;
      }
    }
    return props;
  }
  function mergeModels(a, b) {
    if (!a || !b)
      return a || b;
    if (isArray$1(a) && isArray$1(b))
      return a.concat(b);
    return extend({}, normalizePropsOrEmits(a), normalizePropsOrEmits(b));
  }
  function createPropsRestProxy(props, excludedKeys) {
    const ret = {};
    for (const key in props) {
      if (!excludedKeys.includes(key)) {
        Object.defineProperty(ret, key, {
          enumerable: true,
          get: () => props[key]
        });
      }
    }
    return ret;
  }
  function withAsyncContext(getAwaitable) {
    const ctx = getCurrentInstance();
    let awaitable = getAwaitable();
    unsetCurrentInstance();
    if (isPromise$1(awaitable)) {
      awaitable = awaitable.catch((e) => {
        setCurrentInstance(ctx);
        throw e;
      });
    }
    return [awaitable, () => setCurrentInstance(ctx)];
  }
  function resolveMergedOptions(instance) {
    const base = instance.type;
    const { mixins, extends: extendsOptions } = base;
    const {
      mixins: globalMixins,
      optionsCache: cache,
      config: { optionMergeStrategies }
    } = instance.appContext;
    const cached = cache.get(base);
    let resolved;
    if (cached) {
      resolved = cached;
    } else if (!globalMixins.length && !mixins && !extendsOptions) {
      {
        resolved = base;
      }
    } else {
      resolved = {};
      if (globalMixins.length) {
        globalMixins.forEach(
          (m) => mergeOptions$1(resolved, m, optionMergeStrategies, true)
        );
      }
      mergeOptions$1(resolved, base, optionMergeStrategies);
    }
    if (isObject$1(base)) {
      cache.set(base, resolved);
    }
    return resolved;
  }
  function mergeOptions$1(to, from, strats, asMixin = false) {
    const { mixins, extends: extendsOptions } = from;
    if (extendsOptions) {
      mergeOptions$1(to, extendsOptions, strats, true);
    }
    if (mixins) {
      mixins.forEach(
        (m) => mergeOptions$1(to, m, strats, true)
      );
    }
    for (const key in from) {
      if (asMixin && key === "expose") ; else {
        const strat = internalOptionMergeStrats[key] || strats && strats[key];
        to[key] = strat ? strat(to[key], from[key]) : from[key];
      }
    }
    return to;
  }
  const internalOptionMergeStrats = {
    data: mergeDataFn,
    props: mergeEmitsOrPropsOptions,
    emits: mergeEmitsOrPropsOptions,
    // objects
    methods: mergeObjectOptions,
    computed: mergeObjectOptions,
    // lifecycle
    beforeCreate: mergeAsArray,
    created: mergeAsArray,
    beforeMount: mergeAsArray,
    mounted: mergeAsArray,
    beforeUpdate: mergeAsArray,
    updated: mergeAsArray,
    beforeDestroy: mergeAsArray,
    beforeUnmount: mergeAsArray,
    destroyed: mergeAsArray,
    unmounted: mergeAsArray,
    activated: mergeAsArray,
    deactivated: mergeAsArray,
    errorCaptured: mergeAsArray,
    serverPrefetch: mergeAsArray,
    // assets
    components: mergeObjectOptions,
    directives: mergeObjectOptions,
    // watch
    watch: mergeWatchOptions,
    // provide / inject
    provide: mergeDataFn,
    inject: mergeInject
  };
  function mergeDataFn(to, from) {
    if (!from) {
      return to;
    }
    if (!to) {
      return from;
    }
    return function mergedDataFn() {
      return (extend)(
        isFunction(to) ? to.call(this, this) : to,
        isFunction(from) ? from.call(this, this) : from
      );
    };
  }
  function mergeInject(to, from) {
    return mergeObjectOptions(normalizeInject(to), normalizeInject(from));
  }
  function normalizeInject(raw) {
    if (isArray$1(raw)) {
      const res = {};
      for (let i = 0; i < raw.length; i++) {
        res[raw[i]] = raw[i];
      }
      return res;
    }
    return raw;
  }
  function mergeAsArray(to, from) {
    return to ? [...new Set([].concat(to, from))] : from;
  }
  function mergeObjectOptions(to, from) {
    return to ? extend(/* @__PURE__ */ Object.create(null), to, from) : from;
  }
  function mergeEmitsOrPropsOptions(to, from) {
    if (to) {
      if (isArray$1(to) && isArray$1(from)) {
        return [.../* @__PURE__ */ new Set([...to, ...from])];
      }
      return extend(
        /* @__PURE__ */ Object.create(null),
        normalizePropsOrEmits(to),
        normalizePropsOrEmits(from != null ? from : {})
      );
    } else {
      return from;
    }
  }
  function mergeWatchOptions(to, from) {
    if (!to)
      return from;
    if (!from)
      return to;
    const merged = extend(/* @__PURE__ */ Object.create(null), to);
    for (const key in from) {
      merged[key] = mergeAsArray(to[key], from[key]);
    }
    return merged;
  }

  function createAppContext() {
    return {
      app: null,
      config: {
        isNativeTag: NO,
        performance: false,
        globalProperties: {},
        optionMergeStrategies: {},
        errorHandler: void 0,
        warnHandler: void 0,
        compilerOptions: {}
      },
      mixins: [],
      components: {},
      directives: {},
      provides: /* @__PURE__ */ Object.create(null),
      optionsCache: /* @__PURE__ */ new WeakMap(),
      propsCache: /* @__PURE__ */ new WeakMap(),
      emitsCache: /* @__PURE__ */ new WeakMap()
    };
  }
  let uid$1 = 0;
  function createAppAPI(render, hydrate) {
    return function createApp(rootComponent, rootProps = null) {
      if (!isFunction(rootComponent)) {
        rootComponent = extend({}, rootComponent);
      }
      if (rootProps != null && !isObject$1(rootProps)) {
        rootProps = null;
      }
      const context = createAppContext();
      {
        Object.defineProperty(context.config, "unwrapInjectedRef", {
          get() {
            return true;
          },
          set() {
          }
        });
      }
      const installedPlugins = /* @__PURE__ */ new Set();
      let isMounted = false;
      const app = context.app = {
        _uid: uid$1++,
        _component: rootComponent,
        _props: rootProps,
        _container: null,
        _context: context,
        _instance: null,
        version,
        get config() {
          return context.config;
        },
        set config(v) {
        },
        use(plugin, ...options) {
          if (installedPlugins.has(plugin)) ; else if (plugin && isFunction(plugin.install)) {
            installedPlugins.add(plugin);
            plugin.install(app, ...options);
          } else if (isFunction(plugin)) {
            installedPlugins.add(plugin);
            plugin(app, ...options);
          } else ;
          return app;
        },
        mixin(mixin) {
          return app;
        },
        component(name, component) {
          {
            validateComponentName(name, context.config);
          }
          if (!component) {
            return context.components[name];
          }
          if (context.components[name]) ;
          context.components[name] = component;
          return app;
        },
        directive(name, directive) {
          {
            validateDirectiveName(name);
          }
          if (!directive) {
            return context.directives[name];
          }
          if (context.directives[name]) ;
          context.directives[name] = directive;
          return app;
        },
        mount(rootContainer, isHydrate, isSVG) {
          if (!isMounted) {
            if (rootContainer.__vue_app__) ;
            const vnode = createVNode(
              rootComponent,
              rootProps
            );
            vnode.appContext = context;
            {
              context.reload = () => {
                render(cloneVNode(vnode), rootContainer, isSVG);
              };
            }
            if (isHydrate && hydrate) {
              hydrate(vnode, rootContainer);
            } else {
              render(vnode, rootContainer, isSVG);
            }
            isMounted = true;
            app._container = rootContainer;
            rootContainer.__vue_app__ = app;
            {
              app._instance = vnode.component;
              devtoolsInitApp(app, version);
            }
            return getExposeProxy(vnode.component) || vnode.component.proxy;
          }
        },
        unmount() {
          if (isMounted) {
            render(null, app._container);
            {
              app._instance = null;
              devtoolsUnmountApp(app);
            }
            delete app._container.__vue_app__;
          }
        },
        provide(key, value) {
          if (key in context.provides) ;
          context.provides[key] = value;
          return app;
        },
        runWithContext(fn) {
          currentApp = app;
          try {
            return fn();
          } finally {
            currentApp = null;
          }
        }
      };
      return app;
    };
  }
  let currentApp = null;

  function provide(key, value) {
    if (!currentInstance) ; else {
      let provides = currentInstance.provides;
      const parentProvides = currentInstance.parent && currentInstance.parent.provides;
      if (parentProvides === provides) {
        provides = currentInstance.provides = Object.create(parentProvides);
      }
      provides[key] = value;
    }
  }
  function inject(key, defaultValue, treatDefaultAsFactory = false) {
    const instance = currentInstance || currentRenderingInstance;
    if (instance || currentApp) {
      const provides = instance ? instance.parent == null ? instance.vnode.appContext && instance.vnode.appContext.provides : instance.parent.provides : currentApp._context.provides;
      if (provides && key in provides) {
        return provides[key];
      } else if (arguments.length > 1) {
        return treatDefaultAsFactory && isFunction(defaultValue) ? defaultValue.call(instance && instance.proxy) : defaultValue;
      } else ;
    }
  }
  function hasInjectionContext() {
    return !!(currentInstance || currentRenderingInstance || currentApp);
  }

  function initProps(instance, rawProps, isStateful, isSSR = false) {
    const props = {};
    const attrs = {};
    def(attrs, InternalObjectKey, 1);
    instance.propsDefaults = /* @__PURE__ */ Object.create(null);
    setFullProps(instance, rawProps, props, attrs);
    for (const key in instance.propsOptions[0]) {
      if (!(key in props)) {
        props[key] = void 0;
      }
    }
    {
      validateProps(rawProps || {}, props, instance);
    }
    if (isStateful) {
      instance.props = isSSR ? props : shallowReactive(props);
    } else {
      if (!instance.type.props) {
        instance.props = attrs;
      } else {
        instance.props = props;
      }
    }
    instance.attrs = attrs;
  }
  function isInHmrContext(instance) {
    while (instance) {
      if (instance.type.__hmrId)
        return true;
      instance = instance.parent;
    }
  }
  function updateProps(instance, rawProps, rawPrevProps, optimized) {
    const {
      props,
      attrs,
      vnode: { patchFlag }
    } = instance;
    const rawCurrentProps = toRaw(props);
    const [options] = instance.propsOptions;
    let hasAttrsChanged = false;
    if (
      // always force full diff in dev
      // - #1942 if hmr is enabled with sfc component
      // - vite#872 non-sfc component used by sfc component
      !(isInHmrContext(instance)) && (optimized || patchFlag > 0) && !(patchFlag & 16)
    ) {
      if (patchFlag & 8) {
        const propsToUpdate = instance.vnode.dynamicProps;
        for (let i = 0; i < propsToUpdate.length; i++) {
          let key = propsToUpdate[i];
          if (isEmitListener(instance.emitsOptions, key)) {
            continue;
          }
          const value = rawProps[key];
          if (options) {
            if (hasOwn(attrs, key)) {
              if (value !== attrs[key]) {
                attrs[key] = value;
                hasAttrsChanged = true;
              }
            } else {
              const camelizedKey = camelize(key);
              props[camelizedKey] = resolvePropValue(
                options,
                rawCurrentProps,
                camelizedKey,
                value,
                instance,
                false
                /* isAbsent */
              );
            }
          } else {
            if (value !== attrs[key]) {
              attrs[key] = value;
              hasAttrsChanged = true;
            }
          }
        }
      }
    } else {
      if (setFullProps(instance, rawProps, props, attrs)) {
        hasAttrsChanged = true;
      }
      let kebabKey;
      for (const key in rawCurrentProps) {
        if (!rawProps || // for camelCase
        !hasOwn(rawProps, key) && // it's possible the original props was passed in as kebab-case
        // and converted to camelCase (#955)
        ((kebabKey = hyphenate(key)) === key || !hasOwn(rawProps, kebabKey))) {
          if (options) {
            if (rawPrevProps && // for camelCase
            (rawPrevProps[key] !== void 0 || // for kebab-case
            rawPrevProps[kebabKey] !== void 0)) {
              props[key] = resolvePropValue(
                options,
                rawCurrentProps,
                key,
                void 0,
                instance,
                true
                /* isAbsent */
              );
            }
          } else {
            delete props[key];
          }
        }
      }
      if (attrs !== rawCurrentProps) {
        for (const key in attrs) {
          if (!rawProps || !hasOwn(rawProps, key) && true) {
            delete attrs[key];
            hasAttrsChanged = true;
          }
        }
      }
    }
    if (hasAttrsChanged) {
      trigger(instance, "set", "$attrs");
    }
    {
      validateProps(rawProps || {}, props, instance);
    }
  }
  function setFullProps(instance, rawProps, props, attrs) {
    const [options, needCastKeys] = instance.propsOptions;
    let hasAttrsChanged = false;
    let rawCastValues;
    if (rawProps) {
      for (let key in rawProps) {
        if (isReservedProp(key)) {
          continue;
        }
        const value = rawProps[key];
        let camelKey;
        if (options && hasOwn(options, camelKey = camelize(key))) {
          if (!needCastKeys || !needCastKeys.includes(camelKey)) {
            props[camelKey] = value;
          } else {
            (rawCastValues || (rawCastValues = {}))[camelKey] = value;
          }
        } else if (!isEmitListener(instance.emitsOptions, key)) {
          if (!(key in attrs) || value !== attrs[key]) {
            attrs[key] = value;
            hasAttrsChanged = true;
          }
        }
      }
    }
    if (needCastKeys) {
      const rawCurrentProps = toRaw(props);
      const castValues = rawCastValues || EMPTY_OBJ;
      for (let i = 0; i < needCastKeys.length; i++) {
        const key = needCastKeys[i];
        props[key] = resolvePropValue(
          options,
          rawCurrentProps,
          key,
          castValues[key],
          instance,
          !hasOwn(castValues, key)
        );
      }
    }
    return hasAttrsChanged;
  }
  function resolvePropValue(options, props, key, value, instance, isAbsent) {
    const opt = options[key];
    if (opt != null) {
      const hasDefault = hasOwn(opt, "default");
      if (hasDefault && value === void 0) {
        const defaultValue = opt.default;
        if (opt.type !== Function && !opt.skipFactory && isFunction(defaultValue)) {
          const { propsDefaults } = instance;
          if (key in propsDefaults) {
            value = propsDefaults[key];
          } else {
            setCurrentInstance(instance);
            value = propsDefaults[key] = defaultValue.call(
              null,
              props
            );
            unsetCurrentInstance();
          }
        } else {
          value = defaultValue;
        }
      }
      if (opt[0 /* shouldCast */]) {
        if (isAbsent && !hasDefault) {
          value = false;
        } else if (opt[1 /* shouldCastTrue */] && (value === "" || value === hyphenate(key))) {
          value = true;
        }
      }
    }
    return value;
  }
  function normalizePropsOptions(comp, appContext, asMixin = false) {
    const cache = appContext.propsCache;
    const cached = cache.get(comp);
    if (cached) {
      return cached;
    }
    const raw = comp.props;
    const normalized = {};
    const needCastKeys = [];
    let hasExtends = false;
    if (!raw && !hasExtends) {
      if (isObject$1(comp)) {
        cache.set(comp, EMPTY_ARR);
      }
      return EMPTY_ARR;
    }
    if (isArray$1(raw)) {
      for (let i = 0; i < raw.length; i++) {
        if (!isString(raw[i])) {
          warn$1(`props must be strings when using array syntax.`, raw[i]);
        }
        const normalizedKey = camelize(raw[i]);
        if (validatePropName(normalizedKey)) {
          normalized[normalizedKey] = EMPTY_OBJ;
        }
      }
    } else if (raw) {
      for (const key in raw) {
        const normalizedKey = camelize(key);
        if (validatePropName(normalizedKey)) {
          const opt = raw[key];
          const prop = normalized[normalizedKey] = isArray$1(opt) || isFunction(opt) ? { type: opt } : extend({}, opt);
          if (prop) {
            const booleanIndex = getTypeIndex(Boolean, prop.type);
            const stringIndex = getTypeIndex(String, prop.type);
            prop[0 /* shouldCast */] = booleanIndex > -1;
            prop[1 /* shouldCastTrue */] = stringIndex < 0 || booleanIndex < stringIndex;
            if (booleanIndex > -1 || hasOwn(prop, "default")) {
              needCastKeys.push(normalizedKey);
            }
          }
        }
      }
    }
    const res = [normalized, needCastKeys];
    if (isObject$1(comp)) {
      cache.set(comp, res);
    }
    return res;
  }
  function validatePropName(key) {
    if (key[0] !== "$") {
      return true;
    }
    return false;
  }
  function getType(ctor) {
    const match = ctor && ctor.toString().match(/^\s*(function|class) (\w+)/);
    return match ? match[2] : ctor === null ? "null" : "";
  }
  function isSameType(a, b) {
    return getType(a) === getType(b);
  }
  function getTypeIndex(type, expectedTypes) {
    if (isArray$1(expectedTypes)) {
      return expectedTypes.findIndex((t) => isSameType(t, type));
    } else if (isFunction(expectedTypes)) {
      return isSameType(expectedTypes, type) ? 0 : -1;
    }
    return -1;
  }
  function validateProps(rawProps, props, instance) {
    const resolvedValues = toRaw(props);
    const options = instance.propsOptions[0];
    for (const key in options) {
      let opt = options[key];
      if (opt == null)
        continue;
      validateProp(
        key,
        resolvedValues[key],
        opt,
        !hasOwn(rawProps, key) && !hasOwn(rawProps, hyphenate(key))
      );
    }
  }
  function validateProp(name, value, prop, isAbsent) {
    const { type, required, validator, skipCheck } = prop;
    if (required && isAbsent) {
      return;
    }
    if (value == null && !required) {
      return;
    }
    if (type != null && type !== true && !skipCheck) {
      let isValid = false;
      const types = isArray$1(type) ? type : [type];
      const expectedTypes = [];
      for (let i = 0; i < types.length && !isValid; i++) {
        const { valid, expectedType } = assertType(value, types[i]);
        expectedTypes.push(expectedType || "");
        isValid = valid;
      }
      if (!isValid) {
        warn$1(getInvalidTypeMessage(name, value, expectedTypes));
        return;
      }
    }
    if (validator && !validator(value)) ;
  }
  const isSimpleType = /* @__PURE__ */ makeMap(
    "String,Number,Boolean,Function,Symbol,BigInt"
  );
  function assertType(value, type) {
    let valid;
    const expectedType = getType(type);
    if (isSimpleType(expectedType)) {
      const t = typeof value;
      valid = t === expectedType.toLowerCase();
      if (!valid && t === "object") {
        valid = value instanceof type;
      }
    } else if (expectedType === "Object") {
      valid = isObject$1(value);
    } else if (expectedType === "Array") {
      valid = isArray$1(value);
    } else if (expectedType === "null") {
      valid = value === null;
    } else {
      valid = value instanceof type;
    }
    return {
      valid,
      expectedType
    };
  }
  function getInvalidTypeMessage(name, value, expectedTypes) {
    let message = `Invalid prop: type check failed for prop "${name}". Expected ${expectedTypes.map(capitalize).join(" | ")}`;
    const expectedType = expectedTypes[0];
    const receivedType = toRawType(value);
    const expectedValue = styleValue(value, expectedType);
    const receivedValue = styleValue(value, receivedType);
    if (expectedTypes.length === 1 && isExplicable(expectedType) && !isBoolean(expectedType, receivedType)) {
      message += ` with value ${expectedValue}`;
    }
    message += `, got ${receivedType} `;
    if (isExplicable(receivedType)) {
      message += `with value ${receivedValue}.`;
    }
    return message;
  }
  function styleValue(value, type) {
    if (type === "String") {
      return `"${value}"`;
    } else if (type === "Number") {
      return `${Number(value)}`;
    } else {
      return `${value}`;
    }
  }
  function isExplicable(type) {
    const explicitTypes = ["string", "number", "boolean"];
    return explicitTypes.some((elem) => type.toLowerCase() === elem);
  }
  function isBoolean(...args) {
    return args.some((elem) => elem.toLowerCase() === "boolean");
  }

  const isInternalKey = (key) => key[0] === "_" || key === "$stable";
  const normalizeSlotValue = (value) => isArray$1(value) ? value.map(normalizeVNode) : [normalizeVNode(value)];
  const normalizeSlot$1 = (key, rawSlot, ctx) => {
    if (rawSlot._n) {
      return rawSlot;
    }
    const normalized = withCtx((...args) => {
      if ("development" !== "production" && currentInstance) {
        warn$1(
          `Slot "${key}" invoked outside of the render function: this will not track dependencies used in the slot. Invoke the slot function inside the render function instead.`
        );
      }
      return normalizeSlotValue(rawSlot(...args));
    }, ctx);
    normalized._c = false;
    return normalized;
  };
  const normalizeObjectSlots = (rawSlots, slots, instance) => {
    const ctx = rawSlots._ctx;
    for (const key in rawSlots) {
      if (isInternalKey(key))
        continue;
      const value = rawSlots[key];
      if (isFunction(value)) {
        slots[key] = normalizeSlot$1(key, value, ctx);
      } else if (value != null) {
        const normalized = normalizeSlotValue(value);
        slots[key] = () => normalized;
      }
    }
  };
  const normalizeVNodeSlots = (instance, children) => {
    if (!isKeepAlive(instance.vnode) && true) ;
    const normalized = normalizeSlotValue(children);
    instance.slots.default = () => normalized;
  };
  const initSlots = (instance, children) => {
    if (instance.vnode.shapeFlag & 32) {
      const type = children._;
      if (type) {
        instance.slots = toRaw(children);
        def(children, "_", type);
      } else {
        normalizeObjectSlots(
          children,
          instance.slots = {});
      }
    } else {
      instance.slots = {};
      if (children) {
        normalizeVNodeSlots(instance, children);
      }
    }
    def(instance.slots, InternalObjectKey, 1);
  };
  const updateSlots = (instance, children, optimized) => {
    const { vnode, slots } = instance;
    let needDeletionCheck = true;
    let deletionComparisonTarget = EMPTY_OBJ;
    if (vnode.shapeFlag & 32) {
      const type = children._;
      if (type) {
        if (isHmrUpdating) {
          extend(slots, children);
          trigger(instance, "set", "$slots");
        } else if (optimized && type === 1) {
          needDeletionCheck = false;
        } else {
          extend(slots, children);
          if (!optimized && type === 1) {
            delete slots._;
          }
        }
      } else {
        needDeletionCheck = !children.$stable;
        normalizeObjectSlots(children, slots);
      }
      deletionComparisonTarget = children;
    } else if (children) {
      normalizeVNodeSlots(instance, children);
      deletionComparisonTarget = { default: 1 };
    }
    if (needDeletionCheck) {
      for (const key in slots) {
        if (!isInternalKey(key) && !(key in deletionComparisonTarget)) {
          delete slots[key];
        }
      }
    }
  };

  function setRef(rawRef, oldRawRef, parentSuspense, vnode, isUnmount = false) {
    if (isArray$1(rawRef)) {
      rawRef.forEach(
        (r, i) => setRef(
          r,
          oldRawRef && (isArray$1(oldRawRef) ? oldRawRef[i] : oldRawRef),
          parentSuspense,
          vnode,
          isUnmount
        )
      );
      return;
    }
    if (isAsyncWrapper(vnode) && !isUnmount) {
      return;
    }
    const refValue = vnode.shapeFlag & 4 ? getExposeProxy(vnode.component) || vnode.component.proxy : vnode.el;
    const value = isUnmount ? null : refValue;
    const { i: owner, r: ref } = rawRef;
    if (!owner) {
      return;
    }
    const oldRef = oldRawRef && oldRawRef.r;
    const refs = owner.refs === EMPTY_OBJ ? owner.refs = {} : owner.refs;
    const setupState = owner.setupState;
    if (oldRef != null && oldRef !== ref) {
      if (isString(oldRef)) {
        refs[oldRef] = null;
        if (hasOwn(setupState, oldRef)) {
          setupState[oldRef] = null;
        }
      } else if (isRef(oldRef)) {
        oldRef.value = null;
      }
    }
    if (isFunction(ref)) {
      callWithErrorHandling(ref, owner, 12, [value, refs]);
    } else {
      const _isString = isString(ref);
      const _isRef = isRef(ref);
      if (_isString || _isRef) {
        const doSet = () => {
          if (rawRef.f) {
            const existing = _isString ? hasOwn(setupState, ref) ? setupState[ref] : refs[ref] : ref.value;
            if (isUnmount) {
              isArray$1(existing) && remove(existing, refValue);
            } else {
              if (!isArray$1(existing)) {
                if (_isString) {
                  refs[ref] = [refValue];
                  if (hasOwn(setupState, ref)) {
                    setupState[ref] = refs[ref];
                  }
                } else {
                  ref.value = [refValue];
                  if (rawRef.k)
                    refs[rawRef.k] = ref.value;
                }
              } else if (!existing.includes(refValue)) {
                existing.push(refValue);
              }
            }
          } else if (_isString) {
            refs[ref] = value;
            if (hasOwn(setupState, ref)) {
              setupState[ref] = value;
            }
          } else if (_isRef) {
            ref.value = value;
            if (rawRef.k)
              refs[rawRef.k] = value;
          } else ;
        };
        if (value) {
          doSet.id = -1;
          queuePostRenderEffect(doSet, parentSuspense);
        } else {
          doSet();
        }
      }
    }
  }

  let hasMismatch = false;
  const isSVGContainer = (container) => /svg/.test(container.namespaceURI) && container.tagName !== "foreignObject";
  const isComment = (node) => node.nodeType === 8 /* COMMENT */;
  function createHydrationFunctions(rendererInternals) {
    const {
      mt: mountComponent,
      p: patch,
      o: {
        patchProp,
        createText,
        nextSibling,
        parentNode,
        remove,
        insert,
        createComment
      }
    } = rendererInternals;
    const hydrate = (vnode, container) => {
      if (!container.hasChildNodes()) {
        patch(null, vnode, container);
        flushPostFlushCbs();
        container._vnode = vnode;
        return;
      }
      hasMismatch = false;
      hydrateNode(container.firstChild, vnode, null, null, null);
      flushPostFlushCbs();
      container._vnode = vnode;
      if (hasMismatch && true) {
        console.error(`Hydration completed but contains mismatches.`);
      }
    };
    const hydrateNode = (node, vnode, parentComponent, parentSuspense, slotScopeIds, optimized = false) => {
      const isFragmentStart = isComment(node) && node.data === "[";
      const onMismatch = () => handleMismatch(
        node,
        vnode,
        parentComponent,
        parentSuspense,
        slotScopeIds,
        isFragmentStart
      );
      const { type, ref, shapeFlag, patchFlag } = vnode;
      let domType = node.nodeType;
      vnode.el = node;
      if (patchFlag === -2) {
        optimized = false;
        vnode.dynamicChildren = null;
      }
      let nextNode = null;
      switch (type) {
        case Text:
          if (domType !== 3 /* TEXT */) {
            if (vnode.children === "") {
              insert(vnode.el = createText(""), parentNode(node), node);
              nextNode = node;
            } else {
              nextNode = onMismatch();
            }
          } else {
            if (node.data !== vnode.children) {
              hasMismatch = true;
              warn$1(
                `Hydration text mismatch:
- Client: ${JSON.stringify(node.data)}
- Server: ${JSON.stringify(vnode.children)}`
              );
              node.data = vnode.children;
            }
            nextNode = nextSibling(node);
          }
          break;
        case Comment:
          if (domType !== 8 /* COMMENT */ || isFragmentStart) {
            nextNode = onMismatch();
          } else {
            nextNode = nextSibling(node);
          }
          break;
        case Static:
          if (isFragmentStart) {
            node = nextSibling(node);
            domType = node.nodeType;
          }
          if (domType === 1 /* ELEMENT */ || domType === 3 /* TEXT */) {
            nextNode = node;
            const needToAdoptContent = !vnode.children.length;
            for (let i = 0; i < vnode.staticCount; i++) {
              if (needToAdoptContent)
                vnode.children += nextNode.nodeType === 1 /* ELEMENT */ ? nextNode.outerHTML : nextNode.data;
              if (i === vnode.staticCount - 1) {
                vnode.anchor = nextNode;
              }
              nextNode = nextSibling(nextNode);
            }
            return isFragmentStart ? nextSibling(nextNode) : nextNode;
          } else {
            onMismatch();
          }
          break;
        case Fragment:
          if (!isFragmentStart) {
            nextNode = onMismatch();
          } else {
            nextNode = hydrateFragment(
              node,
              vnode,
              parentComponent,
              parentSuspense,
              slotScopeIds,
              optimized
            );
          }
          break;
        default:
          if (shapeFlag & 1) {
            if (domType !== 1 /* ELEMENT */ || vnode.type.toLowerCase() !== node.tagName.toLowerCase()) {
              nextNode = onMismatch();
            } else {
              nextNode = hydrateElement(
                node,
                vnode,
                parentComponent,
                parentSuspense,
                slotScopeIds,
                optimized
              );
            }
          } else if (shapeFlag & 6) {
            vnode.slotScopeIds = slotScopeIds;
            const container = parentNode(node);
            mountComponent(
              vnode,
              container,
              null,
              parentComponent,
              parentSuspense,
              isSVGContainer(container),
              optimized
            );
            nextNode = isFragmentStart ? locateClosingAsyncAnchor(node) : nextSibling(node);
            if (nextNode && isComment(nextNode) && nextNode.data === "teleport end") {
              nextNode = nextSibling(nextNode);
            }
            if (isAsyncWrapper(vnode)) {
              let subTree;
              if (isFragmentStart) {
                subTree = createVNode(Fragment);
                subTree.anchor = nextNode ? nextNode.previousSibling : container.lastChild;
              } else {
                subTree = node.nodeType === 3 ? createTextVNode("") : createVNode("div");
              }
              subTree.el = node;
              vnode.component.subTree = subTree;
            }
          } else if (shapeFlag & 64) {
            if (domType !== 8 /* COMMENT */) {
              nextNode = onMismatch();
            } else {
              nextNode = vnode.type.hydrate(
                node,
                vnode,
                parentComponent,
                parentSuspense,
                slotScopeIds,
                optimized,
                rendererInternals,
                hydrateChildren
              );
            }
          } else if (shapeFlag & 128) {
            nextNode = vnode.type.hydrate(
              node,
              vnode,
              parentComponent,
              parentSuspense,
              isSVGContainer(parentNode(node)),
              slotScopeIds,
              optimized,
              rendererInternals,
              hydrateNode
            );
          } else ;
      }
      if (ref != null) {
        setRef(ref, null, parentSuspense, vnode);
      }
      return nextNode;
    };
    const hydrateElement = (el, vnode, parentComponent, parentSuspense, slotScopeIds, optimized) => {
      optimized = optimized || !!vnode.dynamicChildren;
      const { type, props, patchFlag, shapeFlag, dirs } = vnode;
      const forcePatchValue = type === "input" && dirs || type === "option";
      {
        if (dirs) {
          invokeDirectiveHook(vnode, null, parentComponent, "created");
        }
        if (props) {
          if (forcePatchValue || !optimized || patchFlag & (16 | 32)) {
            for (const key in props) {
              if (forcePatchValue && key.endsWith("value") || isOn(key) && !isReservedProp(key)) {
                patchProp(
                  el,
                  key,
                  null,
                  props[key],
                  false,
                  void 0,
                  parentComponent
                );
              }
            }
          } else if (props.onClick) {
            patchProp(
              el,
              "onClick",
              null,
              props.onClick,
              false,
              void 0,
              parentComponent
            );
          }
        }
        let vnodeHooks;
        if (vnodeHooks = props && props.onVnodeBeforeMount) {
          invokeVNodeHook(vnodeHooks, parentComponent, vnode);
        }
        if (dirs) {
          invokeDirectiveHook(vnode, null, parentComponent, "beforeMount");
        }
        if ((vnodeHooks = props && props.onVnodeMounted) || dirs) {
          queueEffectWithSuspense(() => {
            vnodeHooks && invokeVNodeHook(vnodeHooks, parentComponent, vnode);
            dirs && invokeDirectiveHook(vnode, null, parentComponent, "mounted");
          }, parentSuspense);
        }
        if (shapeFlag & 16 && // skip if element has innerHTML / textContent
        !(props && (props.innerHTML || props.textContent))) {
          let next = hydrateChildren(
            el.firstChild,
            vnode,
            el,
            parentComponent,
            parentSuspense,
            slotScopeIds,
            optimized
          );
          let hasWarned = false;
          while (next) {
            hasMismatch = true;
            if (!hasWarned) {
              warn$1(
                `Hydration children mismatch in <${vnode.type}>: server rendered element contains more child nodes than client vdom.`
              );
              hasWarned = true;
            }
            const cur = next;
            next = next.nextSibling;
            remove(cur);
          }
        } else if (shapeFlag & 8) {
          if (el.textContent !== vnode.children) {
            hasMismatch = true;
            warn$1(
              `Hydration text content mismatch in <${vnode.type}>:
- Client: ${el.textContent}
- Server: ${vnode.children}`
            );
            el.textContent = vnode.children;
          }
        }
      }
      return el.nextSibling;
    };
    const hydrateChildren = (node, parentVNode, container, parentComponent, parentSuspense, slotScopeIds, optimized) => {
      optimized = optimized || !!parentVNode.dynamicChildren;
      const children = parentVNode.children;
      const l = children.length;
      let hasWarned = false;
      for (let i = 0; i < l; i++) {
        const vnode = optimized ? children[i] : children[i] = normalizeVNode(children[i]);
        if (node) {
          node = hydrateNode(
            node,
            vnode,
            parentComponent,
            parentSuspense,
            slotScopeIds,
            optimized
          );
        } else if (vnode.type === Text && !vnode.children) {
          continue;
        } else {
          hasMismatch = true;
          if (!hasWarned) {
            warn$1(
              `Hydration children mismatch in <${container.tagName.toLowerCase()}>: server rendered element contains fewer child nodes than client vdom.`
            );
            hasWarned = true;
          }
          patch(
            null,
            vnode,
            container,
            null,
            parentComponent,
            parentSuspense,
            isSVGContainer(container),
            slotScopeIds
          );
        }
      }
      return node;
    };
    const hydrateFragment = (node, vnode, parentComponent, parentSuspense, slotScopeIds, optimized) => {
      const { slotScopeIds: fragmentSlotScopeIds } = vnode;
      if (fragmentSlotScopeIds) {
        slotScopeIds = slotScopeIds ? slotScopeIds.concat(fragmentSlotScopeIds) : fragmentSlotScopeIds;
      }
      const container = parentNode(node);
      const next = hydrateChildren(
        nextSibling(node),
        vnode,
        container,
        parentComponent,
        parentSuspense,
        slotScopeIds,
        optimized
      );
      if (next && isComment(next) && next.data === "]") {
        return nextSibling(vnode.anchor = next);
      } else {
        hasMismatch = true;
        insert(vnode.anchor = createComment(`]`), container, next);
        return next;
      }
    };
    const handleMismatch = (node, vnode, parentComponent, parentSuspense, slotScopeIds, isFragment) => {
      hasMismatch = true;
      warn$1(
        `Hydration node mismatch:
- Client vnode:`,
        vnode.type,
        `
- Server rendered DOM:`,
        node,
        node.nodeType === 3 /* TEXT */ ? `(text)` : isComment(node) && node.data === "[" ? `(start of fragment)` : ``
      );
      vnode.el = null;
      if (isFragment) {
        const end = locateClosingAsyncAnchor(node);
        while (true) {
          const next2 = nextSibling(node);
          if (next2 && next2 !== end) {
            remove(next2);
          } else {
            break;
          }
        }
      }
      const next = nextSibling(node);
      const container = parentNode(node);
      remove(node);
      patch(
        null,
        vnode,
        container,
        next,
        parentComponent,
        parentSuspense,
        isSVGContainer(container),
        slotScopeIds
      );
      return next;
    };
    const locateClosingAsyncAnchor = (node) => {
      let match = 0;
      while (node) {
        node = nextSibling(node);
        if (node && isComment(node)) {
          if (node.data === "[")
            match++;
          if (node.data === "]") {
            if (match === 0) {
              return nextSibling(node);
            } else {
              match--;
            }
          }
        }
      }
      return node;
    };
    return [hydrate, hydrateNode];
  }

  let supported$1;
  let perf$1;
  function startMeasure(instance, type) {
    if (instance.appContext.config.performance && isSupported()) {
      perf$1.mark(`vue-${type}-${instance.uid}`);
    }
    {
      devtoolsPerfStart(instance, type, isSupported() ? perf$1.now() : Date.now());
    }
  }
  function endMeasure(instance, type) {
    if (instance.appContext.config.performance && isSupported()) {
      const startTag = `vue-${type}-${instance.uid}`;
      const endTag = startTag + `:end`;
      perf$1.mark(endTag);
      perf$1.measure(
        `<${formatComponentName(instance, instance.type)}> ${type}`,
        startTag,
        endTag
      );
      perf$1.clearMarks(startTag);
      perf$1.clearMarks(endTag);
    }
    {
      devtoolsPerfEnd(instance, type, isSupported() ? perf$1.now() : Date.now());
    }
  }
  function isSupported() {
    if (supported$1 !== void 0) {
      return supported$1;
    }
    if (typeof window !== "undefined" && window.performance) {
      supported$1 = true;
      perf$1 = window.performance;
    } else {
      supported$1 = false;
    }
    return supported$1;
  }

  function initFeatureFlags() {
    const needWarn = [];
    if (needWarn.length) {
      const multi = needWarn.length > 1;
      console.warn(
        `Feature flag${multi ? `s` : ``} ${needWarn.join(", ")} ${multi ? `are` : `is`} not explicitly defined. You are running the esm-bundler build of Vue, which expects these compile-time feature flags to be globally injected via the bundler config in order to get better tree-shaking in the production bundle.

For more details, see https://link.vuejs.org/feature-flags.`
      );
    }
  }

  const queuePostRenderEffect = queueEffectWithSuspense ;
  function createRenderer(options) {
    return baseCreateRenderer(options);
  }
  function createHydrationRenderer(options) {
    return baseCreateRenderer(options, createHydrationFunctions);
  }
  function baseCreateRenderer(options, createHydrationFns) {
    {
      initFeatureFlags();
    }
    const target = getGlobalThis();
    target.__VUE__ = true;
    {
      setDevtoolsHook(target.__VUE_DEVTOOLS_GLOBAL_HOOK__, target);
    }
    const {
      insert: hostInsert,
      remove: hostRemove,
      patchProp: hostPatchProp,
      createElement: hostCreateElement,
      createText: hostCreateText,
      createComment: hostCreateComment,
      setText: hostSetText,
      setElementText: hostSetElementText,
      parentNode: hostParentNode,
      nextSibling: hostNextSibling,
      setScopeId: hostSetScopeId = NOOP,
      insertStaticContent: hostInsertStaticContent
    } = options;
    const patch = (n1, n2, container, anchor = null, parentComponent = null, parentSuspense = null, isSVG = false, slotScopeIds = null, optimized = isHmrUpdating ? false : !!n2.dynamicChildren) => {
      if (n1 === n2) {
        return;
      }
      if (n1 && !isSameVNodeType(n1, n2)) {
        anchor = getNextHostNode(n1);
        unmount(n1, parentComponent, parentSuspense, true);
        n1 = null;
      }
      if (n2.patchFlag === -2) {
        optimized = false;
        n2.dynamicChildren = null;
      }
      const { type, ref, shapeFlag } = n2;
      switch (type) {
        case Text:
          processText(n1, n2, container, anchor);
          break;
        case Comment:
          processCommentNode(n1, n2, container, anchor);
          break;
        case Static:
          if (n1 == null) {
            mountStaticNode(n2, container, anchor, isSVG);
          } else {
            patchStaticNode(n1, n2, container, isSVG);
          }
          break;
        case Fragment:
          processFragment(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            isSVG,
            slotScopeIds,
            optimized
          );
          break;
        default:
          if (shapeFlag & 1) {
            processElement(
              n1,
              n2,
              container,
              anchor,
              parentComponent,
              parentSuspense,
              isSVG,
              slotScopeIds,
              optimized
            );
          } else if (shapeFlag & 6) {
            processComponent(
              n1,
              n2,
              container,
              anchor,
              parentComponent,
              parentSuspense,
              isSVG,
              slotScopeIds,
              optimized
            );
          } else if (shapeFlag & 64) {
            type.process(
              n1,
              n2,
              container,
              anchor,
              parentComponent,
              parentSuspense,
              isSVG,
              slotScopeIds,
              optimized,
              internals
            );
          } else if (shapeFlag & 128) {
            type.process(
              n1,
              n2,
              container,
              anchor,
              parentComponent,
              parentSuspense,
              isSVG,
              slotScopeIds,
              optimized,
              internals
            );
          } else ;
      }
      if (ref != null && parentComponent) {
        setRef(ref, n1 && n1.ref, parentSuspense, n2 || n1, !n2);
      }
    };
    const processText = (n1, n2, container, anchor) => {
      if (n1 == null) {
        hostInsert(
          n2.el = hostCreateText(n2.children),
          container,
          anchor
        );
      } else {
        const el = n2.el = n1.el;
        if (n2.children !== n1.children) {
          hostSetText(el, n2.children);
        }
      }
    };
    const processCommentNode = (n1, n2, container, anchor) => {
      if (n1 == null) {
        hostInsert(
          n2.el = hostCreateComment(n2.children || ""),
          container,
          anchor
        );
      } else {
        n2.el = n1.el;
      }
    };
    const mountStaticNode = (n2, container, anchor, isSVG) => {
      [n2.el, n2.anchor] = hostInsertStaticContent(
        n2.children,
        container,
        anchor,
        isSVG,
        n2.el,
        n2.anchor
      );
    };
    const patchStaticNode = (n1, n2, container, isSVG) => {
      if (n2.children !== n1.children) {
        const anchor = hostNextSibling(n1.anchor);
        removeStaticNode(n1);
        [n2.el, n2.anchor] = hostInsertStaticContent(
          n2.children,
          container,
          anchor,
          isSVG
        );
      } else {
        n2.el = n1.el;
        n2.anchor = n1.anchor;
      }
    };
    const moveStaticNode = ({ el, anchor }, container, nextSibling) => {
      let next;
      while (el && el !== anchor) {
        next = hostNextSibling(el);
        hostInsert(el, container, nextSibling);
        el = next;
      }
      hostInsert(anchor, container, nextSibling);
    };
    const removeStaticNode = ({ el, anchor }) => {
      let next;
      while (el && el !== anchor) {
        next = hostNextSibling(el);
        hostRemove(el);
        el = next;
      }
      hostRemove(anchor);
    };
    const processElement = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
      isSVG = isSVG || n2.type === "svg";
      if (n1 == null) {
        mountElement(
          n2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          isSVG,
          slotScopeIds,
          optimized
        );
      } else {
        patchElement(
          n1,
          n2,
          parentComponent,
          parentSuspense,
          isSVG,
          slotScopeIds,
          optimized
        );
      }
    };
    const mountElement = (vnode, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
      let el;
      let vnodeHook;
      const { type, props, shapeFlag, transition, dirs } = vnode;
      el = vnode.el = hostCreateElement(
        vnode.type,
        isSVG,
        props && props.is,
        props
      );
      if (shapeFlag & 8) {
        hostSetElementText(el, vnode.children);
      } else if (shapeFlag & 16) {
        mountChildren(
          vnode.children,
          el,
          null,
          parentComponent,
          parentSuspense,
          isSVG && type !== "foreignObject",
          slotScopeIds,
          optimized
        );
      }
      if (dirs) {
        invokeDirectiveHook(vnode, null, parentComponent, "created");
      }
      setScopeId(el, vnode, vnode.scopeId, slotScopeIds, parentComponent);
      if (props) {
        for (const key in props) {
          if (key !== "value" && !isReservedProp(key)) {
            hostPatchProp(
              el,
              key,
              null,
              props[key],
              isSVG,
              vnode.children,
              parentComponent,
              parentSuspense,
              unmountChildren
            );
          }
        }
        if ("value" in props) {
          hostPatchProp(el, "value", null, props.value);
        }
        if (vnodeHook = props.onVnodeBeforeMount) {
          invokeVNodeHook(vnodeHook, parentComponent, vnode);
        }
      }
      {
        Object.defineProperty(el, "__vnode", {
          value: vnode,
          enumerable: false
        });
        Object.defineProperty(el, "__vueParentComponent", {
          value: parentComponent,
          enumerable: false
        });
      }
      if (dirs) {
        invokeDirectiveHook(vnode, null, parentComponent, "beforeMount");
      }
      const needCallTransitionHooks = (!parentSuspense || parentSuspense && !parentSuspense.pendingBranch) && transition && !transition.persisted;
      if (needCallTransitionHooks) {
        transition.beforeEnter(el);
      }
      hostInsert(el, container, anchor);
      if ((vnodeHook = props && props.onVnodeMounted) || needCallTransitionHooks || dirs) {
        queuePostRenderEffect(() => {
          vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
          needCallTransitionHooks && transition.enter(el);
          dirs && invokeDirectiveHook(vnode, null, parentComponent, "mounted");
        }, parentSuspense);
      }
    };
    const setScopeId = (el, vnode, scopeId, slotScopeIds, parentComponent) => {
      if (scopeId) {
        hostSetScopeId(el, scopeId);
      }
      if (slotScopeIds) {
        for (let i = 0; i < slotScopeIds.length; i++) {
          hostSetScopeId(el, slotScopeIds[i]);
        }
      }
      if (parentComponent) {
        let subTree = parentComponent.subTree;
        if (subTree.patchFlag > 0 && subTree.patchFlag & 2048) {
          subTree = filterSingleRoot(subTree.children) || subTree;
        }
        if (vnode === subTree) {
          const parentVNode = parentComponent.vnode;
          setScopeId(
            el,
            parentVNode,
            parentVNode.scopeId,
            parentVNode.slotScopeIds,
            parentComponent.parent
          );
        }
      }
    };
    const mountChildren = (children, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, start = 0) => {
      for (let i = start; i < children.length; i++) {
        const child = children[i] = optimized ? cloneIfMounted(children[i]) : normalizeVNode(children[i]);
        patch(
          null,
          child,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          isSVG,
          slotScopeIds,
          optimized
        );
      }
    };
    const patchElement = (n1, n2, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
      const el = n2.el = n1.el;
      let { patchFlag, dynamicChildren, dirs } = n2;
      patchFlag |= n1.patchFlag & 16;
      const oldProps = n1.props || EMPTY_OBJ;
      const newProps = n2.props || EMPTY_OBJ;
      let vnodeHook;
      parentComponent && toggleRecurse(parentComponent, false);
      if (vnodeHook = newProps.onVnodeBeforeUpdate) {
        invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
      }
      if (dirs) {
        invokeDirectiveHook(n2, n1, parentComponent, "beforeUpdate");
      }
      parentComponent && toggleRecurse(parentComponent, true);
      if (isHmrUpdating) {
        patchFlag = 0;
        optimized = false;
        dynamicChildren = null;
      }
      const areChildrenSVG = isSVG && n2.type !== "foreignObject";
      if (dynamicChildren) {
        patchBlockChildren(
          n1.dynamicChildren,
          dynamicChildren,
          el,
          parentComponent,
          parentSuspense,
          areChildrenSVG,
          slotScopeIds
        );
        {
          traverseStaticChildren(n1, n2);
        }
      } else if (!optimized) {
        patchChildren(
          n1,
          n2,
          el,
          null,
          parentComponent,
          parentSuspense,
          areChildrenSVG,
          slotScopeIds,
          false
        );
      }
      if (patchFlag > 0) {
        if (patchFlag & 16) {
          patchProps(
            el,
            n2,
            oldProps,
            newProps,
            parentComponent,
            parentSuspense,
            isSVG
          );
        } else {
          if (patchFlag & 2) {
            if (oldProps.class !== newProps.class) {
              hostPatchProp(el, "class", null, newProps.class, isSVG);
            }
          }
          if (patchFlag & 4) {
            hostPatchProp(el, "style", oldProps.style, newProps.style, isSVG);
          }
          if (patchFlag & 8) {
            const propsToUpdate = n2.dynamicProps;
            for (let i = 0; i < propsToUpdate.length; i++) {
              const key = propsToUpdate[i];
              const prev = oldProps[key];
              const next = newProps[key];
              if (next !== prev || key === "value") {
                hostPatchProp(
                  el,
                  key,
                  prev,
                  next,
                  isSVG,
                  n1.children,
                  parentComponent,
                  parentSuspense,
                  unmountChildren
                );
              }
            }
          }
        }
        if (patchFlag & 1) {
          if (n1.children !== n2.children) {
            hostSetElementText(el, n2.children);
          }
        }
      } else if (!optimized && dynamicChildren == null) {
        patchProps(
          el,
          n2,
          oldProps,
          newProps,
          parentComponent,
          parentSuspense,
          isSVG
        );
      }
      if ((vnodeHook = newProps.onVnodeUpdated) || dirs) {
        queuePostRenderEffect(() => {
          vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
          dirs && invokeDirectiveHook(n2, n1, parentComponent, "updated");
        }, parentSuspense);
      }
    };
    const patchBlockChildren = (oldChildren, newChildren, fallbackContainer, parentComponent, parentSuspense, isSVG, slotScopeIds) => {
      for (let i = 0; i < newChildren.length; i++) {
        const oldVNode = oldChildren[i];
        const newVNode = newChildren[i];
        const container = (
          // oldVNode may be an errored async setup() component inside Suspense
          // which will not have a mounted element
          oldVNode.el && // - In the case of a Fragment, we need to provide the actual parent
          // of the Fragment itself so it can move its children.
          (oldVNode.type === Fragment || // - In the case of different nodes, there is going to be a replacement
          // which also requires the correct parent container
          !isSameVNodeType(oldVNode, newVNode) || // - In the case of a component, it could contain anything.
          oldVNode.shapeFlag & (6 | 64)) ? hostParentNode(oldVNode.el) : (
            // In other cases, the parent container is not actually used so we
            // just pass the block element here to avoid a DOM parentNode call.
            fallbackContainer
          )
        );
        patch(
          oldVNode,
          newVNode,
          container,
          null,
          parentComponent,
          parentSuspense,
          isSVG,
          slotScopeIds,
          true
        );
      }
    };
    const patchProps = (el, vnode, oldProps, newProps, parentComponent, parentSuspense, isSVG) => {
      if (oldProps !== newProps) {
        if (oldProps !== EMPTY_OBJ) {
          for (const key in oldProps) {
            if (!isReservedProp(key) && !(key in newProps)) {
              hostPatchProp(
                el,
                key,
                oldProps[key],
                null,
                isSVG,
                vnode.children,
                parentComponent,
                parentSuspense,
                unmountChildren
              );
            }
          }
        }
        for (const key in newProps) {
          if (isReservedProp(key))
            continue;
          const next = newProps[key];
          const prev = oldProps[key];
          if (next !== prev && key !== "value") {
            hostPatchProp(
              el,
              key,
              prev,
              next,
              isSVG,
              vnode.children,
              parentComponent,
              parentSuspense,
              unmountChildren
            );
          }
        }
        if ("value" in newProps) {
          hostPatchProp(el, "value", oldProps.value, newProps.value);
        }
      }
    };
    const processFragment = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
      const fragmentStartAnchor = n2.el = n1 ? n1.el : hostCreateText("");
      const fragmentEndAnchor = n2.anchor = n1 ? n1.anchor : hostCreateText("");
      let { patchFlag, dynamicChildren, slotScopeIds: fragmentSlotScopeIds } = n2;
      if (// #5523 dev root fragment may inherit directives
      (isHmrUpdating || patchFlag & 2048)) {
        patchFlag = 0;
        optimized = false;
        dynamicChildren = null;
      }
      if (fragmentSlotScopeIds) {
        slotScopeIds = slotScopeIds ? slotScopeIds.concat(fragmentSlotScopeIds) : fragmentSlotScopeIds;
      }
      if (n1 == null) {
        hostInsert(fragmentStartAnchor, container, anchor);
        hostInsert(fragmentEndAnchor, container, anchor);
        mountChildren(
          n2.children,
          container,
          fragmentEndAnchor,
          parentComponent,
          parentSuspense,
          isSVG,
          slotScopeIds,
          optimized
        );
      } else {
        if (patchFlag > 0 && patchFlag & 64 && dynamicChildren && // #2715 the previous fragment could've been a BAILed one as a result
        // of renderSlot() with no valid children
        n1.dynamicChildren) {
          patchBlockChildren(
            n1.dynamicChildren,
            dynamicChildren,
            container,
            parentComponent,
            parentSuspense,
            isSVG,
            slotScopeIds
          );
          {
            traverseStaticChildren(n1, n2);
          }
        } else {
          patchChildren(
            n1,
            n2,
            container,
            fragmentEndAnchor,
            parentComponent,
            parentSuspense,
            isSVG,
            slotScopeIds,
            optimized
          );
        }
      }
    };
    const processComponent = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
      n2.slotScopeIds = slotScopeIds;
      if (n1 == null) {
        if (n2.shapeFlag & 512) {
          parentComponent.ctx.activate(
            n2,
            container,
            anchor,
            isSVG,
            optimized
          );
        } else {
          mountComponent(
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            isSVG,
            optimized
          );
        }
      } else {
        updateComponent(n1, n2, optimized);
      }
    };
    const mountComponent = (initialVNode, container, anchor, parentComponent, parentSuspense, isSVG, optimized) => {
      const instance = (initialVNode.component = createComponentInstance(
        initialVNode,
        parentComponent,
        parentSuspense
      ));
      if (instance.type.__hmrId) {
        registerHMR(instance);
      }
      {
        startMeasure(instance, `mount`);
      }
      if (isKeepAlive(initialVNode)) {
        instance.ctx.renderer = internals;
      }
      {
        {
          startMeasure(instance, `init`);
        }
        setupComponent(instance);
        {
          endMeasure(instance, `init`);
        }
      }
      if (instance.asyncDep) {
        parentSuspense && parentSuspense.registerDep(instance, setupRenderEffect);
        if (!initialVNode.el) {
          const placeholder = instance.subTree = createVNode(Comment);
          processCommentNode(null, placeholder, container, anchor);
        }
        return;
      }
      setupRenderEffect(
        instance,
        initialVNode,
        container,
        anchor,
        parentSuspense,
        isSVG,
        optimized
      );
      {
        endMeasure(instance, `mount`);
      }
    };
    const updateComponent = (n1, n2, optimized) => {
      const instance = n2.component = n1.component;
      if (shouldUpdateComponent(n1, n2, optimized)) {
        if (instance.asyncDep && !instance.asyncResolved) {
          updateComponentPreRender(instance, n2, optimized);
          return;
        } else {
          instance.next = n2;
          invalidateJob(instance.update);
          instance.update();
        }
      } else {
        n2.el = n1.el;
        instance.vnode = n2;
      }
    };
    const setupRenderEffect = (instance, initialVNode, container, anchor, parentSuspense, isSVG, optimized) => {
      const componentUpdateFn = () => {
        if (!instance.isMounted) {
          let vnodeHook;
          const { el, props } = initialVNode;
          const { bm, m, parent } = instance;
          const isAsyncWrapperVNode = isAsyncWrapper(initialVNode);
          toggleRecurse(instance, false);
          if (bm) {
            invokeArrayFns(bm);
          }
          if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeBeforeMount)) {
            invokeVNodeHook(vnodeHook, parent, initialVNode);
          }
          toggleRecurse(instance, true);
          if (el && hydrateNode) {
            const hydrateSubTree = () => {
              {
                startMeasure(instance, `render`);
              }
              instance.subTree = renderComponentRoot(instance);
              {
                endMeasure(instance, `render`);
              }
              {
                startMeasure(instance, `hydrate`);
              }
              hydrateNode(
                el,
                instance.subTree,
                instance,
                parentSuspense,
                null
              );
              {
                endMeasure(instance, `hydrate`);
              }
            };
            if (isAsyncWrapperVNode) {
              initialVNode.type.__asyncLoader().then(
                // note: we are moving the render call into an async callback,
                // which means it won't track dependencies - but it's ok because
                // a server-rendered async wrapper is already in resolved state
                // and it will never need to change.
                () => !instance.isUnmounted && hydrateSubTree()
              );
            } else {
              hydrateSubTree();
            }
          } else {
            {
              startMeasure(instance, `render`);
            }
            const subTree = instance.subTree = renderComponentRoot(instance);
            {
              endMeasure(instance, `render`);
            }
            {
              startMeasure(instance, `patch`);
            }
            patch(
              null,
              subTree,
              container,
              anchor,
              instance,
              parentSuspense,
              isSVG
            );
            {
              endMeasure(instance, `patch`);
            }
            initialVNode.el = subTree.el;
          }
          if (m) {
            queuePostRenderEffect(m, parentSuspense);
          }
          if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeMounted)) {
            const scopedInitialVNode = initialVNode;
            queuePostRenderEffect(
              () => invokeVNodeHook(vnodeHook, parent, scopedInitialVNode),
              parentSuspense
            );
          }
          if (initialVNode.shapeFlag & 256 || parent && isAsyncWrapper(parent.vnode) && parent.vnode.shapeFlag & 256) {
            instance.a && queuePostRenderEffect(instance.a, parentSuspense);
          }
          instance.isMounted = true;
          {
            devtoolsComponentAdded(instance);
          }
          initialVNode = container = anchor = null;
        } else {
          let { next, bu, u, parent, vnode } = instance;
          let originNext = next;
          let vnodeHook;
          {
            pushWarningContext(next || instance.vnode);
          }
          toggleRecurse(instance, false);
          if (next) {
            next.el = vnode.el;
            updateComponentPreRender(instance, next, optimized);
          } else {
            next = vnode;
          }
          if (bu) {
            invokeArrayFns(bu);
          }
          if (vnodeHook = next.props && next.props.onVnodeBeforeUpdate) {
            invokeVNodeHook(vnodeHook, parent, next, vnode);
          }
          toggleRecurse(instance, true);
          {
            startMeasure(instance, `render`);
          }
          const nextTree = renderComponentRoot(instance);
          {
            endMeasure(instance, `render`);
          }
          const prevTree = instance.subTree;
          instance.subTree = nextTree;
          {
            startMeasure(instance, `patch`);
          }
          patch(
            prevTree,
            nextTree,
            // parent may have changed if it's in a teleport
            hostParentNode(prevTree.el),
            // anchor may have changed if it's in a fragment
            getNextHostNode(prevTree),
            instance,
            parentSuspense,
            isSVG
          );
          {
            endMeasure(instance, `patch`);
          }
          next.el = nextTree.el;
          if (originNext === null) {
            updateHOCHostEl(instance, nextTree.el);
          }
          if (u) {
            queuePostRenderEffect(u, parentSuspense);
          }
          if (vnodeHook = next.props && next.props.onVnodeUpdated) {
            queuePostRenderEffect(
              () => invokeVNodeHook(vnodeHook, parent, next, vnode),
              parentSuspense
            );
          }
          {
            devtoolsComponentUpdated(instance);
          }
        }
      };
      const effect = instance.effect = new ReactiveEffect(
        componentUpdateFn,
        () => queueJob(update),
        instance.scope
        // track it in component's effect scope
      );
      const update = instance.update = () => effect.run();
      update.id = instance.uid;
      toggleRecurse(instance, true);
      {
        effect.onTrack = instance.rtc ? (e) => invokeArrayFns(instance.rtc, e) : void 0;
        effect.onTrigger = instance.rtg ? (e) => invokeArrayFns(instance.rtg, e) : void 0;
        update.ownerInstance = instance;
      }
      update();
    };
    const updateComponentPreRender = (instance, nextVNode, optimized) => {
      nextVNode.component = instance;
      const prevProps = instance.vnode.props;
      instance.vnode = nextVNode;
      instance.next = null;
      updateProps(instance, nextVNode.props, prevProps, optimized);
      updateSlots(instance, nextVNode.children, optimized);
      pauseTracking();
      flushPreFlushCbs();
      resetTracking();
    };
    const patchChildren = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized = false) => {
      const c1 = n1 && n1.children;
      const prevShapeFlag = n1 ? n1.shapeFlag : 0;
      const c2 = n2.children;
      const { patchFlag, shapeFlag } = n2;
      if (patchFlag > 0) {
        if (patchFlag & 128) {
          patchKeyedChildren(
            c1,
            c2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            isSVG,
            slotScopeIds,
            optimized
          );
          return;
        } else if (patchFlag & 256) {
          patchUnkeyedChildren(
            c1,
            c2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            isSVG,
            slotScopeIds,
            optimized
          );
          return;
        }
      }
      if (shapeFlag & 8) {
        if (prevShapeFlag & 16) {
          unmountChildren(c1, parentComponent, parentSuspense);
        }
        if (c2 !== c1) {
          hostSetElementText(container, c2);
        }
      } else {
        if (prevShapeFlag & 16) {
          if (shapeFlag & 16) {
            patchKeyedChildren(
              c1,
              c2,
              container,
              anchor,
              parentComponent,
              parentSuspense,
              isSVG,
              slotScopeIds,
              optimized
            );
          } else {
            unmountChildren(c1, parentComponent, parentSuspense, true);
          }
        } else {
          if (prevShapeFlag & 8) {
            hostSetElementText(container, "");
          }
          if (shapeFlag & 16) {
            mountChildren(
              c2,
              container,
              anchor,
              parentComponent,
              parentSuspense,
              isSVG,
              slotScopeIds,
              optimized
            );
          }
        }
      }
    };
    const patchUnkeyedChildren = (c1, c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
      c1 = c1 || EMPTY_ARR;
      c2 = c2 || EMPTY_ARR;
      const oldLength = c1.length;
      const newLength = c2.length;
      const commonLength = Math.min(oldLength, newLength);
      let i;
      for (i = 0; i < commonLength; i++) {
        const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
        patch(
          c1[i],
          nextChild,
          container,
          null,
          parentComponent,
          parentSuspense,
          isSVG,
          slotScopeIds,
          optimized
        );
      }
      if (oldLength > newLength) {
        unmountChildren(
          c1,
          parentComponent,
          parentSuspense,
          true,
          false,
          commonLength
        );
      } else {
        mountChildren(
          c2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          isSVG,
          slotScopeIds,
          optimized,
          commonLength
        );
      }
    };
    const patchKeyedChildren = (c1, c2, container, parentAnchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
      let i = 0;
      const l2 = c2.length;
      let e1 = c1.length - 1;
      let e2 = l2 - 1;
      while (i <= e1 && i <= e2) {
        const n1 = c1[i];
        const n2 = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
        if (isSameVNodeType(n1, n2)) {
          patch(
            n1,
            n2,
            container,
            null,
            parentComponent,
            parentSuspense,
            isSVG,
            slotScopeIds,
            optimized
          );
        } else {
          break;
        }
        i++;
      }
      while (i <= e1 && i <= e2) {
        const n1 = c1[e1];
        const n2 = c2[e2] = optimized ? cloneIfMounted(c2[e2]) : normalizeVNode(c2[e2]);
        if (isSameVNodeType(n1, n2)) {
          patch(
            n1,
            n2,
            container,
            null,
            parentComponent,
            parentSuspense,
            isSVG,
            slotScopeIds,
            optimized
          );
        } else {
          break;
        }
        e1--;
        e2--;
      }
      if (i > e1) {
        if (i <= e2) {
          const nextPos = e2 + 1;
          const anchor = nextPos < l2 ? c2[nextPos].el : parentAnchor;
          while (i <= e2) {
            patch(
              null,
              c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]),
              container,
              anchor,
              parentComponent,
              parentSuspense,
              isSVG,
              slotScopeIds,
              optimized
            );
            i++;
          }
        }
      } else if (i > e2) {
        while (i <= e1) {
          unmount(c1[i], parentComponent, parentSuspense, true);
          i++;
        }
      } else {
        const s1 = i;
        const s2 = i;
        const keyToNewIndexMap = /* @__PURE__ */ new Map();
        for (i = s2; i <= e2; i++) {
          const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
          if (nextChild.key != null) {
            if (keyToNewIndexMap.has(nextChild.key)) {
              warn$1(
                `Duplicate keys found during update:`,
                JSON.stringify(nextChild.key),
                `Make sure keys are unique.`
              );
            }
            keyToNewIndexMap.set(nextChild.key, i);
          }
        }
        let j;
        let patched = 0;
        const toBePatched = e2 - s2 + 1;
        let moved = false;
        let maxNewIndexSoFar = 0;
        const newIndexToOldIndexMap = new Array(toBePatched);
        for (i = 0; i < toBePatched; i++)
          newIndexToOldIndexMap[i] = 0;
        for (i = s1; i <= e1; i++) {
          const prevChild = c1[i];
          if (patched >= toBePatched) {
            unmount(prevChild, parentComponent, parentSuspense, true);
            continue;
          }
          let newIndex;
          if (prevChild.key != null) {
            newIndex = keyToNewIndexMap.get(prevChild.key);
          } else {
            for (j = s2; j <= e2; j++) {
              if (newIndexToOldIndexMap[j - s2] === 0 && isSameVNodeType(prevChild, c2[j])) {
                newIndex = j;
                break;
              }
            }
          }
          if (newIndex === void 0) {
            unmount(prevChild, parentComponent, parentSuspense, true);
          } else {
            newIndexToOldIndexMap[newIndex - s2] = i + 1;
            if (newIndex >= maxNewIndexSoFar) {
              maxNewIndexSoFar = newIndex;
            } else {
              moved = true;
            }
            patch(
              prevChild,
              c2[newIndex],
              container,
              null,
              parentComponent,
              parentSuspense,
              isSVG,
              slotScopeIds,
              optimized
            );
            patched++;
          }
        }
        const increasingNewIndexSequence = moved ? getSequence(newIndexToOldIndexMap) : EMPTY_ARR;
        j = increasingNewIndexSequence.length - 1;
        for (i = toBePatched - 1; i >= 0; i--) {
          const nextIndex = s2 + i;
          const nextChild = c2[nextIndex];
          const anchor = nextIndex + 1 < l2 ? c2[nextIndex + 1].el : parentAnchor;
          if (newIndexToOldIndexMap[i] === 0) {
            patch(
              null,
              nextChild,
              container,
              anchor,
              parentComponent,
              parentSuspense,
              isSVG,
              slotScopeIds,
              optimized
            );
          } else if (moved) {
            if (j < 0 || i !== increasingNewIndexSequence[j]) {
              move(nextChild, container, anchor, 2);
            } else {
              j--;
            }
          }
        }
      }
    };
    const move = (vnode, container, anchor, moveType, parentSuspense = null) => {
      const { el, type, transition, children, shapeFlag } = vnode;
      if (shapeFlag & 6) {
        move(vnode.component.subTree, container, anchor, moveType);
        return;
      }
      if (shapeFlag & 128) {
        vnode.suspense.move(container, anchor, moveType);
        return;
      }
      if (shapeFlag & 64) {
        type.move(vnode, container, anchor, internals);
        return;
      }
      if (type === Fragment) {
        hostInsert(el, container, anchor);
        for (let i = 0; i < children.length; i++) {
          move(children[i], container, anchor, moveType);
        }
        hostInsert(vnode.anchor, container, anchor);
        return;
      }
      if (type === Static) {
        moveStaticNode(vnode, container, anchor);
        return;
      }
      const needTransition = moveType !== 2 && shapeFlag & 1 && transition;
      if (needTransition) {
        if (moveType === 0) {
          transition.beforeEnter(el);
          hostInsert(el, container, anchor);
          queuePostRenderEffect(() => transition.enter(el), parentSuspense);
        } else {
          const { leave, delayLeave, afterLeave } = transition;
          const remove2 = () => hostInsert(el, container, anchor);
          const performLeave = () => {
            leave(el, () => {
              remove2();
              afterLeave && afterLeave();
            });
          };
          if (delayLeave) {
            delayLeave(el, remove2, performLeave);
          } else {
            performLeave();
          }
        }
      } else {
        hostInsert(el, container, anchor);
      }
    };
    const unmount = (vnode, parentComponent, parentSuspense, doRemove = false, optimized = false) => {
      const {
        type,
        props,
        ref,
        children,
        dynamicChildren,
        shapeFlag,
        patchFlag,
        dirs
      } = vnode;
      if (ref != null) {
        setRef(ref, null, parentSuspense, vnode, true);
      }
      if (shapeFlag & 256) {
        parentComponent.ctx.deactivate(vnode);
        return;
      }
      const shouldInvokeDirs = shapeFlag & 1 && dirs;
      const shouldInvokeVnodeHook = !isAsyncWrapper(vnode);
      let vnodeHook;
      if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeBeforeUnmount)) {
        invokeVNodeHook(vnodeHook, parentComponent, vnode);
      }
      if (shapeFlag & 6) {
        unmountComponent(vnode.component, parentSuspense, doRemove);
      } else {
        if (shapeFlag & 128) {
          vnode.suspense.unmount(parentSuspense, doRemove);
          return;
        }
        if (shouldInvokeDirs) {
          invokeDirectiveHook(vnode, null, parentComponent, "beforeUnmount");
        }
        if (shapeFlag & 64) {
          vnode.type.remove(
            vnode,
            parentComponent,
            parentSuspense,
            optimized,
            internals,
            doRemove
          );
        } else if (dynamicChildren && // #1153: fast path should not be taken for non-stable (v-for) fragments
        (type !== Fragment || patchFlag > 0 && patchFlag & 64)) {
          unmountChildren(
            dynamicChildren,
            parentComponent,
            parentSuspense,
            false,
            true
          );
        } else if (type === Fragment && patchFlag & (128 | 256) || !optimized && shapeFlag & 16) {
          unmountChildren(children, parentComponent, parentSuspense);
        }
        if (doRemove) {
          remove(vnode);
        }
      }
      if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeUnmounted) || shouldInvokeDirs) {
        queuePostRenderEffect(() => {
          vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
          shouldInvokeDirs && invokeDirectiveHook(vnode, null, parentComponent, "unmounted");
        }, parentSuspense);
      }
    };
    const remove = (vnode) => {
      const { type, el, anchor, transition } = vnode;
      if (type === Fragment) {
        if (vnode.patchFlag > 0 && vnode.patchFlag & 2048 && transition && !transition.persisted) {
          vnode.children.forEach((child) => {
            if (child.type === Comment) {
              hostRemove(child.el);
            } else {
              remove(child);
            }
          });
        } else {
          removeFragment(el, anchor);
        }
        return;
      }
      if (type === Static) {
        removeStaticNode(vnode);
        return;
      }
      const performRemove = () => {
        hostRemove(el);
        if (transition && !transition.persisted && transition.afterLeave) {
          transition.afterLeave();
        }
      };
      if (vnode.shapeFlag & 1 && transition && !transition.persisted) {
        const { leave, delayLeave } = transition;
        const performLeave = () => leave(el, performRemove);
        if (delayLeave) {
          delayLeave(vnode.el, performRemove, performLeave);
        } else {
          performLeave();
        }
      } else {
        performRemove();
      }
    };
    const removeFragment = (cur, end) => {
      let next;
      while (cur !== end) {
        next = hostNextSibling(cur);
        hostRemove(cur);
        cur = next;
      }
      hostRemove(end);
    };
    const unmountComponent = (instance, parentSuspense, doRemove) => {
      if (instance.type.__hmrId) {
        unregisterHMR(instance);
      }
      const { bum, scope, update, subTree, um } = instance;
      if (bum) {
        invokeArrayFns(bum);
      }
      scope.stop();
      if (update) {
        update.active = false;
        unmount(subTree, instance, parentSuspense, doRemove);
      }
      if (um) {
        queuePostRenderEffect(um, parentSuspense);
      }
      queuePostRenderEffect(() => {
        instance.isUnmounted = true;
      }, parentSuspense);
      if (parentSuspense && parentSuspense.pendingBranch && !parentSuspense.isUnmounted && instance.asyncDep && !instance.asyncResolved && instance.suspenseId === parentSuspense.pendingId) {
        parentSuspense.deps--;
        if (parentSuspense.deps === 0) {
          parentSuspense.resolve();
        }
      }
      {
        devtoolsComponentRemoved(instance);
      }
    };
    const unmountChildren = (children, parentComponent, parentSuspense, doRemove = false, optimized = false, start = 0) => {
      for (let i = start; i < children.length; i++) {
        unmount(children[i], parentComponent, parentSuspense, doRemove, optimized);
      }
    };
    const getNextHostNode = (vnode) => {
      if (vnode.shapeFlag & 6) {
        return getNextHostNode(vnode.component.subTree);
      }
      if (vnode.shapeFlag & 128) {
        return vnode.suspense.next();
      }
      return hostNextSibling(vnode.anchor || vnode.el);
    };
    const render = (vnode, container, isSVG) => {
      if (vnode == null) {
        if (container._vnode) {
          unmount(container._vnode, null, null, true);
        }
      } else {
        patch(container._vnode || null, vnode, container, null, null, null, isSVG);
      }
      flushPreFlushCbs();
      flushPostFlushCbs();
      container._vnode = vnode;
    };
    const internals = {
      p: patch,
      um: unmount,
      m: move,
      r: remove,
      mt: mountComponent,
      mc: mountChildren,
      pc: patchChildren,
      pbc: patchBlockChildren,
      n: getNextHostNode,
      o: options
    };
    let hydrate;
    let hydrateNode;
    if (createHydrationFns) {
      [hydrate, hydrateNode] = createHydrationFns(
        internals
      );
    }
    return {
      render,
      hydrate,
      createApp: createAppAPI(render, hydrate)
    };
  }
  function toggleRecurse({ effect, update }, allowed) {
    effect.allowRecurse = update.allowRecurse = allowed;
  }
  function traverseStaticChildren(n1, n2, shallow = false) {
    const ch1 = n1.children;
    const ch2 = n2.children;
    if (isArray$1(ch1) && isArray$1(ch2)) {
      for (let i = 0; i < ch1.length; i++) {
        const c1 = ch1[i];
        let c2 = ch2[i];
        if (c2.shapeFlag & 1 && !c2.dynamicChildren) {
          if (c2.patchFlag <= 0 || c2.patchFlag === 32) {
            c2 = ch2[i] = cloneIfMounted(ch2[i]);
            c2.el = c1.el;
          }
          if (!shallow)
            traverseStaticChildren(c1, c2);
        }
        if (c2.type === Text) {
          c2.el = c1.el;
        }
        if (c2.type === Comment && !c2.el) {
          c2.el = c1.el;
        }
      }
    }
  }
  function getSequence(arr) {
    const p = arr.slice();
    const result = [0];
    let i, j, u, v, c;
    const len = arr.length;
    for (i = 0; i < len; i++) {
      const arrI = arr[i];
      if (arrI !== 0) {
        j = result[result.length - 1];
        if (arr[j] < arrI) {
          p[i] = j;
          result.push(i);
          continue;
        }
        u = 0;
        v = result.length - 1;
        while (u < v) {
          c = u + v >> 1;
          if (arr[result[c]] < arrI) {
            u = c + 1;
          } else {
            v = c;
          }
        }
        if (arrI < arr[result[u]]) {
          if (u > 0) {
            p[i] = result[u - 1];
          }
          result[u] = i;
        }
      }
    }
    u = result.length;
    v = result[u - 1];
    while (u-- > 0) {
      result[u] = v;
      v = p[v];
    }
    return result;
  }

  const isTeleport = (type) => type.__isTeleport;
  const isTeleportDisabled = (props) => props && (props.disabled || props.disabled === "");
  const isTargetSVG = (target) => typeof SVGElement !== "undefined" && target instanceof SVGElement;
  const resolveTarget = (props, select) => {
    const targetSelector = props && props.to;
    if (isString(targetSelector)) {
      if (!select) {
        return null;
      } else {
        const target = select(targetSelector);
        return target;
      }
    } else {
      if (!targetSelector && !isTeleportDisabled(props)) ;
      return targetSelector;
    }
  };
  const TeleportImpl = {
    __isTeleport: true,
    process(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, internals) {
      const {
        mc: mountChildren,
        pc: patchChildren,
        pbc: patchBlockChildren,
        o: { insert, querySelector, createText, createComment }
      } = internals;
      const disabled = isTeleportDisabled(n2.props);
      let { shapeFlag, children, dynamicChildren } = n2;
      if (isHmrUpdating) {
        optimized = false;
        dynamicChildren = null;
      }
      if (n1 == null) {
        const placeholder = n2.el = createComment("teleport start") ;
        const mainAnchor = n2.anchor = createComment("teleport end") ;
        insert(placeholder, container, anchor);
        insert(mainAnchor, container, anchor);
        const target = n2.target = resolveTarget(n2.props, querySelector);
        const targetAnchor = n2.targetAnchor = createText("");
        if (target) {
          insert(targetAnchor, target);
          isSVG = isSVG || isTargetSVG(target);
        }
        const mount = (container2, anchor2) => {
          if (shapeFlag & 16) {
            mountChildren(
              children,
              container2,
              anchor2,
              parentComponent,
              parentSuspense,
              isSVG,
              slotScopeIds,
              optimized
            );
          }
        };
        if (disabled) {
          mount(container, mainAnchor);
        } else if (target) {
          mount(target, targetAnchor);
        }
      } else {
        n2.el = n1.el;
        const mainAnchor = n2.anchor = n1.anchor;
        const target = n2.target = n1.target;
        const targetAnchor = n2.targetAnchor = n1.targetAnchor;
        const wasDisabled = isTeleportDisabled(n1.props);
        const currentContainer = wasDisabled ? container : target;
        const currentAnchor = wasDisabled ? mainAnchor : targetAnchor;
        isSVG = isSVG || isTargetSVG(target);
        if (dynamicChildren) {
          patchBlockChildren(
            n1.dynamicChildren,
            dynamicChildren,
            currentContainer,
            parentComponent,
            parentSuspense,
            isSVG,
            slotScopeIds
          );
          traverseStaticChildren(n1, n2, true);
        } else if (!optimized) {
          patchChildren(
            n1,
            n2,
            currentContainer,
            currentAnchor,
            parentComponent,
            parentSuspense,
            isSVG,
            slotScopeIds,
            false
          );
        }
        if (disabled) {
          if (!wasDisabled) {
            moveTeleport(
              n2,
              container,
              mainAnchor,
              internals,
              1
            );
          }
        } else {
          if ((n2.props && n2.props.to) !== (n1.props && n1.props.to)) {
            const nextTarget = n2.target = resolveTarget(
              n2.props,
              querySelector
            );
            if (nextTarget) {
              moveTeleport(
                n2,
                nextTarget,
                null,
                internals,
                0
              );
            }
          } else if (wasDisabled) {
            moveTeleport(
              n2,
              target,
              targetAnchor,
              internals,
              1
            );
          }
        }
      }
      updateCssVars(n2);
    },
    remove(vnode, parentComponent, parentSuspense, optimized, { um: unmount, o: { remove: hostRemove } }, doRemove) {
      const { shapeFlag, children, anchor, targetAnchor, target, props } = vnode;
      if (target) {
        hostRemove(targetAnchor);
      }
      if (doRemove || !isTeleportDisabled(props)) {
        hostRemove(anchor);
        if (shapeFlag & 16) {
          for (let i = 0; i < children.length; i++) {
            const child = children[i];
            unmount(
              child,
              parentComponent,
              parentSuspense,
              true,
              !!child.dynamicChildren
            );
          }
        }
      }
    },
    move: moveTeleport,
    hydrate: hydrateTeleport
  };
  function moveTeleport(vnode, container, parentAnchor, { o: { insert }, m: move }, moveType = 2) {
    if (moveType === 0) {
      insert(vnode.targetAnchor, container, parentAnchor);
    }
    const { el, anchor, shapeFlag, children, props } = vnode;
    const isReorder = moveType === 2;
    if (isReorder) {
      insert(el, container, parentAnchor);
    }
    if (!isReorder || isTeleportDisabled(props)) {
      if (shapeFlag & 16) {
        for (let i = 0; i < children.length; i++) {
          move(
            children[i],
            container,
            parentAnchor,
            2
          );
        }
      }
    }
    if (isReorder) {
      insert(anchor, container, parentAnchor);
    }
  }
  function hydrateTeleport(node, vnode, parentComponent, parentSuspense, slotScopeIds, optimized, {
    o: { nextSibling, parentNode, querySelector }
  }, hydrateChildren) {
    const target = vnode.target = resolveTarget(
      vnode.props,
      querySelector
    );
    if (target) {
      const targetNode = target._lpa || target.firstChild;
      if (vnode.shapeFlag & 16) {
        if (isTeleportDisabled(vnode.props)) {
          vnode.anchor = hydrateChildren(
            nextSibling(node),
            vnode,
            parentNode(node),
            parentComponent,
            parentSuspense,
            slotScopeIds,
            optimized
          );
          vnode.targetAnchor = targetNode;
        } else {
          vnode.anchor = nextSibling(node);
          let targetAnchor = targetNode;
          while (targetAnchor) {
            targetAnchor = nextSibling(targetAnchor);
            if (targetAnchor && targetAnchor.nodeType === 8 && targetAnchor.data === "teleport anchor") {
              vnode.targetAnchor = targetAnchor;
              target._lpa = vnode.targetAnchor && nextSibling(vnode.targetAnchor);
              break;
            }
          }
          hydrateChildren(
            targetNode,
            vnode,
            target,
            parentComponent,
            parentSuspense,
            slotScopeIds,
            optimized
          );
        }
      }
      updateCssVars(vnode);
    }
    return vnode.anchor && nextSibling(vnode.anchor);
  }
  const Teleport = TeleportImpl;
  function updateCssVars(vnode) {
    const ctx = vnode.ctx;
    if (ctx && ctx.ut) {
      let node = vnode.children[0].el;
      while (node !== vnode.targetAnchor) {
        if (node.nodeType === 1)
          node.setAttribute("data-v-owner", ctx.uid);
        node = node.nextSibling;
      }
      ctx.ut();
    }
  }

  const Fragment = Symbol.for("v-fgt");
  const Text = Symbol.for("v-txt");
  const Comment = Symbol.for("v-cmt");
  const Static = Symbol.for("v-stc");
  const blockStack = [];
  let currentBlock = null;
  function openBlock(disableTracking = false) {
    blockStack.push(currentBlock = disableTracking ? null : []);
  }
  function closeBlock() {
    blockStack.pop();
    currentBlock = blockStack[blockStack.length - 1] || null;
  }
  let isBlockTreeEnabled = 1;
  function setBlockTracking(value) {
    isBlockTreeEnabled += value;
  }
  function setupBlock(vnode) {
    vnode.dynamicChildren = isBlockTreeEnabled > 0 ? currentBlock || EMPTY_ARR : null;
    closeBlock();
    if (isBlockTreeEnabled > 0 && currentBlock) {
      currentBlock.push(vnode);
    }
    return vnode;
  }
  function createElementBlock(type, props, children, patchFlag, dynamicProps, shapeFlag) {
    return setupBlock(
      createBaseVNode(
        type,
        props,
        children,
        patchFlag,
        dynamicProps,
        shapeFlag,
        true
        /* isBlock */
      )
    );
  }
  function createBlock(type, props, children, patchFlag, dynamicProps) {
    return setupBlock(
      createVNode(
        type,
        props,
        children,
        patchFlag,
        dynamicProps,
        true
        /* isBlock: prevent a block from tracking itself */
      )
    );
  }
  function isVNode(value) {
    return value ? value.__v_isVNode === true : false;
  }
  function isSameVNodeType(n1, n2) {
    if (n2.shapeFlag & 6 && hmrDirtyComponents.has(n2.type)) {
      n1.shapeFlag &= ~256;
      n2.shapeFlag &= ~512;
      return false;
    }
    return n1.type === n2.type && n1.key === n2.key;
  }
  let vnodeArgsTransformer;
  function transformVNodeArgs(transformer) {
    vnodeArgsTransformer = transformer;
  }
  const createVNodeWithArgsTransform = (...args) => {
    return _createVNode(
      ...vnodeArgsTransformer ? vnodeArgsTransformer(args, currentRenderingInstance) : args
    );
  };
  const InternalObjectKey = `__vInternal`;
  const normalizeKey = ({ key }) => key != null ? key : null;
  const normalizeRef = ({
    ref,
    ref_key,
    ref_for
  }) => {
    if (typeof ref === "number") {
      ref = "" + ref;
    }
    return ref != null ? isString(ref) || isRef(ref) || isFunction(ref) ? { i: currentRenderingInstance, r: ref, k: ref_key, f: !!ref_for } : ref : null;
  };
  function createBaseVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, shapeFlag = type === Fragment ? 0 : 1, isBlockNode = false, needFullChildrenNormalization = false) {
    const vnode = {
      __v_isVNode: true,
      __v_skip: true,
      type,
      props,
      key: props && normalizeKey(props),
      ref: props && normalizeRef(props),
      scopeId: currentScopeId,
      slotScopeIds: null,
      children,
      component: null,
      suspense: null,
      ssContent: null,
      ssFallback: null,
      dirs: null,
      transition: null,
      el: null,
      anchor: null,
      target: null,
      targetAnchor: null,
      staticCount: 0,
      shapeFlag,
      patchFlag,
      dynamicProps,
      dynamicChildren: null,
      appContext: null,
      ctx: currentRenderingInstance
    };
    if (needFullChildrenNormalization) {
      normalizeChildren(vnode, children);
      if (shapeFlag & 128) {
        type.normalize(vnode);
      }
    } else if (children) {
      vnode.shapeFlag |= isString(children) ? 8 : 16;
    }
    if (vnode.key !== vnode.key) {
      warn$1(`VNode created with invalid key (NaN). VNode type:`, vnode.type);
    }
    if (isBlockTreeEnabled > 0 && // avoid a block node from tracking itself
    !isBlockNode && // has current parent block
    currentBlock && // presence of a patch flag indicates this node needs patching on updates.
    // component nodes also should always be patched, because even if the
    // component doesn't need to update, it needs to persist the instance on to
    // the next vnode so that it can be properly unmounted later.
    (vnode.patchFlag > 0 || shapeFlag & 6) && // the EVENTS flag is only for hydration and if it is the only flag, the
    // vnode should not be considered dynamic due to handler caching.
    vnode.patchFlag !== 32) {
      currentBlock.push(vnode);
    }
    return vnode;
  }
  const createVNode = createVNodeWithArgsTransform ;
  function _createVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, isBlockNode = false) {
    if (!type || type === NULL_DYNAMIC_COMPONENT) {
      type = Comment;
    }
    if (isVNode(type)) {
      const cloned = cloneVNode(
        type,
        props,
        true
        /* mergeRef: true */
      );
      if (children) {
        normalizeChildren(cloned, children);
      }
      if (isBlockTreeEnabled > 0 && !isBlockNode && currentBlock) {
        if (cloned.shapeFlag & 6) {
          currentBlock[currentBlock.indexOf(type)] = cloned;
        } else {
          currentBlock.push(cloned);
        }
      }
      cloned.patchFlag |= -2;
      return cloned;
    }
    if (isClassComponent(type)) {
      type = type.__vccOpts;
    }
    if (props) {
      props = guardReactiveProps(props);
      let { class: klass, style } = props;
      if (klass && !isString(klass)) {
        props.class = normalizeClass(klass);
      }
      if (isObject$1(style)) {
        if (isProxy(style) && !isArray$1(style)) {
          style = extend({}, style);
        }
        props.style = normalizeStyle(style);
      }
    }
    const shapeFlag = isString(type) ? 1 : isSuspense(type) ? 128 : isTeleport(type) ? 64 : isObject$1(type) ? 4 : isFunction(type) ? 2 : 0;
    if (shapeFlag & 4 && isProxy(type)) {
      type = toRaw(type);
    }
    return createBaseVNode(
      type,
      props,
      children,
      patchFlag,
      dynamicProps,
      shapeFlag,
      isBlockNode,
      true
    );
  }
  function guardReactiveProps(props) {
    if (!props)
      return null;
    return isProxy(props) || InternalObjectKey in props ? extend({}, props) : props;
  }
  function cloneVNode(vnode, extraProps, mergeRef = false) {
    const { props, ref, patchFlag, children } = vnode;
    const mergedProps = extraProps ? mergeProps(props || {}, extraProps) : props;
    const cloned = {
      __v_isVNode: true,
      __v_skip: true,
      type: vnode.type,
      props: mergedProps,
      key: mergedProps && normalizeKey(mergedProps),
      ref: extraProps && extraProps.ref ? (
        // #2078 in the case of <component :is="vnode" ref="extra"/>
        // if the vnode itself already has a ref, cloneVNode will need to merge
        // the refs so the single vnode can be set on multiple refs
        mergeRef && ref ? isArray$1(ref) ? ref.concat(normalizeRef(extraProps)) : [ref, normalizeRef(extraProps)] : normalizeRef(extraProps)
      ) : ref,
      scopeId: vnode.scopeId,
      slotScopeIds: vnode.slotScopeIds,
      children: patchFlag === -1 && isArray$1(children) ? children.map(deepCloneVNode) : children,
      target: vnode.target,
      targetAnchor: vnode.targetAnchor,
      staticCount: vnode.staticCount,
      shapeFlag: vnode.shapeFlag,
      // if the vnode is cloned with extra props, we can no longer assume its
      // existing patch flag to be reliable and need to add the FULL_PROPS flag.
      // note: preserve flag for fragments since they use the flag for children
      // fast paths only.
      patchFlag: extraProps && vnode.type !== Fragment ? patchFlag === -1 ? 16 : patchFlag | 16 : patchFlag,
      dynamicProps: vnode.dynamicProps,
      dynamicChildren: vnode.dynamicChildren,
      appContext: vnode.appContext,
      dirs: vnode.dirs,
      transition: vnode.transition,
      // These should technically only be non-null on mounted VNodes. However,
      // they *should* be copied for kept-alive vnodes. So we just always copy
      // them since them being non-null during a mount doesn't affect the logic as
      // they will simply be overwritten.
      component: vnode.component,
      suspense: vnode.suspense,
      ssContent: vnode.ssContent && cloneVNode(vnode.ssContent),
      ssFallback: vnode.ssFallback && cloneVNode(vnode.ssFallback),
      el: vnode.el,
      anchor: vnode.anchor,
      ctx: vnode.ctx,
      ce: vnode.ce
    };
    return cloned;
  }
  function deepCloneVNode(vnode) {
    const cloned = cloneVNode(vnode);
    if (isArray$1(vnode.children)) {
      cloned.children = vnode.children.map(deepCloneVNode);
    }
    return cloned;
  }
  function createTextVNode(text = " ", flag = 0) {
    return createVNode(Text, null, text, flag);
  }
  function createStaticVNode(content, numberOfNodes) {
    const vnode = createVNode(Static, null, content);
    vnode.staticCount = numberOfNodes;
    return vnode;
  }
  function createCommentVNode(text = "", asBlock = false) {
    return asBlock ? (openBlock(), createBlock(Comment, null, text)) : createVNode(Comment, null, text);
  }
  function normalizeVNode(child) {
    if (child == null || typeof child === "boolean") {
      return createVNode(Comment);
    } else if (isArray$1(child)) {
      return createVNode(
        Fragment,
        null,
        // #3666, avoid reference pollution when reusing vnode
        child.slice()
      );
    } else if (typeof child === "object") {
      return cloneIfMounted(child);
    } else {
      return createVNode(Text, null, String(child));
    }
  }
  function cloneIfMounted(child) {
    return child.el === null && child.patchFlag !== -1 || child.memo ? child : cloneVNode(child);
  }
  function normalizeChildren(vnode, children) {
    let type = 0;
    const { shapeFlag } = vnode;
    if (children == null) {
      children = null;
    } else if (isArray$1(children)) {
      type = 16;
    } else if (typeof children === "object") {
      if (shapeFlag & (1 | 64)) {
        const slot = children.default;
        if (slot) {
          slot._c && (slot._d = false);
          normalizeChildren(vnode, slot());
          slot._c && (slot._d = true);
        }
        return;
      } else {
        type = 32;
        const slotFlag = children._;
        if (!slotFlag && !(InternalObjectKey in children)) {
          children._ctx = currentRenderingInstance;
        } else if (slotFlag === 3 && currentRenderingInstance) {
          if (currentRenderingInstance.slots._ === 1) {
            children._ = 1;
          } else {
            children._ = 2;
            vnode.patchFlag |= 1024;
          }
        }
      }
    } else if (isFunction(children)) {
      children = { default: children, _ctx: currentRenderingInstance };
      type = 32;
    } else {
      children = String(children);
      if (shapeFlag & 64) {
        type = 16;
        children = [createTextVNode(children)];
      } else {
        type = 8;
      }
    }
    vnode.children = children;
    vnode.shapeFlag |= type;
  }
  function mergeProps(...args) {
    const ret = {};
    for (let i = 0; i < args.length; i++) {
      const toMerge = args[i];
      for (const key in toMerge) {
        if (key === "class") {
          if (ret.class !== toMerge.class) {
            ret.class = normalizeClass([ret.class, toMerge.class]);
          }
        } else if (key === "style") {
          ret.style = normalizeStyle([ret.style, toMerge.style]);
        } else if (isOn(key)) {
          const existing = ret[key];
          const incoming = toMerge[key];
          if (incoming && existing !== incoming && !(isArray$1(existing) && existing.includes(incoming))) {
            ret[key] = existing ? [].concat(existing, incoming) : incoming;
          }
        } else if (key !== "") {
          ret[key] = toMerge[key];
        }
      }
    }
    return ret;
  }
  function invokeVNodeHook(hook, instance, vnode, prevVNode = null) {
    callWithAsyncErrorHandling(hook, instance, 7, [
      vnode,
      prevVNode
    ]);
  }

  const emptyAppContext = createAppContext();
  let uid = 0;
  function createComponentInstance(vnode, parent, suspense) {
    const type = vnode.type;
    const appContext = (parent ? parent.appContext : vnode.appContext) || emptyAppContext;
    const instance = {
      uid: uid++,
      vnode,
      type,
      parent,
      appContext,
      root: null,
      // to be immediately set
      next: null,
      subTree: null,
      // will be set synchronously right after creation
      effect: null,
      update: null,
      // will be set synchronously right after creation
      scope: new EffectScope(
        true
        /* detached */
      ),
      render: null,
      proxy: null,
      exposed: null,
      exposeProxy: null,
      withProxy: null,
      provides: parent ? parent.provides : Object.create(appContext.provides),
      accessCache: null,
      renderCache: [],
      // local resolved assets
      components: null,
      directives: null,
      // resolved props and emits options
      propsOptions: normalizePropsOptions(type, appContext),
      emitsOptions: normalizeEmitsOptions(type, appContext),
      // emit
      emit: null,
      // to be set immediately
      emitted: null,
      // props default value
      propsDefaults: EMPTY_OBJ,
      // inheritAttrs
      inheritAttrs: type.inheritAttrs,
      // state
      ctx: EMPTY_OBJ,
      data: EMPTY_OBJ,
      props: EMPTY_OBJ,
      attrs: EMPTY_OBJ,
      slots: EMPTY_OBJ,
      refs: EMPTY_OBJ,
      setupState: EMPTY_OBJ,
      setupContext: null,
      attrsProxy: null,
      slotsProxy: null,
      // suspense related
      suspense,
      suspenseId: suspense ? suspense.pendingId : 0,
      asyncDep: null,
      asyncResolved: false,
      // lifecycle hooks
      // not using enums here because it results in computed properties
      isMounted: false,
      isUnmounted: false,
      isDeactivated: false,
      bc: null,
      c: null,
      bm: null,
      m: null,
      bu: null,
      u: null,
      um: null,
      bum: null,
      da: null,
      a: null,
      rtg: null,
      rtc: null,
      ec: null,
      sp: null
    };
    {
      instance.ctx = createDevRenderContext(instance);
    }
    instance.root = parent ? parent.root : instance;
    instance.emit = emit.bind(null, instance);
    if (vnode.ce) {
      vnode.ce(instance);
    }
    return instance;
  }
  let currentInstance = null;
  const getCurrentInstance = () => currentInstance || currentRenderingInstance;
  let internalSetCurrentInstance;
  let globalCurrentInstanceSetters;
  let settersKey = "__VUE_INSTANCE_SETTERS__";
  {
    if (!(globalCurrentInstanceSetters = getGlobalThis()[settersKey])) {
      globalCurrentInstanceSetters = getGlobalThis()[settersKey] = [];
    }
    globalCurrentInstanceSetters.push((i) => currentInstance = i);
    internalSetCurrentInstance = (instance) => {
      if (globalCurrentInstanceSetters.length > 1) {
        globalCurrentInstanceSetters.forEach((s) => s(instance));
      } else {
        globalCurrentInstanceSetters[0](instance);
      }
    };
  }
  const setCurrentInstance = (instance) => {
    internalSetCurrentInstance(instance);
    instance.scope.on();
  };
  const unsetCurrentInstance = () => {
    currentInstance && currentInstance.scope.off();
    internalSetCurrentInstance(null);
  };
  const isBuiltInTag = /* @__PURE__ */ makeMap("slot,component");
  function validateComponentName(name, config) {
    const appIsNativeTag = config.isNativeTag || NO;
    if (isBuiltInTag(name) || appIsNativeTag(name)) ;
  }
  function isStatefulComponent(instance) {
    return instance.vnode.shapeFlag & 4;
  }
  let isInSSRComponentSetup = false;
  function setupComponent(instance, isSSR = false) {
    isInSSRComponentSetup = isSSR;
    const { props, children } = instance.vnode;
    const isStateful = isStatefulComponent(instance);
    initProps(instance, props, isStateful, isSSR);
    initSlots(instance, children);
    const setupResult = isStateful ? setupStatefulComponent(instance, isSSR) : void 0;
    isInSSRComponentSetup = false;
    return setupResult;
  }
  function setupStatefulComponent(instance, isSSR) {
    var _a;
    const Component = instance.type;
    {
      if (Component.name) {
        validateComponentName(Component.name, instance.appContext.config);
      }
      if (Component.components) {
        const names = Object.keys(Component.components);
        for (let i = 0; i < names.length; i++) {
          validateComponentName(names[i], instance.appContext.config);
        }
      }
      if (Component.directives) {
        const names = Object.keys(Component.directives);
        for (let i = 0; i < names.length; i++) {
          validateDirectiveName(names[i]);
        }
      }
      if (Component.compilerOptions && isRuntimeOnly()) ;
    }
    instance.accessCache = /* @__PURE__ */ Object.create(null);
    instance.proxy = markRaw(new Proxy(instance.ctx, PublicInstanceProxyHandlers));
    {
      exposePropsOnRenderContext(instance);
    }
    const { setup } = Component;
    if (setup) {
      const setupContext = instance.setupContext = setup.length > 1 ? createSetupContext(instance) : null;
      setCurrentInstance(instance);
      pauseTracking();
      const setupResult = callWithErrorHandling(
        setup,
        instance,
        0,
        [shallowReadonly(instance.props) , setupContext]
      );
      resetTracking();
      unsetCurrentInstance();
      if (isPromise$1(setupResult)) {
        setupResult.then(unsetCurrentInstance, unsetCurrentInstance);
        if (isSSR) {
          return setupResult.then((resolvedResult) => {
            handleSetupResult(instance, resolvedResult, isSSR);
          }).catch((e) => {
            handleError(e, instance, 0);
          });
        } else {
          instance.asyncDep = setupResult;
          if (!instance.suspense) {
            (_a = Component.name) != null ? _a : "Anonymous";
          }
        }
      } else {
        handleSetupResult(instance, setupResult, isSSR);
      }
    } else {
      finishComponentSetup(instance, isSSR);
    }
  }
  function handleSetupResult(instance, setupResult, isSSR) {
    if (isFunction(setupResult)) {
      if (instance.type.__ssrInlineRender) {
        instance.ssrRender = setupResult;
      } else {
        instance.render = setupResult;
      }
    } else if (isObject$1(setupResult)) {
      if (isVNode(setupResult)) ;
      {
        instance.devtoolsRawSetupState = setupResult;
      }
      instance.setupState = proxyRefs(setupResult);
      {
        exposeSetupStateOnRenderContext(instance);
      }
    } else ;
    finishComponentSetup(instance, isSSR);
  }
  let compile;
  let installWithProxy;
  function registerRuntimeCompiler(_compile) {
    compile = _compile;
    installWithProxy = (i) => {
      if (i.render._rc) {
        i.withProxy = new Proxy(i.ctx, RuntimeCompiledPublicInstanceProxyHandlers);
      }
    };
  }
  const isRuntimeOnly = () => !compile;
  function finishComponentSetup(instance, isSSR, skipOptions) {
    const Component = instance.type;
    if (!instance.render) {
      if (!isSSR && compile && !Component.render) {
        const template = Component.template || resolveMergedOptions(instance).template;
        if (template) {
          {
            startMeasure(instance, `compile`);
          }
          const { isCustomElement, compilerOptions } = instance.appContext.config;
          const { delimiters, compilerOptions: componentCompilerOptions } = Component;
          const finalCompilerOptions = extend(
            extend(
              {
                isCustomElement,
                delimiters
              },
              compilerOptions
            ),
            componentCompilerOptions
          );
          Component.render = compile(template, finalCompilerOptions);
          {
            endMeasure(instance, `compile`);
          }
        }
      }
      instance.render = Component.render || NOOP;
      if (installWithProxy) {
        installWithProxy(instance);
      }
    }
    if (!Component.render && instance.render === NOOP && !isSSR) {
      if (!compile && Component.template) ;
    }
  }
  function getAttrsProxy(instance) {
    return instance.attrsProxy || (instance.attrsProxy = new Proxy(
      instance.attrs,
      {
        get(target, key) {
          markAttrsAccessed();
          track(instance, "get", "$attrs");
          return target[key];
        },
        set() {
          return false;
        },
        deleteProperty() {
          return false;
        }
      } 
    ));
  }
  function getSlotsProxy(instance) {
    return instance.slotsProxy || (instance.slotsProxy = new Proxy(instance.slots, {
      get(target, key) {
        track(instance, "get", "$slots");
        return target[key];
      }
    }));
  }
  function createSetupContext(instance) {
    const expose = (exposed) => {
      {
        if (instance.exposed) ;
        if (exposed != null) {
          let exposedType = typeof exposed;
          if (exposedType === "object") {
            if (isArray$1(exposed)) {
              exposedType = "array";
            } else if (isRef(exposed)) {
              exposedType = "ref";
            }
          }
        }
      }
      instance.exposed = exposed || {};
    };
    {
      return Object.freeze({
        get attrs() {
          return getAttrsProxy(instance);
        },
        get slots() {
          return getSlotsProxy(instance);
        },
        get emit() {
          return (event, ...args) => instance.emit(event, ...args);
        },
        expose
      });
    }
  }
  function getExposeProxy(instance) {
    if (instance.exposed) {
      return instance.exposeProxy || (instance.exposeProxy = new Proxy(proxyRefs(markRaw(instance.exposed)), {
        get(target, key) {
          if (key in target) {
            return target[key];
          } else if (key in publicPropertiesMap) {
            return publicPropertiesMap[key](instance);
          }
        },
        has(target, key) {
          return key in target || key in publicPropertiesMap;
        }
      }));
    }
  }
  const classifyRE = /(?:^|[-_])(\w)/g;
  const classify = (str) => str.replace(classifyRE, (c) => c.toUpperCase()).replace(/[-_]/g, "");
  function getComponentName(Component, includeInferred = true) {
    return isFunction(Component) ? Component.displayName || Component.name : Component.name || includeInferred && Component.__name;
  }
  function formatComponentName(instance, Component, isRoot = false) {
    let name = getComponentName(Component);
    if (!name && Component.__file) {
      const match = Component.__file.match(/([^/\\]+)\.\w+$/);
      if (match) {
        name = match[1];
      }
    }
    if (!name && instance && instance.parent) {
      const inferFromRegistry = (registry) => {
        for (const key in registry) {
          if (registry[key] === Component) {
            return key;
          }
        }
      };
      name = inferFromRegistry(
        instance.components || instance.parent.type.components
      ) || inferFromRegistry(instance.appContext.components);
    }
    return name ? classify(name) : isRoot ? `App` : `Anonymous`;
  }
  function isClassComponent(value) {
    return isFunction(value) && "__vccOpts" in value;
  }

  const computed = (getterOrOptions, debugOptions) => {
    return computed$1(getterOrOptions, debugOptions, isInSSRComponentSetup);
  };

  function h(type, propsOrChildren, children) {
    const l = arguments.length;
    if (l === 2) {
      if (isObject$1(propsOrChildren) && !isArray$1(propsOrChildren)) {
        if (isVNode(propsOrChildren)) {
          return createVNode(type, null, [propsOrChildren]);
        }
        return createVNode(type, propsOrChildren);
      } else {
        return createVNode(type, null, propsOrChildren);
      }
    } else {
      if (l > 3) {
        children = Array.prototype.slice.call(arguments, 2);
      } else if (l === 3 && isVNode(children)) {
        children = [children];
      }
      return createVNode(type, propsOrChildren, children);
    }
  }

  const ssrContextKey = Symbol.for("v-scx");
  const useSSRContext = () => {
    {
      const ctx = inject(ssrContextKey);
      return ctx;
    }
  };

  function initCustomFormatter() {
    {
      return;
    }
  }

  function withMemo(memo, render, cache, index) {
    const cached = cache[index];
    if (cached && isMemoSame(cached, memo)) {
      return cached;
    }
    const ret = render();
    ret.memo = memo.slice();
    return cache[index] = ret;
  }
  function isMemoSame(cached, memo) {
    const prev = cached.memo;
    if (prev.length != memo.length) {
      return false;
    }
    for (let i = 0; i < prev.length; i++) {
      if (hasChanged(prev[i], memo[i])) {
        return false;
      }
    }
    if (isBlockTreeEnabled > 0 && currentBlock) {
      currentBlock.push(cached);
    }
    return true;
  }

  const version = "3.3.1";
  const _ssrUtils = {
    createComponentInstance,
    setupComponent,
    renderComponentRoot,
    setCurrentRenderingInstance,
    isVNode: isVNode,
    normalizeVNode
  };
  const ssrUtils = _ssrUtils ;
  const resolveFilter = null;
  const compatUtils = null;

  const svgNS = "http://www.w3.org/2000/svg";
  const doc = typeof document !== "undefined" ? document : null;
  const templateContainer = doc && /* @__PURE__ */ doc.createElement("template");
  const nodeOps = {
    insert: (child, parent, anchor) => {
      parent.insertBefore(child, anchor || null);
    },
    remove: (child) => {
      const parent = child.parentNode;
      if (parent) {
        parent.removeChild(child);
      }
    },
    createElement: (tag, isSVG, is, props) => {
      const el = isSVG ? doc.createElementNS(svgNS, tag) : doc.createElement(tag, is ? { is } : void 0);
      if (tag === "select" && props && props.multiple != null) {
        el.setAttribute("multiple", props.multiple);
      }
      return el;
    },
    createText: (text) => doc.createTextNode(text),
    createComment: (text) => doc.createComment(text),
    setText: (node, text) => {
      node.nodeValue = text;
    },
    setElementText: (el, text) => {
      el.textContent = text;
    },
    parentNode: (node) => node.parentNode,
    nextSibling: (node) => node.nextSibling,
    querySelector: (selector) => doc.querySelector(selector),
    setScopeId(el, id) {
      el.setAttribute(id, "");
    },
    // __UNSAFE__
    // Reason: innerHTML.
    // Static content here can only come from compiled templates.
    // As long as the user only uses trusted templates, this is safe.
    insertStaticContent(content, parent, anchor, isSVG, start, end) {
      const before = anchor ? anchor.previousSibling : parent.lastChild;
      if (start && (start === end || start.nextSibling)) {
        while (true) {
          parent.insertBefore(start.cloneNode(true), anchor);
          if (start === end || !(start = start.nextSibling))
            break;
        }
      } else {
        templateContainer.innerHTML = isSVG ? `<svg>${content}</svg>` : content;
        const template = templateContainer.content;
        if (isSVG) {
          const wrapper = template.firstChild;
          while (wrapper.firstChild) {
            template.appendChild(wrapper.firstChild);
          }
          template.removeChild(wrapper);
        }
        parent.insertBefore(template, anchor);
      }
      return [
        // first
        before ? before.nextSibling : parent.firstChild,
        // last
        anchor ? anchor.previousSibling : parent.lastChild
      ];
    }
  };

  function patchClass(el, value, isSVG) {
    const transitionClasses = el._vtc;
    if (transitionClasses) {
      value = (value ? [value, ...transitionClasses] : [...transitionClasses]).join(" ");
    }
    if (value == null) {
      el.removeAttribute("class");
    } else if (isSVG) {
      el.setAttribute("class", value);
    } else {
      el.className = value;
    }
  }

  function patchStyle(el, prev, next) {
    const style = el.style;
    const isCssString = isString(next);
    if (next && !isCssString) {
      if (prev && !isString(prev)) {
        for (const key in prev) {
          if (next[key] == null) {
            setStyle(style, key, "");
          }
        }
      }
      for (const key in next) {
        setStyle(style, key, next[key]);
      }
    } else {
      const currentDisplay = style.display;
      if (isCssString) {
        if (prev !== next) {
          style.cssText = next;
        }
      } else if (prev) {
        el.removeAttribute("style");
      }
      if ("_vod" in el) {
        style.display = currentDisplay;
      }
    }
  }
  const semicolonRE = /[^\\];\s*$/;
  const importantRE = /\s*!important$/;
  function setStyle(style, name, val) {
    if (isArray$1(val)) {
      val.forEach((v) => setStyle(style, name, v));
    } else {
      if (val == null)
        val = "";
      {
        if (semicolonRE.test(val)) ;
      }
      if (name.startsWith("--")) {
        style.setProperty(name, val);
      } else {
        const prefixed = autoPrefix(style, name);
        if (importantRE.test(val)) {
          style.setProperty(
            hyphenate(prefixed),
            val.replace(importantRE, ""),
            "important"
          );
        } else {
          style[prefixed] = val;
        }
      }
    }
  }
  const prefixes = ["Webkit", "Moz", "ms"];
  const prefixCache = {};
  function autoPrefix(style, rawName) {
    const cached = prefixCache[rawName];
    if (cached) {
      return cached;
    }
    let name = camelize(rawName);
    if (name !== "filter" && name in style) {
      return prefixCache[rawName] = name;
    }
    name = capitalize(name);
    for (let i = 0; i < prefixes.length; i++) {
      const prefixed = prefixes[i] + name;
      if (prefixed in style) {
        return prefixCache[rawName] = prefixed;
      }
    }
    return rawName;
  }

  const xlinkNS = "http://www.w3.org/1999/xlink";
  function patchAttr(el, key, value, isSVG, instance) {
    if (isSVG && key.startsWith("xlink:")) {
      if (value == null) {
        el.removeAttributeNS(xlinkNS, key.slice(6, key.length));
      } else {
        el.setAttributeNS(xlinkNS, key, value);
      }
    } else {
      const isBoolean = isSpecialBooleanAttr(key);
      if (value == null || isBoolean && !includeBooleanAttr(value)) {
        el.removeAttribute(key);
      } else {
        el.setAttribute(key, isBoolean ? "" : value);
      }
    }
  }

  function patchDOMProp(el, key, value, prevChildren, parentComponent, parentSuspense, unmountChildren) {
    if (key === "innerHTML" || key === "textContent") {
      if (prevChildren) {
        unmountChildren(prevChildren, parentComponent, parentSuspense);
      }
      el[key] = value == null ? "" : value;
      return;
    }
    const tag = el.tagName;
    if (key === "value" && tag !== "PROGRESS" && // custom elements may use _value internally
    !tag.includes("-")) {
      el._value = value;
      const oldValue = tag === "OPTION" ? el.getAttribute("value") : el.value;
      const newValue = value == null ? "" : value;
      if (oldValue !== newValue) {
        el.value = newValue;
      }
      if (value == null) {
        el.removeAttribute(key);
      }
      return;
    }
    let needRemove = false;
    if (value === "" || value == null) {
      const type = typeof el[key];
      if (type === "boolean") {
        value = includeBooleanAttr(value);
      } else if (value == null && type === "string") {
        value = "";
        needRemove = true;
      } else if (type === "number") {
        value = 0;
        needRemove = true;
      }
    }
    try {
      el[key] = value;
    } catch (e) {
      if (!needRemove) {
        warn$1(
          `Failed setting prop "${key}" on <${tag.toLowerCase()}>: value ${value} is invalid.`,
          e
        );
      }
    }
    needRemove && el.removeAttribute(key);
  }

  function addEventListener(el, event, handler, options) {
    el.addEventListener(event, handler, options);
  }
  function removeEventListener(el, event, handler, options) {
    el.removeEventListener(event, handler, options);
  }
  function patchEvent(el, rawName, prevValue, nextValue, instance = null) {
    const invokers = el._vei || (el._vei = {});
    const existingInvoker = invokers[rawName];
    if (nextValue && existingInvoker) {
      existingInvoker.value = nextValue;
    } else {
      const [name, options] = parseName(rawName);
      if (nextValue) {
        const invoker = invokers[rawName] = createInvoker(nextValue, instance);
        addEventListener(el, name, invoker, options);
      } else if (existingInvoker) {
        removeEventListener(el, name, existingInvoker, options);
        invokers[rawName] = void 0;
      }
    }
  }
  const optionsModifierRE = /(?:Once|Passive|Capture)$/;
  function parseName(name) {
    let options;
    if (optionsModifierRE.test(name)) {
      options = {};
      let m;
      while (m = name.match(optionsModifierRE)) {
        name = name.slice(0, name.length - m[0].length);
        options[m[0].toLowerCase()] = true;
      }
    }
    const event = name[2] === ":" ? name.slice(3) : hyphenate(name.slice(2));
    return [event, options];
  }
  let cachedNow = 0;
  const p = /* @__PURE__ */ Promise.resolve();
  const getNow = () => cachedNow || (p.then(() => cachedNow = 0), cachedNow = Date.now());
  function createInvoker(initialValue, instance) {
    const invoker = (e) => {
      if (!e._vts) {
        e._vts = Date.now();
      } else if (e._vts <= invoker.attached) {
        return;
      }
      callWithAsyncErrorHandling(
        patchStopImmediatePropagation(e, invoker.value),
        instance,
        5,
        [e]
      );
    };
    invoker.value = initialValue;
    invoker.attached = getNow();
    return invoker;
  }
  function patchStopImmediatePropagation(e, value) {
    if (isArray$1(value)) {
      const originalStop = e.stopImmediatePropagation;
      e.stopImmediatePropagation = () => {
        originalStop.call(e);
        e._stopped = true;
      };
      return value.map((fn) => (e2) => !e2._stopped && fn && fn(e2));
    } else {
      return value;
    }
  }

  const nativeOnRE = /^on[a-z]/;
  const patchProp = (el, key, prevValue, nextValue, isSVG = false, prevChildren, parentComponent, parentSuspense, unmountChildren) => {
    if (key === "class") {
      patchClass(el, nextValue, isSVG);
    } else if (key === "style") {
      patchStyle(el, prevValue, nextValue);
    } else if (isOn(key)) {
      if (!isModelListener(key)) {
        patchEvent(el, key, prevValue, nextValue, parentComponent);
      }
    } else if (key[0] === "." ? (key = key.slice(1), true) : key[0] === "^" ? (key = key.slice(1), false) : shouldSetAsProp(el, key, nextValue, isSVG)) {
      patchDOMProp(
        el,
        key,
        nextValue,
        prevChildren,
        parentComponent,
        parentSuspense,
        unmountChildren
      );
    } else {
      if (key === "true-value") {
        el._trueValue = nextValue;
      } else if (key === "false-value") {
        el._falseValue = nextValue;
      }
      patchAttr(el, key, nextValue, isSVG);
    }
  };
  function shouldSetAsProp(el, key, value, isSVG) {
    if (isSVG) {
      if (key === "innerHTML" || key === "textContent") {
        return true;
      }
      if (key in el && nativeOnRE.test(key) && isFunction(value)) {
        return true;
      }
      return false;
    }
    if (key === "spellcheck" || key === "draggable" || key === "translate") {
      return false;
    }
    if (key === "form") {
      return false;
    }
    if (key === "list" && el.tagName === "INPUT") {
      return false;
    }
    if (key === "type" && el.tagName === "TEXTAREA") {
      return false;
    }
    if (nativeOnRE.test(key) && isString(value)) {
      return false;
    }
    return key in el;
  }

  function defineCustomElement(options, hydrate2) {
    const Comp = defineComponent(options);
    class VueCustomElement extends VueElement {
      constructor(initialProps) {
        super(Comp, initialProps, hydrate2);
      }
    }
    VueCustomElement.def = Comp;
    return VueCustomElement;
  }
  const defineSSRCustomElement = (options) => {
    return defineCustomElement(options, hydrate);
  };
  const BaseClass = typeof HTMLElement !== "undefined" ? HTMLElement : class {
  };
  class VueElement extends BaseClass {
    constructor(_def, _props = {}, hydrate2) {
      super();
      this._def = _def;
      this._props = _props;
      /**
       * @internal
       */
      this._instance = null;
      this._connected = false;
      this._resolved = false;
      this._numberProps = null;
      if (this.shadowRoot && hydrate2) {
        hydrate2(this._createVNode(), this.shadowRoot);
      } else {
        if (this.shadowRoot) ;
        this.attachShadow({ mode: "open" });
        if (!this._def.__asyncLoader) {
          this._resolveProps(this._def);
        }
      }
    }
    connectedCallback() {
      this._connected = true;
      if (!this._instance) {
        if (this._resolved) {
          this._update();
        } else {
          this._resolveDef();
        }
      }
    }
    disconnectedCallback() {
      this._connected = false;
      nextTick(() => {
        if (!this._connected) {
          render$y(null, this.shadowRoot);
          this._instance = null;
        }
      });
    }
    /**
     * resolve inner component definition (handle possible async component)
     */
    _resolveDef() {
      this._resolved = true;
      for (let i = 0; i < this.attributes.length; i++) {
        this._setAttr(this.attributes[i].name);
      }
      new MutationObserver((mutations) => {
        for (const m of mutations) {
          this._setAttr(m.attributeName);
        }
      }).observe(this, { attributes: true });
      const resolve = (def, isAsync = false) => {
        const { props, styles } = def;
        let numberProps;
        if (props && !isArray$1(props)) {
          for (const key in props) {
            const opt = props[key];
            if (opt === Number || opt && opt.type === Number) {
              if (key in this._props) {
                this._props[key] = toNumber(this._props[key]);
              }
              (numberProps || (numberProps = /* @__PURE__ */ Object.create(null)))[camelize(key)] = true;
            }
          }
        }
        this._numberProps = numberProps;
        if (isAsync) {
          this._resolveProps(def);
        }
        this._applyStyles(styles);
        this._update();
      };
      const asyncDef = this._def.__asyncLoader;
      if (asyncDef) {
        asyncDef().then((def) => resolve(def, true));
      } else {
        resolve(this._def);
      }
    }
    _resolveProps(def) {
      const { props } = def;
      const declaredPropKeys = isArray$1(props) ? props : Object.keys(props || {});
      for (const key of Object.keys(this)) {
        if (key[0] !== "_" && declaredPropKeys.includes(key)) {
          this._setProp(key, this[key], true, false);
        }
      }
      for (const key of declaredPropKeys.map(camelize)) {
        Object.defineProperty(this, key, {
          get() {
            return this._getProp(key);
          },
          set(val) {
            this._setProp(key, val);
          }
        });
      }
    }
    _setAttr(key) {
      let value = this.getAttribute(key);
      const camelKey = camelize(key);
      if (this._numberProps && this._numberProps[camelKey]) {
        value = toNumber(value);
      }
      this._setProp(camelKey, value, false);
    }
    /**
     * @internal
     */
    _getProp(key) {
      return this._props[key];
    }
    /**
     * @internal
     */
    _setProp(key, val, shouldReflect = true, shouldUpdate = true) {
      if (val !== this._props[key]) {
        this._props[key] = val;
        if (shouldUpdate && this._instance) {
          this._update();
        }
        if (shouldReflect) {
          if (val === true) {
            this.setAttribute(hyphenate(key), "");
          } else if (typeof val === "string" || typeof val === "number") {
            this.setAttribute(hyphenate(key), val + "");
          } else if (!val) {
            this.removeAttribute(hyphenate(key));
          }
        }
      }
    }
    _update() {
      render$y(this._createVNode(), this.shadowRoot);
    }
    _createVNode() {
      const vnode = createVNode(this._def, extend({}, this._props));
      if (!this._instance) {
        vnode.ce = (instance) => {
          this._instance = instance;
          instance.isCE = true;
          {
            instance.ceReload = (newStyles) => {
              if (this._styles) {
                this._styles.forEach((s) => this.shadowRoot.removeChild(s));
                this._styles.length = 0;
              }
              this._applyStyles(newStyles);
              this._instance = null;
              this._update();
            };
          }
          const dispatch = (event, args) => {
            this.dispatchEvent(
              new CustomEvent(event, {
                detail: args
              })
            );
          };
          instance.emit = (event, ...args) => {
            dispatch(event, args);
            if (hyphenate(event) !== event) {
              dispatch(hyphenate(event), args);
            }
          };
          let parent = this;
          while (parent = parent && (parent.parentNode || parent.host)) {
            if (parent instanceof VueElement) {
              instance.parent = parent._instance;
              instance.provides = parent._instance.provides;
              break;
            }
          }
        };
      }
      return vnode;
    }
    _applyStyles(styles) {
      if (styles) {
        styles.forEach((css) => {
          const s = document.createElement("style");
          s.textContent = css;
          this.shadowRoot.appendChild(s);
          {
            (this._styles || (this._styles = [])).push(s);
          }
        });
      }
    }
  }

  function useCssModule(name = "$style") {
    {
      const instance = getCurrentInstance();
      if (!instance) {
        return EMPTY_OBJ;
      }
      const modules = instance.type.__cssModules;
      if (!modules) {
        return EMPTY_OBJ;
      }
      const mod = modules[name];
      if (!mod) {
        return EMPTY_OBJ;
      }
      return mod;
    }
  }

  function useCssVars(getter) {
    const instance = getCurrentInstance();
    if (!instance) {
      return;
    }
    const updateTeleports = instance.ut = (vars = getter(instance.proxy)) => {
      Array.from(
        document.querySelectorAll(`[data-v-owner="${instance.uid}"]`)
      ).forEach((node) => setVarsOnNode(node, vars));
    };
    const setVars = () => {
      const vars = getter(instance.proxy);
      setVarsOnVNode(instance.subTree, vars);
      updateTeleports(vars);
    };
    watchPostEffect(setVars);
    onMounted(() => {
      const ob = new MutationObserver(setVars);
      ob.observe(instance.subTree.el.parentNode, { childList: true });
      onUnmounted(() => ob.disconnect());
    });
  }
  function setVarsOnVNode(vnode, vars) {
    if (vnode.shapeFlag & 128) {
      const suspense = vnode.suspense;
      vnode = suspense.activeBranch;
      if (suspense.pendingBranch && !suspense.isHydrating) {
        suspense.effects.push(() => {
          setVarsOnVNode(suspense.activeBranch, vars);
        });
      }
    }
    while (vnode.component) {
      vnode = vnode.component.subTree;
    }
    if (vnode.shapeFlag & 1 && vnode.el) {
      setVarsOnNode(vnode.el, vars);
    } else if (vnode.type === Fragment) {
      vnode.children.forEach((c) => setVarsOnVNode(c, vars));
    } else if (vnode.type === Static) {
      let { el, anchor } = vnode;
      while (el) {
        setVarsOnNode(el, vars);
        if (el === anchor)
          break;
        el = el.nextSibling;
      }
    }
  }
  function setVarsOnNode(el, vars) {
    if (el.nodeType === 1) {
      const style = el.style;
      for (const key in vars) {
        style.setProperty(`--${key}`, vars[key]);
      }
    }
  }

  const TRANSITION = "transition";
  const ANIMATION = "animation";
  const Transition = (props, { slots }) => h(BaseTransition, resolveTransitionProps(props), slots);
  Transition.displayName = "Transition";
  const DOMTransitionPropsValidators = {
    name: String,
    type: String,
    css: {
      type: Boolean,
      default: true
    },
    duration: [String, Number, Object],
    enterFromClass: String,
    enterActiveClass: String,
    enterToClass: String,
    appearFromClass: String,
    appearActiveClass: String,
    appearToClass: String,
    leaveFromClass: String,
    leaveActiveClass: String,
    leaveToClass: String
  };
  const TransitionPropsValidators = Transition.props = /* @__PURE__ */ extend(
    {},
    BaseTransitionPropsValidators,
    DOMTransitionPropsValidators
  );
  const callHook = (hook, args = []) => {
    if (isArray$1(hook)) {
      hook.forEach((h2) => h2(...args));
    } else if (hook) {
      hook(...args);
    }
  };
  const hasExplicitCallback = (hook) => {
    return hook ? isArray$1(hook) ? hook.some((h2) => h2.length > 1) : hook.length > 1 : false;
  };
  function resolveTransitionProps(rawProps) {
    const baseProps = {};
    for (const key in rawProps) {
      if (!(key in DOMTransitionPropsValidators)) {
        baseProps[key] = rawProps[key];
      }
    }
    if (rawProps.css === false) {
      return baseProps;
    }
    const {
      name = "v",
      type,
      duration,
      enterFromClass = `${name}-enter-from`,
      enterActiveClass = `${name}-enter-active`,
      enterToClass = `${name}-enter-to`,
      appearFromClass = enterFromClass,
      appearActiveClass = enterActiveClass,
      appearToClass = enterToClass,
      leaveFromClass = `${name}-leave-from`,
      leaveActiveClass = `${name}-leave-active`,
      leaveToClass = `${name}-leave-to`
    } = rawProps;
    const durations = normalizeDuration(duration);
    const enterDuration = durations && durations[0];
    const leaveDuration = durations && durations[1];
    const {
      onBeforeEnter,
      onEnter,
      onEnterCancelled,
      onLeave,
      onLeaveCancelled,
      onBeforeAppear = onBeforeEnter,
      onAppear = onEnter,
      onAppearCancelled = onEnterCancelled
    } = baseProps;
    const finishEnter = (el, isAppear, done) => {
      removeTransitionClass(el, isAppear ? appearToClass : enterToClass);
      removeTransitionClass(el, isAppear ? appearActiveClass : enterActiveClass);
      done && done();
    };
    const finishLeave = (el, done) => {
      el._isLeaving = false;
      removeTransitionClass(el, leaveFromClass);
      removeTransitionClass(el, leaveToClass);
      removeTransitionClass(el, leaveActiveClass);
      done && done();
    };
    const makeEnterHook = (isAppear) => {
      return (el, done) => {
        const hook = isAppear ? onAppear : onEnter;
        const resolve = () => finishEnter(el, isAppear, done);
        callHook(hook, [el, resolve]);
        nextFrame(() => {
          removeTransitionClass(el, isAppear ? appearFromClass : enterFromClass);
          addTransitionClass(el, isAppear ? appearToClass : enterToClass);
          if (!hasExplicitCallback(hook)) {
            whenTransitionEnds(el, type, enterDuration, resolve);
          }
        });
      };
    };
    return extend(baseProps, {
      onBeforeEnter(el) {
        callHook(onBeforeEnter, [el]);
        addTransitionClass(el, enterFromClass);
        addTransitionClass(el, enterActiveClass);
      },
      onBeforeAppear(el) {
        callHook(onBeforeAppear, [el]);
        addTransitionClass(el, appearFromClass);
        addTransitionClass(el, appearActiveClass);
      },
      onEnter: makeEnterHook(false),
      onAppear: makeEnterHook(true),
      onLeave(el, done) {
        el._isLeaving = true;
        const resolve = () => finishLeave(el, done);
        addTransitionClass(el, leaveFromClass);
        forceReflow();
        addTransitionClass(el, leaveActiveClass);
        nextFrame(() => {
          if (!el._isLeaving) {
            return;
          }
          removeTransitionClass(el, leaveFromClass);
          addTransitionClass(el, leaveToClass);
          if (!hasExplicitCallback(onLeave)) {
            whenTransitionEnds(el, type, leaveDuration, resolve);
          }
        });
        callHook(onLeave, [el, resolve]);
      },
      onEnterCancelled(el) {
        finishEnter(el, false);
        callHook(onEnterCancelled, [el]);
      },
      onAppearCancelled(el) {
        finishEnter(el, true);
        callHook(onAppearCancelled, [el]);
      },
      onLeaveCancelled(el) {
        finishLeave(el);
        callHook(onLeaveCancelled, [el]);
      }
    });
  }
  function normalizeDuration(duration) {
    if (duration == null) {
      return null;
    } else if (isObject$1(duration)) {
      return [NumberOf(duration.enter), NumberOf(duration.leave)];
    } else {
      const n = NumberOf(duration);
      return [n, n];
    }
  }
  function NumberOf(val) {
    const res = toNumber(val);
    return res;
  }
  function addTransitionClass(el, cls) {
    cls.split(/\s+/).forEach((c) => c && el.classList.add(c));
    (el._vtc || (el._vtc = /* @__PURE__ */ new Set())).add(cls);
  }
  function removeTransitionClass(el, cls) {
    cls.split(/\s+/).forEach((c) => c && el.classList.remove(c));
    const { _vtc } = el;
    if (_vtc) {
      _vtc.delete(cls);
      if (!_vtc.size) {
        el._vtc = void 0;
      }
    }
  }
  function nextFrame(cb) {
    requestAnimationFrame(() => {
      requestAnimationFrame(cb);
    });
  }
  let endId = 0;
  function whenTransitionEnds(el, expectedType, explicitTimeout, resolve) {
    const id = el._endId = ++endId;
    const resolveIfNotStale = () => {
      if (id === el._endId) {
        resolve();
      }
    };
    if (explicitTimeout) {
      return setTimeout(resolveIfNotStale, explicitTimeout);
    }
    const { type, timeout, propCount } = getTransitionInfo(el, expectedType);
    if (!type) {
      return resolve();
    }
    const endEvent = type + "end";
    let ended = 0;
    const end = () => {
      el.removeEventListener(endEvent, onEnd);
      resolveIfNotStale();
    };
    const onEnd = (e) => {
      if (e.target === el && ++ended >= propCount) {
        end();
      }
    };
    setTimeout(() => {
      if (ended < propCount) {
        end();
      }
    }, timeout + 1);
    el.addEventListener(endEvent, onEnd);
  }
  function getTransitionInfo(el, expectedType) {
    const styles = window.getComputedStyle(el);
    const getStyleProperties = (key) => (styles[key] || "").split(", ");
    const transitionDelays = getStyleProperties(`${TRANSITION}Delay`);
    const transitionDurations = getStyleProperties(`${TRANSITION}Duration`);
    const transitionTimeout = getTimeout(transitionDelays, transitionDurations);
    const animationDelays = getStyleProperties(`${ANIMATION}Delay`);
    const animationDurations = getStyleProperties(`${ANIMATION}Duration`);
    const animationTimeout = getTimeout(animationDelays, animationDurations);
    let type = null;
    let timeout = 0;
    let propCount = 0;
    if (expectedType === TRANSITION) {
      if (transitionTimeout > 0) {
        type = TRANSITION;
        timeout = transitionTimeout;
        propCount = transitionDurations.length;
      }
    } else if (expectedType === ANIMATION) {
      if (animationTimeout > 0) {
        type = ANIMATION;
        timeout = animationTimeout;
        propCount = animationDurations.length;
      }
    } else {
      timeout = Math.max(transitionTimeout, animationTimeout);
      type = timeout > 0 ? transitionTimeout > animationTimeout ? TRANSITION : ANIMATION : null;
      propCount = type ? type === TRANSITION ? transitionDurations.length : animationDurations.length : 0;
    }
    const hasTransform = type === TRANSITION && /\b(transform|all)(,|$)/.test(
      getStyleProperties(`${TRANSITION}Property`).toString()
    );
    return {
      type,
      timeout,
      propCount,
      hasTransform
    };
  }
  function getTimeout(delays, durations) {
    while (delays.length < durations.length) {
      delays = delays.concat(delays);
    }
    return Math.max(...durations.map((d, i) => toMs(d) + toMs(delays[i])));
  }
  function toMs(s) {
    return Number(s.slice(0, -1).replace(",", ".")) * 1e3;
  }
  function forceReflow() {
    return document.body.offsetHeight;
  }

  const positionMap = /* @__PURE__ */ new WeakMap();
  const newPositionMap = /* @__PURE__ */ new WeakMap();
  const TransitionGroupImpl = {
    name: "TransitionGroup",
    props: /* @__PURE__ */ extend({}, TransitionPropsValidators, {
      tag: String,
      moveClass: String
    }),
    setup(props, { slots }) {
      const instance = getCurrentInstance();
      const state = useTransitionState();
      let prevChildren;
      let children;
      onUpdated(() => {
        if (!prevChildren.length) {
          return;
        }
        const moveClass = props.moveClass || `${props.name || "v"}-move`;
        if (!hasCSSTransform(
          prevChildren[0].el,
          instance.vnode.el,
          moveClass
        )) {
          return;
        }
        prevChildren.forEach(callPendingCbs);
        prevChildren.forEach(recordPosition);
        const movedChildren = prevChildren.filter(applyTranslation);
        forceReflow();
        movedChildren.forEach((c) => {
          const el = c.el;
          const style = el.style;
          addTransitionClass(el, moveClass);
          style.transform = style.webkitTransform = style.transitionDuration = "";
          const cb = el._moveCb = (e) => {
            if (e && e.target !== el) {
              return;
            }
            if (!e || /transform$/.test(e.propertyName)) {
              el.removeEventListener("transitionend", cb);
              el._moveCb = null;
              removeTransitionClass(el, moveClass);
            }
          };
          el.addEventListener("transitionend", cb);
        });
      });
      return () => {
        const rawProps = toRaw(props);
        const cssTransitionProps = resolveTransitionProps(rawProps);
        let tag = rawProps.tag || Fragment;
        prevChildren = children;
        children = slots.default ? getTransitionRawChildren(slots.default()) : [];
        for (let i = 0; i < children.length; i++) {
          const child = children[i];
          if (child.key != null) {
            setTransitionHooks(
              child,
              resolveTransitionHooks(child, cssTransitionProps, state, instance)
            );
          }
        }
        if (prevChildren) {
          for (let i = 0; i < prevChildren.length; i++) {
            const child = prevChildren[i];
            setTransitionHooks(
              child,
              resolveTransitionHooks(child, cssTransitionProps, state, instance)
            );
            positionMap.set(child, child.el.getBoundingClientRect());
          }
        }
        return createVNode(tag, null, children);
      };
    }
  };
  const removeMode = (props) => delete props.mode;
  /* @__PURE__ */ removeMode(TransitionGroupImpl.props);
  const TransitionGroup = TransitionGroupImpl;
  function callPendingCbs(c) {
    const el = c.el;
    if (el._moveCb) {
      el._moveCb();
    }
    if (el._enterCb) {
      el._enterCb();
    }
  }
  function recordPosition(c) {
    newPositionMap.set(c, c.el.getBoundingClientRect());
  }
  function applyTranslation(c) {
    const oldPos = positionMap.get(c);
    const newPos = newPositionMap.get(c);
    const dx = oldPos.left - newPos.left;
    const dy = oldPos.top - newPos.top;
    if (dx || dy) {
      const s = c.el.style;
      s.transform = s.webkitTransform = `translate(${dx}px,${dy}px)`;
      s.transitionDuration = "0s";
      return c;
    }
  }
  function hasCSSTransform(el, root, moveClass) {
    const clone = el.cloneNode();
    if (el._vtc) {
      el._vtc.forEach((cls) => {
        cls.split(/\s+/).forEach((c) => c && clone.classList.remove(c));
      });
    }
    moveClass.split(/\s+/).forEach((c) => c && clone.classList.add(c));
    clone.style.display = "none";
    const container = root.nodeType === 1 ? root : root.parentNode;
    container.appendChild(clone);
    const { hasTransform } = getTransitionInfo(clone);
    container.removeChild(clone);
    return hasTransform;
  }

  const getModelAssigner = (vnode) => {
    const fn = vnode.props["onUpdate:modelValue"] || false;
    return isArray$1(fn) ? (value) => invokeArrayFns(fn, value) : fn;
  };
  function onCompositionStart(e) {
    e.target.composing = true;
  }
  function onCompositionEnd(e) {
    const target = e.target;
    if (target.composing) {
      target.composing = false;
      target.dispatchEvent(new Event("input"));
    }
  }
  const vModelText = {
    created(el, { modifiers: { lazy, trim, number } }, vnode) {
      el._assign = getModelAssigner(vnode);
      const castToNumber = number || vnode.props && vnode.props.type === "number";
      addEventListener(el, lazy ? "change" : "input", (e) => {
        if (e.target.composing)
          return;
        let domValue = el.value;
        if (trim) {
          domValue = domValue.trim();
        }
        if (castToNumber) {
          domValue = looseToNumber(domValue);
        }
        el._assign(domValue);
      });
      if (trim) {
        addEventListener(el, "change", () => {
          el.value = el.value.trim();
        });
      }
      if (!lazy) {
        addEventListener(el, "compositionstart", onCompositionStart);
        addEventListener(el, "compositionend", onCompositionEnd);
        addEventListener(el, "change", onCompositionEnd);
      }
    },
    // set value on mounted so it's after min/max for type="range"
    mounted(el, { value }) {
      el.value = value == null ? "" : value;
    },
    beforeUpdate(el, { value, modifiers: { lazy, trim, number } }, vnode) {
      el._assign = getModelAssigner(vnode);
      if (el.composing)
        return;
      if (document.activeElement === el && el.type !== "range") {
        if (lazy) {
          return;
        }
        if (trim && el.value.trim() === value) {
          return;
        }
        if ((number || el.type === "number") && looseToNumber(el.value) === value) {
          return;
        }
      }
      const newValue = value == null ? "" : value;
      if (el.value !== newValue) {
        el.value = newValue;
      }
    }
  };
  const vModelCheckbox = {
    // #4096 array checkboxes need to be deep traversed
    deep: true,
    created(el, _, vnode) {
      el._assign = getModelAssigner(vnode);
      addEventListener(el, "change", () => {
        const modelValue = el._modelValue;
        const elementValue = getValue(el);
        const checked = el.checked;
        const assign = el._assign;
        if (isArray$1(modelValue)) {
          const index = looseIndexOf(modelValue, elementValue);
          const found = index !== -1;
          if (checked && !found) {
            assign(modelValue.concat(elementValue));
          } else if (!checked && found) {
            const filtered = [...modelValue];
            filtered.splice(index, 1);
            assign(filtered);
          }
        } else if (isSet(modelValue)) {
          const cloned = new Set(modelValue);
          if (checked) {
            cloned.add(elementValue);
          } else {
            cloned.delete(elementValue);
          }
          assign(cloned);
        } else {
          assign(getCheckboxValue(el, checked));
        }
      });
    },
    // set initial checked on mount to wait for true-value/false-value
    mounted: setChecked,
    beforeUpdate(el, binding, vnode) {
      el._assign = getModelAssigner(vnode);
      setChecked(el, binding, vnode);
    }
  };
  function setChecked(el, { value, oldValue }, vnode) {
    el._modelValue = value;
    if (isArray$1(value)) {
      el.checked = looseIndexOf(value, vnode.props.value) > -1;
    } else if (isSet(value)) {
      el.checked = value.has(vnode.props.value);
    } else if (value !== oldValue) {
      el.checked = looseEqual(value, getCheckboxValue(el, true));
    }
  }
  const vModelRadio = {
    created(el, { value }, vnode) {
      el.checked = looseEqual(value, vnode.props.value);
      el._assign = getModelAssigner(vnode);
      addEventListener(el, "change", () => {
        el._assign(getValue(el));
      });
    },
    beforeUpdate(el, { value, oldValue }, vnode) {
      el._assign = getModelAssigner(vnode);
      if (value !== oldValue) {
        el.checked = looseEqual(value, vnode.props.value);
      }
    }
  };
  const vModelSelect = {
    // <select multiple> value need to be deep traversed
    deep: true,
    created(el, { value, modifiers: { number } }, vnode) {
      const isSetModel = isSet(value);
      addEventListener(el, "change", () => {
        const selectedVal = Array.prototype.filter.call(el.options, (o) => o.selected).map(
          (o) => number ? looseToNumber(getValue(o)) : getValue(o)
        );
        el._assign(
          el.multiple ? isSetModel ? new Set(selectedVal) : selectedVal : selectedVal[0]
        );
      });
      el._assign = getModelAssigner(vnode);
    },
    // set value in mounted & updated because <select> relies on its children
    // <option>s.
    mounted(el, { value }) {
      setSelected(el, value);
    },
    beforeUpdate(el, _binding, vnode) {
      el._assign = getModelAssigner(vnode);
    },
    updated(el, { value }) {
      setSelected(el, value);
    }
  };
  function setSelected(el, value) {
    const isMultiple = el.multiple;
    if (isMultiple && !isArray$1(value) && !isSet(value)) {
      warn$1(
        `<select multiple v-model> expects an Array or Set value for its binding, but got ${Object.prototype.toString.call(value).slice(8, -1)}.`
      );
      return;
    }
    for (let i = 0, l = el.options.length; i < l; i++) {
      const option = el.options[i];
      const optionValue = getValue(option);
      if (isMultiple) {
        if (isArray$1(value)) {
          option.selected = looseIndexOf(value, optionValue) > -1;
        } else {
          option.selected = value.has(optionValue);
        }
      } else {
        if (looseEqual(getValue(option), value)) {
          if (el.selectedIndex !== i)
            el.selectedIndex = i;
          return;
        }
      }
    }
    if (!isMultiple && el.selectedIndex !== -1) {
      el.selectedIndex = -1;
    }
  }
  function getValue(el) {
    return "_value" in el ? el._value : el.value;
  }
  function getCheckboxValue(el, checked) {
    const key = checked ? "_trueValue" : "_falseValue";
    return key in el ? el[key] : checked;
  }
  const vModelDynamic = {
    created(el, binding, vnode) {
      callModelHook(el, binding, vnode, null, "created");
    },
    mounted(el, binding, vnode) {
      callModelHook(el, binding, vnode, null, "mounted");
    },
    beforeUpdate(el, binding, vnode, prevVNode) {
      callModelHook(el, binding, vnode, prevVNode, "beforeUpdate");
    },
    updated(el, binding, vnode, prevVNode) {
      callModelHook(el, binding, vnode, prevVNode, "updated");
    }
  };
  function resolveDynamicModel(tagName, type) {
    switch (tagName) {
      case "SELECT":
        return vModelSelect;
      case "TEXTAREA":
        return vModelText;
      default:
        switch (type) {
          case "checkbox":
            return vModelCheckbox;
          case "radio":
            return vModelRadio;
          default:
            return vModelText;
        }
    }
  }
  function callModelHook(el, binding, vnode, prevVNode, hook) {
    const modelToUse = resolveDynamicModel(
      el.tagName,
      vnode.props && vnode.props.type
    );
    const fn = modelToUse[hook];
    fn && fn(el, binding, vnode, prevVNode);
  }
  function initVModelForSSR() {
    vModelText.getSSRProps = ({ value }) => ({ value });
    vModelRadio.getSSRProps = ({ value }, vnode) => {
      if (vnode.props && looseEqual(vnode.props.value, value)) {
        return { checked: true };
      }
    };
    vModelCheckbox.getSSRProps = ({ value }, vnode) => {
      if (isArray$1(value)) {
        if (vnode.props && looseIndexOf(value, vnode.props.value) > -1) {
          return { checked: true };
        }
      } else if (isSet(value)) {
        if (vnode.props && value.has(vnode.props.value)) {
          return { checked: true };
        }
      } else if (value) {
        return { checked: true };
      }
    };
    vModelDynamic.getSSRProps = (binding, vnode) => {
      if (typeof vnode.type !== "string") {
        return;
      }
      const modelToUse = resolveDynamicModel(
        // resolveDynamicModel expects an uppercase tag name, but vnode.type is lowercase
        vnode.type.toUpperCase(),
        vnode.props && vnode.props.type
      );
      if (modelToUse.getSSRProps) {
        return modelToUse.getSSRProps(binding, vnode);
      }
    };
  }

  const systemModifiers = ["ctrl", "shift", "alt", "meta"];
  const modifierGuards = {
    stop: (e) => e.stopPropagation(),
    prevent: (e) => e.preventDefault(),
    self: (e) => e.target !== e.currentTarget,
    ctrl: (e) => !e.ctrlKey,
    shift: (e) => !e.shiftKey,
    alt: (e) => !e.altKey,
    meta: (e) => !e.metaKey,
    left: (e) => "button" in e && e.button !== 0,
    middle: (e) => "button" in e && e.button !== 1,
    right: (e) => "button" in e && e.button !== 2,
    exact: (e, modifiers) => systemModifiers.some((m) => e[`${m}Key`] && !modifiers.includes(m))
  };
  const withModifiers = (fn, modifiers) => {
    return (event, ...args) => {
      for (let i = 0; i < modifiers.length; i++) {
        const guard = modifierGuards[modifiers[i]];
        if (guard && guard(event, modifiers))
          return;
      }
      return fn(event, ...args);
    };
  };
  const keyNames = {
    esc: "escape",
    space: " ",
    up: "arrow-up",
    left: "arrow-left",
    right: "arrow-right",
    down: "arrow-down",
    delete: "backspace"
  };
  const withKeys = (fn, modifiers) => {
    return (event) => {
      if (!("key" in event)) {
        return;
      }
      const eventKey = hyphenate(event.key);
      if (modifiers.some((k) => k === eventKey || keyNames[k] === eventKey)) {
        return fn(event);
      }
    };
  };

  const vShow = {
    beforeMount(el, { value }, { transition }) {
      el._vod = el.style.display === "none" ? "" : el.style.display;
      if (transition && value) {
        transition.beforeEnter(el);
      } else {
        setDisplay(el, value);
      }
    },
    mounted(el, { value }, { transition }) {
      if (transition && value) {
        transition.enter(el);
      }
    },
    updated(el, { value, oldValue }, { transition }) {
      if (!value === !oldValue)
        return;
      if (transition) {
        if (value) {
          transition.beforeEnter(el);
          setDisplay(el, true);
          transition.enter(el);
        } else {
          transition.leave(el, () => {
            setDisplay(el, false);
          });
        }
      } else {
        setDisplay(el, value);
      }
    },
    beforeUnmount(el, { value }) {
      setDisplay(el, value);
    }
  };
  function setDisplay(el, value) {
    el.style.display = value ? el._vod : "none";
  }
  function initVShowForSSR() {
    vShow.getSSRProps = ({ value }) => {
      if (!value) {
        return { style: { display: "none" } };
      }
    };
  }

  const rendererOptions = /* @__PURE__ */ extend({ patchProp }, nodeOps);
  let renderer;
  let enabledHydration = false;
  function ensureRenderer() {
    return renderer || (renderer = createRenderer(rendererOptions));
  }
  function ensureHydrationRenderer() {
    renderer = enabledHydration ? renderer : createHydrationRenderer(rendererOptions);
    enabledHydration = true;
    return renderer;
  }
  const render$y = (...args) => {
    ensureRenderer().render(...args);
  };
  const hydrate = (...args) => {
    ensureHydrationRenderer().hydrate(...args);
  };
  const createApp = (...args) => {
    const app = ensureRenderer().createApp(...args);
    {
      injectNativeTagCheck(app);
      injectCompilerOptionsCheck(app);
    }
    const { mount } = app;
    app.mount = (containerOrSelector) => {
      const container = normalizeContainer(containerOrSelector);
      if (!container)
        return;
      const component = app._component;
      if (!isFunction(component) && !component.render && !component.template) {
        component.template = container.innerHTML;
      }
      container.innerHTML = "";
      const proxy = mount(container, false, container instanceof SVGElement);
      if (container instanceof Element) {
        container.removeAttribute("v-cloak");
        container.setAttribute("data-v-app", "");
      }
      return proxy;
    };
    return app;
  };
  const createSSRApp = (...args) => {
    const app = ensureHydrationRenderer().createApp(...args);
    {
      injectNativeTagCheck(app);
      injectCompilerOptionsCheck(app);
    }
    const { mount } = app;
    app.mount = (containerOrSelector) => {
      const container = normalizeContainer(containerOrSelector);
      if (container) {
        return mount(container, true, container instanceof SVGElement);
      }
    };
    return app;
  };
  function injectNativeTagCheck(app) {
    Object.defineProperty(app.config, "isNativeTag", {
      value: (tag) => isHTMLTag(tag) || isSVGTag(tag),
      writable: false
    });
  }
  function injectCompilerOptionsCheck(app) {
    if (isRuntimeOnly()) {
      const isCustomElement = app.config.isCustomElement;
      Object.defineProperty(app.config, "isCustomElement", {
        get() {
          return isCustomElement;
        },
        set() {
        }
      });
      const compilerOptions = app.config.compilerOptions;
      Object.defineProperty(app.config, "compilerOptions", {
        get() {
          return compilerOptions;
        },
        set() {
        }
      });
    }
  }
  function normalizeContainer(container) {
    if (isString(container)) {
      const res = document.querySelector(container);
      return res;
    }
    if (window.ShadowRoot && container instanceof window.ShadowRoot && container.mode === "closed") ;
    return container;
  }
  let ssrDirectiveInitialized = false;
  const initDirectivesForSSR = () => {
    if (!ssrDirectiveInitialized) {
      ssrDirectiveInitialized = true;
      initVModelForSSR();
      initVShowForSSR();
    }
  } ;

  var runtimeDom_esmBundler = /*#__PURE__*/Object.freeze({
    __proto__: null,
    Transition: Transition,
    TransitionGroup: TransitionGroup,
    VueElement: VueElement,
    createApp: createApp,
    createSSRApp: createSSRApp,
    defineCustomElement: defineCustomElement,
    defineSSRCustomElement: defineSSRCustomElement,
    hydrate: hydrate,
    initDirectivesForSSR: initDirectivesForSSR,
    render: render$y,
    useCssModule: useCssModule,
    useCssVars: useCssVars,
    vModelCheckbox: vModelCheckbox,
    vModelDynamic: vModelDynamic,
    vModelRadio: vModelRadio,
    vModelSelect: vModelSelect,
    vModelText: vModelText,
    vShow: vShow,
    withKeys: withKeys,
    withModifiers: withModifiers,
    EffectScope: EffectScope,
    ReactiveEffect: ReactiveEffect,
    customRef: customRef,
    effect: effect,
    effectScope: effectScope,
    getCurrentScope: getCurrentScope,
    isProxy: isProxy,
    isReactive: isReactive,
    isReadonly: isReadonly,
    isRef: isRef,
    isShallow: isShallow,
    markRaw: markRaw,
    onScopeDispose: onScopeDispose,
    proxyRefs: proxyRefs,
    reactive: reactive,
    readonly: readonly,
    ref: ref,
    shallowReactive: shallowReactive,
    shallowReadonly: shallowReadonly,
    shallowRef: shallowRef,
    stop: stop,
    toRaw: toRaw,
    toRef: toRef,
    toRefs: toRefs,
    toValue: toValue,
    triggerRef: triggerRef,
    unref: unref,
    camelize: camelize,
    capitalize: capitalize,
    normalizeClass: normalizeClass,
    normalizeProps: normalizeProps,
    normalizeStyle: normalizeStyle,
    toDisplayString: toDisplayString,
    toHandlerKey: toHandlerKey,
    BaseTransition: BaseTransition,
    BaseTransitionPropsValidators: BaseTransitionPropsValidators,
    Comment: Comment,
    Fragment: Fragment,
    KeepAlive: KeepAlive,
    Static: Static,
    Suspense: Suspense,
    Teleport: Teleport,
    Text: Text,
    assertNumber: assertNumber,
    callWithAsyncErrorHandling: callWithAsyncErrorHandling,
    callWithErrorHandling: callWithErrorHandling,
    cloneVNode: cloneVNode,
    compatUtils: compatUtils,
    computed: computed,
    createBlock: createBlock,
    createCommentVNode: createCommentVNode,
    createElementBlock: createElementBlock,
    createElementVNode: createBaseVNode,
    createHydrationRenderer: createHydrationRenderer,
    createPropsRestProxy: createPropsRestProxy,
    createRenderer: createRenderer,
    createSlots: createSlots,
    createStaticVNode: createStaticVNode,
    createTextVNode: createTextVNode,
    createVNode: createVNode,
    defineAsyncComponent: defineAsyncComponent,
    defineComponent: defineComponent,
    defineEmits: defineEmits,
    defineExpose: defineExpose,
    defineModel: defineModel,
    defineOptions: defineOptions,
    defineProps: defineProps,
    defineSlots: defineSlots,
    get devtools () { return devtools; },
    getCurrentInstance: getCurrentInstance,
    getTransitionRawChildren: getTransitionRawChildren,
    guardReactiveProps: guardReactiveProps,
    h: h,
    handleError: handleError,
    hasInjectionContext: hasInjectionContext,
    initCustomFormatter: initCustomFormatter,
    inject: inject,
    isMemoSame: isMemoSame,
    isRuntimeOnly: isRuntimeOnly,
    isVNode: isVNode,
    mergeDefaults: mergeDefaults,
    mergeModels: mergeModels,
    mergeProps: mergeProps,
    nextTick: nextTick,
    onActivated: onActivated,
    onBeforeMount: onBeforeMount,
    onBeforeUnmount: onBeforeUnmount,
    onBeforeUpdate: onBeforeUpdate,
    onDeactivated: onDeactivated,
    onErrorCaptured: onErrorCaptured,
    onMounted: onMounted,
    onRenderTracked: onRenderTracked,
    onRenderTriggered: onRenderTriggered,
    onServerPrefetch: onServerPrefetch,
    onUnmounted: onUnmounted,
    onUpdated: onUpdated,
    openBlock: openBlock,
    popScopeId: popScopeId,
    provide: provide,
    pushScopeId: pushScopeId,
    queuePostFlushCb: queuePostFlushCb,
    registerRuntimeCompiler: registerRuntimeCompiler,
    renderList: renderList,
    renderSlot: renderSlot,
    resolveComponent: resolveComponent,
    resolveDirective: resolveDirective,
    resolveDynamicComponent: resolveDynamicComponent,
    resolveFilter: resolveFilter,
    resolveTransitionHooks: resolveTransitionHooks,
    setBlockTracking: setBlockTracking,
    setDevtoolsHook: setDevtoolsHook,
    setTransitionHooks: setTransitionHooks,
    ssrContextKey: ssrContextKey,
    ssrUtils: ssrUtils,
    toHandlers: toHandlers,
    transformVNodeArgs: transformVNodeArgs,
    useAttrs: useAttrs,
    useModel: useModel,
    useSSRContext: useSSRContext,
    useSlots: useSlots,
    useTransitionState: useTransitionState,
    version: version,
    warn: warn$1,
    watch: watch,
    watchEffect: watchEffect,
    watchPostEffect: watchPostEffect,
    watchSyncEffect: watchSyncEffect,
    withAsyncContext: withAsyncContext,
    withCtx: withCtx,
    withDefaults: withDefaults,
    withDirectives: withDirectives,
    withMemo: withMemo,
    withScopeId: withScopeId
  });

  var isVue2 = false;

  function set(target, key, val) {
    if (Array.isArray(target)) {
      target.length = Math.max(target.length, key);
      target.splice(key, 1, val);
      return val
    }
    target[key] = val;
    return val
  }

  function del(target, key) {
    if (Array.isArray(target)) {
      target.splice(key, 1);
      return
    }
    delete target[key];
  }

  function getDevtoolsGlobalHook() {
      return getTarget().__VUE_DEVTOOLS_GLOBAL_HOOK__;
  }
  function getTarget() {
      // @ts-ignore
      return (typeof navigator !== 'undefined' && typeof window !== 'undefined')
          ? window
          : typeof global !== 'undefined'
              ? global
              : {};
  }
  const isProxyAvailable = typeof Proxy === 'function';

  const HOOK_SETUP = 'devtools-plugin:setup';
  const HOOK_PLUGIN_SETTINGS_SET = 'plugin:settings:set';

  let supported;
  let perf;
  function isPerformanceSupported() {
      var _a;
      if (supported !== undefined) {
          return supported;
      }
      if (typeof window !== 'undefined' && window.performance) {
          supported = true;
          perf = window.performance;
      }
      else if (typeof global !== 'undefined' && ((_a = global.perf_hooks) === null || _a === void 0 ? void 0 : _a.performance)) {
          supported = true;
          perf = global.perf_hooks.performance;
      }
      else {
          supported = false;
      }
      return supported;
  }
  function now() {
      return isPerformanceSupported() ? perf.now() : Date.now();
  }

  class ApiProxy {
      constructor(plugin, hook) {
          this.target = null;
          this.targetQueue = [];
          this.onQueue = [];
          this.plugin = plugin;
          this.hook = hook;
          const defaultSettings = {};
          if (plugin.settings) {
              for (const id in plugin.settings) {
                  const item = plugin.settings[id];
                  defaultSettings[id] = item.defaultValue;
              }
          }
          const localSettingsSaveId = `__vue-devtools-plugin-settings__${plugin.id}`;
          let currentSettings = Object.assign({}, defaultSettings);
          try {
              const raw = localStorage.getItem(localSettingsSaveId);
              const data = JSON.parse(raw);
              Object.assign(currentSettings, data);
          }
          catch (e) {
              // noop
          }
          this.fallbacks = {
              getSettings() {
                  return currentSettings;
              },
              setSettings(value) {
                  try {
                      localStorage.setItem(localSettingsSaveId, JSON.stringify(value));
                  }
                  catch (e) {
                      // noop
                  }
                  currentSettings = value;
              },
              now() {
                  return now();
              },
          };
          if (hook) {
              hook.on(HOOK_PLUGIN_SETTINGS_SET, (pluginId, value) => {
                  if (pluginId === this.plugin.id) {
                      this.fallbacks.setSettings(value);
                  }
              });
          }
          this.proxiedOn = new Proxy({}, {
              get: (_target, prop) => {
                  if (this.target) {
                      return this.target.on[prop];
                  }
                  else {
                      return (...args) => {
                          this.onQueue.push({
                              method: prop,
                              args,
                          });
                      };
                  }
              },
          });
          this.proxiedTarget = new Proxy({}, {
              get: (_target, prop) => {
                  if (this.target) {
                      return this.target[prop];
                  }
                  else if (prop === 'on') {
                      return this.proxiedOn;
                  }
                  else if (Object.keys(this.fallbacks).includes(prop)) {
                      return (...args) => {
                          this.targetQueue.push({
                              method: prop,
                              args,
                              resolve: () => { },
                          });
                          return this.fallbacks[prop](...args);
                      };
                  }
                  else {
                      return (...args) => {
                          return new Promise(resolve => {
                              this.targetQueue.push({
                                  method: prop,
                                  args,
                                  resolve,
                              });
                          });
                      };
                  }
              },
          });
      }
      async setRealTarget(target) {
          this.target = target;
          for (const item of this.onQueue) {
              this.target.on[item.method](...item.args);
          }
          for (const item of this.targetQueue) {
              item.resolve(await this.target[item.method](...item.args));
          }
      }
  }

  function setupDevtoolsPlugin(pluginDescriptor, setupFn) {
      const descriptor = pluginDescriptor;
      const target = getTarget();
      const hook = getDevtoolsGlobalHook();
      const enableProxy = isProxyAvailable && descriptor.enableEarlyProxy;
      if (hook && (target.__VUE_DEVTOOLS_PLUGIN_API_AVAILABLE__ || !enableProxy)) {
          hook.emit(HOOK_SETUP, pluginDescriptor, setupFn);
      }
      else {
          const proxy = enableProxy ? new ApiProxy(descriptor, hook) : null;
          const list = target.__VUE_DEVTOOLS_PLUGINS__ = target.__VUE_DEVTOOLS_PLUGINS__ || [];
          list.push({
              pluginDescriptor: descriptor,
              setupFn,
              proxy,
          });
          if (proxy)
              setupFn(proxy.proxiedTarget);
      }
  }

  /*!
    * pinia v2.0.36
    * (c) 2023 Eduardo San Martin Morote
    * @license MIT
    */

  /**
   * setActivePinia must be called to handle SSR at the top of functions like
   * `fetch`, `setup`, `serverPrefetch` and others
   */
  let activePinia;
  /**
   * Sets or unsets the active pinia. Used in SSR and internally when calling
   * actions and getters
   *
   * @param pinia - Pinia instance
   */
  // @ts-expect-error: cannot constrain the type of the return
  const setActivePinia = (pinia) => (activePinia = pinia);
  const piniaSymbol = (Symbol('pinia') );

  function isPlainObject(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  o) {
      return (o &&
          typeof o === 'object' &&
          Object.prototype.toString.call(o) === '[object Object]' &&
          typeof o.toJSON !== 'function');
  }
  // type DeepReadonly<T> = { readonly [P in keyof T]: DeepReadonly<T[P]> }
  // TODO: can we change these to numbers?
  /**
   * Possible types for SubscriptionCallback
   */
  var MutationType;
  (function (MutationType) {
      /**
       * Direct mutation of the state:
       *
       * - `store.name = 'new name'`
       * - `store.$state.name = 'new name'`
       * - `store.list.push('new item')`
       */
      MutationType["direct"] = "direct";
      /**
       * Mutated the state with `$patch` and an object
       *
       * - `store.$patch({ name: 'newName' })`
       */
      MutationType["patchObject"] = "patch object";
      /**
       * Mutated the state with `$patch` and a function
       *
       * - `store.$patch(state => state.name = 'newName')`
       */
      MutationType["patchFunction"] = "patch function";
      // maybe reset? for $state = {} and $reset
  })(MutationType || (MutationType = {}));

  const IS_CLIENT = typeof window !== 'undefined';
  /**
   * Should we add the devtools plugins.
   * - only if dev mode or forced through the prod devtools flag
   * - not in test
   * - only if window exists (could change in the future)
   */
  const USE_DEVTOOLS = IS_CLIENT;

  /*
   * FileSaver.js A saveAs() FileSaver implementation.
   *
   * Originally by Eli Grey, adapted as an ESM module by Eduardo San Martin
   * Morote.
   *
   * License : MIT
   */
  // The one and only way of getting global scope in all environments
  // https://stackoverflow.com/q/3277182/1008999
  const _global = /*#__PURE__*/ (() => typeof window === 'object' && window.window === window
      ? window
      : typeof self === 'object' && self.self === self
          ? self
          : typeof global === 'object' && global.global === global
              ? global
              : typeof globalThis === 'object'
                  ? globalThis
                  : { HTMLElement: null })();
  function bom(blob, { autoBom = false } = {}) {
      // prepend BOM for UTF-8 XML and text/* types (including HTML)
      // note: your browser will automatically convert UTF-16 U+FEFF to EF BB BF
      if (autoBom &&
          /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
          return new Blob([String.fromCharCode(0xfeff), blob], { type: blob.type });
      }
      return blob;
  }
  function download(url, name, opts) {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url);
      xhr.responseType = 'blob';
      xhr.onload = function () {
          saveAs(xhr.response, name, opts);
      };
      xhr.onerror = function () {
          console.error('could not download file');
      };
      xhr.send();
  }
  function corsEnabled(url) {
      const xhr = new XMLHttpRequest();
      // use sync to avoid popup blocker
      xhr.open('HEAD', url, false);
      try {
          xhr.send();
      }
      catch (e) { }
      return xhr.status >= 200 && xhr.status <= 299;
  }
  // `a.click()` doesn't work for all browsers (#465)
  function click(node) {
      try {
          node.dispatchEvent(new MouseEvent('click'));
      }
      catch (e) {
          const evt = document.createEvent('MouseEvents');
          evt.initMouseEvent('click', true, true, window, 0, 0, 0, 80, 20, false, false, false, false, 0, null);
          node.dispatchEvent(evt);
      }
  }
  const _navigator = 
   typeof navigator === 'object' ? navigator : { userAgent: '' };
  // Detect WebView inside a native macOS app by ruling out all browsers
  // We just need to check for 'Safari' because all other browsers (besides Firefox) include that too
  // https://www.whatismybrowser.com/guides/the-latest-user-agent/macos
  const isMacOSWebView = /*#__PURE__*/ (() => /Macintosh/.test(_navigator.userAgent) &&
      /AppleWebKit/.test(_navigator.userAgent) &&
      !/Safari/.test(_navigator.userAgent))();
  const saveAs = !IS_CLIENT
      ? () => { } // noop
      : // Use download attribute first if possible (#193 Lumia mobile) unless this is a macOS WebView or mini program
          typeof HTMLAnchorElement !== 'undefined' &&
              'download' in HTMLAnchorElement.prototype &&
              !isMacOSWebView
              ? downloadSaveAs
              : // Use msSaveOrOpenBlob as a second approach
                  'msSaveOrOpenBlob' in _navigator
                      ? msSaveAs
                      : // Fallback to using FileReader and a popup
                          fileSaverSaveAs;
  function downloadSaveAs(blob, name = 'download', opts) {
      const a = document.createElement('a');
      a.download = name;
      a.rel = 'noopener'; // tabnabbing
      // TODO: detect chrome extensions & packaged apps
      // a.target = '_blank'
      if (typeof blob === 'string') {
          // Support regular links
          a.href = blob;
          if (a.origin !== location.origin) {
              if (corsEnabled(a.href)) {
                  download(blob, name, opts);
              }
              else {
                  a.target = '_blank';
                  click(a);
              }
          }
          else {
              click(a);
          }
      }
      else {
          // Support blobs
          a.href = URL.createObjectURL(blob);
          setTimeout(function () {
              URL.revokeObjectURL(a.href);
          }, 4e4); // 40s
          setTimeout(function () {
              click(a);
          }, 0);
      }
  }
  function msSaveAs(blob, name = 'download', opts) {
      if (typeof blob === 'string') {
          if (corsEnabled(blob)) {
              download(blob, name, opts);
          }
          else {
              const a = document.createElement('a');
              a.href = blob;
              a.target = '_blank';
              setTimeout(function () {
                  click(a);
              });
          }
      }
      else {
          // @ts-ignore: works on windows
          navigator.msSaveOrOpenBlob(bom(blob, opts), name);
      }
  }
  function fileSaverSaveAs(blob, name, opts, popup) {
      // Open a popup immediately do go around popup blocker
      // Mostly only available on user interaction and the fileReader is async so...
      popup = popup || open('', '_blank');
      if (popup) {
          popup.document.title = popup.document.body.innerText = 'downloading...';
      }
      if (typeof blob === 'string')
          return download(blob, name, opts);
      const force = blob.type === 'application/octet-stream';
      const isSafari = /constructor/i.test(String(_global.HTMLElement)) || 'safari' in _global;
      const isChromeIOS = /CriOS\/[\d]+/.test(navigator.userAgent);
      if ((isChromeIOS || (force && isSafari) || isMacOSWebView) &&
          typeof FileReader !== 'undefined') {
          // Safari doesn't allow downloading of blob URLs
          const reader = new FileReader();
          reader.onloadend = function () {
              let url = reader.result;
              if (typeof url !== 'string') {
                  popup = null;
                  throw new Error('Wrong reader.result type');
              }
              url = isChromeIOS
                  ? url
                  : url.replace(/^data:[^;]*;/, 'data:attachment/file;');
              if (popup) {
                  popup.location.href = url;
              }
              else {
                  location.assign(url);
              }
              popup = null; // reverse-tabnabbing #460
          };
          reader.readAsDataURL(blob);
      }
      else {
          const url = URL.createObjectURL(blob);
          if (popup)
              popup.location.assign(url);
          else
              location.href = url;
          popup = null; // reverse-tabnabbing #460
          setTimeout(function () {
              URL.revokeObjectURL(url);
          }, 4e4); // 40s
      }
  }

  /**
   * Shows a toast or console.log
   *
   * @param message - message to log
   * @param type - different color of the tooltip
   */
  function toastMessage(message, type) {
      const piniaMessage = '🍍 ' + message;
      if (typeof __VUE_DEVTOOLS_TOAST__ === 'function') {
          __VUE_DEVTOOLS_TOAST__(piniaMessage, type);
      }
      else if (type === 'error') {
          console.error(piniaMessage);
      }
      else if (type === 'warn') {
          console.warn(piniaMessage);
      }
      else {
          console.log(piniaMessage);
      }
  }
  function isPinia(o) {
      return '_a' in o && 'install' in o;
  }

  function checkClipboardAccess() {
      if (!('clipboard' in navigator)) {
          toastMessage(`Your browser doesn't support the Clipboard API`, 'error');
          return true;
      }
  }
  function checkNotFocusedError(error) {
      if (error instanceof Error &&
          error.message.toLowerCase().includes('document is not focused')) {
          toastMessage('You need to activate the "Emulate a focused page" setting in the "Rendering" panel of devtools.', 'warn');
          return true;
      }
      return false;
  }
  async function actionGlobalCopyState(pinia) {
      if (checkClipboardAccess())
          return;
      try {
          await navigator.clipboard.writeText(JSON.stringify(pinia.state.value));
          toastMessage('Global state copied to clipboard.');
      }
      catch (error) {
          if (checkNotFocusedError(error))
              return;
          toastMessage(`Failed to serialize the state. Check the console for more details.`, 'error');
          console.error(error);
      }
  }
  async function actionGlobalPasteState(pinia) {
      if (checkClipboardAccess())
          return;
      try {
          pinia.state.value = JSON.parse(await navigator.clipboard.readText());
          toastMessage('Global state pasted from clipboard.');
      }
      catch (error) {
          if (checkNotFocusedError(error))
              return;
          toastMessage(`Failed to deserialize the state from clipboard. Check the console for more details.`, 'error');
          console.error(error);
      }
  }
  async function actionGlobalSaveState(pinia) {
      try {
          saveAs(new Blob([JSON.stringify(pinia.state.value)], {
              type: 'text/plain;charset=utf-8',
          }), 'pinia-state.json');
      }
      catch (error) {
          toastMessage(`Failed to export the state as JSON. Check the console for more details.`, 'error');
          console.error(error);
      }
  }
  let fileInput;
  function getFileOpener() {
      if (!fileInput) {
          fileInput = document.createElement('input');
          fileInput.type = 'file';
          fileInput.accept = '.json';
      }
      function openFile() {
          return new Promise((resolve, reject) => {
              fileInput.onchange = async () => {
                  const files = fileInput.files;
                  if (!files)
                      return resolve(null);
                  const file = files.item(0);
                  if (!file)
                      return resolve(null);
                  return resolve({ text: await file.text(), file });
              };
              // @ts-ignore: TODO: changed from 4.3 to 4.4
              fileInput.oncancel = () => resolve(null);
              fileInput.onerror = reject;
              fileInput.click();
          });
      }
      return openFile;
  }
  async function actionGlobalOpenStateFile(pinia) {
      try {
          const open = await getFileOpener();
          const result = await open();
          if (!result)
              return;
          const { text, file } = result;
          pinia.state.value = JSON.parse(text);
          toastMessage(`Global state imported from "${file.name}".`);
      }
      catch (error) {
          toastMessage(`Failed to export the state as JSON. Check the console for more details.`, 'error');
          console.error(error);
      }
  }

  function formatDisplay$1(display) {
      return {
          _custom: {
              display,
          },
      };
  }
  const PINIA_ROOT_LABEL = '🍍 Pinia (root)';
  const PINIA_ROOT_ID = '_root';
  function formatStoreForInspectorTree$1(store) {
      return isPinia(store)
          ? {
              id: PINIA_ROOT_ID,
              label: PINIA_ROOT_LABEL,
          }
          : {
              id: store.$id,
              label: store.$id,
          };
  }
  function formatStoreForInspectorState$1(store) {
      if (isPinia(store)) {
          const storeNames = Array.from(store._s.keys());
          const storeMap = store._s;
          const state = {
              state: storeNames.map((storeId) => ({
                  editable: true,
                  key: storeId,
                  value: store.state.value[storeId],
              })),
              getters: storeNames
                  .filter((id) => storeMap.get(id)._getters)
                  .map((id) => {
                  const store = storeMap.get(id);
                  return {
                      editable: false,
                      key: id,
                      value: store._getters.reduce((getters, key) => {
                          getters[key] = store[key];
                          return getters;
                      }, {}),
                  };
              }),
          };
          return state;
      }
      const state = {
          state: Object.keys(store.$state).map((key) => ({
              editable: true,
              key,
              value: store.$state[key],
          })),
      };
      // avoid adding empty getters
      if (store._getters && store._getters.length) {
          state.getters = store._getters.map((getterName) => ({
              editable: false,
              key: getterName,
              value: store[getterName],
          }));
      }
      if (store._customProperties.size) {
          state.customProperties = Array.from(store._customProperties).map((key) => ({
              editable: true,
              key,
              value: store[key],
          }));
      }
      return state;
  }
  function formatEventData(events) {
      if (!events)
          return {};
      if (Array.isArray(events)) {
          // TODO: handle add and delete for arrays and objects
          return events.reduce((data, event) => {
              data.keys.push(event.key);
              data.operations.push(event.type);
              data.oldValue[event.key] = event.oldValue;
              data.newValue[event.key] = event.newValue;
              return data;
          }, {
              oldValue: {},
              keys: [],
              operations: [],
              newValue: {},
          });
      }
      else {
          return {
              operation: formatDisplay$1(events.type),
              key: formatDisplay$1(events.key),
              oldValue: events.oldValue,
              newValue: events.newValue,
          };
      }
  }
  function formatMutationType(type) {
      switch (type) {
          case MutationType.direct:
              return 'mutation';
          case MutationType.patchFunction:
              return '$patch';
          case MutationType.patchObject:
              return '$patch';
          default:
              return 'unknown';
      }
  }

  // timeline can be paused when directly changing the state
  let isTimelineActive = true;
  const componentStateTypes = [];
  const MUTATIONS_LAYER_ID$1 = 'pinia:mutations';
  const INSPECTOR_ID$1 = 'pinia';
  const { assign: assign$1 } = Object;
  /**
   * Gets the displayed name of a store in devtools
   *
   * @param id - id of the store
   * @returns a formatted string
   */
  const getStoreType = (id) => '🍍 ' + id;
  /**
   * Add the pinia plugin without any store. Allows displaying a Pinia plugin tab
   * as soon as it is added to the application.
   *
   * @param app - Vue application
   * @param pinia - pinia instance
   */
  function registerPiniaDevtools(app, pinia) {
      setupDevtoolsPlugin({
          id: 'dev.esm.pinia',
          label: 'Pinia 🍍',
          logo: 'https://pinia.vuejs.org/logo.svg',
          packageName: 'pinia',
          homepage: 'https://pinia.vuejs.org',
          componentStateTypes,
          app,
      }, (api) => {
          if (typeof api.now !== 'function') {
              toastMessage('You seem to be using an outdated version of Vue Devtools. Are you still using the Beta release instead of the stable one? You can find the links at https://devtools.vuejs.org/guide/installation.html.');
          }
          api.addTimelineLayer({
              id: MUTATIONS_LAYER_ID$1,
              label: `Pinia 🍍`,
              color: 0xe5df88,
          });
          api.addInspector({
              id: INSPECTOR_ID$1,
              label: 'Pinia 🍍',
              icon: 'storage',
              treeFilterPlaceholder: 'Search stores',
              actions: [
                  {
                      icon: 'content_copy',
                      action: () => {
                          actionGlobalCopyState(pinia);
                      },
                      tooltip: 'Serialize and copy the state',
                  },
                  {
                      icon: 'content_paste',
                      action: async () => {
                          await actionGlobalPasteState(pinia);
                          api.sendInspectorTree(INSPECTOR_ID$1);
                          api.sendInspectorState(INSPECTOR_ID$1);
                      },
                      tooltip: 'Replace the state with the content of your clipboard',
                  },
                  {
                      icon: 'save',
                      action: () => {
                          actionGlobalSaveState(pinia);
                      },
                      tooltip: 'Save the state as a JSON file',
                  },
                  {
                      icon: 'folder_open',
                      action: async () => {
                          await actionGlobalOpenStateFile(pinia);
                          api.sendInspectorTree(INSPECTOR_ID$1);
                          api.sendInspectorState(INSPECTOR_ID$1);
                      },
                      tooltip: 'Import the state from a JSON file',
                  },
              ],
              nodeActions: [
                  {
                      icon: 'restore',
                      tooltip: 'Reset the state (option store only)',
                      action: (nodeId) => {
                          const store = pinia._s.get(nodeId);
                          if (!store) {
                              toastMessage(`Cannot reset "${nodeId}" store because it wasn't found.`, 'warn');
                          }
                          else if (!store._isOptionsAPI) {
                              toastMessage(`Cannot reset "${nodeId}" store because it's a setup store.`, 'warn');
                          }
                          else {
                              store.$reset();
                              toastMessage(`Store "${nodeId}" reset.`);
                          }
                      },
                  },
              ],
          });
          api.on.inspectComponent((payload, ctx) => {
              const proxy = (payload.componentInstance &&
                  payload.componentInstance.proxy);
              if (proxy && proxy._pStores) {
                  const piniaStores = payload.componentInstance.proxy._pStores;
                  Object.values(piniaStores).forEach((store) => {
                      payload.instanceData.state.push({
                          type: getStoreType(store.$id),
                          key: 'state',
                          editable: true,
                          value: store._isOptionsAPI
                              ? {
                                  _custom: {
                                      value: toRaw(store.$state),
                                      actions: [
                                          {
                                              icon: 'restore',
                                              tooltip: 'Reset the state of this store',
                                              action: () => store.$reset(),
                                          },
                                      ],
                                  },
                              }
                              : // NOTE: workaround to unwrap transferred refs
                                  Object.keys(store.$state).reduce((state, key) => {
                                      state[key] = store.$state[key];
                                      return state;
                                  }, {}),
                      });
                      if (store._getters && store._getters.length) {
                          payload.instanceData.state.push({
                              type: getStoreType(store.$id),
                              key: 'getters',
                              editable: false,
                              value: store._getters.reduce((getters, key) => {
                                  try {
                                      getters[key] = store[key];
                                  }
                                  catch (error) {
                                      // @ts-expect-error: we just want to show it in devtools
                                      getters[key] = error;
                                  }
                                  return getters;
                              }, {}),
                          });
                      }
                  });
              }
          });
          api.on.getInspectorTree((payload) => {
              if (payload.app === app && payload.inspectorId === INSPECTOR_ID$1) {
                  let stores = [pinia];
                  stores = stores.concat(Array.from(pinia._s.values()));
                  payload.rootNodes = (payload.filter
                      ? stores.filter((store) => '$id' in store
                          ? store.$id
                              .toLowerCase()
                              .includes(payload.filter.toLowerCase())
                          : PINIA_ROOT_LABEL.toLowerCase().includes(payload.filter.toLowerCase()))
                      : stores).map(formatStoreForInspectorTree$1);
              }
          });
          api.on.getInspectorState((payload) => {
              if (payload.app === app && payload.inspectorId === INSPECTOR_ID$1) {
                  const inspectedStore = payload.nodeId === PINIA_ROOT_ID
                      ? pinia
                      : pinia._s.get(payload.nodeId);
                  if (!inspectedStore) {
                      // this could be the selected store restored for a different project
                      // so it's better not to say anything here
                      return;
                  }
                  if (inspectedStore) {
                      payload.state = formatStoreForInspectorState$1(inspectedStore);
                  }
              }
          });
          api.on.editInspectorState((payload, ctx) => {
              if (payload.app === app && payload.inspectorId === INSPECTOR_ID$1) {
                  const inspectedStore = payload.nodeId === PINIA_ROOT_ID
                      ? pinia
                      : pinia._s.get(payload.nodeId);
                  if (!inspectedStore) {
                      return toastMessage(`store "${payload.nodeId}" not found`, 'error');
                  }
                  const { path } = payload;
                  if (!isPinia(inspectedStore)) {
                      // access only the state
                      if (path.length !== 1 ||
                          !inspectedStore._customProperties.has(path[0]) ||
                          path[0] in inspectedStore.$state) {
                          path.unshift('$state');
                      }
                  }
                  else {
                      // Root access, we can omit the `.value` because the devtools API does it for us
                      path.unshift('state');
                  }
                  isTimelineActive = false;
                  payload.set(inspectedStore, path, payload.state.value);
                  isTimelineActive = true;
              }
          });
          api.on.editComponentState((payload) => {
              if (payload.type.startsWith('🍍')) {
                  const storeId = payload.type.replace(/^🍍\s*/, '');
                  const store = pinia._s.get(storeId);
                  if (!store) {
                      return toastMessage(`store "${storeId}" not found`, 'error');
                  }
                  const { path } = payload;
                  if (path[0] !== 'state') {
                      return toastMessage(`Invalid path for store "${storeId}":\n${path}\nOnly state can be modified.`);
                  }
                  // rewrite the first entry to be able to directly set the state as
                  // well as any other path
                  path[0] = '$state';
                  isTimelineActive = false;
                  payload.set(store, path, payload.state.value);
                  isTimelineActive = true;
              }
          });
      });
  }
  function addStoreToDevtools(app, store) {
      if (!componentStateTypes.includes(getStoreType(store.$id))) {
          componentStateTypes.push(getStoreType(store.$id));
      }
      setupDevtoolsPlugin({
          id: 'dev.esm.pinia',
          label: 'Pinia 🍍',
          logo: 'https://pinia.vuejs.org/logo.svg',
          packageName: 'pinia',
          homepage: 'https://pinia.vuejs.org',
          componentStateTypes,
          app,
          settings: {
              logStoreChanges: {
                  label: 'Notify about new/deleted stores',
                  type: 'boolean',
                  defaultValue: true,
              },
              // useEmojis: {
              //   label: 'Use emojis in messages ⚡️',
              //   type: 'boolean',
              //   defaultValue: true,
              // },
          },
      }, (api) => {
          // gracefully handle errors
          const now = typeof api.now === 'function' ? api.now.bind(api) : Date.now;
          store.$onAction(({ after, onError, name, args }) => {
              const groupId = runningActionId++;
              api.addTimelineEvent({
                  layerId: MUTATIONS_LAYER_ID$1,
                  event: {
                      time: now(),
                      title: '🛫 ' + name,
                      subtitle: 'start',
                      data: {
                          store: formatDisplay$1(store.$id),
                          action: formatDisplay$1(name),
                          args,
                      },
                      groupId,
                  },
              });
              after((result) => {
                  activeAction = undefined;
                  api.addTimelineEvent({
                      layerId: MUTATIONS_LAYER_ID$1,
                      event: {
                          time: now(),
                          title: '🛬 ' + name,
                          subtitle: 'end',
                          data: {
                              store: formatDisplay$1(store.$id),
                              action: formatDisplay$1(name),
                              args,
                              result,
                          },
                          groupId,
                      },
                  });
              });
              onError((error) => {
                  activeAction = undefined;
                  api.addTimelineEvent({
                      layerId: MUTATIONS_LAYER_ID$1,
                      event: {
                          time: now(),
                          logType: 'error',
                          title: '💥 ' + name,
                          subtitle: 'end',
                          data: {
                              store: formatDisplay$1(store.$id),
                              action: formatDisplay$1(name),
                              args,
                              error,
                          },
                          groupId,
                      },
                  });
              });
          }, true);
          store._customProperties.forEach((name) => {
              watch(() => unref(store[name]), (newValue, oldValue) => {
                  api.notifyComponentUpdate();
                  api.sendInspectorState(INSPECTOR_ID$1);
                  if (isTimelineActive) {
                      api.addTimelineEvent({
                          layerId: MUTATIONS_LAYER_ID$1,
                          event: {
                              time: now(),
                              title: 'Change',
                              subtitle: name,
                              data: {
                                  newValue,
                                  oldValue,
                              },
                              groupId: activeAction,
                          },
                      });
                  }
              }, { deep: true });
          });
          store.$subscribe(({ events, type }, state) => {
              api.notifyComponentUpdate();
              api.sendInspectorState(INSPECTOR_ID$1);
              if (!isTimelineActive)
                  return;
              // rootStore.state[store.id] = state
              const eventData = {
                  time: now(),
                  title: formatMutationType(type),
                  data: assign$1({ store: formatDisplay$1(store.$id) }, formatEventData(events)),
                  groupId: activeAction,
              };
              // reset for the next mutation
              activeAction = undefined;
              if (type === MutationType.patchFunction) {
                  eventData.subtitle = '⤵️';
              }
              else if (type === MutationType.patchObject) {
                  eventData.subtitle = '🧩';
              }
              else if (events && !Array.isArray(events)) {
                  eventData.subtitle = events.type;
              }
              if (events) {
                  eventData.data['rawEvent(s)'] = {
                      _custom: {
                          display: 'DebuggerEvent',
                          type: 'object',
                          tooltip: 'raw DebuggerEvent[]',
                          value: events,
                      },
                  };
              }
              api.addTimelineEvent({
                  layerId: MUTATIONS_LAYER_ID$1,
                  event: eventData,
              });
          }, { detached: true, flush: 'sync' });
          const hotUpdate = store._hotUpdate;
          store._hotUpdate = markRaw((newStore) => {
              hotUpdate(newStore);
              api.addTimelineEvent({
                  layerId: MUTATIONS_LAYER_ID$1,
                  event: {
                      time: now(),
                      title: '🔥 ' + store.$id,
                      subtitle: 'HMR update',
                      data: {
                          store: formatDisplay$1(store.$id),
                          info: formatDisplay$1(`HMR update`),
                      },
                  },
              });
              // update the devtools too
              api.notifyComponentUpdate();
              api.sendInspectorTree(INSPECTOR_ID$1);
              api.sendInspectorState(INSPECTOR_ID$1);
          });
          const { $dispose } = store;
          store.$dispose = () => {
              $dispose();
              api.notifyComponentUpdate();
              api.sendInspectorTree(INSPECTOR_ID$1);
              api.sendInspectorState(INSPECTOR_ID$1);
              api.getSettings().logStoreChanges &&
                  toastMessage(`Disposed "${store.$id}" store 🗑`);
          };
          // trigger an update so it can display new registered stores
          api.notifyComponentUpdate();
          api.sendInspectorTree(INSPECTOR_ID$1);
          api.sendInspectorState(INSPECTOR_ID$1);
          api.getSettings().logStoreChanges &&
              toastMessage(`"${store.$id}" store installed 🆕`);
      });
  }
  let runningActionId = 0;
  let activeAction;
  /**
   * Patches a store to enable action grouping in devtools by wrapping the store with a Proxy that is passed as the
   * context of all actions, allowing us to set `runningAction` on each access and effectively associating any state
   * mutation to the action.
   *
   * @param store - store to patch
   * @param actionNames - list of actionst to patch
   */
  function patchActionForGrouping(store, actionNames) {
      // original actions of the store as they are given by pinia. We are going to override them
      const actions = actionNames.reduce((storeActions, actionName) => {
          // use toRaw to avoid tracking #541
          storeActions[actionName] = toRaw(store)[actionName];
          return storeActions;
      }, {});
      for (const actionName in actions) {
          store[actionName] = function () {
              // setActivePinia(store._p)
              // the running action id is incremented in a before action hook
              const _actionId = runningActionId;
              const trackedStore = new Proxy(store, {
                  get(...args) {
                      activeAction = _actionId;
                      return Reflect.get(...args);
                  },
                  set(...args) {
                      activeAction = _actionId;
                      return Reflect.set(...args);
                  },
              });
              return actions[actionName].apply(trackedStore, arguments);
          };
      }
  }
  /**
   * pinia.use(devtoolsPlugin)
   */
  function devtoolsPlugin({ app, store, options }) {
      // HMR module
      if (store.$id.startsWith('__hot:')) {
          return;
      }
      // detect option api vs setup api
      if (options.state) {
          store._isOptionsAPI = true;
      }
      // only wrap actions in option-defined stores as this technique relies on
      // wrapping the context of the action with a proxy
      if (typeof options.state === 'function') {
          patchActionForGrouping(
          // @ts-expect-error: can cast the store...
          store, Object.keys(options.actions));
          const originalHotUpdate = store._hotUpdate;
          // Upgrade the HMR to also update the new actions
          toRaw(store)._hotUpdate = function (newStore) {
              originalHotUpdate.apply(this, arguments);
              patchActionForGrouping(store, Object.keys(newStore._hmrPayload.actions));
          };
      }
      addStoreToDevtools(app, 
      // FIXME: is there a way to allow the assignment from Store<Id, S, G, A> to StoreGeneric?
      store);
  }

  /**
   * Creates a Pinia instance to be used by the application
   */
  function createPinia() {
      const scope = effectScope(true);
      // NOTE: here we could check the window object for a state and directly set it
      // if there is anything like it with Vue 3 SSR
      const state = scope.run(() => ref({}));
      let _p = [];
      // plugins added before calling app.use(pinia)
      let toBeInstalled = [];
      const pinia = markRaw({
          install(app) {
              // this allows calling useStore() outside of a component setup after
              // installing pinia's plugin
              setActivePinia(pinia);
              {
                  pinia._a = app;
                  app.provide(piniaSymbol, pinia);
                  app.config.globalProperties.$pinia = pinia;
                  /* istanbul ignore else */
                  if (USE_DEVTOOLS) {
                      registerPiniaDevtools(app, pinia);
                  }
                  toBeInstalled.forEach((plugin) => _p.push(plugin));
                  toBeInstalled = [];
              }
          },
          use(plugin) {
              if (!this._a && !isVue2) {
                  toBeInstalled.push(plugin);
              }
              else {
                  _p.push(plugin);
              }
              return this;
          },
          _p,
          // it's actually undefined here
          // @ts-expect-error
          _a: null,
          _e: scope,
          _s: new Map(),
          state,
      });
      // pinia devtools rely on dev only features so they cannot be forced unless
      // the dev build of Vue is used. Avoid old browsers like IE11.
      if (USE_DEVTOOLS && typeof Proxy !== 'undefined') {
          pinia.use(devtoolsPlugin);
      }
      return pinia;
  }
  /**
   * Mutates in place `newState` with `oldState` to _hot update_ it. It will
   * remove any key not existing in `newState` and recursively merge plain
   * objects.
   *
   * @param newState - new state object to be patched
   * @param oldState - old state that should be used to patch newState
   * @returns - newState
   */
  function patchObject(newState, oldState) {
      // no need to go through symbols because they cannot be serialized anyway
      for (const key in oldState) {
          const subPatch = oldState[key];
          // skip the whole sub tree
          if (!(key in newState)) {
              continue;
          }
          const targetValue = newState[key];
          if (isPlainObject(targetValue) &&
              isPlainObject(subPatch) &&
              !isRef(subPatch) &&
              !isReactive(subPatch)) {
              newState[key] = patchObject(targetValue, subPatch);
          }
          else {
              // objects are either a bit more complex (e.g. refs) or primitives, so we
              // just set the whole thing
              {
                  newState[key] = subPatch;
              }
          }
      }
      return newState;
  }

  const noop$1 = () => { };
  function addSubscription(subscriptions, callback, detached, onCleanup = noop$1) {
      subscriptions.push(callback);
      const removeSubscription = () => {
          const idx = subscriptions.indexOf(callback);
          if (idx > -1) {
              subscriptions.splice(idx, 1);
              onCleanup();
          }
      };
      if (!detached && getCurrentScope()) {
          onScopeDispose(removeSubscription);
      }
      return removeSubscription;
  }
  function triggerSubscriptions(subscriptions, ...args) {
      subscriptions.slice().forEach((callback) => {
          callback(...args);
      });
  }

  function mergeReactiveObjects(target, patchToApply) {
      // Handle Map instances
      if (target instanceof Map && patchToApply instanceof Map) {
          patchToApply.forEach((value, key) => target.set(key, value));
      }
      // Handle Set instances
      if (target instanceof Set && patchToApply instanceof Set) {
          patchToApply.forEach(target.add, target);
      }
      // no need to go through symbols because they cannot be serialized anyway
      for (const key in patchToApply) {
          if (!patchToApply.hasOwnProperty(key))
              continue;
          const subPatch = patchToApply[key];
          const targetValue = target[key];
          if (isPlainObject(targetValue) &&
              isPlainObject(subPatch) &&
              target.hasOwnProperty(key) &&
              !isRef(subPatch) &&
              !isReactive(subPatch)) {
              // NOTE: here I wanted to warn about inconsistent types but it's not possible because in setup stores one might
              // start the value of a property as a certain type e.g. a Map, and then for some reason, during SSR, change that
              // to `undefined`. When trying to hydrate, we want to override the Map with `undefined`.
              target[key] = mergeReactiveObjects(targetValue, subPatch);
          }
          else {
              // @ts-expect-error: subPatch is a valid value
              target[key] = subPatch;
          }
      }
      return target;
  }
  const skipHydrateSymbol = Symbol('pinia:skipHydration')
      ;
  /**
   * Returns whether a value should be hydrated
   *
   * @param obj - target variable
   * @returns true if `obj` should be hydrated
   */
  function shouldHydrate(obj) {
      return !isPlainObject(obj) || !obj.hasOwnProperty(skipHydrateSymbol);
  }
  const { assign: assign$2 } = Object;
  function isComputed(o) {
      return !!(isRef(o) && o.effect);
  }
  function createOptionsStore(id, options, pinia, hot) {
      const { state, actions, getters } = options;
      const initialState = pinia.state.value[id];
      let store;
      function setup() {
          if (!initialState && (!hot)) {
              /* istanbul ignore if */
              {
                  pinia.state.value[id] = state ? state() : {};
              }
          }
          // avoid creating a state in pinia.state.value
          const localState = hot
              ? // use ref() to unwrap refs inside state TODO: check if this is still necessary
                  toRefs(ref(state ? state() : {}).value)
              : toRefs(pinia.state.value[id]);
          return assign$2(localState, actions, Object.keys(getters || {}).reduce((computedGetters, name) => {
              if (name in localState) {
                  console.warn(`[🍍]: A getter cannot have the same name as another state property. Rename one of them. Found with "${name}" in store "${id}".`);
              }
              computedGetters[name] = markRaw(computed(() => {
                  setActivePinia(pinia);
                  // it was created just before
                  const store = pinia._s.get(id);
                  // @ts-expect-error
                  // return getters![name].call(context, context)
                  // TODO: avoid reading the getter while assigning with a global variable
                  return getters[name].call(store, store);
              }));
              return computedGetters;
          }, {}));
      }
      store = createSetupStore(id, setup, options, pinia, hot, true);
      return store;
  }
  function createSetupStore($id, setup, options = {}, pinia, hot, isOptionsStore) {
      let scope;
      const optionsForPlugin = assign$2({ actions: {} }, options);
      /* istanbul ignore if */
      if (!pinia._e.active) {
          throw new Error('Pinia destroyed');
      }
      // watcher options for $subscribe
      const $subscribeOptions = {
          deep: true,
          // flush: 'post',
      };
      /* istanbul ignore else */
      {
          $subscribeOptions.onTrigger = (event) => {
              /* istanbul ignore else */
              if (isListening) {
                  debuggerEvents = event;
                  // avoid triggering this while the store is being built and the state is being set in pinia
              }
              else if (isListening == false && !store._hotUpdating) {
                  // let patch send all the events together later
                  /* istanbul ignore else */
                  if (Array.isArray(debuggerEvents)) {
                      debuggerEvents.push(event);
                  }
                  else {
                      console.error('🍍 debuggerEvents should be an array. This is most likely an internal Pinia bug.');
                  }
              }
          };
      }
      // internal state
      let isListening; // set to true at the end
      let isSyncListening; // set to true at the end
      let subscriptions = markRaw([]);
      let actionSubscriptions = markRaw([]);
      let debuggerEvents;
      const initialState = pinia.state.value[$id];
      // avoid setting the state for option stores if it is set
      // by the setup
      if (!isOptionsStore && !initialState && (!hot)) {
          /* istanbul ignore if */
          {
              pinia.state.value[$id] = {};
          }
      }
      const hotState = ref({});
      // avoid triggering too many listeners
      // https://github.com/vuejs/pinia/issues/1129
      let activeListener;
      function $patch(partialStateOrMutator) {
          let subscriptionMutation;
          isListening = isSyncListening = false;
          // reset the debugger events since patches are sync
          /* istanbul ignore else */
          {
              debuggerEvents = [];
          }
          if (typeof partialStateOrMutator === 'function') {
              partialStateOrMutator(pinia.state.value[$id]);
              subscriptionMutation = {
                  type: MutationType.patchFunction,
                  storeId: $id,
                  events: debuggerEvents,
              };
          }
          else {
              mergeReactiveObjects(pinia.state.value[$id], partialStateOrMutator);
              subscriptionMutation = {
                  type: MutationType.patchObject,
                  payload: partialStateOrMutator,
                  storeId: $id,
                  events: debuggerEvents,
              };
          }
          const myListenerId = (activeListener = Symbol());
          nextTick().then(() => {
              if (activeListener === myListenerId) {
                  isListening = true;
              }
          });
          isSyncListening = true;
          // because we paused the watcher, we need to manually call the subscriptions
          triggerSubscriptions(subscriptions, subscriptionMutation, pinia.state.value[$id]);
      }
      const $reset = isOptionsStore
          ? function $reset() {
              const { state } = options;
              const newState = state ? state() : {};
              // we use a patch to group all changes into one single subscription
              this.$patch(($state) => {
                  assign$2($state, newState);
              });
          }
          : /* istanbul ignore next */
              () => {
                      throw new Error(`🍍: Store "${$id}" is built using the setup syntax and does not implement $reset().`);
                  }
                  ;
      function $dispose() {
          scope.stop();
          subscriptions = [];
          actionSubscriptions = [];
          pinia._s.delete($id);
      }
      /**
       * Wraps an action to handle subscriptions.
       *
       * @param name - name of the action
       * @param action - action to wrap
       * @returns a wrapped action to handle subscriptions
       */
      function wrapAction(name, action) {
          return function () {
              setActivePinia(pinia);
              const args = Array.from(arguments);
              const afterCallbackList = [];
              const onErrorCallbackList = [];
              function after(callback) {
                  afterCallbackList.push(callback);
              }
              function onError(callback) {
                  onErrorCallbackList.push(callback);
              }
              // @ts-expect-error
              triggerSubscriptions(actionSubscriptions, {
                  args,
                  name,
                  store,
                  after,
                  onError,
              });
              let ret;
              try {
                  ret = action.apply(this && this.$id === $id ? this : store, args);
                  // handle sync errors
              }
              catch (error) {
                  triggerSubscriptions(onErrorCallbackList, error);
                  throw error;
              }
              if (ret instanceof Promise) {
                  return ret
                      .then((value) => {
                      triggerSubscriptions(afterCallbackList, value);
                      return value;
                  })
                      .catch((error) => {
                      triggerSubscriptions(onErrorCallbackList, error);
                      return Promise.reject(error);
                  });
              }
              // trigger after callbacks
              triggerSubscriptions(afterCallbackList, ret);
              return ret;
          };
      }
      const _hmrPayload = /*#__PURE__*/ markRaw({
          actions: {},
          getters: {},
          state: [],
          hotState,
      });
      const partialStore = {
          _p: pinia,
          // _s: scope,
          $id,
          $onAction: addSubscription.bind(null, actionSubscriptions),
          $patch,
          $reset,
          $subscribe(callback, options = {}) {
              const removeSubscription = addSubscription(subscriptions, callback, options.detached, () => stopWatcher());
              const stopWatcher = scope.run(() => watch(() => pinia.state.value[$id], (state) => {
                  if (options.flush === 'sync' ? isSyncListening : isListening) {
                      callback({
                          storeId: $id,
                          type: MutationType.direct,
                          events: debuggerEvents,
                      }, state);
                  }
              }, assign$2({}, $subscribeOptions, options)));
              return removeSubscription;
          },
          $dispose,
      };
      const store = reactive(assign$2({
              _hmrPayload,
              _customProperties: markRaw(new Set()), // devtools custom properties
          }, partialStore
          // must be added later
          // setupStore
          )
          );
      // store the partial store now so the setup of stores can instantiate each other before they are finished without
      // creating infinite loops.
      pinia._s.set($id, store);
      // TODO: idea create skipSerialize that marks properties as non serializable and they are skipped
      const setupStore = pinia._e.run(() => {
          scope = effectScope();
          return scope.run(() => setup());
      });
      // overwrite existing actions to support $onAction
      for (const key in setupStore) {
          const prop = setupStore[key];
          if ((isRef(prop) && !isComputed(prop)) || isReactive(prop)) {
              // mark it as a piece of state to be serialized
              if (hot) {
                  set(hotState.value, key, toRef(setupStore, key));
                  // createOptionStore directly sets the state in pinia.state.value so we
                  // can just skip that
              }
              else if (!isOptionsStore) {
                  // in setup stores we must hydrate the state and sync pinia state tree with the refs the user just created
                  if (initialState && shouldHydrate(prop)) {
                      if (isRef(prop)) {
                          prop.value = initialState[key];
                      }
                      else {
                          // probably a reactive object, lets recursively assign
                          // @ts-expect-error: prop is unknown
                          mergeReactiveObjects(prop, initialState[key]);
                      }
                  }
                  // transfer the ref to the pinia state to keep everything in sync
                  /* istanbul ignore if */
                  {
                      pinia.state.value[$id][key] = prop;
                  }
              }
              /* istanbul ignore else */
              {
                  _hmrPayload.state.push(key);
              }
              // action
          }
          else if (typeof prop === 'function') {
              // @ts-expect-error: we are overriding the function we avoid wrapping if
              const actionValue = hot ? prop : wrapAction(key, prop);
              // this a hot module replacement store because the hotUpdate method needs
              // to do it with the right context
              /* istanbul ignore if */
              {
                  // @ts-expect-error
                  setupStore[key] = actionValue;
              }
              /* istanbul ignore else */
              {
                  _hmrPayload.actions[key] = prop;
              }
              // list actions so they can be used in plugins
              // @ts-expect-error
              optionsForPlugin.actions[key] = prop;
          }
          else {
              // add getters for devtools
              if (isComputed(prop)) {
                  _hmrPayload.getters[key] = isOptionsStore
                      ? // @ts-expect-error
                          options.getters[key]
                      : prop;
                  if (IS_CLIENT) {
                      const getters = setupStore._getters ||
                          // @ts-expect-error: same
                          (setupStore._getters = markRaw([]));
                      getters.push(key);
                  }
              }
          }
      }
      // add the state, getters, and action properties
      /* istanbul ignore if */
      {
          assign$2(store, setupStore);
          // allows retrieving reactive objects with `storeToRefs()`. Must be called after assigning to the reactive object.
          // Make `storeToRefs()` work with `reactive()` #799
          assign$2(toRaw(store), setupStore);
      }
      // use this instead of a computed with setter to be able to create it anywhere
      // without linking the computed lifespan to wherever the store is first
      // created.
      Object.defineProperty(store, '$state', {
          get: () => (hot ? hotState.value : pinia.state.value[$id]),
          set: (state) => {
              /* istanbul ignore if */
              if (hot) {
                  throw new Error('cannot set hotState');
              }
              $patch(($state) => {
                  assign$2($state, state);
              });
          },
      });
      // add the hotUpdate before plugins to allow them to override it
      /* istanbul ignore else */
      {
          store._hotUpdate = markRaw((newStore) => {
              store._hotUpdating = true;
              newStore._hmrPayload.state.forEach((stateKey) => {
                  if (stateKey in store.$state) {
                      const newStateTarget = newStore.$state[stateKey];
                      const oldStateSource = store.$state[stateKey];
                      if (typeof newStateTarget === 'object' &&
                          isPlainObject(newStateTarget) &&
                          isPlainObject(oldStateSource)) {
                          patchObject(newStateTarget, oldStateSource);
                      }
                      else {
                          // transfer the ref
                          newStore.$state[stateKey] = oldStateSource;
                      }
                  }
                  // patch direct access properties to allow store.stateProperty to work as
                  // store.$state.stateProperty
                  set(store, stateKey, toRef(newStore.$state, stateKey));
              });
              // remove deleted state properties
              Object.keys(store.$state).forEach((stateKey) => {
                  if (!(stateKey in newStore.$state)) {
                      del(store, stateKey);
                  }
              });
              // avoid devtools logging this as a mutation
              isListening = false;
              isSyncListening = false;
              pinia.state.value[$id] = toRef(newStore._hmrPayload, 'hotState');
              isSyncListening = true;
              nextTick().then(() => {
                  isListening = true;
              });
              for (const actionName in newStore._hmrPayload.actions) {
                  const action = newStore[actionName];
                  set(store, actionName, wrapAction(actionName, action));
              }
              // TODO: does this work in both setup and option store?
              for (const getterName in newStore._hmrPayload.getters) {
                  const getter = newStore._hmrPayload.getters[getterName];
                  const getterValue = isOptionsStore
                      ? // special handling of options api
                          computed(() => {
                              setActivePinia(pinia);
                              return getter.call(store, store);
                          })
                      : getter;
                  set(store, getterName, getterValue);
              }
              // remove deleted getters
              Object.keys(store._hmrPayload.getters).forEach((key) => {
                  if (!(key in newStore._hmrPayload.getters)) {
                      del(store, key);
                  }
              });
              // remove old actions
              Object.keys(store._hmrPayload.actions).forEach((key) => {
                  if (!(key in newStore._hmrPayload.actions)) {
                      del(store, key);
                  }
              });
              // update the values used in devtools and to allow deleting new properties later on
              store._hmrPayload = newStore._hmrPayload;
              store._getters = newStore._getters;
              store._hotUpdating = false;
          });
      }
      if (USE_DEVTOOLS) {
          const nonEnumerable = {
              writable: true,
              configurable: true,
              // avoid warning on devtools trying to display this property
              enumerable: false,
          };
          ['_p', '_hmrPayload', '_getters', '_customProperties'].forEach((p) => {
              Object.defineProperty(store, p, assign$2({ value: store[p] }, nonEnumerable));
          });
      }
      // apply all plugins
      pinia._p.forEach((extender) => {
          /* istanbul ignore else */
          if (USE_DEVTOOLS) {
              const extensions = scope.run(() => extender({
                  store,
                  app: pinia._a,
                  pinia,
                  options: optionsForPlugin,
              }));
              Object.keys(extensions || {}).forEach((key) => store._customProperties.add(key));
              assign$2(store, extensions);
          }
          else {
              assign$2(store, scope.run(() => extender({
                  store,
                  app: pinia._a,
                  pinia,
                  options: optionsForPlugin,
              })));
          }
      });
      if (store.$state &&
          typeof store.$state === 'object' &&
          typeof store.$state.constructor === 'function' &&
          !store.$state.constructor.toString().includes('[native code]')) {
          console.warn(`[🍍]: The "state" must be a plain object. It cannot be\n` +
              `\tstate: () => new MyClass()\n` +
              `Found in store "${store.$id}".`);
      }
      // only apply hydrate to option stores with an initial state in pinia
      if (initialState &&
          isOptionsStore &&
          options.hydrate) {
          options.hydrate(store.$state, initialState);
      }
      isListening = true;
      isSyncListening = true;
      return store;
  }
  function defineStore(
  // TODO: add proper types from above
  idOrOptions, setup, setupOptions) {
      let id;
      let options;
      const isSetupStore = typeof setup === 'function';
      if (typeof idOrOptions === 'string') {
          id = idOrOptions;
          // the option store setup will contain the actual options in this case
          options = isSetupStore ? setupOptions : setup;
      }
      else {
          options = idOrOptions;
          id = idOrOptions.id;
          if (typeof id !== 'string') {
              throw new Error(`[🍍]: "defineStore()" must be passed a store id as its first argument.`);
          }
      }
      function useStore(pinia, hot) {
          const currentInstance = getCurrentInstance();
          pinia =
              // in test mode, ignore the argument provided as we can always retrieve a
              // pinia instance with getActivePinia()
              (pinia) ||
                  (currentInstance && inject(piniaSymbol, null));
          if (pinia)
              setActivePinia(pinia);
          if (!activePinia) {
              throw new Error(`[🍍]: "getActivePinia()" was called but there was no active Pinia. Did you forget to install pinia?\n` +
                  `\tconst pinia = createPinia()\n` +
                  `\tapp.use(pinia)\n` +
                  `This will fail in production.`);
          }
          pinia = activePinia;
          if (!pinia._s.has(id)) {
              // creating the store registers it in `pinia._s`
              if (isSetupStore) {
                  createSetupStore(id, setup, options, pinia);
              }
              else {
                  createOptionsStore(id, options, pinia);
              }
              /* istanbul ignore else */
              {
                  // @ts-expect-error: not the right inferred type
                  useStore._pinia = pinia;
              }
          }
          const store = pinia._s.get(id);
          if (hot) {
              const hotId = '__hot:' + id;
              const newStore = isSetupStore
                  ? createSetupStore(hotId, setup, options, pinia, true)
                  : createOptionsStore(hotId, assign$2({}, options), pinia, true);
              hot._hotUpdate(newStore);
              // cleanup the state properties and the store from the cache
              delete pinia.state.value[hotId];
              pinia._s.delete(hotId);
          }
          // save stores in instances to access them devtools
          if (IS_CLIENT &&
              currentInstance &&
              currentInstance.proxy &&
              // avoid adding stores that are just built for hot module replacement
              !hot) {
              const vm = currentInstance.proxy;
              const cache = '_pStores' in vm ? vm._pStores : (vm._pStores = {});
              cache[id] = store;
          }
          // StoreGeneric cannot be casted towards Store
          return store;
      }
      useStore.$id = id;
      return useStore;
  }

  function render$u(_ctx, _cache) {
    const _component_router_view = resolveComponent("router-view");

    return (openBlock(), createBlock(_component_router_view))
  }

  const script$u = {};



  script$u.render = render$u;

  /*!
    * vue-router v4.2.0
    * (c) 2023 Eduardo San Martin Morote
    * @license MIT
    */

  const isBrowser = typeof window !== 'undefined';

  function isESModule(obj) {
      return obj.__esModule || obj[Symbol.toStringTag] === 'Module';
  }
  const assign = Object.assign;
  function applyToParams(fn, params) {
      const newParams = {};
      for (const key in params) {
          const value = params[key];
          newParams[key] = isArray(value)
              ? value.map(fn)
              : fn(value);
      }
      return newParams;
  }
  const noop = () => { };
  /**
   * Typesafe alternative to Array.isArray
   * https://github.com/microsoft/TypeScript/pull/48228
   */
  const isArray = Array.isArray;

  function warn(msg) {
      // avoid using ...args as it breaks in older Edge builds
      const args = Array.from(arguments).slice(1);
      console.warn.apply(console, ['[Vue Router warn]: ' + msg].concat(args));
  }

  const TRAILING_SLASH_RE = /\/$/;
  const removeTrailingSlash = (path) => path.replace(TRAILING_SLASH_RE, '');
  /**
   * Transforms a URI into a normalized history location
   *
   * @param parseQuery
   * @param location - URI to normalize
   * @param currentLocation - current absolute location. Allows resolving relative
   * paths. Must start with `/`. Defaults to `/`
   * @returns a normalized history location
   */
  function parseURL(parseQuery, location, currentLocation = '/') {
      let path, query = {}, searchString = '', hash = '';
      // Could use URL and URLSearchParams but IE 11 doesn't support it
      // TODO: move to new URL()
      const hashPos = location.indexOf('#');
      let searchPos = location.indexOf('?');
      // the hash appears before the search, so it's not part of the search string
      if (hashPos < searchPos && hashPos >= 0) {
          searchPos = -1;
      }
      if (searchPos > -1) {
          path = location.slice(0, searchPos);
          searchString = location.slice(searchPos + 1, hashPos > -1 ? hashPos : location.length);
          query = parseQuery(searchString);
      }
      if (hashPos > -1) {
          path = path || location.slice(0, hashPos);
          // keep the # character
          hash = location.slice(hashPos, location.length);
      }
      // no search and no query
      path = resolveRelativePath(path != null ? path : location, currentLocation);
      // empty path means a relative query or hash `?foo=f`, `#thing`
      return {
          fullPath: path + (searchString && '?') + searchString + hash,
          path,
          query,
          hash,
      };
  }
  /**
   * Stringifies a URL object
   *
   * @param stringifyQuery
   * @param location
   */
  function stringifyURL(stringifyQuery, location) {
      const query = location.query ? stringifyQuery(location.query) : '';
      return location.path + (query && '?') + query + (location.hash || '');
  }
  /**
   * Strips off the base from the beginning of a location.pathname in a non-case-sensitive way.
   *
   * @param pathname - location.pathname
   * @param base - base to strip off
   */
  function stripBase(pathname, base) {
      // no base or base is not found at the beginning
      if (!base || !pathname.toLowerCase().startsWith(base.toLowerCase()))
          return pathname;
      return pathname.slice(base.length) || '/';
  }
  /**
   * Checks if two RouteLocation are equal. This means that both locations are
   * pointing towards the same {@link RouteRecord} and that all `params`, `query`
   * parameters and `hash` are the same
   *
   * @param stringifyQuery - A function that takes a query object of type LocationQueryRaw and returns a string representation of it.
   * @param a - first {@link RouteLocation}
   * @param b - second {@link RouteLocation}
   */
  function isSameRouteLocation(stringifyQuery, a, b) {
      const aLastIndex = a.matched.length - 1;
      const bLastIndex = b.matched.length - 1;
      return (aLastIndex > -1 &&
          aLastIndex === bLastIndex &&
          isSameRouteRecord(a.matched[aLastIndex], b.matched[bLastIndex]) &&
          isSameRouteLocationParams(a.params, b.params) &&
          stringifyQuery(a.query) === stringifyQuery(b.query) &&
          a.hash === b.hash);
  }
  /**
   * Check if two `RouteRecords` are equal. Takes into account aliases: they are
   * considered equal to the `RouteRecord` they are aliasing.
   *
   * @param a - first {@link RouteRecord}
   * @param b - second {@link RouteRecord}
   */
  function isSameRouteRecord(a, b) {
      // since the original record has an undefined value for aliasOf
      // but all aliases point to the original record, this will always compare
      // the original record
      return (a.aliasOf || a) === (b.aliasOf || b);
  }
  function isSameRouteLocationParams(a, b) {
      if (Object.keys(a).length !== Object.keys(b).length)
          return false;
      for (const key in a) {
          if (!isSameRouteLocationParamsValue(a[key], b[key]))
              return false;
      }
      return true;
  }
  function isSameRouteLocationParamsValue(a, b) {
      return isArray(a)
          ? isEquivalentArray(a, b)
          : isArray(b)
              ? isEquivalentArray(b, a)
              : a === b;
  }
  /**
   * Check if two arrays are the same or if an array with one single entry is the
   * same as another primitive value. Used to check query and parameters
   *
   * @param a - array of values
   * @param b - array of values or a single value
   */
  function isEquivalentArray(a, b) {
      return isArray(b)
          ? a.length === b.length && a.every((value, i) => value === b[i])
          : a.length === 1 && a[0] === b;
  }
  /**
   * Resolves a relative path that starts with `.`.
   *
   * @param to - path location we are resolving
   * @param from - currentLocation.path, should start with `/`
   */
  function resolveRelativePath(to, from) {
      if (to.startsWith('/'))
          return to;
      if (!from.startsWith('/')) {
          warn(`Cannot resolve a relative location without an absolute path. Trying to resolve "${to}" from "${from}". It should look like "/${from}".`);
          return to;
      }
      if (!to)
          return from;
      const fromSegments = from.split('/');
      const toSegments = to.split('/');
      const lastToSegment = toSegments[toSegments.length - 1];
      // make . and ./ the same (../ === .., ../../ === ../..)
      // this is the same behavior as new URL()
      if (lastToSegment === '..' || lastToSegment === '.') {
          toSegments.push('');
      }
      let position = fromSegments.length - 1;
      let toPosition;
      let segment;
      for (toPosition = 0; toPosition < toSegments.length; toPosition++) {
          segment = toSegments[toPosition];
          // we stay on the same position
          if (segment === '.')
              continue;
          // go up in the from array
          if (segment === '..') {
              // we can't go below zero, but we still need to increment toPosition
              if (position > 1)
                  position--;
              // continue
          }
          // we reached a non-relative path, we stop here
          else
              break;
      }
      return (fromSegments.slice(0, position).join('/') +
          '/' +
          toSegments
              // ensure we use at least the last element in the toSegments
              .slice(toPosition - (toPosition === toSegments.length ? 1 : 0))
              .join('/'));
  }

  var NavigationType;
  (function (NavigationType) {
      NavigationType["pop"] = "pop";
      NavigationType["push"] = "push";
  })(NavigationType || (NavigationType = {}));
  var NavigationDirection;
  (function (NavigationDirection) {
      NavigationDirection["back"] = "back";
      NavigationDirection["forward"] = "forward";
      NavigationDirection["unknown"] = "";
  })(NavigationDirection || (NavigationDirection = {}));
  // Generic utils
  /**
   * Normalizes a base by removing any trailing slash and reading the base tag if
   * present.
   *
   * @param base - base to normalize
   */
  function normalizeBase(base) {
      if (!base) {
          if (isBrowser) {
              // respect <base> tag
              const baseEl = document.querySelector('base');
              base = (baseEl && baseEl.getAttribute('href')) || '/';
              // strip full URL origin
              base = base.replace(/^\w+:\/\/[^\/]+/, '');
          }
          else {
              base = '/';
          }
      }
      // ensure leading slash when it was removed by the regex above avoid leading
      // slash with hash because the file could be read from the disk like file://
      // and the leading slash would cause problems
      if (base[0] !== '/' && base[0] !== '#')
          base = '/' + base;
      // remove the trailing slash so all other method can just do `base + fullPath`
      // to build an href
      return removeTrailingSlash(base);
  }
  // remove any character before the hash
  const BEFORE_HASH_RE = /^[^#]+#/;
  function createHref(base, location) {
      return base.replace(BEFORE_HASH_RE, '#') + location;
  }

  function getElementPosition(el, offset) {
      const docRect = document.documentElement.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      return {
          behavior: offset.behavior,
          left: elRect.left - docRect.left - (offset.left || 0),
          top: elRect.top - docRect.top - (offset.top || 0),
      };
  }
  const computeScrollPosition = () => ({
      left: window.pageXOffset,
      top: window.pageYOffset,
  });
  function scrollToPosition(position) {
      let scrollToOptions;
      if ('el' in position) {
          const positionEl = position.el;
          const isIdSelector = typeof positionEl === 'string' && positionEl.startsWith('#');
          /**
           * `id`s can accept pretty much any characters, including CSS combinators
           * like `>` or `~`. It's still possible to retrieve elements using
           * `document.getElementById('~')` but it needs to be escaped when using
           * `document.querySelector('#\\~')` for it to be valid. The only
           * requirements for `id`s are them to be unique on the page and to not be
           * empty (`id=""`). Because of that, when passing an id selector, it should
           * be properly escaped for it to work with `querySelector`. We could check
           * for the id selector to be simple (no CSS combinators `+ >~`) but that
           * would make things inconsistent since they are valid characters for an
           * `id` but would need to be escaped when using `querySelector`, breaking
           * their usage and ending up in no selector returned. Selectors need to be
           * escaped:
           *
           * - `#1-thing` becomes `#\31 -thing`
           * - `#with~symbols` becomes `#with\\~symbols`
           *
           * - More information about  the topic can be found at
           *   https://mathiasbynens.be/notes/html5-id-class.
           * - Practical example: https://mathiasbynens.be/demo/html5-id
           */
          if (typeof position.el === 'string') {
              if (!isIdSelector || !document.getElementById(position.el.slice(1))) {
                  try {
                      const foundEl = document.querySelector(position.el);
                      if (isIdSelector && foundEl) {
                          warn(`The selector "${position.el}" should be passed as "el: document.querySelector('${position.el}')" because it starts with "#".`);
                          // return to avoid other warnings
                          return;
                      }
                  }
                  catch (err) {
                      warn(`The selector "${position.el}" is invalid. If you are using an id selector, make sure to escape it. You can find more information about escaping characters in selectors at https://mathiasbynens.be/notes/css-escapes or use CSS.escape (https://developer.mozilla.org/en-US/docs/Web/API/CSS/escape).`);
                      // return to avoid other warnings
                      return;
                  }
              }
          }
          const el = typeof positionEl === 'string'
              ? isIdSelector
                  ? document.getElementById(positionEl.slice(1))
                  : document.querySelector(positionEl)
              : positionEl;
          if (!el) {
              warn(`Couldn't find element using selector "${position.el}" returned by scrollBehavior.`);
              return;
          }
          scrollToOptions = getElementPosition(el, position);
      }
      else {
          scrollToOptions = position;
      }
      if ('scrollBehavior' in document.documentElement.style)
          window.scrollTo(scrollToOptions);
      else {
          window.scrollTo(scrollToOptions.left != null ? scrollToOptions.left : window.pageXOffset, scrollToOptions.top != null ? scrollToOptions.top : window.pageYOffset);
      }
  }
  function getScrollKey(path, delta) {
      const position = history.state ? history.state.position - delta : -1;
      return position + path;
  }
  const scrollPositions = new Map();
  function saveScrollPosition(key, scrollPosition) {
      scrollPositions.set(key, scrollPosition);
  }
  function getSavedScrollPosition(key) {
      const scroll = scrollPositions.get(key);
      // consume it so it's not used again
      scrollPositions.delete(key);
      return scroll;
  }
  // TODO: RFC about how to save scroll position
  /**
   * ScrollBehavior instance used by the router to compute and restore the scroll
   * position when navigating.
   */
  // export interface ScrollHandler<ScrollPositionEntry extends HistoryStateValue, ScrollPosition extends ScrollPositionEntry> {
  //   // returns a scroll position that can be saved in history
  //   compute(): ScrollPositionEntry
  //   // can take an extended ScrollPositionEntry
  //   scroll(position: ScrollPosition): void
  // }
  // export const scrollHandler: ScrollHandler<ScrollPosition> = {
  //   compute: computeScroll,
  //   scroll: scrollToPosition,
  // }

  let createBaseLocation = () => location.protocol + '//' + location.host;
  /**
   * Creates a normalized history location from a window.location object
   * @param base - The base path
   * @param location - The window.location object
   */
  function createCurrentLocation(base, location) {
      const { pathname, search, hash } = location;
      // allows hash bases like #, /#, #/, #!, #!/, /#!/, or even /folder#end
      const hashPos = base.indexOf('#');
      if (hashPos > -1) {
          let slicePos = hash.includes(base.slice(hashPos))
              ? base.slice(hashPos).length
              : 1;
          let pathFromHash = hash.slice(slicePos);
          // prepend the starting slash to hash so the url starts with /#
          if (pathFromHash[0] !== '/')
              pathFromHash = '/' + pathFromHash;
          return stripBase(pathFromHash, '');
      }
      const path = stripBase(pathname, base);
      return path + search + hash;
  }
  function useHistoryListeners(base, historyState, currentLocation, replace) {
      let listeners = [];
      let teardowns = [];
      // TODO: should it be a stack? a Dict. Check if the popstate listener
      // can trigger twice
      let pauseState = null;
      const popStateHandler = ({ state, }) => {
          const to = createCurrentLocation(base, location);
          const from = currentLocation.value;
          const fromState = historyState.value;
          let delta = 0;
          if (state) {
              currentLocation.value = to;
              historyState.value = state;
              // ignore the popstate and reset the pauseState
              if (pauseState && pauseState === from) {
                  pauseState = null;
                  return;
              }
              delta = fromState ? state.position - fromState.position : 0;
          }
          else {
              replace(to);
          }
          // console.log({ deltaFromCurrent })
          // Here we could also revert the navigation by calling history.go(-delta)
          // this listener will have to be adapted to not trigger again and to wait for the url
          // to be updated before triggering the listeners. Some kind of validation function would also
          // need to be passed to the listeners so the navigation can be accepted
          // call all listeners
          listeners.forEach(listener => {
              listener(currentLocation.value, from, {
                  delta,
                  type: NavigationType.pop,
                  direction: delta
                      ? delta > 0
                          ? NavigationDirection.forward
                          : NavigationDirection.back
                      : NavigationDirection.unknown,
              });
          });
      };
      function pauseListeners() {
          pauseState = currentLocation.value;
      }
      function listen(callback) {
          // set up the listener and prepare teardown callbacks
          listeners.push(callback);
          const teardown = () => {
              const index = listeners.indexOf(callback);
              if (index > -1)
                  listeners.splice(index, 1);
          };
          teardowns.push(teardown);
          return teardown;
      }
      function beforeUnloadListener() {
          const { history } = window;
          if (!history.state)
              return;
          history.replaceState(assign({}, history.state, { scroll: computeScrollPosition() }), '');
      }
      function destroy() {
          for (const teardown of teardowns)
              teardown();
          teardowns = [];
          window.removeEventListener('popstate', popStateHandler);
          window.removeEventListener('beforeunload', beforeUnloadListener);
      }
      // set up the listeners and prepare teardown callbacks
      window.addEventListener('popstate', popStateHandler);
      // TODO: could we use 'pagehide' or 'visibilitychange' instead?
      // https://developer.chrome.com/blog/page-lifecycle-api/
      window.addEventListener('beforeunload', beforeUnloadListener, {
          passive: true,
      });
      return {
          pauseListeners,
          listen,
          destroy,
      };
  }
  /**
   * Creates a state object
   */
  function buildState(back, current, forward, replaced = false, computeScroll = false) {
      return {
          back,
          current,
          forward,
          replaced,
          position: window.history.length,
          scroll: computeScroll ? computeScrollPosition() : null,
      };
  }
  function useHistoryStateNavigation(base) {
      const { history, location } = window;
      // private variables
      const currentLocation = {
          value: createCurrentLocation(base, location),
      };
      const historyState = { value: history.state };
      // build current history entry as this is a fresh navigation
      if (!historyState.value) {
          changeLocation(currentLocation.value, {
              back: null,
              current: currentLocation.value,
              forward: null,
              // the length is off by one, we need to decrease it
              position: history.length - 1,
              replaced: true,
              // don't add a scroll as the user may have an anchor, and we want
              // scrollBehavior to be triggered without a saved position
              scroll: null,
          }, true);
      }
      function changeLocation(to, state, replace) {
          /**
           * if a base tag is provided, and we are on a normal domain, we have to
           * respect the provided `base` attribute because pushState() will use it and
           * potentially erase anything before the `#` like at
           * https://github.com/vuejs/router/issues/685 where a base of
           * `/folder/#` but a base of `/` would erase the `/folder/` section. If
           * there is no host, the `<base>` tag makes no sense and if there isn't a
           * base tag we can just use everything after the `#`.
           */
          const hashIndex = base.indexOf('#');
          const url = hashIndex > -1
              ? (location.host && document.querySelector('base')
                  ? base
                  : base.slice(hashIndex)) + to
              : createBaseLocation() + base + to;
          try {
              // BROWSER QUIRK
              // NOTE: Safari throws a SecurityError when calling this function 100 times in 30 seconds
              history[replace ? 'replaceState' : 'pushState'](state, '', url);
              historyState.value = state;
          }
          catch (err) {
              {
                  warn('Error with push/replace State', err);
              }
              // Force the navigation, this also resets the call count
              location[replace ? 'replace' : 'assign'](url);
          }
      }
      function replace(to, data) {
          const state = assign({}, history.state, buildState(historyState.value.back, 
          // keep back and forward entries but override current position
          to, historyState.value.forward, true), data, { position: historyState.value.position });
          changeLocation(to, state, true);
          currentLocation.value = to;
      }
      function push(to, data) {
          // Add to current entry the information of where we are going
          // as well as saving the current position
          const currentState = assign({}, 
          // use current history state to gracefully handle a wrong call to
          // history.replaceState
          // https://github.com/vuejs/router/issues/366
          historyState.value, history.state, {
              forward: to,
              scroll: computeScrollPosition(),
          });
          if (!history.state) {
              warn(`history.state seems to have been manually replaced without preserving the necessary values. Make sure to preserve existing history state if you are manually calling history.replaceState:\n\n` +
                  `history.replaceState(history.state, '', url)\n\n` +
                  `You can find more information at https://next.router.vuejs.org/guide/migration/#usage-of-history-state.`);
          }
          changeLocation(currentState.current, currentState, true);
          const state = assign({}, buildState(currentLocation.value, to, null), { position: currentState.position + 1 }, data);
          changeLocation(to, state, false);
          currentLocation.value = to;
      }
      return {
          location: currentLocation,
          state: historyState,
          push,
          replace,
      };
  }
  /**
   * Creates an HTML5 history. Most common history for single page applications.
   *
   * @param base -
   */
  function createWebHistory(base) {
      base = normalizeBase(base);
      const historyNavigation = useHistoryStateNavigation(base);
      const historyListeners = useHistoryListeners(base, historyNavigation.state, historyNavigation.location, historyNavigation.replace);
      function go(delta, triggerListeners = true) {
          if (!triggerListeners)
              historyListeners.pauseListeners();
          history.go(delta);
      }
      const routerHistory = assign({
          // it's overridden right after
          location: '',
          base,
          go,
          createHref: createHref.bind(null, base),
      }, historyNavigation, historyListeners);
      Object.defineProperty(routerHistory, 'location', {
          enumerable: true,
          get: () => historyNavigation.location.value,
      });
      Object.defineProperty(routerHistory, 'state', {
          enumerable: true,
          get: () => historyNavigation.state.value,
      });
      return routerHistory;
  }

  function isRouteLocation(route) {
      return typeof route === 'string' || (route && typeof route === 'object');
  }
  function isRouteName(name) {
      return typeof name === 'string' || typeof name === 'symbol';
  }

  /**
   * Initial route location where the router is. Can be used in navigation guards
   * to differentiate the initial navigation.
   *
   * @example
   * ```js
   * import { START_LOCATION } from 'vue-router'
   *
   * router.beforeEach((to, from) => {
   *   if (from === START_LOCATION) {
   *     // initial navigation
   *   }
   * })
   * ```
   */
  const START_LOCATION_NORMALIZED = {
      path: '/',
      name: undefined,
      params: {},
      query: {},
      hash: '',
      fullPath: '/',
      matched: [],
      meta: {},
      redirectedFrom: undefined,
  };

  const NavigationFailureSymbol = Symbol('navigation failure' );
  /**
   * Enumeration with all possible types for navigation failures. Can be passed to
   * {@link isNavigationFailure} to check for specific failures.
   */
  var NavigationFailureType;
  (function (NavigationFailureType) {
      /**
       * An aborted navigation is a navigation that failed because a navigation
       * guard returned `false` or called `next(false)`
       */
      NavigationFailureType[NavigationFailureType["aborted"] = 4] = "aborted";
      /**
       * A cancelled navigation is a navigation that failed because a more recent
       * navigation finished started (not necessarily finished).
       */
      NavigationFailureType[NavigationFailureType["cancelled"] = 8] = "cancelled";
      /**
       * A duplicated navigation is a navigation that failed because it was
       * initiated while already being at the exact same location.
       */
      NavigationFailureType[NavigationFailureType["duplicated"] = 16] = "duplicated";
  })(NavigationFailureType || (NavigationFailureType = {}));
  // DEV only debug messages
  const ErrorTypeMessages = {
      [1 /* ErrorTypes.MATCHER_NOT_FOUND */]({ location, currentLocation }) {
          return `No match for\n ${JSON.stringify(location)}${currentLocation
            ? '\nwhile being at\n' + JSON.stringify(currentLocation)
            : ''}`;
      },
      [2 /* ErrorTypes.NAVIGATION_GUARD_REDIRECT */]({ from, to, }) {
          return `Redirected from "${from.fullPath}" to "${stringifyRoute(to)}" via a navigation guard.`;
      },
      [4 /* ErrorTypes.NAVIGATION_ABORTED */]({ from, to }) {
          return `Navigation aborted from "${from.fullPath}" to "${to.fullPath}" via a navigation guard.`;
      },
      [8 /* ErrorTypes.NAVIGATION_CANCELLED */]({ from, to }) {
          return `Navigation cancelled from "${from.fullPath}" to "${to.fullPath}" with a new navigation.`;
      },
      [16 /* ErrorTypes.NAVIGATION_DUPLICATED */]({ from, to }) {
          return `Avoided redundant navigation to current location: "${from.fullPath}".`;
      },
  };
  function createRouterError(type, params) {
      // keep full error messages in cjs versions
      {
          return assign(new Error(ErrorTypeMessages[type](params)), {
              type,
              [NavigationFailureSymbol]: true,
          }, params);
      }
  }
  function isNavigationFailure(error, type) {
      return (error instanceof Error &&
          NavigationFailureSymbol in error &&
          (type == null || !!(error.type & type)));
  }
  const propertiesToLog = ['params', 'query', 'hash'];
  function stringifyRoute(to) {
      if (typeof to === 'string')
          return to;
      if ('path' in to)
          return to.path;
      const location = {};
      for (const key of propertiesToLog) {
          if (key in to)
              location[key] = to[key];
      }
      return JSON.stringify(location, null, 2);
  }

  // default pattern for a param: non-greedy everything but /
  const BASE_PARAM_PATTERN = '[^/]+?';
  const BASE_PATH_PARSER_OPTIONS = {
      sensitive: false,
      strict: false,
      start: true,
      end: true,
  };
  // Special Regex characters that must be escaped in static tokens
  const REGEX_CHARS_RE = /[.+*?^${}()[\]/\\]/g;
  /**
   * Creates a path parser from an array of Segments (a segment is an array of Tokens)
   *
   * @param segments - array of segments returned by tokenizePath
   * @param extraOptions - optional options for the regexp
   * @returns a PathParser
   */
  function tokensToParser(segments, extraOptions) {
      const options = assign({}, BASE_PATH_PARSER_OPTIONS, extraOptions);
      // the amount of scores is the same as the length of segments except for the root segment "/"
      const score = [];
      // the regexp as a string
      let pattern = options.start ? '^' : '';
      // extracted keys
      const keys = [];
      for (const segment of segments) {
          // the root segment needs special treatment
          const segmentScores = segment.length ? [] : [90 /* PathScore.Root */];
          // allow trailing slash
          if (options.strict && !segment.length)
              pattern += '/';
          for (let tokenIndex = 0; tokenIndex < segment.length; tokenIndex++) {
              const token = segment[tokenIndex];
              // resets the score if we are inside a sub-segment /:a-other-:b
              let subSegmentScore = 40 /* PathScore.Segment */ +
                  (options.sensitive ? 0.25 /* PathScore.BonusCaseSensitive */ : 0);
              if (token.type === 0 /* TokenType.Static */) {
                  // prepend the slash if we are starting a new segment
                  if (!tokenIndex)
                      pattern += '/';
                  pattern += token.value.replace(REGEX_CHARS_RE, '\\$&');
                  subSegmentScore += 40 /* PathScore.Static */;
              }
              else if (token.type === 1 /* TokenType.Param */) {
                  const { value, repeatable, optional, regexp } = token;
                  keys.push({
                      name: value,
                      repeatable,
                      optional,
                  });
                  const re = regexp ? regexp : BASE_PARAM_PATTERN;
                  // the user provided a custom regexp /:id(\\d+)
                  if (re !== BASE_PARAM_PATTERN) {
                      subSegmentScore += 10 /* PathScore.BonusCustomRegExp */;
                      // make sure the regexp is valid before using it
                      try {
                          new RegExp(`(${re})`);
                      }
                      catch (err) {
                          throw new Error(`Invalid custom RegExp for param "${value}" (${re}): ` +
                              err.message);
                      }
                  }
                  // when we repeat we must take care of the repeating leading slash
                  let subPattern = repeatable ? `((?:${re})(?:/(?:${re}))*)` : `(${re})`;
                  // prepend the slash if we are starting a new segment
                  if (!tokenIndex)
                      subPattern =
                          // avoid an optional / if there are more segments e.g. /:p?-static
                          // or /:p?-:p2
                          optional && segment.length < 2
                              ? `(?:/${subPattern})`
                              : '/' + subPattern;
                  if (optional)
                      subPattern += '?';
                  pattern += subPattern;
                  subSegmentScore += 20 /* PathScore.Dynamic */;
                  if (optional)
                      subSegmentScore += -8 /* PathScore.BonusOptional */;
                  if (repeatable)
                      subSegmentScore += -20 /* PathScore.BonusRepeatable */;
                  if (re === '.*')
                      subSegmentScore += -50 /* PathScore.BonusWildcard */;
              }
              segmentScores.push(subSegmentScore);
          }
          // an empty array like /home/ -> [[{home}], []]
          // if (!segment.length) pattern += '/'
          score.push(segmentScores);
      }
      // only apply the strict bonus to the last score
      if (options.strict && options.end) {
          const i = score.length - 1;
          score[i][score[i].length - 1] += 0.7000000000000001 /* PathScore.BonusStrict */;
      }
      // TODO: dev only warn double trailing slash
      if (!options.strict)
          pattern += '/?';
      if (options.end)
          pattern += '$';
      // allow paths like /dynamic to only match dynamic or dynamic/... but not dynamic_something_else
      else if (options.strict)
          pattern += '(?:/|$)';
      const re = new RegExp(pattern, options.sensitive ? '' : 'i');
      function parse(path) {
          const match = path.match(re);
          const params = {};
          if (!match)
              return null;
          for (let i = 1; i < match.length; i++) {
              const value = match[i] || '';
              const key = keys[i - 1];
              params[key.name] = value && key.repeatable ? value.split('/') : value;
          }
          return params;
      }
      function stringify(params) {
          let path = '';
          // for optional parameters to allow to be empty
          let avoidDuplicatedSlash = false;
          for (const segment of segments) {
              if (!avoidDuplicatedSlash || !path.endsWith('/'))
                  path += '/';
              avoidDuplicatedSlash = false;
              for (const token of segment) {
                  if (token.type === 0 /* TokenType.Static */) {
                      path += token.value;
                  }
                  else if (token.type === 1 /* TokenType.Param */) {
                      const { value, repeatable, optional } = token;
                      const param = value in params ? params[value] : '';
                      if (isArray(param) && !repeatable) {
                          throw new Error(`Provided param "${value}" is an array but it is not repeatable (* or + modifiers)`);
                      }
                      const text = isArray(param)
                          ? param.join('/')
                          : param;
                      if (!text) {
                          if (optional) {
                              // if we have more than one optional param like /:a?-static we don't need to care about the optional param
                              if (segment.length < 2) {
                                  // remove the last slash as we could be at the end
                                  if (path.endsWith('/'))
                                      path = path.slice(0, -1);
                                  // do not append a slash on the next iteration
                                  else
                                      avoidDuplicatedSlash = true;
                              }
                          }
                          else
                              throw new Error(`Missing required param "${value}"`);
                      }
                      path += text;
                  }
              }
          }
          // avoid empty path when we have multiple optional params
          return path || '/';
      }
      return {
          re,
          score,
          keys,
          parse,
          stringify,
      };
  }
  /**
   * Compares an array of numbers as used in PathParser.score and returns a
   * number. This function can be used to `sort` an array
   *
   * @param a - first array of numbers
   * @param b - second array of numbers
   * @returns 0 if both are equal, < 0 if a should be sorted first, > 0 if b
   * should be sorted first
   */
  function compareScoreArray(a, b) {
      let i = 0;
      while (i < a.length && i < b.length) {
          const diff = b[i] - a[i];
          // only keep going if diff === 0
          if (diff)
              return diff;
          i++;
      }
      // if the last subsegment was Static, the shorter segments should be sorted first
      // otherwise sort the longest segment first
      if (a.length < b.length) {
          return a.length === 1 && a[0] === 40 /* PathScore.Static */ + 40 /* PathScore.Segment */
              ? -1
              : 1;
      }
      else if (a.length > b.length) {
          return b.length === 1 && b[0] === 40 /* PathScore.Static */ + 40 /* PathScore.Segment */
              ? 1
              : -1;
      }
      return 0;
  }
  /**
   * Compare function that can be used with `sort` to sort an array of PathParser
   *
   * @param a - first PathParser
   * @param b - second PathParser
   * @returns 0 if both are equal, < 0 if a should be sorted first, > 0 if b
   */
  function comparePathParserScore(a, b) {
      let i = 0;
      const aScore = a.score;
      const bScore = b.score;
      while (i < aScore.length && i < bScore.length) {
          const comp = compareScoreArray(aScore[i], bScore[i]);
          // do not return if both are equal
          if (comp)
              return comp;
          i++;
      }
      if (Math.abs(bScore.length - aScore.length) === 1) {
          if (isLastScoreNegative(aScore))
              return 1;
          if (isLastScoreNegative(bScore))
              return -1;
      }
      // if a and b share the same score entries but b has more, sort b first
      return bScore.length - aScore.length;
      // this is the ternary version
      // return aScore.length < bScore.length
      //   ? 1
      //   : aScore.length > bScore.length
      //   ? -1
      //   : 0
  }
  /**
   * This allows detecting splats at the end of a path: /home/:id(.*)*
   *
   * @param score - score to check
   * @returns true if the last entry is negative
   */
  function isLastScoreNegative(score) {
      const last = score[score.length - 1];
      return score.length > 0 && last[last.length - 1] < 0;
  }

  const ROOT_TOKEN = {
      type: 0 /* TokenType.Static */,
      value: '',
  };
  const VALID_PARAM_RE = /[a-zA-Z0-9_]/;
  // After some profiling, the cache seems to be unnecessary because tokenizePath
  // (the slowest part of adding a route) is very fast
  // const tokenCache = new Map<string, Token[][]>()
  function tokenizePath(path) {
      if (!path)
          return [[]];
      if (path === '/')
          return [[ROOT_TOKEN]];
      if (!path.startsWith('/')) {
          throw new Error(`Route paths should start with a "/": "${path}" should be "/${path}".`
              );
      }
      // if (tokenCache.has(path)) return tokenCache.get(path)!
      function crash(message) {
          throw new Error(`ERR (${state})/"${buffer}": ${message}`);
      }
      let state = 0 /* TokenizerState.Static */;
      let previousState = state;
      const tokens = [];
      // the segment will always be valid because we get into the initial state
      // with the leading /
      let segment;
      function finalizeSegment() {
          if (segment)
              tokens.push(segment);
          segment = [];
      }
      // index on the path
      let i = 0;
      // char at index
      let char;
      // buffer of the value read
      let buffer = '';
      // custom regexp for a param
      let customRe = '';
      function consumeBuffer() {
          if (!buffer)
              return;
          if (state === 0 /* TokenizerState.Static */) {
              segment.push({
                  type: 0 /* TokenType.Static */,
                  value: buffer,
              });
          }
          else if (state === 1 /* TokenizerState.Param */ ||
              state === 2 /* TokenizerState.ParamRegExp */ ||
              state === 3 /* TokenizerState.ParamRegExpEnd */) {
              if (segment.length > 1 && (char === '*' || char === '+'))
                  crash(`A repeatable param (${buffer}) must be alone in its segment. eg: '/:ids+.`);
              segment.push({
                  type: 1 /* TokenType.Param */,
                  value: buffer,
                  regexp: customRe,
                  repeatable: char === '*' || char === '+',
                  optional: char === '*' || char === '?',
              });
          }
          else {
              crash('Invalid state to consume buffer');
          }
          buffer = '';
      }
      function addCharToBuffer() {
          buffer += char;
      }
      while (i < path.length) {
          char = path[i++];
          if (char === '\\' && state !== 2 /* TokenizerState.ParamRegExp */) {
              previousState = state;
              state = 4 /* TokenizerState.EscapeNext */;
              continue;
          }
          switch (state) {
              case 0 /* TokenizerState.Static */:
                  if (char === '/') {
                      if (buffer) {
                          consumeBuffer();
                      }
                      finalizeSegment();
                  }
                  else if (char === ':') {
                      consumeBuffer();
                      state = 1 /* TokenizerState.Param */;
                  }
                  else {
                      addCharToBuffer();
                  }
                  break;
              case 4 /* TokenizerState.EscapeNext */:
                  addCharToBuffer();
                  state = previousState;
                  break;
              case 1 /* TokenizerState.Param */:
                  if (char === '(') {
                      state = 2 /* TokenizerState.ParamRegExp */;
                  }
                  else if (VALID_PARAM_RE.test(char)) {
                      addCharToBuffer();
                  }
                  else {
                      consumeBuffer();
                      state = 0 /* TokenizerState.Static */;
                      // go back one character if we were not modifying
                      if (char !== '*' && char !== '?' && char !== '+')
                          i--;
                  }
                  break;
              case 2 /* TokenizerState.ParamRegExp */:
                  // TODO: is it worth handling nested regexp? like :p(?:prefix_([^/]+)_suffix)
                  // it already works by escaping the closing )
                  // https://paths.esm.dev/?p=AAMeJbiAwQEcDKbAoAAkP60PG2R6QAvgNaA6AFACM2ABuQBB#
                  // is this really something people need since you can also write
                  // /prefix_:p()_suffix
                  if (char === ')') {
                      // handle the escaped )
                      if (customRe[customRe.length - 1] == '\\')
                          customRe = customRe.slice(0, -1) + char;
                      else
                          state = 3 /* TokenizerState.ParamRegExpEnd */;
                  }
                  else {
                      customRe += char;
                  }
                  break;
              case 3 /* TokenizerState.ParamRegExpEnd */:
                  // same as finalizing a param
                  consumeBuffer();
                  state = 0 /* TokenizerState.Static */;
                  // go back one character if we were not modifying
                  if (char !== '*' && char !== '?' && char !== '+')
                      i--;
                  customRe = '';
                  break;
              default:
                  crash('Unknown state');
                  break;
          }
      }
      if (state === 2 /* TokenizerState.ParamRegExp */)
          crash(`Unfinished custom RegExp for param "${buffer}"`);
      consumeBuffer();
      finalizeSegment();
      // tokenCache.set(path, tokens)
      return tokens;
  }

  function createRouteRecordMatcher(record, parent, options) {
      const parser = tokensToParser(tokenizePath(record.path), options);
      // warn against params with the same name
      {
          const existingKeys = new Set();
          for (const key of parser.keys) {
              if (existingKeys.has(key.name))
                  warn(`Found duplicated params with name "${key.name}" for path "${record.path}". Only the last one will be available on "$route.params".`);
              existingKeys.add(key.name);
          }
      }
      const matcher = assign(parser, {
          record,
          parent,
          // these needs to be populated by the parent
          children: [],
          alias: [],
      });
      if (parent) {
          // both are aliases or both are not aliases
          // we don't want to mix them because the order is used when
          // passing originalRecord in Matcher.addRoute
          if (!matcher.record.aliasOf === !parent.record.aliasOf)
              parent.children.push(matcher);
      }
      return matcher;
  }

  /**
   * Creates a Router Matcher.
   *
   * @internal
   * @param routes - array of initial routes
   * @param globalOptions - global route options
   */
  function createRouterMatcher(routes, globalOptions) {
      // normalized ordered array of matchers
      const matchers = [];
      const matcherMap = new Map();
      globalOptions = mergeOptions({ strict: false, end: true, sensitive: false }, globalOptions);
      function getRecordMatcher(name) {
          return matcherMap.get(name);
      }
      function addRoute(record, parent, originalRecord) {
          // used later on to remove by name
          const isRootAdd = !originalRecord;
          const mainNormalizedRecord = normalizeRouteRecord(record);
          {
              checkChildMissingNameWithEmptyPath(mainNormalizedRecord, parent);
          }
          // we might be the child of an alias
          mainNormalizedRecord.aliasOf = originalRecord && originalRecord.record;
          const options = mergeOptions(globalOptions, record);
          // generate an array of records to correctly handle aliases
          const normalizedRecords = [
              mainNormalizedRecord,
          ];
          if ('alias' in record) {
              const aliases = typeof record.alias === 'string' ? [record.alias] : record.alias;
              for (const alias of aliases) {
                  normalizedRecords.push(assign({}, mainNormalizedRecord, {
                      // this allows us to hold a copy of the `components` option
                      // so that async components cache is hold on the original record
                      components: originalRecord
                          ? originalRecord.record.components
                          : mainNormalizedRecord.components,
                      path: alias,
                      // we might be the child of an alias
                      aliasOf: originalRecord
                          ? originalRecord.record
                          : mainNormalizedRecord,
                      // the aliases are always of the same kind as the original since they
                      // are defined on the same record
                  }));
              }
          }
          let matcher;
          let originalMatcher;
          for (const normalizedRecord of normalizedRecords) {
              const { path } = normalizedRecord;
              // Build up the path for nested routes if the child isn't an absolute
              // route. Only add the / delimiter if the child path isn't empty and if the
              // parent path doesn't have a trailing slash
              if (parent && path[0] !== '/') {
                  const parentPath = parent.record.path;
                  const connectingSlash = parentPath[parentPath.length - 1] === '/' ? '' : '/';
                  normalizedRecord.path =
                      parent.record.path + (path && connectingSlash + path);
              }
              if (normalizedRecord.path === '*') {
                  throw new Error('Catch all routes ("*") must now be defined using a param with a custom regexp.\n' +
                      'See more at https://next.router.vuejs.org/guide/migration/#removed-star-or-catch-all-routes.');
              }
              // create the object beforehand, so it can be passed to children
              matcher = createRouteRecordMatcher(normalizedRecord, parent, options);
              if (parent && path[0] === '/')
                  checkMissingParamsInAbsolutePath(matcher, parent);
              // if we are an alias we must tell the original record that we exist,
              // so we can be removed
              if (originalRecord) {
                  originalRecord.alias.push(matcher);
                  {
                      checkSameParams(originalRecord, matcher);
                  }
              }
              else {
                  // otherwise, the first record is the original and others are aliases
                  originalMatcher = originalMatcher || matcher;
                  if (originalMatcher !== matcher)
                      originalMatcher.alias.push(matcher);
                  // remove the route if named and only for the top record (avoid in nested calls)
                  // this works because the original record is the first one
                  if (isRootAdd && record.name && !isAliasRecord(matcher))
                      removeRoute(record.name);
              }
              if (mainNormalizedRecord.children) {
                  const children = mainNormalizedRecord.children;
                  for (let i = 0; i < children.length; i++) {
                      addRoute(children[i], matcher, originalRecord && originalRecord.children[i]);
                  }
              }
              // if there was no original record, then the first one was not an alias and all
              // other aliases (if any) need to reference this record when adding children
              originalRecord = originalRecord || matcher;
              // TODO: add normalized records for more flexibility
              // if (parent && isAliasRecord(originalRecord)) {
              //   parent.children.push(originalRecord)
              // }
              // Avoid adding a record that doesn't display anything. This allows passing through records without a component to
              // not be reached and pass through the catch all route
              if ((matcher.record.components &&
                  Object.keys(matcher.record.components).length) ||
                  matcher.record.name ||
                  matcher.record.redirect) {
                  insertMatcher(matcher);
              }
          }
          return originalMatcher
              ? () => {
                  // since other matchers are aliases, they should be removed by the original matcher
                  removeRoute(originalMatcher);
              }
              : noop;
      }
      function removeRoute(matcherRef) {
          if (isRouteName(matcherRef)) {
              const matcher = matcherMap.get(matcherRef);
              if (matcher) {
                  matcherMap.delete(matcherRef);
                  matchers.splice(matchers.indexOf(matcher), 1);
                  matcher.children.forEach(removeRoute);
                  matcher.alias.forEach(removeRoute);
              }
          }
          else {
              const index = matchers.indexOf(matcherRef);
              if (index > -1) {
                  matchers.splice(index, 1);
                  if (matcherRef.record.name)
                      matcherMap.delete(matcherRef.record.name);
                  matcherRef.children.forEach(removeRoute);
                  matcherRef.alias.forEach(removeRoute);
              }
          }
      }
      function getRoutes() {
          return matchers;
      }
      function insertMatcher(matcher) {
          let i = 0;
          while (i < matchers.length &&
              comparePathParserScore(matcher, matchers[i]) >= 0 &&
              // Adding children with empty path should still appear before the parent
              // https://github.com/vuejs/router/issues/1124
              (matcher.record.path !== matchers[i].record.path ||
                  !isRecordChildOf(matcher, matchers[i])))
              i++;
          matchers.splice(i, 0, matcher);
          // only add the original record to the name map
          if (matcher.record.name && !isAliasRecord(matcher))
              matcherMap.set(matcher.record.name, matcher);
      }
      function resolve(location, currentLocation) {
          let matcher;
          let params = {};
          let path;
          let name;
          if ('name' in location && location.name) {
              matcher = matcherMap.get(location.name);
              if (!matcher)
                  throw createRouterError(1 /* ErrorTypes.MATCHER_NOT_FOUND */, {
                      location,
                  });
              // warn if the user is passing invalid params so they can debug it better when they get removed
              {
                  const invalidParams = Object.keys(location.params || {}).filter(paramName => !matcher.keys.find(k => k.name === paramName));
                  if (invalidParams.length) {
                      warn(`Discarded invalid param(s) "${invalidParams.join('", "')}" when navigating. See https://github.com/vuejs/router/blob/main/packages/router/CHANGELOG.md#414-2022-08-22 for more details.`);
                  }
              }
              name = matcher.record.name;
              params = assign(
              // paramsFromLocation is a new object
              paramsFromLocation(currentLocation.params, 
              // only keep params that exist in the resolved location
              // TODO: only keep optional params coming from a parent record
              matcher.keys.filter(k => !k.optional).map(k => k.name)), 
              // discard any existing params in the current location that do not exist here
              // #1497 this ensures better active/exact matching
              location.params &&
                  paramsFromLocation(location.params, matcher.keys.map(k => k.name)));
              // throws if cannot be stringified
              path = matcher.stringify(params);
          }
          else if ('path' in location) {
              // no need to resolve the path with the matcher as it was provided
              // this also allows the user to control the encoding
              path = location.path;
              if (!path.startsWith('/')) {
                  warn(`The Matcher cannot resolve relative paths but received "${path}". Unless you directly called \`matcher.resolve("${path}")\`, this is probably a bug in vue-router. Please open an issue at https://new-issue.vuejs.org/?repo=vuejs/router.`);
              }
              matcher = matchers.find(m => m.re.test(path));
              // matcher should have a value after the loop
              if (matcher) {
                  // we know the matcher works because we tested the regexp
                  params = matcher.parse(path);
                  name = matcher.record.name;
              }
              // location is a relative path
          }
          else {
              // match by name or path of current route
              matcher = currentLocation.name
                  ? matcherMap.get(currentLocation.name)
                  : matchers.find(m => m.re.test(currentLocation.path));
              if (!matcher)
                  throw createRouterError(1 /* ErrorTypes.MATCHER_NOT_FOUND */, {
                      location,
                      currentLocation,
                  });
              name = matcher.record.name;
              // since we are navigating to the same location, we don't need to pick the
              // params like when `name` is provided
              params = assign({}, currentLocation.params, location.params);
              path = matcher.stringify(params);
          }
          const matched = [];
          let parentMatcher = matcher;
          while (parentMatcher) {
              // reversed order so parents are at the beginning
              matched.unshift(parentMatcher.record);
              parentMatcher = parentMatcher.parent;
          }
          return {
              name,
              path,
              params,
              matched,
              meta: mergeMetaFields(matched),
          };
      }
      // add initial routes
      routes.forEach(route => addRoute(route));
      return { addRoute, resolve, removeRoute, getRoutes, getRecordMatcher };
  }
  function paramsFromLocation(params, keys) {
      const newParams = {};
      for (const key of keys) {
          if (key in params)
              newParams[key] = params[key];
      }
      return newParams;
  }
  /**
   * Normalizes a RouteRecordRaw. Creates a copy
   *
   * @param record
   * @returns the normalized version
   */
  function normalizeRouteRecord(record) {
      return {
          path: record.path,
          redirect: record.redirect,
          name: record.name,
          meta: record.meta || {},
          aliasOf: undefined,
          beforeEnter: record.beforeEnter,
          props: normalizeRecordProps(record),
          children: record.children || [],
          instances: {},
          leaveGuards: new Set(),
          updateGuards: new Set(),
          enterCallbacks: {},
          components: 'components' in record
              ? record.components || null
              : record.component && { default: record.component },
      };
  }
  /**
   * Normalize the optional `props` in a record to always be an object similar to
   * components. Also accept a boolean for components.
   * @param record
   */
  function normalizeRecordProps(record) {
      const propsObject = {};
      // props does not exist on redirect records, but we can set false directly
      const props = record.props || false;
      if ('component' in record) {
          propsObject.default = props;
      }
      else {
          // NOTE: we could also allow a function to be applied to every component.
          // Would need user feedback for use cases
          for (const name in record.components)
              propsObject[name] = typeof props === 'boolean' ? props : props[name];
      }
      return propsObject;
  }
  /**
   * Checks if a record or any of its parent is an alias
   * @param record
   */
  function isAliasRecord(record) {
      while (record) {
          if (record.record.aliasOf)
              return true;
          record = record.parent;
      }
      return false;
  }
  /**
   * Merge meta fields of an array of records
   *
   * @param matched - array of matched records
   */
  function mergeMetaFields(matched) {
      return matched.reduce((meta, record) => assign(meta, record.meta), {});
  }
  function mergeOptions(defaults, partialOptions) {
      const options = {};
      for (const key in defaults) {
          options[key] = key in partialOptions ? partialOptions[key] : defaults[key];
      }
      return options;
  }
  function isSameParam(a, b) {
      return (a.name === b.name &&
          a.optional === b.optional &&
          a.repeatable === b.repeatable);
  }
  /**
   * Check if a path and its alias have the same required params
   *
   * @param a - original record
   * @param b - alias record
   */
  function checkSameParams(a, b) {
      for (const key of a.keys) {
          if (!key.optional && !b.keys.find(isSameParam.bind(null, key)))
              return warn(`Alias "${b.record.path}" and the original record: "${a.record.path}" must have the exact same param named "${key.name}"`);
      }
      for (const key of b.keys) {
          if (!key.optional && !a.keys.find(isSameParam.bind(null, key)))
              return warn(`Alias "${b.record.path}" and the original record: "${a.record.path}" must have the exact same param named "${key.name}"`);
      }
  }
  /**
   * A route with a name and a child with an empty path without a name should warn when adding the route
   *
   * @param mainNormalizedRecord - RouteRecordNormalized
   * @param parent - RouteRecordMatcher
   */
  function checkChildMissingNameWithEmptyPath(mainNormalizedRecord, parent) {
      if (parent &&
          parent.record.name &&
          !mainNormalizedRecord.name &&
          !mainNormalizedRecord.path) {
          warn(`The route named "${String(parent.record.name)}" has a child without a name and an empty path. Using that name won't render the empty path child so you probably want to move the name to the child instead. If this is intentional, add a name to the child route to remove the warning.`);
      }
  }
  function checkMissingParamsInAbsolutePath(record, parent) {
      for (const key of parent.keys) {
          if (!record.keys.find(isSameParam.bind(null, key)))
              return warn(`Absolute path "${record.record.path}" must have the exact same param named "${key.name}" as its parent "${parent.record.path}".`);
      }
  }
  function isRecordChildOf(record, parent) {
      return parent.children.some(child => child === record || isRecordChildOf(record, child));
  }

  /**
   * Encoding Rules ␣ = Space Path: ␣ " < > # ? { } Query: ␣ " < > # & = Hash: ␣ "
   * < > `
   *
   * On top of that, the RFC3986 (https://tools.ietf.org/html/rfc3986#section-2.2)
   * defines some extra characters to be encoded. Most browsers do not encode them
   * in encodeURI https://github.com/whatwg/url/issues/369, so it may be safer to
   * also encode `!'()*`. Leaving un-encoded only ASCII alphanumeric(`a-zA-Z0-9`)
   * plus `-._~`. This extra safety should be applied to query by patching the
   * string returned by encodeURIComponent encodeURI also encodes `[\]^`. `\`
   * should be encoded to avoid ambiguity. Browsers (IE, FF, C) transform a `\`
   * into a `/` if directly typed in. The _backtick_ (`````) should also be
   * encoded everywhere because some browsers like FF encode it when directly
   * written while others don't. Safari and IE don't encode ``"<>{}``` in hash.
   */
  // const EXTRA_RESERVED_RE = /[!'()*]/g
  // const encodeReservedReplacer = (c: string) => '%' + c.charCodeAt(0).toString(16)
  const HASH_RE = /#/g; // %23
  const AMPERSAND_RE = /&/g; // %26
  const SLASH_RE = /\//g; // %2F
  const EQUAL_RE = /=/g; // %3D
  const IM_RE = /\?/g; // %3F
  const PLUS_RE = /\+/g; // %2B
  /**
   * NOTE: It's not clear to me if we should encode the + symbol in queries, it
   * seems to be less flexible than not doing so and I can't find out the legacy
   * systems requiring this for regular requests like text/html. In the standard,
   * the encoding of the plus character is only mentioned for
   * application/x-www-form-urlencoded
   * (https://url.spec.whatwg.org/#urlencoded-parsing) and most browsers seems lo
   * leave the plus character as is in queries. To be more flexible, we allow the
   * plus character on the query, but it can also be manually encoded by the user.
   *
   * Resources:
   * - https://url.spec.whatwg.org/#urlencoded-parsing
   * - https://stackoverflow.com/questions/1634271/url-encoding-the-space-character-or-20
   */
  const ENC_BRACKET_OPEN_RE = /%5B/g; // [
  const ENC_BRACKET_CLOSE_RE = /%5D/g; // ]
  const ENC_CARET_RE = /%5E/g; // ^
  const ENC_BACKTICK_RE = /%60/g; // `
  const ENC_CURLY_OPEN_RE = /%7B/g; // {
  const ENC_PIPE_RE = /%7C/g; // |
  const ENC_CURLY_CLOSE_RE = /%7D/g; // }
  const ENC_SPACE_RE = /%20/g; // }
  /**
   * Encode characters that need to be encoded on the path, search and hash
   * sections of the URL.
   *
   * @internal
   * @param text - string to encode
   * @returns encoded string
   */
  function commonEncode(text) {
      return encodeURI('' + text)
          .replace(ENC_PIPE_RE, '|')
          .replace(ENC_BRACKET_OPEN_RE, '[')
          .replace(ENC_BRACKET_CLOSE_RE, ']');
  }
  /**
   * Encode characters that need to be encoded on the hash section of the URL.
   *
   * @param text - string to encode
   * @returns encoded string
   */
  function encodeHash(text) {
      return commonEncode(text)
          .replace(ENC_CURLY_OPEN_RE, '{')
          .replace(ENC_CURLY_CLOSE_RE, '}')
          .replace(ENC_CARET_RE, '^');
  }
  /**
   * Encode characters that need to be encoded query values on the query
   * section of the URL.
   *
   * @param text - string to encode
   * @returns encoded string
   */
  function encodeQueryValue(text) {
      return (commonEncode(text)
          // Encode the space as +, encode the + to differentiate it from the space
          .replace(PLUS_RE, '%2B')
          .replace(ENC_SPACE_RE, '+')
          .replace(HASH_RE, '%23')
          .replace(AMPERSAND_RE, '%26')
          .replace(ENC_BACKTICK_RE, '`')
          .replace(ENC_CURLY_OPEN_RE, '{')
          .replace(ENC_CURLY_CLOSE_RE, '}')
          .replace(ENC_CARET_RE, '^'));
  }
  /**
   * Like `encodeQueryValue` but also encodes the `=` character.
   *
   * @param text - string to encode
   */
  function encodeQueryKey(text) {
      return encodeQueryValue(text).replace(EQUAL_RE, '%3D');
  }
  /**
   * Encode characters that need to be encoded on the path section of the URL.
   *
   * @param text - string to encode
   * @returns encoded string
   */
  function encodePath(text) {
      return commonEncode(text).replace(HASH_RE, '%23').replace(IM_RE, '%3F');
  }
  /**
   * Encode characters that need to be encoded on the path section of the URL as a
   * param. This function encodes everything {@link encodePath} does plus the
   * slash (`/`) character. If `text` is `null` or `undefined`, returns an empty
   * string instead.
   *
   * @param text - string to encode
   * @returns encoded string
   */
  function encodeParam(text) {
      return text == null ? '' : encodePath(text).replace(SLASH_RE, '%2F');
  }
  /**
   * Decode text using `decodeURIComponent`. Returns the original text if it
   * fails.
   *
   * @param text - string to decode
   * @returns decoded string
   */
  function decode(text) {
      try {
          return decodeURIComponent('' + text);
      }
      catch (err) {
          warn(`Error decoding "${text}". Using original value`);
      }
      return '' + text;
  }

  /**
   * Transforms a queryString into a {@link LocationQuery} object. Accept both, a
   * version with the leading `?` and without Should work as URLSearchParams

   * @internal
   *
   * @param search - search string to parse
   * @returns a query object
   */
  function parseQuery(search) {
      const query = {};
      // avoid creating an object with an empty key and empty value
      // because of split('&')
      if (search === '' || search === '?')
          return query;
      const hasLeadingIM = search[0] === '?';
      const searchParams = (hasLeadingIM ? search.slice(1) : search).split('&');
      for (let i = 0; i < searchParams.length; ++i) {
          // pre decode the + into space
          const searchParam = searchParams[i].replace(PLUS_RE, ' ');
          // allow the = character
          const eqPos = searchParam.indexOf('=');
          const key = decode(eqPos < 0 ? searchParam : searchParam.slice(0, eqPos));
          const value = eqPos < 0 ? null : decode(searchParam.slice(eqPos + 1));
          if (key in query) {
              // an extra variable for ts types
              let currentValue = query[key];
              if (!isArray(currentValue)) {
                  currentValue = query[key] = [currentValue];
              }
              currentValue.push(value);
          }
          else {
              query[key] = value;
          }
      }
      return query;
  }
  /**
   * Stringifies a {@link LocationQueryRaw} object. Like `URLSearchParams`, it
   * doesn't prepend a `?`
   *
   * @internal
   *
   * @param query - query object to stringify
   * @returns string version of the query without the leading `?`
   */
  function stringifyQuery(query) {
      let search = '';
      for (let key in query) {
          const value = query[key];
          key = encodeQueryKey(key);
          if (value == null) {
              // only null adds the value
              if (value !== undefined) {
                  search += (search.length ? '&' : '') + key;
              }
              continue;
          }
          // keep null values
          const values = isArray(value)
              ? value.map(v => v && encodeQueryValue(v))
              : [value && encodeQueryValue(value)];
          values.forEach(value => {
              // skip undefined values in arrays as if they were not present
              // smaller code than using filter
              if (value !== undefined) {
                  // only append & with non-empty search
                  search += (search.length ? '&' : '') + key;
                  if (value != null)
                      search += '=' + value;
              }
          });
      }
      return search;
  }
  /**
   * Transforms a {@link LocationQueryRaw} into a {@link LocationQuery} by casting
   * numbers into strings, removing keys with an undefined value and replacing
   * undefined with null in arrays
   *
   * @param query - query object to normalize
   * @returns a normalized query object
   */
  function normalizeQuery(query) {
      const normalizedQuery = {};
      for (const key in query) {
          const value = query[key];
          if (value !== undefined) {
              normalizedQuery[key] = isArray(value)
                  ? value.map(v => (v == null ? null : '' + v))
                  : value == null
                      ? value
                      : '' + value;
          }
      }
      return normalizedQuery;
  }

  /**
   * RouteRecord being rendered by the closest ancestor Router View. Used for
   * `onBeforeRouteUpdate` and `onBeforeRouteLeave`. rvlm stands for Router View
   * Location Matched
   *
   * @internal
   */
  const matchedRouteKey = Symbol('router view location matched' );
  /**
   * Allows overriding the router view depth to control which component in
   * `matched` is rendered. rvd stands for Router View Depth
   *
   * @internal
   */
  const viewDepthKey = Symbol('router view depth' );
  /**
   * Allows overriding the router instance returned by `useRouter` in tests. r
   * stands for router
   *
   * @internal
   */
  const routerKey = Symbol('router' );
  /**
   * Allows overriding the current route returned by `useRoute` in tests. rl
   * stands for route location
   *
   * @internal
   */
  const routeLocationKey = Symbol('route location' );
  /**
   * Allows overriding the current route used by router-view. Internally this is
   * used when the `route` prop is passed.
   *
   * @internal
   */
  const routerViewLocationKey = Symbol('router view location' );

  /**
   * Create a list of callbacks that can be reset. Used to create before and after navigation guards list
   */
  function useCallbacks() {
      let handlers = [];
      function add(handler) {
          handlers.push(handler);
          return () => {
              const i = handlers.indexOf(handler);
              if (i > -1)
                  handlers.splice(i, 1);
          };
      }
      function reset() {
          handlers = [];
      }
      return {
          add,
          list: () => handlers,
          reset,
      };
  }
  function guardToPromiseFn(guard, to, from, record, name) {
      // keep a reference to the enterCallbackArray to prevent pushing callbacks if a new navigation took place
      const enterCallbackArray = record &&
          // name is defined if record is because of the function overload
          (record.enterCallbacks[name] = record.enterCallbacks[name] || []);
      return () => new Promise((resolve, reject) => {
          const next = (valid) => {
              if (valid === false) {
                  reject(createRouterError(4 /* ErrorTypes.NAVIGATION_ABORTED */, {
                      from,
                      to,
                  }));
              }
              else if (valid instanceof Error) {
                  reject(valid);
              }
              else if (isRouteLocation(valid)) {
                  reject(createRouterError(2 /* ErrorTypes.NAVIGATION_GUARD_REDIRECT */, {
                      from: to,
                      to: valid,
                  }));
              }
              else {
                  if (enterCallbackArray &&
                      // since enterCallbackArray is truthy, both record and name also are
                      record.enterCallbacks[name] === enterCallbackArray &&
                      typeof valid === 'function') {
                      enterCallbackArray.push(valid);
                  }
                  resolve();
              }
          };
          // wrapping with Promise.resolve allows it to work with both async and sync guards
          const guardReturn = guard.call(record && record.instances[name], to, from, canOnlyBeCalledOnce(next, to, from) );
          let guardCall = Promise.resolve(guardReturn);
          if (guard.length < 3)
              guardCall = guardCall.then(next);
          if (guard.length > 2) {
              const message = `The "next" callback was never called inside of ${guard.name ? '"' + guard.name + '"' : ''}:\n${guard.toString()}\n. If you are returning a value instead of calling "next", make sure to remove the "next" parameter from your function.`;
              if (typeof guardReturn === 'object' && 'then' in guardReturn) {
                  guardCall = guardCall.then(resolvedValue => {
                      // @ts-expect-error: _called is added at canOnlyBeCalledOnce
                      if (!next._called) {
                          warn(message);
                          return Promise.reject(new Error('Invalid navigation guard'));
                      }
                      return resolvedValue;
                  });
              }
              else if (guardReturn !== undefined) {
                  // @ts-expect-error: _called is added at canOnlyBeCalledOnce
                  if (!next._called) {
                      warn(message);
                      reject(new Error('Invalid navigation guard'));
                      return;
                  }
              }
          }
          guardCall.catch(err => reject(err));
      });
  }
  function canOnlyBeCalledOnce(next, to, from) {
      let called = 0;
      return function () {
          if (called++ === 1)
              warn(`The "next" callback was called more than once in one navigation guard when going from "${from.fullPath}" to "${to.fullPath}". It should be called exactly one time in each navigation guard. This will fail in production.`);
          // @ts-expect-error: we put it in the original one because it's easier to check
          next._called = true;
          if (called === 1)
              next.apply(null, arguments);
      };
  }
  function extractComponentsGuards(matched, guardType, to, from) {
      const guards = [];
      for (const record of matched) {
          if (!record.components && !record.children.length) {
              warn(`Record with path "${record.path}" is either missing a "component(s)"` +
                  ` or "children" property.`);
          }
          for (const name in record.components) {
              let rawComponent = record.components[name];
              {
                  if (!rawComponent ||
                      (typeof rawComponent !== 'object' &&
                          typeof rawComponent !== 'function')) {
                      warn(`Component "${name}" in record with path "${record.path}" is not` +
                          ` a valid component. Received "${String(rawComponent)}".`);
                      // throw to ensure we stop here but warn to ensure the message isn't
                      // missed by the user
                      throw new Error('Invalid route component');
                  }
                  else if ('then' in rawComponent) {
                      // warn if user wrote import('/component.vue') instead of () =>
                      // import('./component.vue')
                      warn(`Component "${name}" in record with path "${record.path}" is a ` +
                          `Promise instead of a function that returns a Promise. Did you ` +
                          `write "import('./MyPage.vue')" instead of ` +
                          `"() => import('./MyPage.vue')" ? This will break in ` +
                          `production if not fixed.`);
                      const promise = rawComponent;
                      rawComponent = () => promise;
                  }
                  else if (rawComponent.__asyncLoader &&
                      // warn only once per component
                      !rawComponent.__warnedDefineAsync) {
                      rawComponent.__warnedDefineAsync = true;
                      warn(`Component "${name}" in record with path "${record.path}" is defined ` +
                          `using "defineAsyncComponent()". ` +
                          `Write "() => import('./MyPage.vue')" instead of ` +
                          `"defineAsyncComponent(() => import('./MyPage.vue'))".`);
                  }
              }
              // skip update and leave guards if the route component is not mounted
              if (guardType !== 'beforeRouteEnter' && !record.instances[name])
                  continue;
              if (isRouteComponent(rawComponent)) {
                  // __vccOpts is added by vue-class-component and contain the regular options
                  const options = rawComponent.__vccOpts || rawComponent;
                  const guard = options[guardType];
                  guard && guards.push(guardToPromiseFn(guard, to, from, record, name));
              }
              else {
                  // start requesting the chunk already
                  let componentPromise = rawComponent();
                  if (!('catch' in componentPromise)) {
                      warn(`Component "${name}" in record with path "${record.path}" is a function that does not return a Promise. If you were passing a functional component, make sure to add a "displayName" to the component. This will break in production if not fixed.`);
                      componentPromise = Promise.resolve(componentPromise);
                  }
                  guards.push(() => componentPromise.then(resolved => {
                      if (!resolved)
                          return Promise.reject(new Error(`Couldn't resolve component "${name}" at "${record.path}"`));
                      const resolvedComponent = isESModule(resolved)
                          ? resolved.default
                          : resolved;
                      // replace the function with the resolved component
                      // cannot be null or undefined because we went into the for loop
                      record.components[name] = resolvedComponent;
                      // __vccOpts is added by vue-class-component and contain the regular options
                      const options = resolvedComponent.__vccOpts || resolvedComponent;
                      const guard = options[guardType];
                      return guard && guardToPromiseFn(guard, to, from, record, name)();
                  }));
              }
          }
      }
      return guards;
  }
  /**
   * Allows differentiating lazy components from functional components and vue-class-component
   * @internal
   *
   * @param component
   */
  function isRouteComponent(component) {
      return (typeof component === 'object' ||
          'displayName' in component ||
          'props' in component ||
          '__vccOpts' in component);
  }

  // TODO: we could allow currentRoute as a prop to expose `isActive` and
  // `isExactActive` behavior should go through an RFC
  function useLink(props) {
      const router = inject(routerKey);
      const currentRoute = inject(routeLocationKey);
      const route = computed(() => router.resolve(unref(props.to)));
      const activeRecordIndex = computed(() => {
          const { matched } = route.value;
          const { length } = matched;
          const routeMatched = matched[length - 1];
          const currentMatched = currentRoute.matched;
          if (!routeMatched || !currentMatched.length)
              return -1;
          const index = currentMatched.findIndex(isSameRouteRecord.bind(null, routeMatched));
          if (index > -1)
              return index;
          // possible parent record
          const parentRecordPath = getOriginalPath(matched[length - 2]);
          return (
          // we are dealing with nested routes
          length > 1 &&
              // if the parent and matched route have the same path, this link is
              // referring to the empty child. Or we currently are on a different
              // child of the same parent
              getOriginalPath(routeMatched) === parentRecordPath &&
              // avoid comparing the child with its parent
              currentMatched[currentMatched.length - 1].path !== parentRecordPath
              ? currentMatched.findIndex(isSameRouteRecord.bind(null, matched[length - 2]))
              : index);
      });
      const isActive = computed(() => activeRecordIndex.value > -1 &&
          includesParams(currentRoute.params, route.value.params));
      const isExactActive = computed(() => activeRecordIndex.value > -1 &&
          activeRecordIndex.value === currentRoute.matched.length - 1 &&
          isSameRouteLocationParams(currentRoute.params, route.value.params));
      function navigate(e = {}) {
          if (guardEvent(e)) {
              return router[unref(props.replace) ? 'replace' : 'push'](unref(props.to)
              // avoid uncaught errors are they are logged anyway
              ).catch(noop);
          }
          return Promise.resolve();
      }
      // devtools only
      if (isBrowser) {
          const instance = getCurrentInstance();
          if (instance) {
              const linkContextDevtools = {
                  route: route.value,
                  isActive: isActive.value,
                  isExactActive: isExactActive.value,
              };
              // @ts-expect-error: this is internal
              instance.__vrl_devtools = instance.__vrl_devtools || [];
              // @ts-expect-error: this is internal
              instance.__vrl_devtools.push(linkContextDevtools);
              watchEffect(() => {
                  linkContextDevtools.route = route.value;
                  linkContextDevtools.isActive = isActive.value;
                  linkContextDevtools.isExactActive = isExactActive.value;
              }, { flush: 'post' });
          }
      }
      /**
       * NOTE: update {@link _RouterLinkI}'s `$slots` type when updating this
       */
      return {
          route,
          href: computed(() => route.value.href),
          isActive,
          isExactActive,
          navigate,
      };
  }
  const RouterLinkImpl = /*#__PURE__*/ defineComponent({
      name: 'RouterLink',
      compatConfig: { MODE: 3 },
      props: {
          to: {
              type: [String, Object],
              required: true,
          },
          replace: Boolean,
          activeClass: String,
          // inactiveClass: String,
          exactActiveClass: String,
          custom: Boolean,
          ariaCurrentValue: {
              type: String,
              default: 'page',
          },
      },
      useLink,
      setup(props, { slots }) {
          const link = reactive(useLink(props));
          const { options } = inject(routerKey);
          const elClass = computed(() => ({
              [getLinkClass(props.activeClass, options.linkActiveClass, 'router-link-active')]: link.isActive,
              // [getLinkClass(
              //   props.inactiveClass,
              //   options.linkInactiveClass,
              //   'router-link-inactive'
              // )]: !link.isExactActive,
              [getLinkClass(props.exactActiveClass, options.linkExactActiveClass, 'router-link-exact-active')]: link.isExactActive,
          }));
          return () => {
              const children = slots.default && slots.default(link);
              return props.custom
                  ? children
                  : h('a', {
                      'aria-current': link.isExactActive
                          ? props.ariaCurrentValue
                          : null,
                      href: link.href,
                      // this would override user added attrs but Vue will still add
                      // the listener, so we end up triggering both
                      onClick: link.navigate,
                      class: elClass.value,
                  }, children);
          };
      },
  });
  // export the public type for h/tsx inference
  // also to avoid inline import() in generated d.ts files
  /**
   * Component to render a link that triggers a navigation on click.
   */
  const RouterLink = RouterLinkImpl;
  function guardEvent(e) {
      // don't redirect with control keys
      if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey)
          return;
      // don't redirect when preventDefault called
      if (e.defaultPrevented)
          return;
      // don't redirect on right click
      if (e.button !== undefined && e.button !== 0)
          return;
      // don't redirect if `target="_blank"`
      // @ts-expect-error getAttribute does exist
      if (e.currentTarget && e.currentTarget.getAttribute) {
          // @ts-expect-error getAttribute exists
          const target = e.currentTarget.getAttribute('target');
          if (/\b_blank\b/i.test(target))
              return;
      }
      // this may be a Weex event which doesn't have this method
      if (e.preventDefault)
          e.preventDefault();
      return true;
  }
  function includesParams(outer, inner) {
      for (const key in inner) {
          const innerValue = inner[key];
          const outerValue = outer[key];
          if (typeof innerValue === 'string') {
              if (innerValue !== outerValue)
                  return false;
          }
          else {
              if (!isArray(outerValue) ||
                  outerValue.length !== innerValue.length ||
                  innerValue.some((value, i) => value !== outerValue[i]))
                  return false;
          }
      }
      return true;
  }
  /**
   * Get the original path value of a record by following its aliasOf
   * @param record
   */
  function getOriginalPath(record) {
      return record ? (record.aliasOf ? record.aliasOf.path : record.path) : '';
  }
  /**
   * Utility class to get the active class based on defaults.
   * @param propClass
   * @param globalClass
   * @param defaultClass
   */
  const getLinkClass = (propClass, globalClass, defaultClass) => propClass != null
      ? propClass
      : globalClass != null
          ? globalClass
          : defaultClass;

  const RouterViewImpl = /*#__PURE__*/ defineComponent({
      name: 'RouterView',
      // #674 we manually inherit them
      inheritAttrs: false,
      props: {
          name: {
              type: String,
              default: 'default',
          },
          route: Object,
      },
      // Better compat for @vue/compat users
      // https://github.com/vuejs/router/issues/1315
      compatConfig: { MODE: 3 },
      setup(props, { attrs, slots }) {
          warnDeprecatedUsage();
          const injectedRoute = inject(routerViewLocationKey);
          const routeToDisplay = computed(() => props.route || injectedRoute.value);
          const injectedDepth = inject(viewDepthKey, 0);
          // The depth changes based on empty components option, which allows passthrough routes e.g. routes with children
          // that are used to reuse the `path` property
          const depth = computed(() => {
              let initialDepth = unref(injectedDepth);
              const { matched } = routeToDisplay.value;
              let matchedRoute;
              while ((matchedRoute = matched[initialDepth]) &&
                  !matchedRoute.components) {
                  initialDepth++;
              }
              return initialDepth;
          });
          const matchedRouteRef = computed(() => routeToDisplay.value.matched[depth.value]);
          provide(viewDepthKey, computed(() => depth.value + 1));
          provide(matchedRouteKey, matchedRouteRef);
          provide(routerViewLocationKey, routeToDisplay);
          const viewRef = ref();
          // watch at the same time the component instance, the route record we are
          // rendering, and the name
          watch(() => [viewRef.value, matchedRouteRef.value, props.name], ([instance, to, name], [oldInstance, from, oldName]) => {
              // copy reused instances
              if (to) {
                  // this will update the instance for new instances as well as reused
                  // instances when navigating to a new route
                  to.instances[name] = instance;
                  // the component instance is reused for a different route or name, so
                  // we copy any saved update or leave guards. With async setup, the
                  // mounting component will mount before the matchedRoute changes,
                  // making instance === oldInstance, so we check if guards have been
                  // added before. This works because we remove guards when
                  // unmounting/deactivating components
                  if (from && from !== to && instance && instance === oldInstance) {
                      if (!to.leaveGuards.size) {
                          to.leaveGuards = from.leaveGuards;
                      }
                      if (!to.updateGuards.size) {
                          to.updateGuards = from.updateGuards;
                      }
                  }
              }
              // trigger beforeRouteEnter next callbacks
              if (instance &&
                  to &&
                  // if there is no instance but to and from are the same this might be
                  // the first visit
                  (!from || !isSameRouteRecord(to, from) || !oldInstance)) {
                  (to.enterCallbacks[name] || []).forEach(callback => callback(instance));
              }
          }, { flush: 'post' });
          return () => {
              const route = routeToDisplay.value;
              // we need the value at the time we render because when we unmount, we
              // navigated to a different location so the value is different
              const currentName = props.name;
              const matchedRoute = matchedRouteRef.value;
              const ViewComponent = matchedRoute && matchedRoute.components[currentName];
              if (!ViewComponent) {
                  return normalizeSlot(slots.default, { Component: ViewComponent, route });
              }
              // props from route configuration
              const routePropsOption = matchedRoute.props[currentName];
              const routeProps = routePropsOption
                  ? routePropsOption === true
                      ? route.params
                      : typeof routePropsOption === 'function'
                          ? routePropsOption(route)
                          : routePropsOption
                  : null;
              const onVnodeUnmounted = vnode => {
                  // remove the instance reference to prevent leak
                  if (vnode.component.isUnmounted) {
                      matchedRoute.instances[currentName] = null;
                  }
              };
              const component = h(ViewComponent, assign({}, routeProps, attrs, {
                  onVnodeUnmounted,
                  ref: viewRef,
              }));
              if (isBrowser &&
                  component.ref) {
                  // TODO: can display if it's an alias, its props
                  const info = {
                      depth: depth.value,
                      name: matchedRoute.name,
                      path: matchedRoute.path,
                      meta: matchedRoute.meta,
                  };
                  const internalInstances = isArray(component.ref)
                      ? component.ref.map(r => r.i)
                      : [component.ref.i];
                  internalInstances.forEach(instance => {
                      // @ts-expect-error
                      instance.__vrv_devtools = info;
                  });
              }
              return (
              // pass the vnode to the slot as a prop.
              // h and <component :is="..."> both accept vnodes
              normalizeSlot(slots.default, { Component: component, route }) ||
                  component);
          };
      },
  });
  function normalizeSlot(slot, data) {
      if (!slot)
          return null;
      const slotContent = slot(data);
      return slotContent.length === 1 ? slotContent[0] : slotContent;
  }
  // export the public type for h/tsx inference
  // also to avoid inline import() in generated d.ts files
  /**
   * Component to display the current route the user is at.
   */
  const RouterView = RouterViewImpl;
  // warn against deprecated usage with <transition> & <keep-alive>
  // due to functional component being no longer eager in Vue 3
  function warnDeprecatedUsage() {
      const instance = getCurrentInstance();
      const parentName = instance.parent && instance.parent.type.name;
      const parentSubTreeType = instance.parent && instance.parent.subTree && instance.parent.subTree.type;
      if (parentName &&
          (parentName === 'KeepAlive' || parentName.includes('Transition')) &&
          typeof parentSubTreeType === 'object' &&
          parentSubTreeType.name === 'RouterView') {
          const comp = parentName === 'KeepAlive' ? 'keep-alive' : 'transition';
          warn(`<router-view> can no longer be used directly inside <transition> or <keep-alive>.\n` +
              `Use slot props instead:\n\n` +
              `<router-view v-slot="{ Component }">\n` +
              `  <${comp}>\n` +
              `    <component :is="Component" />\n` +
              `  </${comp}>\n` +
              `</router-view>`);
      }
  }

  /**
   * Copies a route location and removes any problematic properties that cannot be shown in devtools (e.g. Vue instances).
   *
   * @param routeLocation - routeLocation to format
   * @param tooltip - optional tooltip
   * @returns a copy of the routeLocation
   */
  function formatRouteLocation(routeLocation, tooltip) {
      const copy = assign({}, routeLocation, {
          // remove variables that can contain vue instances
          matched: routeLocation.matched.map(matched => omit(matched, ['instances', 'children', 'aliasOf'])),
      });
      return {
          _custom: {
              type: null,
              readOnly: true,
              display: routeLocation.fullPath,
              tooltip,
              value: copy,
          },
      };
  }
  function formatDisplay(display) {
      return {
          _custom: {
              display,
          },
      };
  }
  // to support multiple router instances
  let routerId = 0;
  function addDevtools$1(app, router, matcher) {
      // Take over router.beforeEach and afterEach
      // make sure we are not registering the devtool twice
      if (router.__hasDevtools)
          return;
      router.__hasDevtools = true;
      // increment to support multiple router instances
      const id = routerId++;
      setupDevtoolsPlugin({
          id: 'org.vuejs.router' + (id ? '.' + id : ''),
          label: 'Vue Router',
          packageName: 'vue-router',
          homepage: 'https://router.vuejs.org',
          logo: 'https://router.vuejs.org/logo.png',
          componentStateTypes: ['Routing'],
          app,
      }, api => {
          if (typeof api.now !== 'function') {
              console.warn('[Vue Router]: You seem to be using an outdated version of Vue Devtools. Are you still using the Beta release instead of the stable one? You can find the links at https://devtools.vuejs.org/guide/installation.html.');
          }
          // display state added by the router
          api.on.inspectComponent((payload, ctx) => {
              if (payload.instanceData) {
                  payload.instanceData.state.push({
                      type: 'Routing',
                      key: '$route',
                      editable: false,
                      value: formatRouteLocation(router.currentRoute.value, 'Current Route'),
                  });
              }
          });
          // mark router-link as active and display tags on router views
          api.on.visitComponentTree(({ treeNode: node, componentInstance }) => {
              if (componentInstance.__vrv_devtools) {
                  const info = componentInstance.__vrv_devtools;
                  node.tags.push({
                      label: (info.name ? `${info.name.toString()}: ` : '') + info.path,
                      textColor: 0,
                      tooltip: 'This component is rendered by &lt;router-view&gt;',
                      backgroundColor: PINK_500,
                  });
              }
              // if multiple useLink are used
              if (isArray(componentInstance.__vrl_devtools)) {
                  componentInstance.__devtoolsApi = api;
                  componentInstance.__vrl_devtools.forEach(devtoolsData => {
                      let backgroundColor = ORANGE_400;
                      let tooltip = '';
                      if (devtoolsData.isExactActive) {
                          backgroundColor = LIME_500;
                          tooltip = 'This is exactly active';
                      }
                      else if (devtoolsData.isActive) {
                          backgroundColor = BLUE_600;
                          tooltip = 'This link is active';
                      }
                      node.tags.push({
                          label: devtoolsData.route.path,
                          textColor: 0,
                          tooltip,
                          backgroundColor,
                      });
                  });
              }
          });
          watch(router.currentRoute, () => {
              // refresh active state
              refreshRoutesView();
              api.notifyComponentUpdate();
              api.sendInspectorTree(routerInspectorId);
              api.sendInspectorState(routerInspectorId);
          });
          const navigationsLayerId = 'router:navigations:' + id;
          api.addTimelineLayer({
              id: navigationsLayerId,
              label: `Router${id ? ' ' + id : ''} Navigations`,
              color: 0x40a8c4,
          });
          // const errorsLayerId = 'router:errors'
          // api.addTimelineLayer({
          //   id: errorsLayerId,
          //   label: 'Router Errors',
          //   color: 0xea5455,
          // })
          router.onError((error, to) => {
              api.addTimelineEvent({
                  layerId: navigationsLayerId,
                  event: {
                      title: 'Error during Navigation',
                      subtitle: to.fullPath,
                      logType: 'error',
                      time: api.now(),
                      data: { error },
                      groupId: to.meta.__navigationId,
                  },
              });
          });
          // attached to `meta` and used to group events
          let navigationId = 0;
          router.beforeEach((to, from) => {
              const data = {
                  guard: formatDisplay('beforeEach'),
                  from: formatRouteLocation(from, 'Current Location during this navigation'),
                  to: formatRouteLocation(to, 'Target location'),
              };
              // Used to group navigations together, hide from devtools
              Object.defineProperty(to.meta, '__navigationId', {
                  value: navigationId++,
              });
              api.addTimelineEvent({
                  layerId: navigationsLayerId,
                  event: {
                      time: api.now(),
                      title: 'Start of navigation',
                      subtitle: to.fullPath,
                      data,
                      groupId: to.meta.__navigationId,
                  },
              });
          });
          router.afterEach((to, from, failure) => {
              const data = {
                  guard: formatDisplay('afterEach'),
              };
              if (failure) {
                  data.failure = {
                      _custom: {
                          type: Error,
                          readOnly: true,
                          display: failure ? failure.message : '',
                          tooltip: 'Navigation Failure',
                          value: failure,
                      },
                  };
                  data.status = formatDisplay('❌');
              }
              else {
                  data.status = formatDisplay('✅');
              }
              // we set here to have the right order
              data.from = formatRouteLocation(from, 'Current Location during this navigation');
              data.to = formatRouteLocation(to, 'Target location');
              api.addTimelineEvent({
                  layerId: navigationsLayerId,
                  event: {
                      title: 'End of navigation',
                      subtitle: to.fullPath,
                      time: api.now(),
                      data,
                      logType: failure ? 'warning' : 'default',
                      groupId: to.meta.__navigationId,
                  },
              });
          });
          /**
           * Inspector of Existing routes
           */
          const routerInspectorId = 'router-inspector:' + id;
          api.addInspector({
              id: routerInspectorId,
              label: 'Routes' + (id ? ' ' + id : ''),
              icon: 'book',
              treeFilterPlaceholder: 'Search routes',
          });
          function refreshRoutesView() {
              // the routes view isn't active
              if (!activeRoutesPayload)
                  return;
              const payload = activeRoutesPayload;
              // children routes will appear as nested
              let routes = matcher.getRoutes().filter(route => !route.parent);
              // reset match state to false
              routes.forEach(resetMatchStateOnRouteRecord);
              // apply a match state if there is a payload
              if (payload.filter) {
                  routes = routes.filter(route => 
                  // save matches state based on the payload
                  isRouteMatching(route, payload.filter.toLowerCase()));
              }
              // mark active routes
              routes.forEach(route => markRouteRecordActive(route, router.currentRoute.value));
              payload.rootNodes = routes.map(formatRouteRecordForInspector);
          }
          let activeRoutesPayload;
          api.on.getInspectorTree(payload => {
              activeRoutesPayload = payload;
              if (payload.app === app && payload.inspectorId === routerInspectorId) {
                  refreshRoutesView();
              }
          });
          /**
           * Display information about the currently selected route record
           */
          api.on.getInspectorState(payload => {
              if (payload.app === app && payload.inspectorId === routerInspectorId) {
                  const routes = matcher.getRoutes();
                  const route = routes.find(route => route.record.__vd_id === payload.nodeId);
                  if (route) {
                      payload.state = {
                          options: formatRouteRecordMatcherForStateInspector(route),
                      };
                  }
              }
          });
          api.sendInspectorTree(routerInspectorId);
          api.sendInspectorState(routerInspectorId);
      });
  }
  function modifierForKey(key) {
      if (key.optional) {
          return key.repeatable ? '*' : '?';
      }
      else {
          return key.repeatable ? '+' : '';
      }
  }
  function formatRouteRecordMatcherForStateInspector(route) {
      const { record } = route;
      const fields = [
          { editable: false, key: 'path', value: record.path },
      ];
      if (record.name != null) {
          fields.push({
              editable: false,
              key: 'name',
              value: record.name,
          });
      }
      fields.push({ editable: false, key: 'regexp', value: route.re });
      if (route.keys.length) {
          fields.push({
              editable: false,
              key: 'keys',
              value: {
                  _custom: {
                      type: null,
                      readOnly: true,
                      display: route.keys
                          .map(key => `${key.name}${modifierForKey(key)}`)
                          .join(' '),
                      tooltip: 'Param keys',
                      value: route.keys,
                  },
              },
          });
      }
      if (record.redirect != null) {
          fields.push({
              editable: false,
              key: 'redirect',
              value: record.redirect,
          });
      }
      if (route.alias.length) {
          fields.push({
              editable: false,
              key: 'aliases',
              value: route.alias.map(alias => alias.record.path),
          });
      }
      if (Object.keys(route.record.meta).length) {
          fields.push({
              editable: false,
              key: 'meta',
              value: route.record.meta,
          });
      }
      fields.push({
          key: 'score',
          editable: false,
          value: {
              _custom: {
                  type: null,
                  readOnly: true,
                  display: route.score.map(score => score.join(', ')).join(' | '),
                  tooltip: 'Score used to sort routes',
                  value: route.score,
              },
          },
      });
      return fields;
  }
  /**
   * Extracted from tailwind palette
   */
  const PINK_500 = 0xec4899;
  const BLUE_600 = 0x2563eb;
  const LIME_500 = 0x84cc16;
  const CYAN_400 = 0x22d3ee;
  const ORANGE_400 = 0xfb923c;
  // const GRAY_100 = 0xf4f4f5
  const DARK = 0x666666;
  function formatRouteRecordForInspector(route) {
      const tags = [];
      const { record } = route;
      if (record.name != null) {
          tags.push({
              label: String(record.name),
              textColor: 0,
              backgroundColor: CYAN_400,
          });
      }
      if (record.aliasOf) {
          tags.push({
              label: 'alias',
              textColor: 0,
              backgroundColor: ORANGE_400,
          });
      }
      if (route.__vd_match) {
          tags.push({
              label: 'matches',
              textColor: 0,
              backgroundColor: PINK_500,
          });
      }
      if (route.__vd_exactActive) {
          tags.push({
              label: 'exact',
              textColor: 0,
              backgroundColor: LIME_500,
          });
      }
      if (route.__vd_active) {
          tags.push({
              label: 'active',
              textColor: 0,
              backgroundColor: BLUE_600,
          });
      }
      if (record.redirect) {
          tags.push({
              label: typeof record.redirect === 'string'
                  ? `redirect: ${record.redirect}`
                  : 'redirects',
              textColor: 0xffffff,
              backgroundColor: DARK,
          });
      }
      // add an id to be able to select it. Using the `path` is not possible because
      // empty path children would collide with their parents
      let id = record.__vd_id;
      if (id == null) {
          id = String(routeRecordId++);
          record.__vd_id = id;
      }
      return {
          id,
          label: record.path,
          tags,
          children: route.children.map(formatRouteRecordForInspector),
      };
  }
  //  incremental id for route records and inspector state
  let routeRecordId = 0;
  const EXTRACT_REGEXP_RE = /^\/(.*)\/([a-z]*)$/;
  function markRouteRecordActive(route, currentRoute) {
      // no route will be active if matched is empty
      // reset the matching state
      const isExactActive = currentRoute.matched.length &&
          isSameRouteRecord(currentRoute.matched[currentRoute.matched.length - 1], route.record);
      route.__vd_exactActive = route.__vd_active = isExactActive;
      if (!isExactActive) {
          route.__vd_active = currentRoute.matched.some(match => isSameRouteRecord(match, route.record));
      }
      route.children.forEach(childRoute => markRouteRecordActive(childRoute, currentRoute));
  }
  function resetMatchStateOnRouteRecord(route) {
      route.__vd_match = false;
      route.children.forEach(resetMatchStateOnRouteRecord);
  }
  function isRouteMatching(route, filter) {
      const found = String(route.re).match(EXTRACT_REGEXP_RE);
      route.__vd_match = false;
      if (!found || found.length < 3) {
          return false;
      }
      // use a regexp without $ at the end to match nested routes better
      const nonEndingRE = new RegExp(found[1].replace(/\$$/, ''), found[2]);
      if (nonEndingRE.test(filter)) {
          // mark children as matches
          route.children.forEach(child => isRouteMatching(child, filter));
          // exception case: `/`
          if (route.record.path !== '/' || filter === '/') {
              route.__vd_match = route.re.test(filter);
              return true;
          }
          // hide the / route
          return false;
      }
      const path = route.record.path.toLowerCase();
      const decodedPath = decode(path);
      // also allow partial matching on the path
      if (!filter.startsWith('/') &&
          (decodedPath.includes(filter) || path.includes(filter)))
          return true;
      if (decodedPath.startsWith(filter) || path.startsWith(filter))
          return true;
      if (route.record.name && String(route.record.name).includes(filter))
          return true;
      return route.children.some(child => isRouteMatching(child, filter));
  }
  function omit(obj, keys) {
      const ret = {};
      for (const key in obj) {
          if (!keys.includes(key)) {
              // @ts-expect-error
              ret[key] = obj[key];
          }
      }
      return ret;
  }

  /**
   * Creates a Router instance that can be used by a Vue app.
   *
   * @param options - {@link RouterOptions}
   */
  function createRouter(options) {
      const matcher = createRouterMatcher(options.routes, options);
      const parseQuery$1 = options.parseQuery || parseQuery;
      const stringifyQuery$1 = options.stringifyQuery || stringifyQuery;
      const routerHistory = options.history;
      if (!routerHistory)
          throw new Error('Provide the "history" option when calling "createRouter()":' +
              ' https://next.router.vuejs.org/api/#history.');
      const beforeGuards = useCallbacks();
      const beforeResolveGuards = useCallbacks();
      const afterGuards = useCallbacks();
      const currentRoute = shallowRef(START_LOCATION_NORMALIZED);
      let pendingLocation = START_LOCATION_NORMALIZED;
      // leave the scrollRestoration if no scrollBehavior is provided
      if (isBrowser && options.scrollBehavior && 'scrollRestoration' in history) {
          history.scrollRestoration = 'manual';
      }
      const normalizeParams = applyToParams.bind(null, paramValue => '' + paramValue);
      const encodeParams = applyToParams.bind(null, encodeParam);
      const decodeParams = 
      // @ts-expect-error: intentionally avoid the type check
      applyToParams.bind(null, decode);
      function addRoute(parentOrRoute, route) {
          let parent;
          let record;
          if (isRouteName(parentOrRoute)) {
              parent = matcher.getRecordMatcher(parentOrRoute);
              record = route;
          }
          else {
              record = parentOrRoute;
          }
          return matcher.addRoute(record, parent);
      }
      function removeRoute(name) {
          const recordMatcher = matcher.getRecordMatcher(name);
          if (recordMatcher) {
              matcher.removeRoute(recordMatcher);
          }
          else {
              warn(`Cannot remove non-existent route "${String(name)}"`);
          }
      }
      function getRoutes() {
          return matcher.getRoutes().map(routeMatcher => routeMatcher.record);
      }
      function hasRoute(name) {
          return !!matcher.getRecordMatcher(name);
      }
      function resolve(rawLocation, currentLocation) {
          // const objectLocation = routerLocationAsObject(rawLocation)
          // we create a copy to modify it later
          currentLocation = assign({}, currentLocation || currentRoute.value);
          if (typeof rawLocation === 'string') {
              const locationNormalized = parseURL(parseQuery$1, rawLocation, currentLocation.path);
              const matchedRoute = matcher.resolve({ path: locationNormalized.path }, currentLocation);
              const href = routerHistory.createHref(locationNormalized.fullPath);
              {
                  if (href.startsWith('//'))
                      warn(`Location "${rawLocation}" resolved to "${href}". A resolved location cannot start with multiple slashes.`);
                  else if (!matchedRoute.matched.length) {
                      warn(`No match found for location with path "${rawLocation}"`);
                  }
              }
              // locationNormalized is always a new object
              return assign(locationNormalized, matchedRoute, {
                  params: decodeParams(matchedRoute.params),
                  hash: decode(locationNormalized.hash),
                  redirectedFrom: undefined,
                  href,
              });
          }
          let matcherLocation;
          // path could be relative in object as well
          if ('path' in rawLocation) {
              if ('params' in rawLocation &&
                  !('name' in rawLocation) &&
                  // @ts-expect-error: the type is never
                  Object.keys(rawLocation.params).length) {
                  warn(`Path "${rawLocation.path}" was passed with params but they will be ignored. Use a named route alongside params instead.`);
              }
              matcherLocation = assign({}, rawLocation, {
                  path: parseURL(parseQuery$1, rawLocation.path, currentLocation.path).path,
              });
          }
          else {
              // remove any nullish param
              const targetParams = assign({}, rawLocation.params);
              for (const key in targetParams) {
                  if (targetParams[key] == null) {
                      delete targetParams[key];
                  }
              }
              // pass encoded values to the matcher, so it can produce encoded path and fullPath
              matcherLocation = assign({}, rawLocation, {
                  params: encodeParams(targetParams),
              });
              // current location params are decoded, we need to encode them in case the
              // matcher merges the params
              currentLocation.params = encodeParams(currentLocation.params);
          }
          const matchedRoute = matcher.resolve(matcherLocation, currentLocation);
          const hash = rawLocation.hash || '';
          if (hash && !hash.startsWith('#')) {
              warn(`A \`hash\` should always start with the character "#". Replace "${hash}" with "#${hash}".`);
          }
          // the matcher might have merged current location params, so
          // we need to run the decoding again
          matchedRoute.params = normalizeParams(decodeParams(matchedRoute.params));
          const fullPath = stringifyURL(stringifyQuery$1, assign({}, rawLocation, {
              hash: encodeHash(hash),
              path: matchedRoute.path,
          }));
          const href = routerHistory.createHref(fullPath);
          {
              if (href.startsWith('//')) {
                  warn(`Location "${rawLocation}" resolved to "${href}". A resolved location cannot start with multiple slashes.`);
              }
              else if (!matchedRoute.matched.length) {
                  warn(`No match found for location with path "${'path' in rawLocation ? rawLocation.path : rawLocation}"`);
              }
          }
          return assign({
              fullPath,
              // keep the hash encoded so fullPath is effectively path + encodedQuery +
              // hash
              hash,
              query: 
              // if the user is using a custom query lib like qs, we might have
              // nested objects, so we keep the query as is, meaning it can contain
              // numbers at `$route.query`, but at the point, the user will have to
              // use their own type anyway.
              // https://github.com/vuejs/router/issues/328#issuecomment-649481567
              stringifyQuery$1 === stringifyQuery
                  ? normalizeQuery(rawLocation.query)
                  : (rawLocation.query || {}),
          }, matchedRoute, {
              redirectedFrom: undefined,
              href,
          });
      }
      function locationAsObject(to) {
          return typeof to === 'string'
              ? parseURL(parseQuery$1, to, currentRoute.value.path)
              : assign({}, to);
      }
      function checkCanceledNavigation(to, from) {
          if (pendingLocation !== to) {
              return createRouterError(8 /* ErrorTypes.NAVIGATION_CANCELLED */, {
                  from,
                  to,
              });
          }
      }
      function push(to) {
          return pushWithRedirect(to);
      }
      function replace(to) {
          return push(assign(locationAsObject(to), { replace: true }));
      }
      function handleRedirectRecord(to) {
          const lastMatched = to.matched[to.matched.length - 1];
          if (lastMatched && lastMatched.redirect) {
              const { redirect } = lastMatched;
              let newTargetLocation = typeof redirect === 'function' ? redirect(to) : redirect;
              if (typeof newTargetLocation === 'string') {
                  newTargetLocation =
                      newTargetLocation.includes('?') || newTargetLocation.includes('#')
                          ? (newTargetLocation = locationAsObject(newTargetLocation))
                          : // force empty params
                              { path: newTargetLocation };
                  // @ts-expect-error: force empty params when a string is passed to let
                  // the router parse them again
                  newTargetLocation.params = {};
              }
              if (!('path' in newTargetLocation) &&
                  !('name' in newTargetLocation)) {
                  warn(`Invalid redirect found:\n${JSON.stringify(newTargetLocation, null, 2)}\n when navigating to "${to.fullPath}". A redirect must contain a name or path. This will break in production.`);
                  throw new Error('Invalid redirect');
              }
              return assign({
                  query: to.query,
                  hash: to.hash,
                  // avoid transferring params if the redirect has a path
                  params: 'path' in newTargetLocation ? {} : to.params,
              }, newTargetLocation);
          }
      }
      function pushWithRedirect(to, redirectedFrom) {
          const targetLocation = (pendingLocation = resolve(to));
          const from = currentRoute.value;
          const data = to.state;
          const force = to.force;
          // to could be a string where `replace` is a function
          const replace = to.replace === true;
          const shouldRedirect = handleRedirectRecord(targetLocation);
          if (shouldRedirect)
              return pushWithRedirect(assign(locationAsObject(shouldRedirect), {
                  state: typeof shouldRedirect === 'object'
                      ? assign({}, data, shouldRedirect.state)
                      : data,
                  force,
                  replace,
              }), 
              // keep original redirectedFrom if it exists
              redirectedFrom || targetLocation);
          // if it was a redirect we already called `pushWithRedirect` above
          const toLocation = targetLocation;
          toLocation.redirectedFrom = redirectedFrom;
          let failure;
          if (!force && isSameRouteLocation(stringifyQuery$1, from, targetLocation)) {
              failure = createRouterError(16 /* ErrorTypes.NAVIGATION_DUPLICATED */, { to: toLocation, from });
              // trigger scroll to allow scrolling to the same anchor
              handleScroll(from, from, 
              // this is a push, the only way for it to be triggered from a
              // history.listen is with a redirect, which makes it become a push
              true, 
              // This cannot be the first navigation because the initial location
              // cannot be manually navigated to
              false);
          }
          return (failure ? Promise.resolve(failure) : navigate(toLocation, from))
              .catch((error) => isNavigationFailure(error)
              ? // navigation redirects still mark the router as ready
                  isNavigationFailure(error, 2 /* ErrorTypes.NAVIGATION_GUARD_REDIRECT */)
                      ? error
                      : markAsReady(error) // also returns the error
              : // reject any unknown error
                  triggerError(error, toLocation, from))
              .then((failure) => {
              if (failure) {
                  if (isNavigationFailure(failure, 2 /* ErrorTypes.NAVIGATION_GUARD_REDIRECT */)) {
                      if (// we are redirecting to the same location we were already at
                          isSameRouteLocation(stringifyQuery$1, resolve(failure.to), toLocation) &&
                          // and we have done it a couple of times
                          redirectedFrom &&
                          // @ts-expect-error: added only in dev
                          (redirectedFrom._count = redirectedFrom._count
                              ? // @ts-expect-error
                                  redirectedFrom._count + 1
                              : 1) > 30) {
                          warn(`Detected a possibly infinite redirection in a navigation guard when going from "${from.fullPath}" to "${toLocation.fullPath}". Aborting to avoid a Stack Overflow.\n Are you always returning a new location within a navigation guard? That would lead to this error. Only return when redirecting or aborting, that should fix this. This might break in production if not fixed.`);
                          return Promise.reject(new Error('Infinite redirect in navigation guard'));
                      }
                      return pushWithRedirect(
                      // keep options
                      assign({
                          // preserve an existing replacement but allow the redirect to override it
                          replace,
                      }, locationAsObject(failure.to), {
                          state: typeof failure.to === 'object'
                              ? assign({}, data, failure.to.state)
                              : data,
                          force,
                      }), 
                      // preserve the original redirectedFrom if any
                      redirectedFrom || toLocation);
                  }
              }
              else {
                  // if we fail we don't finalize the navigation
                  failure = finalizeNavigation(toLocation, from, true, replace, data);
              }
              triggerAfterEach(toLocation, from, failure);
              return failure;
          });
      }
      /**
       * Helper to reject and skip all navigation guards if a new navigation happened
       * @param to
       * @param from
       */
      function checkCanceledNavigationAndReject(to, from) {
          const error = checkCanceledNavigation(to, from);
          return error ? Promise.reject(error) : Promise.resolve();
      }
      function runWithContext(fn) {
          const app = installedApps.values().next().value;
          // support Vue < 3.3
          return app && typeof app.runWithContext === 'function'
              ? app.runWithContext(fn)
              : fn();
      }
      // TODO: refactor the whole before guards by internally using router.beforeEach
      function navigate(to, from) {
          let guards;
          const [leavingRecords, updatingRecords, enteringRecords] = extractChangingRecords(to, from);
          // all components here have been resolved once because we are leaving
          guards = extractComponentsGuards(leavingRecords.reverse(), 'beforeRouteLeave', to, from);
          // leavingRecords is already reversed
          for (const record of leavingRecords) {
              record.leaveGuards.forEach(guard => {
                  guards.push(guardToPromiseFn(guard, to, from));
              });
          }
          const canceledNavigationCheck = checkCanceledNavigationAndReject.bind(null, to, from);
          guards.push(canceledNavigationCheck);
          // run the queue of per route beforeRouteLeave guards
          return (runGuardQueue(guards)
              .then(() => {
              // check global guards beforeEach
              guards = [];
              for (const guard of beforeGuards.list()) {
                  guards.push(guardToPromiseFn(guard, to, from));
              }
              guards.push(canceledNavigationCheck);
              return runGuardQueue(guards);
          })
              .then(() => {
              // check in components beforeRouteUpdate
              guards = extractComponentsGuards(updatingRecords, 'beforeRouteUpdate', to, from);
              for (const record of updatingRecords) {
                  record.updateGuards.forEach(guard => {
                      guards.push(guardToPromiseFn(guard, to, from));
                  });
              }
              guards.push(canceledNavigationCheck);
              // run the queue of per route beforeEnter guards
              return runGuardQueue(guards);
          })
              .then(() => {
              // check the route beforeEnter
              guards = [];
              for (const record of to.matched) {
                  // do not trigger beforeEnter on reused views
                  if (record.beforeEnter && !from.matched.includes(record)) {
                      if (isArray(record.beforeEnter)) {
                          for (const beforeEnter of record.beforeEnter)
                              guards.push(guardToPromiseFn(beforeEnter, to, from));
                      }
                      else {
                          guards.push(guardToPromiseFn(record.beforeEnter, to, from));
                      }
                  }
              }
              guards.push(canceledNavigationCheck);
              // run the queue of per route beforeEnter guards
              return runGuardQueue(guards);
          })
              .then(() => {
              // NOTE: at this point to.matched is normalized and does not contain any () => Promise<Component>
              // clear existing enterCallbacks, these are added by extractComponentsGuards
              to.matched.forEach(record => (record.enterCallbacks = {}));
              // check in-component beforeRouteEnter
              guards = extractComponentsGuards(enteringRecords, 'beforeRouteEnter', to, from);
              guards.push(canceledNavigationCheck);
              // run the queue of per route beforeEnter guards
              return runGuardQueue(guards);
          })
              .then(() => {
              // check global guards beforeResolve
              guards = [];
              for (const guard of beforeResolveGuards.list()) {
                  guards.push(guardToPromiseFn(guard, to, from));
              }
              guards.push(canceledNavigationCheck);
              return runGuardQueue(guards);
          })
              // catch any navigation canceled
              .catch(err => isNavigationFailure(err, 8 /* ErrorTypes.NAVIGATION_CANCELLED */)
              ? err
              : Promise.reject(err)));
      }
      function triggerAfterEach(to, from, failure) {
          // navigation is confirmed, call afterGuards
          // TODO: wrap with error handlers
          for (const guard of afterGuards.list()) {
              runWithContext(() => guard(to, from, failure));
          }
      }
      /**
       * - Cleans up any navigation guards
       * - Changes the url if necessary
       * - Calls the scrollBehavior
       */
      function finalizeNavigation(toLocation, from, isPush, replace, data) {
          // a more recent navigation took place
          const error = checkCanceledNavigation(toLocation, from);
          if (error)
              return error;
          // only consider as push if it's not the first navigation
          const isFirstNavigation = from === START_LOCATION_NORMALIZED;
          const state = !isBrowser ? {} : history.state;
          // change URL only if the user did a push/replace and if it's not the initial navigation because
          // it's just reflecting the url
          if (isPush) {
              // on the initial navigation, we want to reuse the scroll position from
              // history state if it exists
              if (replace || isFirstNavigation)
                  routerHistory.replace(toLocation.fullPath, assign({
                      scroll: isFirstNavigation && state && state.scroll,
                  }, data));
              else
                  routerHistory.push(toLocation.fullPath, data);
          }
          // accept current navigation
          currentRoute.value = toLocation;
          handleScroll(toLocation, from, isPush, isFirstNavigation);
          markAsReady();
      }
      let removeHistoryListener;
      // attach listener to history to trigger navigations
      function setupListeners() {
          // avoid setting up listeners twice due to an invalid first navigation
          if (removeHistoryListener)
              return;
          removeHistoryListener = routerHistory.listen((to, _from, info) => {
              if (!router.listening)
                  return;
              // cannot be a redirect route because it was in history
              const toLocation = resolve(to);
              // due to dynamic routing, and to hash history with manual navigation
              // (manually changing the url or calling history.hash = '#/somewhere'),
              // there could be a redirect record in history
              const shouldRedirect = handleRedirectRecord(toLocation);
              if (shouldRedirect) {
                  pushWithRedirect(assign(shouldRedirect, { replace: true }), toLocation).catch(noop);
                  return;
              }
              pendingLocation = toLocation;
              const from = currentRoute.value;
              // TODO: should be moved to web history?
              if (isBrowser) {
                  saveScrollPosition(getScrollKey(from.fullPath, info.delta), computeScrollPosition());
              }
              navigate(toLocation, from)
                  .catch((error) => {
                  if (isNavigationFailure(error, 4 /* ErrorTypes.NAVIGATION_ABORTED */ | 8 /* ErrorTypes.NAVIGATION_CANCELLED */)) {
                      return error;
                  }
                  if (isNavigationFailure(error, 2 /* ErrorTypes.NAVIGATION_GUARD_REDIRECT */)) {
                      // Here we could call if (info.delta) routerHistory.go(-info.delta,
                      // false) but this is bug prone as we have no way to wait the
                      // navigation to be finished before calling pushWithRedirect. Using
                      // a setTimeout of 16ms seems to work but there is no guarantee for
                      // it to work on every browser. So instead we do not restore the
                      // history entry and trigger a new navigation as requested by the
                      // navigation guard.
                      // the error is already handled by router.push we just want to avoid
                      // logging the error
                      pushWithRedirect(error.to, toLocation
                      // avoid an uncaught rejection, let push call triggerError
                      )
                          .then(failure => {
                          // manual change in hash history #916 ending up in the URL not
                          // changing, but it was changed by the manual url change, so we
                          // need to manually change it ourselves
                          if (isNavigationFailure(failure, 4 /* ErrorTypes.NAVIGATION_ABORTED */ |
                              16 /* ErrorTypes.NAVIGATION_DUPLICATED */) &&
                              !info.delta &&
                              info.type === NavigationType.pop) {
                              routerHistory.go(-1, false);
                          }
                      })
                          .catch(noop);
                      // avoid the then branch
                      return Promise.reject();
                  }
                  // do not restore history on unknown direction
                  if (info.delta) {
                      routerHistory.go(-info.delta, false);
                  }
                  // unrecognized error, transfer to the global handler
                  return triggerError(error, toLocation, from);
              })
                  .then((failure) => {
                  failure =
                      failure ||
                          finalizeNavigation(
                          // after navigation, all matched components are resolved
                          toLocation, from, false);
                  // revert the navigation
                  if (failure) {
                      if (info.delta &&
                          // a new navigation has been triggered, so we do not want to revert, that will change the current history
                          // entry while a different route is displayed
                          !isNavigationFailure(failure, 8 /* ErrorTypes.NAVIGATION_CANCELLED */)) {
                          routerHistory.go(-info.delta, false);
                      }
                      else if (info.type === NavigationType.pop &&
                          isNavigationFailure(failure, 4 /* ErrorTypes.NAVIGATION_ABORTED */ | 16 /* ErrorTypes.NAVIGATION_DUPLICATED */)) {
                          // manual change in hash history #916
                          // it's like a push but lacks the information of the direction
                          routerHistory.go(-1, false);
                      }
                  }
                  triggerAfterEach(toLocation, from, failure);
              })
                  .catch(noop);
          });
      }
      // Initialization and Errors
      let readyHandlers = useCallbacks();
      let errorHandlers = useCallbacks();
      let ready;
      /**
       * Trigger errorHandlers added via onError and throws the error as well
       *
       * @param error - error to throw
       * @param to - location we were navigating to when the error happened
       * @param from - location we were navigating from when the error happened
       * @returns the error as a rejected promise
       */
      function triggerError(error, to, from) {
          markAsReady(error);
          const list = errorHandlers.list();
          if (list.length) {
              list.forEach(handler => handler(error, to, from));
          }
          else {
              {
                  warn('uncaught error during route navigation:');
              }
              console.error(error);
          }
          return Promise.reject(error);
      }
      function isReady() {
          if (ready && currentRoute.value !== START_LOCATION_NORMALIZED)
              return Promise.resolve();
          return new Promise((resolve, reject) => {
              readyHandlers.add([resolve, reject]);
          });
      }
      function markAsReady(err) {
          if (!ready) {
              // still not ready if an error happened
              ready = !err;
              setupListeners();
              readyHandlers
                  .list()
                  .forEach(([resolve, reject]) => (err ? reject(err) : resolve()));
              readyHandlers.reset();
          }
          return err;
      }
      // Scroll behavior
      function handleScroll(to, from, isPush, isFirstNavigation) {
          const { scrollBehavior } = options;
          if (!isBrowser || !scrollBehavior)
              return Promise.resolve();
          const scrollPosition = (!isPush && getSavedScrollPosition(getScrollKey(to.fullPath, 0))) ||
              ((isFirstNavigation || !isPush) &&
                  history.state &&
                  history.state.scroll) ||
              null;
          return nextTick()
              .then(() => scrollBehavior(to, from, scrollPosition))
              .then(position => position && scrollToPosition(position))
              .catch(err => triggerError(err, to, from));
      }
      const go = (delta) => routerHistory.go(delta);
      let started;
      const installedApps = new Set();
      const router = {
          currentRoute,
          listening: true,
          addRoute,
          removeRoute,
          hasRoute,
          getRoutes,
          resolve,
          options,
          push,
          replace,
          go,
          back: () => go(-1),
          forward: () => go(1),
          beforeEach: beforeGuards.add,
          beforeResolve: beforeResolveGuards.add,
          afterEach: afterGuards.add,
          onError: errorHandlers.add,
          isReady,
          install(app) {
              const router = this;
              app.component('RouterLink', RouterLink);
              app.component('RouterView', RouterView);
              app.config.globalProperties.$router = router;
              Object.defineProperty(app.config.globalProperties, '$route', {
                  enumerable: true,
                  get: () => unref(currentRoute),
              });
              // this initial navigation is only necessary on client, on server it doesn't
              // make sense because it will create an extra unnecessary navigation and could
              // lead to problems
              if (isBrowser &&
                  // used for the initial navigation client side to avoid pushing
                  // multiple times when the router is used in multiple apps
                  !started &&
                  currentRoute.value === START_LOCATION_NORMALIZED) {
                  // see above
                  started = true;
                  push(routerHistory.location).catch(err => {
                      warn('Unexpected error when starting the router:', err);
                  });
              }
              const reactiveRoute = {};
              for (const key in START_LOCATION_NORMALIZED) {
                  // @ts-expect-error: the key matches
                  reactiveRoute[key] = computed(() => currentRoute.value[key]);
              }
              app.provide(routerKey, router);
              app.provide(routeLocationKey, reactive(reactiveRoute));
              app.provide(routerViewLocationKey, currentRoute);
              const unmountApp = app.unmount;
              installedApps.add(app);
              app.unmount = function () {
                  installedApps.delete(app);
                  // the router is not attached to an app anymore
                  if (installedApps.size < 1) {
                      // invalidate the current navigation
                      pendingLocation = START_LOCATION_NORMALIZED;
                      removeHistoryListener && removeHistoryListener();
                      removeHistoryListener = null;
                      currentRoute.value = START_LOCATION_NORMALIZED;
                      started = false;
                      ready = false;
                  }
                  unmountApp();
              };
              // TODO: this probably needs to be updated so it can be used by vue-termui
              if (isBrowser) {
                  addDevtools$1(app, router, matcher);
              }
          },
      };
      // TODO: type this as NavigationGuardReturn or similar instead of any
      function runGuardQueue(guards) {
          return guards.reduce((promise, guard) => promise.then(() => runWithContext(guard)), Promise.resolve());
      }
      return router;
  }
  function extractChangingRecords(to, from) {
      const leavingRecords = [];
      const updatingRecords = [];
      const enteringRecords = [];
      const len = Math.max(from.matched.length, to.matched.length);
      for (let i = 0; i < len; i++) {
          const recordFrom = from.matched[i];
          if (recordFrom) {
              if (to.matched.find(record => isSameRouteRecord(record, recordFrom)))
                  updatingRecords.push(recordFrom);
              else
                  leavingRecords.push(recordFrom);
          }
          const recordTo = to.matched[i];
          if (recordTo) {
              // the type doesn't matter because we are comparing per reference
              if (!from.matched.find(record => isSameRouteRecord(record, recordTo))) {
                  enteringRecords.push(recordTo);
              }
          }
      }
      return [leavingRecords, updatingRecords, enteringRecords];
  }

  /**
   * Returns the router instance. Equivalent to using `$router` inside
   * templates.
   */
  function useRouter() {
      return inject(routerKey);
  }

  var script$r$1 = {
    name: 'VColumn',
    props: {
      size: String,
      offset: String,
      narrow: Boolean,
      narrowBreakpoint: String
    },
  };

  function render$r$1(_ctx, _cache, $props, $setup, $data, $options) {
    return (openBlock(), createBlock("div", {
      class: ["column", [
      $props.size,
      $props.offset,
      $props.narrowBreakpoint,
      {
        'is-narrow': $props.narrow
      }
    ]]
    }, [
      renderSlot(_ctx.$slots, "default")
    ], 2))
  }

  script$r$1.render = render$r$1;

  var script$s$1 = {
    name: 'VColumns',
    props: {
      mobile: Boolean,
      desktop: Boolean,
      gapless: Boolean,
      gap: String,
      multiline: Boolean,
      hcentered: Boolean,
      vcentered: Boolean,
    },
  };

  function render$s$1(_ctx, _cache, $props, $setup, $data, $options) {
    return (openBlock(), createBlock("div", {
      class: ["columns", [
      $props.gap,
      {
        'is-mobile': $props.mobile,
        'is-desktop': $props.desktop,
        'is-gapless': $props.gapless,
        'is-variable': $props.gap,
        'is-vcentered': $props.vcentered,
        'is-multiline': $props.multiline,
        'is-centered': $props.hcentered,
      }
    ]]
    }, [
      renderSlot(_ctx.$slots, "default")
    ], 2))
  }

  script$s$1.render = render$s$1;

  var script$v = {
    name: 'VMenu',
    props: {
      // accordion: Boolean, // TODO
      // activable: Boolean // TODO
    },
  };

  const _hoisted_1$i$1 = { class: "menu" };

  function render$v(_ctx, _cache, $props, $setup, $data, $options) {
    return (openBlock(), createBlock("div", _hoisted_1$i$1, [
      renderSlot(_ctx.$slots, "default")
    ]))
  }

  script$v.render = render$v;

  var script$w = {
    name: 'VMenuItem',
    inheritAttrs: false,
    props: {
      label: String,
      active: Boolean,
      expanded: Boolean,
      disabled: Boolean,
      icon: String,
      tag: {
        type: String,
        default: 'a'
      },
      ariaRole: String
    },
    emits: ['update:expanded', 'update:active'],
    setup(props, { emit }) {
      const newActive = ref(props.active);
      const newExpanded = ref(props.expanded);
      const content = ref(null);

      watchEffect(() => {
        newActive.value = props.active;
      });

      watchEffect(() => {
        newExpanded.value = props.expanded;
      });

      const onClick = () => {
        // TODO Disable previous active item
        if (props.disabled) return

        newExpanded.value = !newExpanded.value;
        emit('update:expanded', newActive.value);
        emit('update:active', newActive.value );
        // newActive.value = true
      };

      return { newActive, newExpanded, onClick, content }
    }
  };

  const _hoisted_1$j$1 = {
    key: 0,
    class: "pr-2"
  };
  const _hoisted_2$5$1 = { key: 1 };
  const _hoisted_3$4$1 = { key: 0 };

  function render$w(_ctx, _cache, $props, $setup, $data, $options) {
    return (openBlock(), createBlock("li", {
      role: $props.ariaRole,
      ref: "content"
    }, [
      (openBlock(), createBlock(resolveDynamicComponent($props.tag), mergeProps(_ctx.$attrs, {
        class: {
          'is-flex': $props.icon,
          'is-active': $setup.newActive,
          'is-disabled': $props.disabled
        },
        onClick: _cache[1] || (_cache[1] = $event => ($setup.onClick($event)))
      }), {
        default: withCtx(() => [
          ($props.icon)
            ? (openBlock(), createBlock("span", _hoisted_1$j$1, toDisplayString($props.icon), 1))
            : createCommentVNode("", true),
          ($props.label)
            ? (openBlock(), createBlock("span", _hoisted_2$5$1, toDisplayString($props.label), 1))
            : renderSlot(_ctx.$slots, "label", {
                key: 2,
                expanded: $setup.newExpanded,
                active: $setup.newActive
              })
        ]),
        _: 1
      }, 16, ["class"])),
      (_ctx.$slots.default)
        ? withDirectives((openBlock(), createBlock("ul", _hoisted_3$4$1, [
            renderSlot(_ctx.$slots, "default")
          ], 512)), [
            [vShow, $setup.newExpanded]
          ])
        : createCommentVNode("", true)
    ], 8, ["role"]))
  }

  script$w.render = render$w;

  var script$x = {
    name: 'VMenuList',
    props: {
      label: String,
      ariaRole: String
    }
  };

  const _hoisted_1$k$1 = {
    key: 0,
    class: "menu-label"
  };

  function render$x(_ctx, _cache, $props, $setup, $data, $options) {
    return (openBlock(), createBlock(Fragment, null, [
      ($props.label)
        ? (openBlock(), createBlock("p", _hoisted_1$k$1, toDisplayString($props.label), 1))
        : createCommentVNode("", true),
      createVNode("ul", {
        class: "menu-list",
        role: $props.ariaRole
      }, [
        renderSlot(_ctx.$slots, "default")
      ], 8, ["role"])
    ], 64 /* STABLE_FRAGMENT */))
  }

  script$x.render = render$x;

  var script$t = {
    name: "App",
    components: { VColumns: script$s$1, VColumn: script$r$1, VMenu: script$v, VMenuList: script$x, VMenuItem: script$w },
    setup() {
      const router = useRouter();
      return {
        redirect: (to) => router.push(to),
      };
    },
  };

  const _hoisted_1$k = { class: "container my-6" };
  const _hoisted_2$c = /*#__PURE__*/createBaseVNode("div", { style: {"border-bottom":"solid 1px #eee"} }, null, -1 /* HOISTED */);

  function render$t(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_v_menu_item = resolveComponent("v-menu-item");
    const _component_v_menu_list = resolveComponent("v-menu-list");
    const _component_v_menu = resolveComponent("v-menu");
    const _component_v_column = resolveComponent("v-column");
    const _component_router_view = resolveComponent("router-view");
    const _component_v_columns = resolveComponent("v-columns");

    return (openBlock(), createElementBlock("div", _hoisted_1$k, [
      createVNode(_component_v_columns, null, {
        default: withCtx(() => [
          createVNode(_component_v_column, { size: "is-2" }, {
            default: withCtx(() => [
              createVNode(_component_v_menu, null, {
                default: withCtx(() => [
                  createVNode(_component_v_menu_list, { label: "Appstate Benchmark" }, {
                    default: withCtx(() => [
                      createVNode(_component_v_menu_item, {
                        label: "Introduction",
                        onClick: _cache[0] || (_cache[0] = $event => ($setup.redirect('/hello')))
                      }),
                      createVNode(_component_v_menu_item, {
                        label: "Appstate",
                        onClick: _cache[1] || (_cache[1] = $event => ($setup.redirect('/appstate')))
                      }),
                      createVNode(_component_v_menu_item, {
                        label: "Composition API",
                        onClick: _cache[2] || (_cache[2] = $event => ($setup.redirect('/composition-api')))
                      }),
                      createVNode(_component_v_menu_item, {
                        label: "Vuex",
                        onClick: _cache[3] || (_cache[3] = $event => ($setup.redirect('/vuex')))
                      }),
                      createVNode(_component_v_menu_item, {
                        label: "Pinia",
                        onClick: _cache[4] || (_cache[4] = $event => ($setup.redirect('/pinia')))
                      }),
                      _hoisted_2$c,
                      createVNode(_component_v_menu_item, {
                        label: "Appstate LargeState",
                        onClick: _cache[5] || (_cache[5] = $event => ($setup.redirect('/appstate-large')))
                      }),
                      createVNode(_component_v_menu_item, {
                        label: "Composition API LargeState",
                        onClick: _cache[6] || (_cache[6] = $event => ($setup.redirect('/composition-api-large')))
                      }),
                      createVNode(_component_v_menu_item, {
                        label: "Vuex Large",
                        onClick: _cache[7] || (_cache[7] = $event => ($setup.redirect('/vuex-large')))
                      }),
                      createVNode(_component_v_menu_item, {
                        label: "Pinia Large",
                        onClick: _cache[8] || (_cache[8] = $event => ($setup.redirect('/pinia-large')))
                      })
                    ]),
                    _: 1 /* STABLE */
                  })
                ]),
                _: 1 /* STABLE */
              })
            ]),
            _: 1 /* STABLE */
          }),
          createVNode(_component_v_column, null, {
            default: withCtx(() => [
              createVNode(_component_router_view)
            ]),
            _: 1 /* STABLE */
          })
        ]),
        _: 1 /* STABLE */
      })
    ]))
  }

  script$t.render = render$t;

  const _hoisted_1$j = /*#__PURE__*/createStaticVNode("<h1 class=\"title is-1\">Hi</h1><p> These benchmarks have ben configured to randomly update cells in a matrix of size 50x50 every 10ms for 20 seconds </p><br><p>Metrics</p><ul><li><strong>TOTAL_SUM</strong>: global sum, incremented on very cell update </li><li><strong>CELL_UPDATES</strong>: amount of cells that have been updated </li><li><strong>AVERAGE_UPDATE_RATE</strong>: elapsed time divided by the amount of updates </li></ul>", 5);

  function render$s(_ctx, _cache) {
    return (openBlock(), createElementBlock("div", null, [
      _hoisted_1$j,
      createCommentVNode(" <br />\n    <p>\n        Everytime a cell is updated +1 is added to metric <strong>total matrix updates</strong>\n        <br />\n        Everytime a cell is updated a global sum accumulator is updated <i>acc += change</i>\n    </p> ")
    ]))
  }

  const script$s = {};



  script$s.render = render$s;

  /*!
   * vuex v4.1.0
   * (c) 2022 Evan You
   * @license MIT
   */

  var storeKey = 'store';

  function useStore$2 (key) {
    if ( key === void 0 ) key = null;

    return inject(key !== null ? key : storeKey)
  }

  /**
   * forEach for object
   */
  function forEachValue (obj, fn) {
    Object.keys(obj).forEach(function (key) { return fn(obj[key], key); });
  }

  function isObject (obj) {
    return obj !== null && typeof obj === 'object'
  }

  function isPromise (val) {
    return val && typeof val.then === 'function'
  }

  function assert (condition, msg) {
    if (!condition) { throw new Error(("[vuex] " + msg)) }
  }

  function partial (fn, arg) {
    return function () {
      return fn(arg)
    }
  }

  function genericSubscribe (fn, subs, options) {
    if (subs.indexOf(fn) < 0) {
      options && options.prepend
        ? subs.unshift(fn)
        : subs.push(fn);
    }
    return function () {
      var i = subs.indexOf(fn);
      if (i > -1) {
        subs.splice(i, 1);
      }
    }
  }

  function resetStore (store, hot) {
    store._actions = Object.create(null);
    store._mutations = Object.create(null);
    store._wrappedGetters = Object.create(null);
    store._modulesNamespaceMap = Object.create(null);
    var state = store.state;
    // init all modules
    installModule(store, state, [], store._modules.root, true);
    // reset state
    resetStoreState(store, state, hot);
  }

  function resetStoreState (store, state, hot) {
    var oldState = store._state;
    var oldScope = store._scope;

    // bind store public getters
    store.getters = {};
    // reset local getters cache
    store._makeLocalGettersCache = Object.create(null);
    var wrappedGetters = store._wrappedGetters;
    var computedObj = {};
    var computedCache = {};

    // create a new effect scope and create computed object inside it to avoid
    // getters (computed) getting destroyed on component unmount.
    var scope = effectScope(true);

    scope.run(function () {
      forEachValue(wrappedGetters, function (fn, key) {
        // use computed to leverage its lazy-caching mechanism
        // direct inline function use will lead to closure preserving oldState.
        // using partial to return function with only arguments preserved in closure environment.
        computedObj[key] = partial(fn, store);
        computedCache[key] = computed(function () { return computedObj[key](); });
        Object.defineProperty(store.getters, key, {
          get: function () { return computedCache[key].value; },
          enumerable: true // for local getters
        });
      });
    });

    store._state = reactive({
      data: state
    });

    // register the newly created effect scope to the store so that we can
    // dispose the effects when this method runs again in the future.
    store._scope = scope;

    // enable strict mode for new state
    if (store.strict) {
      enableStrictMode(store);
    }

    if (oldState) {
      if (hot) {
        // dispatch changes in all subscribed watchers
        // to force getter re-evaluation for hot reloading.
        store._withCommit(function () {
          oldState.data = null;
        });
      }
    }

    // dispose previously registered effect scope if there is one.
    if (oldScope) {
      oldScope.stop();
    }
  }

  function installModule (store, rootState, path, module, hot) {
    var isRoot = !path.length;
    var namespace = store._modules.getNamespace(path);

    // register in namespace map
    if (module.namespaced) {
      if (store._modulesNamespaceMap[namespace] && ("development" !== 'production')) {
        console.error(("[vuex] duplicate namespace " + namespace + " for the namespaced module " + (path.join('/'))));
      }
      store._modulesNamespaceMap[namespace] = module;
    }

    // set state
    if (!isRoot && !hot) {
      var parentState = getNestedState(rootState, path.slice(0, -1));
      var moduleName = path[path.length - 1];
      store._withCommit(function () {
        {
          if (moduleName in parentState) {
            console.warn(
              ("[vuex] state field \"" + moduleName + "\" was overridden by a module with the same name at \"" + (path.join('.')) + "\"")
            );
          }
        }
        parentState[moduleName] = module.state;
      });
    }

    var local = module.context = makeLocalContext(store, namespace, path);

    module.forEachMutation(function (mutation, key) {
      var namespacedType = namespace + key;
      registerMutation(store, namespacedType, mutation, local);
    });

    module.forEachAction(function (action, key) {
      var type = action.root ? key : namespace + key;
      var handler = action.handler || action;
      registerAction(store, type, handler, local);
    });

    module.forEachGetter(function (getter, key) {
      var namespacedType = namespace + key;
      registerGetter(store, namespacedType, getter, local);
    });

    module.forEachChild(function (child, key) {
      installModule(store, rootState, path.concat(key), child, hot);
    });
  }

  /**
   * make localized dispatch, commit, getters and state
   * if there is no namespace, just use root ones
   */
  function makeLocalContext (store, namespace, path) {
    var noNamespace = namespace === '';

    var local = {
      dispatch: noNamespace ? store.dispatch : function (_type, _payload, _options) {
        var args = unifyObjectStyle(_type, _payload, _options);
        var payload = args.payload;
        var options = args.options;
        var type = args.type;

        if (!options || !options.root) {
          type = namespace + type;
          if (!store._actions[type]) {
            console.error(("[vuex] unknown local action type: " + (args.type) + ", global type: " + type));
            return
          }
        }

        return store.dispatch(type, payload)
      },

      commit: noNamespace ? store.commit : function (_type, _payload, _options) {
        var args = unifyObjectStyle(_type, _payload, _options);
        var payload = args.payload;
        var options = args.options;
        var type = args.type;

        if (!options || !options.root) {
          type = namespace + type;
          if (!store._mutations[type]) {
            console.error(("[vuex] unknown local mutation type: " + (args.type) + ", global type: " + type));
            return
          }
        }

        store.commit(type, payload, options);
      }
    };

    // getters and state object must be gotten lazily
    // because they will be changed by state update
    Object.defineProperties(local, {
      getters: {
        get: noNamespace
          ? function () { return store.getters; }
          : function () { return makeLocalGetters(store, namespace); }
      },
      state: {
        get: function () { return getNestedState(store.state, path); }
      }
    });

    return local
  }

  function makeLocalGetters (store, namespace) {
    if (!store._makeLocalGettersCache[namespace]) {
      var gettersProxy = {};
      var splitPos = namespace.length;
      Object.keys(store.getters).forEach(function (type) {
        // skip if the target getter is not match this namespace
        if (type.slice(0, splitPos) !== namespace) { return }

        // extract local getter type
        var localType = type.slice(splitPos);

        // Add a port to the getters proxy.
        // Define as getter property because
        // we do not want to evaluate the getters in this time.
        Object.defineProperty(gettersProxy, localType, {
          get: function () { return store.getters[type]; },
          enumerable: true
        });
      });
      store._makeLocalGettersCache[namespace] = gettersProxy;
    }

    return store._makeLocalGettersCache[namespace]
  }

  function registerMutation (store, type, handler, local) {
    var entry = store._mutations[type] || (store._mutations[type] = []);
    entry.push(function wrappedMutationHandler (payload) {
      handler.call(store, local.state, payload);
    });
  }

  function registerAction (store, type, handler, local) {
    var entry = store._actions[type] || (store._actions[type] = []);
    entry.push(function wrappedActionHandler (payload) {
      var res = handler.call(store, {
        dispatch: local.dispatch,
        commit: local.commit,
        getters: local.getters,
        state: local.state,
        rootGetters: store.getters,
        rootState: store.state
      }, payload);
      if (!isPromise(res)) {
        res = Promise.resolve(res);
      }
      if (store._devtoolHook) {
        return res.catch(function (err) {
          store._devtoolHook.emit('vuex:error', err);
          throw err
        })
      } else {
        return res
      }
    });
  }

  function registerGetter (store, type, rawGetter, local) {
    if (store._wrappedGetters[type]) {
      {
        console.error(("[vuex] duplicate getter key: " + type));
      }
      return
    }
    store._wrappedGetters[type] = function wrappedGetter (store) {
      return rawGetter(
        local.state, // local state
        local.getters, // local getters
        store.state, // root state
        store.getters // root getters
      )
    };
  }

  function enableStrictMode (store) {
    watch(function () { return store._state.data; }, function () {
      {
        assert(store._committing, "do not mutate vuex store state outside mutation handlers.");
      }
    }, { deep: true, flush: 'sync' });
  }

  function getNestedState (state, path) {
    return path.reduce(function (state, key) { return state[key]; }, state)
  }

  function unifyObjectStyle (type, payload, options) {
    if (isObject(type) && type.type) {
      options = payload;
      payload = type;
      type = type.type;
    }

    {
      assert(typeof type === 'string', ("expects string as the type, but found " + (typeof type) + "."));
    }

    return { type: type, payload: payload, options: options }
  }

  var LABEL_VUEX_BINDINGS = 'vuex bindings';
  var MUTATIONS_LAYER_ID = 'vuex:mutations';
  var ACTIONS_LAYER_ID = 'vuex:actions';
  var INSPECTOR_ID = 'vuex';

  var actionId = 0;

  function addDevtools (app, store) {
    setupDevtoolsPlugin(
      {
        id: 'org.vuejs.vuex',
        app: app,
        label: 'Vuex',
        homepage: 'https://next.vuex.vuejs.org/',
        logo: 'https://vuejs.org/images/icons/favicon-96x96.png',
        packageName: 'vuex',
        componentStateTypes: [LABEL_VUEX_BINDINGS]
      },
      function (api) {
        api.addTimelineLayer({
          id: MUTATIONS_LAYER_ID,
          label: 'Vuex Mutations',
          color: COLOR_LIME_500
        });

        api.addTimelineLayer({
          id: ACTIONS_LAYER_ID,
          label: 'Vuex Actions',
          color: COLOR_LIME_500
        });

        api.addInspector({
          id: INSPECTOR_ID,
          label: 'Vuex',
          icon: 'storage',
          treeFilterPlaceholder: 'Filter stores...'
        });

        api.on.getInspectorTree(function (payload) {
          if (payload.app === app && payload.inspectorId === INSPECTOR_ID) {
            if (payload.filter) {
              var nodes = [];
              flattenStoreForInspectorTree(nodes, store._modules.root, payload.filter, '');
              payload.rootNodes = nodes;
            } else {
              payload.rootNodes = [
                formatStoreForInspectorTree(store._modules.root, '')
              ];
            }
          }
        });

        api.on.getInspectorState(function (payload) {
          if (payload.app === app && payload.inspectorId === INSPECTOR_ID) {
            var modulePath = payload.nodeId;
            makeLocalGetters(store, modulePath);
            payload.state = formatStoreForInspectorState(
              getStoreModule(store._modules, modulePath),
              modulePath === 'root' ? store.getters : store._makeLocalGettersCache,
              modulePath
            );
          }
        });

        api.on.editInspectorState(function (payload) {
          if (payload.app === app && payload.inspectorId === INSPECTOR_ID) {
            var modulePath = payload.nodeId;
            var path = payload.path;
            if (modulePath !== 'root') {
              path = modulePath.split('/').filter(Boolean).concat( path);
            }
            store._withCommit(function () {
              payload.set(store._state.data, path, payload.state.value);
            });
          }
        });

        store.subscribe(function (mutation, state) {
          var data = {};

          if (mutation.payload) {
            data.payload = mutation.payload;
          }

          data.state = state;

          api.notifyComponentUpdate();
          api.sendInspectorTree(INSPECTOR_ID);
          api.sendInspectorState(INSPECTOR_ID);

          api.addTimelineEvent({
            layerId: MUTATIONS_LAYER_ID,
            event: {
              time: Date.now(),
              title: mutation.type,
              data: data
            }
          });
        });

        store.subscribeAction({
          before: function (action, state) {
            var data = {};
            if (action.payload) {
              data.payload = action.payload;
            }
            action._id = actionId++;
            action._time = Date.now();
            data.state = state;

            api.addTimelineEvent({
              layerId: ACTIONS_LAYER_ID,
              event: {
                time: action._time,
                title: action.type,
                groupId: action._id,
                subtitle: 'start',
                data: data
              }
            });
          },
          after: function (action, state) {
            var data = {};
            var duration = Date.now() - action._time;
            data.duration = {
              _custom: {
                type: 'duration',
                display: (duration + "ms"),
                tooltip: 'Action duration',
                value: duration
              }
            };
            if (action.payload) {
              data.payload = action.payload;
            }
            data.state = state;

            api.addTimelineEvent({
              layerId: ACTIONS_LAYER_ID,
              event: {
                time: Date.now(),
                title: action.type,
                groupId: action._id,
                subtitle: 'end',
                data: data
              }
            });
          }
        });
      }
    );
  }

  // extracted from tailwind palette
  var COLOR_LIME_500 = 0x84cc16;
  var COLOR_DARK = 0x666666;
  var COLOR_WHITE = 0xffffff;

  var TAG_NAMESPACED = {
    label: 'namespaced',
    textColor: COLOR_WHITE,
    backgroundColor: COLOR_DARK
  };

  /**
   * @param {string} path
   */
  function extractNameFromPath (path) {
    return path && path !== 'root' ? path.split('/').slice(-2, -1)[0] : 'Root'
  }

  /**
   * @param {*} module
   * @return {import('@vue/devtools-api').CustomInspectorNode}
   */
  function formatStoreForInspectorTree (module, path) {
    return {
      id: path || 'root',
      // all modules end with a `/`, we want the last segment only
      // cart/ -> cart
      // nested/cart/ -> cart
      label: extractNameFromPath(path),
      tags: module.namespaced ? [TAG_NAMESPACED] : [],
      children: Object.keys(module._children).map(function (moduleName) { return formatStoreForInspectorTree(
          module._children[moduleName],
          path + moduleName + '/'
        ); }
      )
    }
  }

  /**
   * @param {import('@vue/devtools-api').CustomInspectorNode[]} result
   * @param {*} module
   * @param {string} filter
   * @param {string} path
   */
  function flattenStoreForInspectorTree (result, module, filter, path) {
    if (path.includes(filter)) {
      result.push({
        id: path || 'root',
        label: path.endsWith('/') ? path.slice(0, path.length - 1) : path || 'Root',
        tags: module.namespaced ? [TAG_NAMESPACED] : []
      });
    }
    Object.keys(module._children).forEach(function (moduleName) {
      flattenStoreForInspectorTree(result, module._children[moduleName], filter, path + moduleName + '/');
    });
  }

  /**
   * @param {*} module
   * @return {import('@vue/devtools-api').CustomInspectorState}
   */
  function formatStoreForInspectorState (module, getters, path) {
    getters = path === 'root' ? getters : getters[path];
    var gettersKeys = Object.keys(getters);
    var storeState = {
      state: Object.keys(module.state).map(function (key) { return ({
        key: key,
        editable: true,
        value: module.state[key]
      }); })
    };

    if (gettersKeys.length) {
      var tree = transformPathsToObjectTree(getters);
      storeState.getters = Object.keys(tree).map(function (key) { return ({
        key: key.endsWith('/') ? extractNameFromPath(key) : key,
        editable: false,
        value: canThrow(function () { return tree[key]; })
      }); });
    }

    return storeState
  }

  function transformPathsToObjectTree (getters) {
    var result = {};
    Object.keys(getters).forEach(function (key) {
      var path = key.split('/');
      if (path.length > 1) {
        var target = result;
        var leafKey = path.pop();
        path.forEach(function (p) {
          if (!target[p]) {
            target[p] = {
              _custom: {
                value: {},
                display: p,
                tooltip: 'Module',
                abstract: true
              }
            };
          }
          target = target[p]._custom.value;
        });
        target[leafKey] = canThrow(function () { return getters[key]; });
      } else {
        result[key] = canThrow(function () { return getters[key]; });
      }
    });
    return result
  }

  function getStoreModule (moduleMap, path) {
    var names = path.split('/').filter(function (n) { return n; });
    return names.reduce(
      function (module, moduleName, i) {
        var child = module[moduleName];
        if (!child) {
          throw new Error(("Missing module \"" + moduleName + "\" for path \"" + path + "\"."))
        }
        return i === names.length - 1 ? child : child._children
      },
      path === 'root' ? moduleMap : moduleMap.root._children
    )
  }

  function canThrow (cb) {
    try {
      return cb()
    } catch (e) {
      return e
    }
  }

  // Base data struct for store's module, package with some attribute and method
  var Module = function Module (rawModule, runtime) {
    this.runtime = runtime;
    // Store some children item
    this._children = Object.create(null);
    // Store the origin module object which passed by programmer
    this._rawModule = rawModule;
    var rawState = rawModule.state;

    // Store the origin module's state
    this.state = (typeof rawState === 'function' ? rawState() : rawState) || {};
  };

  var prototypeAccessors$1 = { namespaced: { configurable: true } };

  prototypeAccessors$1.namespaced.get = function () {
    return !!this._rawModule.namespaced
  };

  Module.prototype.addChild = function addChild (key, module) {
    this._children[key] = module;
  };

  Module.prototype.removeChild = function removeChild (key) {
    delete this._children[key];
  };

  Module.prototype.getChild = function getChild (key) {
    return this._children[key]
  };

  Module.prototype.hasChild = function hasChild (key) {
    return key in this._children
  };

  Module.prototype.update = function update (rawModule) {
    this._rawModule.namespaced = rawModule.namespaced;
    if (rawModule.actions) {
      this._rawModule.actions = rawModule.actions;
    }
    if (rawModule.mutations) {
      this._rawModule.mutations = rawModule.mutations;
    }
    if (rawModule.getters) {
      this._rawModule.getters = rawModule.getters;
    }
  };

  Module.prototype.forEachChild = function forEachChild (fn) {
    forEachValue(this._children, fn);
  };

  Module.prototype.forEachGetter = function forEachGetter (fn) {
    if (this._rawModule.getters) {
      forEachValue(this._rawModule.getters, fn);
    }
  };

  Module.prototype.forEachAction = function forEachAction (fn) {
    if (this._rawModule.actions) {
      forEachValue(this._rawModule.actions, fn);
    }
  };

  Module.prototype.forEachMutation = function forEachMutation (fn) {
    if (this._rawModule.mutations) {
      forEachValue(this._rawModule.mutations, fn);
    }
  };

  Object.defineProperties( Module.prototype, prototypeAccessors$1 );

  var ModuleCollection = function ModuleCollection (rawRootModule) {
    // register root module (Vuex.Store options)
    this.register([], rawRootModule, false);
  };

  ModuleCollection.prototype.get = function get (path) {
    return path.reduce(function (module, key) {
      return module.getChild(key)
    }, this.root)
  };

  ModuleCollection.prototype.getNamespace = function getNamespace (path) {
    var module = this.root;
    return path.reduce(function (namespace, key) {
      module = module.getChild(key);
      return namespace + (module.namespaced ? key + '/' : '')
    }, '')
  };

  ModuleCollection.prototype.update = function update$1 (rawRootModule) {
    update([], this.root, rawRootModule);
  };

  ModuleCollection.prototype.register = function register (path, rawModule, runtime) {
      var this$1$1 = this;
      if ( runtime === void 0 ) runtime = true;

    {
      assertRawModule(path, rawModule);
    }

    var newModule = new Module(rawModule, runtime);
    if (path.length === 0) {
      this.root = newModule;
    } else {
      var parent = this.get(path.slice(0, -1));
      parent.addChild(path[path.length - 1], newModule);
    }

    // register nested modules
    if (rawModule.modules) {
      forEachValue(rawModule.modules, function (rawChildModule, key) {
        this$1$1.register(path.concat(key), rawChildModule, runtime);
      });
    }
  };

  ModuleCollection.prototype.unregister = function unregister (path) {
    var parent = this.get(path.slice(0, -1));
    var key = path[path.length - 1];
    var child = parent.getChild(key);

    if (!child) {
      {
        console.warn(
          "[vuex] trying to unregister module '" + key + "', which is " +
          "not registered"
        );
      }
      return
    }

    if (!child.runtime) {
      return
    }

    parent.removeChild(key);
  };

  ModuleCollection.prototype.isRegistered = function isRegistered (path) {
    var parent = this.get(path.slice(0, -1));
    var key = path[path.length - 1];

    if (parent) {
      return parent.hasChild(key)
    }

    return false
  };

  function update (path, targetModule, newModule) {
    {
      assertRawModule(path, newModule);
    }

    // update target module
    targetModule.update(newModule);

    // update nested modules
    if (newModule.modules) {
      for (var key in newModule.modules) {
        if (!targetModule.getChild(key)) {
          {
            console.warn(
              "[vuex] trying to add a new module '" + key + "' on hot reloading, " +
              'manual reload is needed'
            );
          }
          return
        }
        update(
          path.concat(key),
          targetModule.getChild(key),
          newModule.modules[key]
        );
      }
    }
  }

  var functionAssert = {
    assert: function (value) { return typeof value === 'function'; },
    expected: 'function'
  };

  var objectAssert = {
    assert: function (value) { return typeof value === 'function' ||
      (typeof value === 'object' && typeof value.handler === 'function'); },
    expected: 'function or object with "handler" function'
  };

  var assertTypes = {
    getters: functionAssert,
    mutations: functionAssert,
    actions: objectAssert
  };

  function assertRawModule (path, rawModule) {
    Object.keys(assertTypes).forEach(function (key) {
      if (!rawModule[key]) { return }

      var assertOptions = assertTypes[key];

      forEachValue(rawModule[key], function (value, type) {
        assert(
          assertOptions.assert(value),
          makeAssertionMessage(path, key, type, value, assertOptions.expected)
        );
      });
    });
  }

  function makeAssertionMessage (path, key, type, value, expected) {
    var buf = key + " should be " + expected + " but \"" + key + "." + type + "\"";
    if (path.length > 0) {
      buf += " in module \"" + (path.join('.')) + "\"";
    }
    buf += " is " + (JSON.stringify(value)) + ".";
    return buf
  }

  function createStore (options) {
    return new Store(options)
  }

  var Store = function Store (options) {
    var this$1$1 = this;
    if ( options === void 0 ) options = {};

    {
      assert(typeof Promise !== 'undefined', "vuex requires a Promise polyfill in this browser.");
      assert(this instanceof Store, "store must be called with the new operator.");
    }

    var plugins = options.plugins; if ( plugins === void 0 ) plugins = [];
    var strict = options.strict; if ( strict === void 0 ) strict = false;
    var devtools = options.devtools;

    // store internal state
    this._committing = false;
    this._actions = Object.create(null);
    this._actionSubscribers = [];
    this._mutations = Object.create(null);
    this._wrappedGetters = Object.create(null);
    this._modules = new ModuleCollection(options);
    this._modulesNamespaceMap = Object.create(null);
    this._subscribers = [];
    this._makeLocalGettersCache = Object.create(null);

    // EffectScope instance. when registering new getters, we wrap them inside
    // EffectScope so that getters (computed) would not be destroyed on
    // component unmount.
    this._scope = null;

    this._devtools = devtools;

    // bind commit and dispatch to self
    var store = this;
    var ref = this;
    var dispatch = ref.dispatch;
    var commit = ref.commit;
    this.dispatch = function boundDispatch (type, payload) {
      return dispatch.call(store, type, payload)
    };
    this.commit = function boundCommit (type, payload, options) {
      return commit.call(store, type, payload, options)
    };

    // strict mode
    this.strict = strict;

    var state = this._modules.root.state;

    // init root module.
    // this also recursively registers all sub-modules
    // and collects all module getters inside this._wrappedGetters
    installModule(this, state, [], this._modules.root);

    // initialize the store state, which is responsible for the reactivity
    // (also registers _wrappedGetters as computed properties)
    resetStoreState(this, state);

    // apply plugins
    plugins.forEach(function (plugin) { return plugin(this$1$1); });
  };

  var prototypeAccessors = { state: { configurable: true } };

  Store.prototype.install = function install (app, injectKey) {
    app.provide(injectKey || storeKey, this);
    app.config.globalProperties.$store = this;

    var useDevtools = this._devtools !== undefined
      ? this._devtools
      : ("development" !== 'production') ;

    if (useDevtools) {
      addDevtools(app, this);
    }
  };

  prototypeAccessors.state.get = function () {
    return this._state.data
  };

  prototypeAccessors.state.set = function (v) {
    {
      assert(false, "use store.replaceState() to explicit replace store state.");
    }
  };

  Store.prototype.commit = function commit (_type, _payload, _options) {
      var this$1$1 = this;

    // check object-style commit
    var ref = unifyObjectStyle(_type, _payload, _options);
      var type = ref.type;
      var payload = ref.payload;
      var options = ref.options;

    var mutation = { type: type, payload: payload };
    var entry = this._mutations[type];
    if (!entry) {
      {
        console.error(("[vuex] unknown mutation type: " + type));
      }
      return
    }
    this._withCommit(function () {
      entry.forEach(function commitIterator (handler) {
        handler(payload);
      });
    });

    this._subscribers
      .slice() // shallow copy to prevent iterator invalidation if subscriber synchronously calls unsubscribe
      .forEach(function (sub) { return sub(mutation, this$1$1.state); });

    if (
      options && options.silent
    ) {
      console.warn(
        "[vuex] mutation type: " + type + ". Silent option has been removed. " +
        'Use the filter functionality in the vue-devtools'
      );
    }
  };

  Store.prototype.dispatch = function dispatch (_type, _payload) {
      var this$1$1 = this;

    // check object-style dispatch
    var ref = unifyObjectStyle(_type, _payload);
      var type = ref.type;
      var payload = ref.payload;

    var action = { type: type, payload: payload };
    var entry = this._actions[type];
    if (!entry) {
      {
        console.error(("[vuex] unknown action type: " + type));
      }
      return
    }

    try {
      this._actionSubscribers
        .slice() // shallow copy to prevent iterator invalidation if subscriber synchronously calls unsubscribe
        .filter(function (sub) { return sub.before; })
        .forEach(function (sub) { return sub.before(action, this$1$1.state); });
    } catch (e) {
      {
        console.warn("[vuex] error in before action subscribers: ");
        console.error(e);
      }
    }

    var result = entry.length > 1
      ? Promise.all(entry.map(function (handler) { return handler(payload); }))
      : entry[0](payload);

    return new Promise(function (resolve, reject) {
      result.then(function (res) {
        try {
          this$1$1._actionSubscribers
            .filter(function (sub) { return sub.after; })
            .forEach(function (sub) { return sub.after(action, this$1$1.state); });
        } catch (e) {
          {
            console.warn("[vuex] error in after action subscribers: ");
            console.error(e);
          }
        }
        resolve(res);
      }, function (error) {
        try {
          this$1$1._actionSubscribers
            .filter(function (sub) { return sub.error; })
            .forEach(function (sub) { return sub.error(action, this$1$1.state, error); });
        } catch (e) {
          {
            console.warn("[vuex] error in error action subscribers: ");
            console.error(e);
          }
        }
        reject(error);
      });
    })
  };

  Store.prototype.subscribe = function subscribe (fn, options) {
    return genericSubscribe(fn, this._subscribers, options)
  };

  Store.prototype.subscribeAction = function subscribeAction (fn, options) {
    var subs = typeof fn === 'function' ? { before: fn } : fn;
    return genericSubscribe(subs, this._actionSubscribers, options)
  };

  Store.prototype.watch = function watch$1 (getter, cb, options) {
      var this$1$1 = this;

    {
      assert(typeof getter === 'function', "store.watch only accepts a function.");
    }
    return watch(function () { return getter(this$1$1.state, this$1$1.getters); }, cb, Object.assign({}, options))
  };

  Store.prototype.replaceState = function replaceState (state) {
      var this$1$1 = this;

    this._withCommit(function () {
      this$1$1._state.data = state;
    });
  };

  Store.prototype.registerModule = function registerModule (path, rawModule, options) {
      if ( options === void 0 ) options = {};

    if (typeof path === 'string') { path = [path]; }

    {
      assert(Array.isArray(path), "module path must be a string or an Array.");
      assert(path.length > 0, 'cannot register the root module by using registerModule.');
    }

    this._modules.register(path, rawModule);
    installModule(this, this.state, path, this._modules.get(path), options.preserveState);
    // reset store to update getters...
    resetStoreState(this, this.state);
  };

  Store.prototype.unregisterModule = function unregisterModule (path) {
      var this$1$1 = this;

    if (typeof path === 'string') { path = [path]; }

    {
      assert(Array.isArray(path), "module path must be a string or an Array.");
    }

    this._modules.unregister(path);
    this._withCommit(function () {
      var parentState = getNestedState(this$1$1.state, path.slice(0, -1));
      delete parentState[path[path.length - 1]];
    });
    resetStore(this);
  };

  Store.prototype.hasModule = function hasModule (path) {
    if (typeof path === 'string') { path = [path]; }

    {
      assert(Array.isArray(path), "module path must be a string or an Array.");
    }

    return this._modules.isRegistered(path)
  };

  Store.prototype.hotUpdate = function hotUpdate (newOptions) {
    this._modules.update(newOptions);
    resetStore(this, true);
  };

  Store.prototype._withCommit = function _withCommit (fn) {
    var committing = this._committing;
    this._committing = true;
    fn();
    this._committing = committing;
  };

  Object.defineProperties( Store.prototype, prototypeAccessors );

  var script$r = {
    props: {
      state: Array,
      config: Object,
    },
    setup(props) {
      const store = useStore$2();
      const stats = computed(() => store.state.metrics);
      return { stats };
    },
  };

  const _hoisted_1$i = ["attr"];

  function render$r(_ctx, _cache, $props, $setup, $data, $options) {
    return (openBlock(), createElementBlock("div", { attr: _ctx.markUsed }, [
      createBaseVNode("p", null, [
        createBaseVNode("span", null, "TIME_ELAPSED: " + toDisplayString($setup.stats.elapsed) + "s", 1 /* TEXT */)
      ]),
      createBaseVNode("p", null, [
        createBaseVNode("span", null, "TOTAL_SUM: " + toDisplayString($setup.stats.totalSum), 1 /* TEXT */)
      ]),
      createBaseVNode("p", null, [
        createBaseVNode("span", null, "CELL_UPDATES " + toDisplayString($setup.stats.totalCalls), 1 /* TEXT */)
      ]),
      createBaseVNode("p", null, [
        createBaseVNode("span", null, "AVERAGE_UPDATE_RATE: " + toDisplayString($setup.stats.rate) + "cells/s", 1 /* TEXT */)
      ])
    ], 8 /* PROPS */, _hoisted_1$i))
  }

  script$r.render = render$r;

  function createCommonjsModule(fn, basedir, module) {
  	return module = {
  		path: basedir,
  		exports: {},
  		require: function (path, base) {
  			return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
  		}
  	}, fn(module, module.exports), module.exports;
  }

  function getAugmentedNamespace(n) {
  	if (n.__esModule) return n;
  	var a = Object.defineProperty({}, '__esModule', {value: true});
  	Object.keys(n).forEach(function (k) {
  		var d = Object.getOwnPropertyDescriptor(n, k);
  		Object.defineProperty(a, k, d.get ? d : {
  			enumerable: true,
  			get: function () {
  				return n[k];
  			}
  		});
  	});
  	return a;
  }

  function commonjsRequire () {
  	throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
  }

  var vue = /*@__PURE__*/getAugmentedNamespace(runtimeDom_esmBundler);

  var dist = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, '__esModule', { value: true });



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
              return useSubscribedStateMethods(parentMethods.state, parentMethods.path, parentMethods, parentMethods.onGetUsed)[self];
          }
          else {
              return useSubscribedStateMethods(parentMethods.state, parentMethods.path, parentMethods.state)[self];
          }
      }
      else {
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
              // should satisfy the invariants:
              // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/getPrototypeOf#Invariants
              var targetReal = targetGetter();
              if (targetReal === undefined || targetReal === null) {
                  return null;
              }
              return Object.getPrototypeOf(targetReal);
          },
          setPrototypeOf: function (target, v) {
              return onInvalidUsage(isValueProxy ?
                  ErrorId.SetPrototypeOf_State :
                  ErrorId.SetPrototypeOf_Value);
          },
          isExtensible: function (target) {
              // should satisfy the invariants:
              // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/isExtensible#Invariants
              return true; // required to satisfy the invariants of the getPrototypeOf
              // return Object.isExtensible(target);
          },
          preventExtensions: function (target) {
              return onInvalidUsage(isValueProxy ?
                  ErrorId.PreventExtensions_State :
                  ErrorId.PreventExtensions_Value);
          },
          getOwnPropertyDescriptor: function (target, p) {
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
              return propertyGetter(target, p);
          },
          set: function (target, p, v, r) {
              return propertySetter(target, p, v, r);
          },
          deleteProperty: function (target, p) {
              return onInvalidUsage(isValueProxy ?
                  ErrorId.DeleteProperty_State :
                  ErrorId.DeleteProperty_Value);
          },
          defineProperty: function (target, p, attributes) {
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
              return onInvalidUsage(isValueProxy ?
                  ErrorId.Apply_State :
                  ErrorId.Apply_Value);
          },
          construct: function (target, argArray, newTarget) {
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

  });

  var script$q = {
    props: {
      state: Number,
    },
    setup(props) {
      const statee = dist.useState(props.state);
      return {
        statee,
      };
    },
  };

  function render$q(_ctx, _cache, $props, $setup, $data, $options) {
    return (openBlock(), createElementBlock("td", null, toDisplayString($props.state.toString(16)), 1 /* TEXT */))
  }

  script$q.render = render$q;
  script$q.__scopeId = "data-v-3e8bbcf0";

  var script$p = {
    props: {
      state: Array,
    },
    components: {
      TableCell: script$q,
    },
    setup(props) {
      // const statee = useState(props.state);

      // return {
      //   statee,
      // };
    },
  };

  function render$p(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_table_cell = resolveComponent("table-cell");

    return (openBlock(), createElementBlock("tr", null, [
      (openBlock(true), createElementBlock(Fragment, null, renderList($props.state, (s, i) => {
        return (openBlock(), createBlock(_component_table_cell, {
          key: i,
          state: s
        }, null, 8 /* PROPS */, ["state"]))
      }), 128 /* KEYED_FRAGMENT */))
    ]))
  }

  script$p.render = render$p;
  script$p.__scopeId = "data-v-5b9d982b";

  var config = {
      totalRows: 50,
      totalColumns: 50,
      callsPerInterval: 50,
      interval: 10, // ms
      MAX_TIME: 20000, // ms
      largeTotalRows: 5000
    };

  const randomInt = (min, max) => {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min)) + min;
  };

  var script$o = {
    components: {
      TableRow: script$p,
      TableMeter: script$r,
    },

    setup() {
      const store = useStore$2();

      const data = computed(() => store.state.data);
      const running = computed(() => store.state.running);

      let timer;

      const start = () => {
        if (running.value) return;
        store.commit("clear");
        store.commit("start");

        timer = setInterval(() => {
          for (let i = 0; i < config.callsPerInterval; i += 1) {
            store.dispatch("increment", {
              row: randomInt(0, config.totalRows),
              column: randomInt(0, config.totalColumns),
              amount: randomInt(0, 5),
            });
          }
        }, config.interval);

        setTimeout(() => {
          clearInterval(timer);
          store.commit("stop");
        }, config.MAX_TIME);
      };

      onBeforeUnmount(() => {
        clearInterval(timer);
      });

      return {
        data,
        config,
        start,
        running,
      };
    },
  };

  const _hoisted_1$h = /*#__PURE__*/createBaseVNode("h1", { class: "title is-1" }, "Vuex Benchmark", -1 /* HOISTED */);
  const _hoisted_2$b = { class: "mb-4 table-container" };
  const _hoisted_3$7 = ["disabled"];

  function render$o(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_table_meter = resolveComponent("table-meter");
    const _component_table_row = resolveComponent("table-row");

    return (openBlock(), createElementBlock("div", null, [
      _hoisted_1$h,
      createVNode(_component_table_meter, {
        state: $setup.data,
        config: $setup.config,
        class: "mb-4"
      }, null, 8 /* PROPS */, ["state", "config"]),
      createBaseVNode("div", _hoisted_2$b, [
        createBaseVNode("table", null, [
          createBaseVNode("tbody", null, [
            (openBlock(true), createElementBlock(Fragment, null, renderList($setup.data, (s, i) => {
              return (openBlock(), createBlock(_component_table_row, {
                key: i,
                state: s
              }, null, 8 /* PROPS */, ["state"]))
            }), 128 /* KEYED_FRAGMENT */))
          ])
        ])
      ]),
      createBaseVNode("button", {
        class: "button is-info",
        onClick: _cache[0] || (_cache[0] = (...args) => ($setup.start && $setup.start(...args))),
        disabled: $setup.running
      }, " Start ", 8 /* PROPS */, _hoisted_3$7)
    ]))
  }

  script$o.render = render$o;

  var script$n = {
    __name: 'Dump',
    props: {
          state: {
              type: Array,
              default: []
          }
      },
    setup(__props, { expose: __expose }) {
    __expose();

  const props = __props;

      

      const time = dist.useState(0);
      time.set(new Date().toISOString());
      watch(() => props.state, (v) => {
          time.set(new Date().toISOString());
      });

  const __returned__ = { props, time, get useState() { return dist.useState }, watch };
  Object.defineProperty(__returned__, '__isScriptSetup', { enumerable: false, value: true });
  return __returned__
  }

  };

  const _hoisted_1$g = ["innerHTML"];

  function render$n(_ctx, _cache, $props, $setup, $data, $options) {
    return (openBlock(), createElementBlock("div", null, [
      createBaseVNode("div", null, "Last render at: " + toDisplayString($setup.time) + " (JSON dump of the first 10 fields) :", 1 /* TEXT */),
      createBaseVNode("div", {
        innerHTML: $setup.props.state.join('<br/>')
      }, null, 8 /* PROPS */, _hoisted_1$g)
    ]))
  }

  script$n.render = render$n;
  script$n.__scopeId = "data-v-4d31b7d2";

  var script$m = {
    __name: 'Row',
    props: {
      value: {
          type: String,
          default: ''
      },
      index: {
          type: Number,
          default: 0
      }
  },
    emits: ['change'],
    setup(__props, { expose: __expose, emit }) {
    __expose();

  const props = __props;




  const time = dist.useState(0);
  const onChange = (e) => {
      time.set(new Date().toISOString());
      emit('change', e.target.value, props.index);
  };
  onMounted(() => {
      time.set(new Date().toISOString());
  });

  const __returned__ = { props, emit, time, onChange, get useState() { return dist.useState }, onMounted };
  Object.defineProperty(__returned__, '__isScriptSetup', { enumerable: false, value: true });
  return __returned__
  }

  };

  const _withScopeId$3 = n => (pushScopeId("data-v-f7a6fa9c"),n=n(),popScopeId(),n);
  const _hoisted_1$f = { class: "large-row" };
  const _hoisted_2$a = /*#__PURE__*/ _withScopeId$3(() => /*#__PURE__*/createBaseVNode("label", null, "Last render at:", -1 /* HOISTED */));
  const _hoisted_3$6 = ["value"];

  function render$m(_ctx, _cache, $props, $setup, $data, $options) {
    return (openBlock(), createElementBlock("div", _hoisted_1$f, [
      _hoisted_2$a,
      createBaseVNode("span", null, toDisplayString($setup.time), 1 /* TEXT */),
      createBaseVNode("input", {
        value: $setup.props.value,
        onInput: $setup.onChange
      }, null, 40 /* PROPS, HYDRATE_EVENTS */, _hoisted_3$6)
    ]))
  }

  script$m.render = render$m;
  script$m.__scopeId = "data-v-f7a6fa9c";

  var script$l = {
    components: {
        row: script$m,
        Dump: script$n,
    },

    setup() {
        const store = useStore$2();
        console.log(store);
        const data = computed(() => store.state.largeData);
        const state = computed(() => store.getters.largeState);
        store.commit("largeIncrement", Array.from(Array(config.largeTotalRows).keys()).map((i) => `Field #${i + 1} value`));
      const changeRow = (v, i) => {
          store.commit("incrementRow", {
              i, v
          });
      };


      return {
        data,
          state,
        config,
          changeRow
      };
    },
  };

  const _hoisted_1$e = /*#__PURE__*/createBaseVNode("h1", { class: "title is-1" }, "Vuex Large state / Large forms Benchmark", -1 /* HOISTED */);
  const _hoisted_2$9 = { class: "mb-4 table-container" };

  function render$l(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_Dump = resolveComponent("Dump");
    const _component_row = resolveComponent("row");

    return (openBlock(), createElementBlock("div", null, [
      _hoisted_1$e,
      createVNode(_component_Dump, {
        state: $setup.state,
        class: "mb-4"
      }, null, 8 /* PROPS */, ["state"]),
      createBaseVNode("div", _hoisted_2$9, [
        (openBlock(true), createElementBlock(Fragment, null, renderList($setup.data, (s, i) => {
          return (openBlock(), createBlock(_component_row, {
            value: s,
            index: i,
            key: i,
            onChange: $setup.changeRow
          }, null, 8 /* PROPS */, ["value", "index", "onChange"]))
        }), 128 /* KEYED_FRAGMENT */))
      ]),
      createCommentVNode("    <button class=\"button is-info\" @click=\"start\" :disabled=\"running.get()\">"),
      createCommentVNode("      Start"),
      createCommentVNode("    </button>")
    ]))
  }

  script$l.render = render$l;

  const initial$2 = {
      data: Array.from(Array(50).keys()).map((i) =>
          Array.from(Array(50).keys()).map((j) => 0)
      ),
      running: false,
      startTime: new Date().getTime(),
      metrics: {
          totalSum: 0,
          totalCalls: 0,
          elapsed: 0,
          rate: 0,
      }
  };

  const useStore$1 = defineStore('store', {
      state: () => ({
          ...initial$2
      }),
      actions: {
          start() {
              this.running = true;
          },
          stop() {
              this.running = false;
          },
          incrementCell({ row, column, amount }) {
              this.data[row][column] += amount;
          },
          updateMetrics(metrics) {
              this.metrics = {...metrics};
          },
          clear() {
              this.data = initial$2.data;
              this.running = initial$2.running;
              this.metrics = initial$2.metrics;
              this.startTime = Date.now();
          },
          increment({ row, column, amount }) {
              this.incrementCell({ row, column, amount });
              const elapsedMs = Date.now() - this.startTime;
              this.updateMetrics({
                  totalSum: this.metrics.totalSum + amount,
                  totalCalls: this.metrics.totalCalls + 1,
                  elapsed: Math.floor(elapsedMs / 1000),
                  rate: Math.floor((this.metrics.totalCalls / elapsedMs) * 1000)
              });
          }
      }
  });

  var script$k = {
    props: {
      state: Array,
      config: Object,
    },
    setup(props) {
      const store = useStore$1();
      const stats = computed(() => store.metrics);
      return { stats };
    },
  };

  const _hoisted_1$d = ["attr"];

  function render$k(_ctx, _cache, $props, $setup, $data, $options) {
    return (openBlock(), createElementBlock("div", { attr: _ctx.markUsed }, [
      createBaseVNode("p", null, [
        createBaseVNode("span", null, "TIME_ELAPSED: " + toDisplayString($setup.stats.elapsed) + "s", 1 /* TEXT */)
      ]),
      createBaseVNode("p", null, [
        createBaseVNode("span", null, "TOTAL_SUM: " + toDisplayString($setup.stats.totalSum), 1 /* TEXT */)
      ]),
      createBaseVNode("p", null, [
        createBaseVNode("span", null, "CELL_UPDATES " + toDisplayString($setup.stats.totalCalls), 1 /* TEXT */)
      ]),
      createBaseVNode("p", null, [
        createBaseVNode("span", null, "AVERAGE_UPDATE_RATE: " + toDisplayString($setup.stats.rate) + "cells/s", 1 /* TEXT */)
      ])
    ], 8 /* PROPS */, _hoisted_1$d))
  }

  script$k.render = render$k;

  // import { useState } from "@pathscale/appstate-fast";

  var script$j = {
    props: {
      state: Number,
    },
    setup(props) {
      // const statee = useState(props.state);
      // return {
      //   statee,
      // };
    },
  };

  function render$j(_ctx, _cache, $props, $setup, $data, $options) {
    return (openBlock(), createElementBlock("td", null, toDisplayString($props.state.toString(16)), 1 /* TEXT */))
  }

  script$j.render = render$j;
  script$j.__scopeId = "data-v-929da8ed";

  var script$i = {
    props: {
      state: Array,
    },
    components: {
      TableCell: script$j,
    },
    setup(props) {
    },
  };

  function render$i(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_table_cell = resolveComponent("table-cell");

    return (openBlock(), createElementBlock("tr", null, [
      (openBlock(true), createElementBlock(Fragment, null, renderList($props.state, (s, i) => {
        return (openBlock(), createBlock(_component_table_cell, {
          key: i,
          state: s
        }, null, 8 /* PROPS */, ["state"]))
      }), 128 /* KEYED_FRAGMENT */))
    ]))
  }

  script$i.render = render$i;
  script$i.__scopeId = "data-v-732c2fba";

  var script$h = {
    components: {
      TableRow: script$i,
      TableMeter: script$k,
    },

    setup() {
      const store = useStore$1();

      const data = computed(() => store.data);
      const running = computed(() => store.running);

      const loop = () => {
          if (store.metrics.elapsed >= config.MAX_TIME/1000) {
              store.stop();
              return
          }
          for (let i = 0; i < config.callsPerInterval; i += 1) {
              store.increment({
                  row: randomInt(0, config.totalRows),
                  column: randomInt(0, config.totalColumns),
                  amount: randomInt(0, 5),
              });
          }
          window.requestAnimationFrame(loop);
      };

      const start = () => {
        if (running.value) return;
        store.clear();
        store.start();
        window.requestAnimationFrame(loop);
      };

      onBeforeUnmount(() => {
        clearInterval(timer);
      });

      return {
        data,
        config,
        start,
        running,
      };
    },
  };

  const _hoisted_1$c = /*#__PURE__*/createBaseVNode("h1", { class: "title is-1" }, "Pinia Benchmark", -1 /* HOISTED */);
  const _hoisted_2$8 = { class: "mb-4 table-container" };
  const _hoisted_3$5 = ["disabled"];

  function render$h(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_table_meter = resolveComponent("table-meter");
    const _component_table_row = resolveComponent("table-row");

    return (openBlock(), createElementBlock("div", null, [
      _hoisted_1$c,
      createVNode(_component_table_meter, {
        state: $setup.data,
        config: $setup.config,
        class: "mb-4"
      }, null, 8 /* PROPS */, ["state", "config"]),
      createBaseVNode("div", _hoisted_2$8, [
        createBaseVNode("table", null, [
          createBaseVNode("tbody", null, [
            (openBlock(true), createElementBlock(Fragment, null, renderList($setup.data, (s, i) => {
              return (openBlock(), createBlock(_component_table_row, {
                key: i,
                state: s
              }, null, 8 /* PROPS */, ["state"]))
            }), 128 /* KEYED_FRAGMENT */))
          ])
        ])
      ]),
      createBaseVNode("button", {
        class: "button is-info",
        onClick: _cache[0] || (_cache[0] = (...args) => ($setup.start && $setup.start(...args))),
        disabled: $setup.running
      }, " Start ", 8 /* PROPS */, _hoisted_3$5)
    ]))
  }

  script$h.render = render$h;

  const initial$1 = {
      data: []
  };

  const useStore = defineStore('store', {
      state: () => ({
          ...initial$1
      }),
      getters: {
          largeState() {
              return this.data.length > 10 ? this.data.slice(0, 10) : []
          }
      },
      actions: {
          incrementRow({i, v}) {
              this.data[i] = v;
          },
          largeIncrement( data ) {
              this.data = data;
          }
      }
  });

  var script$g = {
    __name: 'Dump',
    props: {
          state: {
              type: Array,
              default: []
          }
      },
    setup(__props, { expose: __expose }) {
    __expose();

  const props = __props;

      

      const time = dist.useState(0);
      time.set(new Date().toISOString());
      watch(() => props.state, (v) => {
          time.set(new Date().toISOString());
      });

  const __returned__ = { props, time, get useState() { return dist.useState }, watch };
  Object.defineProperty(__returned__, '__isScriptSetup', { enumerable: false, value: true });
  return __returned__
  }

  };

  const _hoisted_1$b = ["innerHTML"];

  function render$g(_ctx, _cache, $props, $setup, $data, $options) {
    return (openBlock(), createElementBlock("div", null, [
      createBaseVNode("div", null, "Last render at: " + toDisplayString($setup.time) + " (JSON dump of the first 10 fields) :", 1 /* TEXT */),
      createBaseVNode("div", {
        innerHTML: $setup.props.state.join('<br/>')
      }, null, 8 /* PROPS */, _hoisted_1$b)
    ]))
  }

  script$g.render = render$g;
  script$g.__scopeId = "data-v-757fb1ac";

  var script$f = {
    __name: 'Row',
    props: {
      value: {
          type: String,
          default: ''
      },
      index: {
          type: Number,
          default: 0
      }
  },
    emits: ['change'],
    setup(__props, { expose: __expose, emit }) {
    __expose();

  const props = __props;




  const time = dist.useState(0);
  const onChange = (e) => {
      time.set(new Date().toISOString());
      emit('change', e.target.value, props.index);
  };
  onMounted(() => {
      time.set(new Date().toISOString());
  });

  const __returned__ = { props, emit, time, onChange, get useState() { return dist.useState }, onMounted };
  Object.defineProperty(__returned__, '__isScriptSetup', { enumerable: false, value: true });
  return __returned__
  }

  };

  const _withScopeId$2 = n => (pushScopeId("data-v-22732fb8"),n=n(),popScopeId(),n);
  const _hoisted_1$a = { class: "large-row" };
  const _hoisted_2$7 = /*#__PURE__*/ _withScopeId$2(() => /*#__PURE__*/createBaseVNode("label", null, "Last render at:", -1 /* HOISTED */));
  const _hoisted_3$4 = ["value"];

  function render$f(_ctx, _cache, $props, $setup, $data, $options) {
    return (openBlock(), createElementBlock("div", _hoisted_1$a, [
      _hoisted_2$7,
      createBaseVNode("span", null, toDisplayString($setup.time), 1 /* TEXT */),
      createBaseVNode("input", {
        value: $setup.props.value,
        onInput: $setup.onChange
      }, null, 40 /* PROPS, HYDRATE_EVENTS */, _hoisted_3$4)
    ]))
  }

  script$f.render = render$f;
  script$f.__scopeId = "data-v-22732fb8";

  var script$e = {
    components: {
        row: script$f,
        Dump: script$g,
    },

    setup() {
        const store = useStore();
        console.log(store);
        const data = computed(() => store.data);
        const state = computed(() => store.largeState);
        store.largeIncrement( Array.from(Array(config.largeTotalRows).keys()).map((i) => `Field #${i + 1} value`));
      const changeRow = (v, i) => {
          store.incrementRow( {
              i, v
          });
      };


      return {
        data,
          state,
        config,
          changeRow
      };
    },
  };

  const _hoisted_1$9 = /*#__PURE__*/createBaseVNode("h1", { class: "title is-1" }, "Pinia Large state / Large forms Benchmark", -1 /* HOISTED */);
  const _hoisted_2$6 = { class: "mb-4 table-container" };

  function render$e(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_Dump = resolveComponent("Dump");
    const _component_row = resolveComponent("row");

    return (openBlock(), createElementBlock("div", null, [
      _hoisted_1$9,
      createVNode(_component_Dump, {
        state: $setup.state,
        class: "mb-4"
      }, null, 8 /* PROPS */, ["state"]),
      createBaseVNode("div", _hoisted_2$6, [
        (openBlock(true), createElementBlock(Fragment, null, renderList($setup.data, (s, i) => {
          return (openBlock(), createBlock(_component_row, {
            value: s,
            index: i,
            key: i,
            onChange: $setup.changeRow
          }, null, 8 /* PROPS */, ["value", "index", "onChange"]))
        }), 128 /* KEYED_FRAGMENT */))
      ]),
      createCommentVNode("    <button class=\"button is-info\" @click=\"start\" :disabled=\"running.get()\">"),
      createCommentVNode("      Start"),
      createCommentVNode("    </button>")
    ]))
  }

  script$e.render = render$e;

  var script$d = {
    props: {
      stats: Object,
    },
  };

  function render$d(_ctx, _cache, $props, $setup, $data, $options) {
    return (openBlock(), createElementBlock("div", null, [
      createBaseVNode("p", null, [
        createBaseVNode("span", null, "TIME_ELAPSED: " + toDisplayString($props.stats.elapsed) + "s", 1 /* TEXT */)
      ]),
      createBaseVNode("p", null, [
        createBaseVNode("span", null, "TOTAL_SUM: " + toDisplayString($props.stats.totalSum), 1 /* TEXT */)
      ]),
      createBaseVNode("p", null, [
        createBaseVNode("span", null, "CELL_UPDATES " + toDisplayString($props.stats.totalCalls), 1 /* TEXT */)
      ]),
      createBaseVNode("p", null, [
        createBaseVNode("span", null, "AVERAGE_UPDATE_RATE: " + toDisplayString($props.stats.rate) + "cells/s", 1 /* TEXT */)
      ])
    ]))
  }

  script$d.render = render$d;

  var script$c = {
    props: {
      state: Number,
    },
    setup(props) {
      const statee = dist.useState(props.state);
      return {
        statee,
      };
    },
  };

  function render$c(_ctx, _cache, $props, $setup, $data, $options) {
    return (openBlock(), createElementBlock("td", null, toDisplayString($props.state.toString(16)), 1 /* TEXT */))
  }

  script$c.render = render$c;
  script$c.__scopeId = "data-v-f4263868";

  var script$b = {
    props: {
      state: Array,
    },
    components: {
      TableCell: script$c,
    },
    setup(props) {
      // const statee = useState(props.state);

      // return {
      //   statee,
      // };
    },
  };

  function render$b(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_table_cell = resolveComponent("table-cell");

    return (openBlock(), createElementBlock("tr", null, [
      (openBlock(true), createElementBlock(Fragment, null, renderList($props.state, (s, i) => {
        return (openBlock(), createBlock(_component_table_cell, {
          key: i,
          state: s
        }, null, 8 /* PROPS */, ["state"]))
      }), 128 /* KEYED_FRAGMENT */))
    ]))
  }

  script$b.render = render$b;
  script$b.__scopeId = "data-v-a6b94a73";

  var script$a = {
    components: {
      TableRow: script$b,
      TableMeter: script$d,
    },

    setup() {
      const data = reactive(
        Array.from(Array(config.totalRows).keys()).map((i) =>
          Array.from(Array(config.totalColumns).keys()).map((j) => 0)
        )
      );

      const running = ref(false);

      const stats = reactive({
        startTime: new Date().getTime(),
        totalSum: 0,
        totalCalls: 0,
        elapsed: 0,
        rate: 0,
      });

      let timer;

      const start = () => {
        if (running.value) return;
        running.value = true;

        stats.startTime = new Date().getTime();
        stats.totalSum = 0;
        stats.totalCalls = 0;
        stats.elapsed = 0;
        stats.rate = 0;

        timer = setInterval(() => {
          for (let i = 0; i < config.callsPerInterval; i += 1) {
            const amount = randomInt(0, 5);
            data[randomInt(0, config.totalRows)][
              randomInt(0, config.totalColumns)
            ] += amount;

            // update stats, as a cell has been updated
            const elapsedMs = new Date().getTime() - stats.startTime;
            stats.totalSum += amount;
            stats.totalCalls += 1;
            stats.elapsed = Math.floor(elapsedMs / 1000),
            stats.rate = Math.floor((stats.totalCalls / elapsedMs) * 1000);
          }
        }, config.interval);

        setTimeout(() => {
          clearInterval(timer);
          running.value = false;
        }, config.MAX_TIME);
      };

      onBeforeUnmount(() => {
        clearInterval(timer);
      });

      return {
        data,
        config,
        start,
        running,
        stats
      };
    },
  };

  const _hoisted_1$8 = /*#__PURE__*/createBaseVNode("h1", { class: "title is-1" }, "Composition API Benchmark", -1 /* HOISTED */);
  const _hoisted_2$5 = { class: "mb-4 table-container" };
  const _hoisted_3$3 = ["disabled"];

  function render$a(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_table_meter = resolveComponent("table-meter");
    const _component_table_row = resolveComponent("table-row");

    return (openBlock(), createElementBlock("div", null, [
      _hoisted_1$8,
      createVNode(_component_table_meter, {
        stats: $setup.stats,
        class: "mb-4"
      }, null, 8 /* PROPS */, ["stats"]),
      createBaseVNode("div", _hoisted_2$5, [
        createBaseVNode("table", null, [
          createBaseVNode("tbody", null, [
            (openBlock(true), createElementBlock(Fragment, null, renderList($setup.data, (s, i) => {
              return (openBlock(), createBlock(_component_table_row, {
                key: i,
                state: s
              }, null, 8 /* PROPS */, ["state"]))
            }), 128 /* KEYED_FRAGMENT */))
          ])
        ])
      ]),
      createBaseVNode("button", {
        class: "button is-info",
        onClick: _cache[0] || (_cache[0] = (...args) => ($setup.start && $setup.start(...args))),
        disabled: $setup.running
      }, " Start ", 8 /* PROPS */, _hoisted_3$3)
    ]))
  }

  script$a.render = render$a;

  var script$9 = {
    __name: 'Dump',
    props: {
          state: {
              type: Array,
              default: []
          }
      },
    setup(__props, { expose: __expose }) {
    __expose();

  const props = __props;

      

      const time = dist.useState(0);
      time.set(new Date().toISOString());
      watch(() => props.state, (v) => {
          time.set(new Date().toISOString());
      });

  const __returned__ = { props, time, get useState() { return dist.useState }, watch };
  Object.defineProperty(__returned__, '__isScriptSetup', { enumerable: false, value: true });
  return __returned__
  }

  };

  const _hoisted_1$7 = ["innerHTML"];

  function render$9(_ctx, _cache, $props, $setup, $data, $options) {
    return (openBlock(), createElementBlock("div", null, [
      createBaseVNode("div", null, "Last render at: " + toDisplayString($setup.time) + " (JSON dump of the first 10 fields) :", 1 /* TEXT */),
      createBaseVNode("div", {
        innerHTML: $setup.props.state.join('<br/>')
      }, null, 8 /* PROPS */, _hoisted_1$7)
    ]))
  }

  script$9.render = render$9;
  script$9.__scopeId = "data-v-9b998a06";

  var script$8 = {
    __name: 'Row',
    props: {
      value: {
          type: String,
          default: ''
      },
      index: {
          type: Number,
          default: 0
      }
  },
    emits: ['change'],
    setup(__props, { expose: __expose, emit }) {
    __expose();

  const props = __props;




  const time = dist.useState(0);
  const onChange = (e) => {
      time.set(new Date().toISOString());
      emit('change', e.target.value, props.index);
  };
  onMounted(() => {
      time.set(new Date().toISOString());
  });

  const __returned__ = { props, emit, time, onChange, get useState() { return dist.useState }, onMounted };
  Object.defineProperty(__returned__, '__isScriptSetup', { enumerable: false, value: true });
  return __returned__
  }

  };

  const _withScopeId$1 = n => (pushScopeId("data-v-72237dfa"),n=n(),popScopeId(),n);
  const _hoisted_1$6 = { class: "large-row" };
  const _hoisted_2$4 = /*#__PURE__*/ _withScopeId$1(() => /*#__PURE__*/createBaseVNode("label", null, "Last render at:", -1 /* HOISTED */));
  const _hoisted_3$2 = ["value"];

  function render$8(_ctx, _cache, $props, $setup, $data, $options) {
    return (openBlock(), createElementBlock("div", _hoisted_1$6, [
      _hoisted_2$4,
      createBaseVNode("span", null, toDisplayString($setup.time), 1 /* TEXT */),
      createBaseVNode("input", {
        value: $setup.props.value,
        onInput: $setup.onChange
      }, null, 40 /* PROPS, HYDRATE_EVENTS */, _hoisted_3$2)
    ]))
  }

  script$8.render = render$8;
  script$8.__scopeId = "data-v-72237dfa";

  var script$7 = {
    components: {
        row: script$8,
        Dump: script$9,
    },

    setup() {
      const data = reactive(
        Array.from(Array(config.largeTotalRows).keys()).map((i) => `Field #${i + 1} value`)
      );
      const state = computed(() => {
          return data.slice(0, 10)
      });
      const changeRow = (v, i) => {
          console.log(v, i);
          data[i] = v;
      };


      return {
        data,
          state,
        config,
          changeRow
      };
    },
  };

  const _hoisted_1$5 = /*#__PURE__*/createBaseVNode("h1", { class: "title is-1" }, "Composition API Large state / Large forms Benchmark", -1 /* HOISTED */);
  const _hoisted_2$3 = { class: "mb-4 table-container" };

  function render$7(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_Dump = resolveComponent("Dump");
    const _component_row = resolveComponent("row");

    return (openBlock(), createElementBlock("div", null, [
      _hoisted_1$5,
      createVNode(_component_Dump, {
        state: $setup.state,
        class: "mb-4"
      }, null, 8 /* PROPS */, ["state"]),
      createBaseVNode("div", _hoisted_2$3, [
        (openBlock(true), createElementBlock(Fragment, null, renderList($setup.data, (s, i) => {
          return (openBlock(), createBlock(_component_row, {
            value: s,
            index: i,
            key: i,
            onChange: $setup.changeRow
          }, null, 8 /* PROPS */, ["value", "index", "onChange"]))
        }), 128 /* KEYED_FRAGMENT */))
      ]),
      createCommentVNode("    <button class=\"button is-info\" @click=\"start\" :disabled=\"running.get()\">"),
      createCommentVNode("      Start"),
      createCommentVNode("    </button>")
    ]))
  }

  script$7.render = render$7;

  const PerformanceViewPluginID = Symbol("PerformanceViewPlugin");

  var script$6 = {
    props: {
      state: Array,
    },
    setup(props) {
      const stats = {
        startTime: new Date().getTime(),
        totalSum: 0,
        totalCalls: 0,
        elapsed: 0,
        rate: 0,
      };

      props.state[dist.self].attach(() => ({
        id: PerformanceViewPluginID,
        init: () => ({
          onSet: (p) => {
            if (p.path.length === 2) {
              // new value can be only number in this example
              // and path can contain only 2 elements: row and column indexes
              stats.totalSum += p.value - p.previous;
            }
            stats.totalCalls += 1;

            const elapsedMs = new Date().getTime() - stats.startTime;
            stats.elapsed = Math.floor(elapsedMs / 1000);
            stats.rate = Math.floor((stats.totalCalls / elapsedMs) * 1000);
          },
        }),
      }));
      const scopedState = dist.useState(props.state);

      // mark the value of the whole matrix as 'used' by this component
      scopedState[dist.self].attach(dist.Downgraded);
      const markUsed = computed(() => {
        scopedState[dist.self].get();
        return 0;
      });

      return {
        stats,
        markUsed,
      };
    },
  };

  const _hoisted_1$4 = ["attr"];

  function render$6(_ctx, _cache, $props, $setup, $data, $options) {
    return (openBlock(), createElementBlock("div", { attr: $setup.markUsed }, [
      createBaseVNode("p", null, [
        createBaseVNode("span", null, "TIME_ELAPSED: " + toDisplayString($setup.stats.elapsed) + "s", 1 /* TEXT */)
      ]),
      createBaseVNode("p", null, [
        createBaseVNode("span", null, "TOTAL_SUM: " + toDisplayString($setup.stats.totalSum), 1 /* TEXT */)
      ]),
      createBaseVNode("p", null, [
        createBaseVNode("span", null, "CELL_UPDATES " + toDisplayString($setup.stats.totalCalls), 1 /* TEXT */)
      ]),
      createBaseVNode("p", null, [
        createBaseVNode("span", null, "AVERAGE_UPDATE_RATE: " + toDisplayString($setup.stats.rate) + "cells/s", 1 /* TEXT */)
      ])
    ], 8 /* PROPS */, _hoisted_1$4))
  }

  script$6.render = render$6;

  var script$5 = {
    props: {
      state: Object,
    },
    setup(props) {
      const statee = dist.useState(props.state);
      return {
        statee,
      };
    },
  };

  function render$5(_ctx, _cache, $props, $setup, $data, $options) {
    return (openBlock(), createElementBlock("td", null, toDisplayString($setup.statee.value.toString(16)), 1 /* TEXT */))
  }

  script$5.render = render$5;
  script$5.__scopeId = "data-v-14fd37c5";

  var script$4 = {
    props: {
      state: Array,
    },
    components: {
      TableCell: script$5,
    },
    setup(props) {
      const statee = dist.useState(props.state);

      return {
        statee,
      };
    },
  };

  function render$4(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_table_cell = resolveComponent("table-cell");

    return (openBlock(), createElementBlock("tr", null, [
      (openBlock(true), createElementBlock(Fragment, null, renderList($setup.statee, (s, i) => {
        return (openBlock(), createBlock(_component_table_cell, {
          key: i,
          state: s
        }, null, 8 /* PROPS */, ["state"]))
      }), 128 /* KEYED_FRAGMENT */))
    ]))
  }

  script$4.render = render$4;
  script$4.__scopeId = "data-v-ea439c1b";

  var script$3 = {
    components: {
      TableRow: script$4,
      TableMeter: script$6,
    },

    setup() {
      const data = dist.useState(
        Array.from(Array(config.totalRows).keys()).map((i) =>
          Array.from(Array(config.totalColumns).keys()).map((j) => 0)
        )
      );

      const running = dist.useState(false);

      let timer;

      const start = () => {
        if (running.get()) return;

        running.set(true);
        timer = setInterval(() => {
          for (let i = 0; i < config.callsPerInterval; i += 1) {
            data[randomInt(0, config.totalRows)][
              randomInt(0, config.totalColumns)
            ].set((p) => p + randomInt(0, 5));
          }
        }, config.interval);

        setTimeout(() => {
          clearInterval(timer);
          running.set(false);
        }, config.MAX_TIME);
      };

      onBeforeUnmount(() => {
        clearInterval(timer);
      });

      return {
        data,
        config,
        start,
        running,
      };
    },
  };

  const _hoisted_1$3 = /*#__PURE__*/createBaseVNode("h1", { class: "title is-1" }, "Appstate Benchmark", -1 /* HOISTED */);
  const _hoisted_2$2 = { class: "mb-4 table-container" };
  const _hoisted_3$1 = ["disabled"];

  function render$3(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_table_meter = resolveComponent("table-meter");
    const _component_table_row = resolveComponent("table-row");

    return (openBlock(), createElementBlock("div", null, [
      _hoisted_1$3,
      createVNode(_component_table_meter, {
        state: $setup.data,
        config: $setup.config,
        class: "mb-4"
      }, null, 8 /* PROPS */, ["state", "config"]),
      createBaseVNode("div", _hoisted_2$2, [
        createBaseVNode("table", null, [
          createBaseVNode("tbody", null, [
            (openBlock(true), createElementBlock(Fragment, null, renderList($setup.data, (s, i) => {
              return (openBlock(), createBlock(_component_table_row, {
                key: i,
                state: s
              }, null, 8 /* PROPS */, ["state"]))
            }), 128 /* KEYED_FRAGMENT */))
          ])
        ])
      ]),
      createBaseVNode("button", {
        class: "button is-info",
        onClick: _cache[0] || (_cache[0] = (...args) => ($setup.start && $setup.start(...args))),
        disabled: $setup.running.get()
      }, " Start ", 8 /* PROPS */, _hoisted_3$1)
    ]))
  }

  script$3.render = render$3;

  var script$2 = {
    __name: 'Dump',
    props: {
          state: {
              type: Array,
              default: []
          }
      },
    setup(__props, { expose: __expose }) {
    __expose();

  const props = __props;

      

      const time = dist.useState(0);
      time.set(new Date().toISOString());
      watch(() => props.state, (v) => {
          time.set(new Date().toISOString());
      });

  const __returned__ = { props, time, get useState() { return dist.useState }, watch };
  Object.defineProperty(__returned__, '__isScriptSetup', { enumerable: false, value: true });
  return __returned__
  }

  };

  const _hoisted_1$2 = ["innerHTML"];

  function render$2(_ctx, _cache, $props, $setup, $data, $options) {
    return (openBlock(), createElementBlock("div", null, [
      createBaseVNode("div", null, "Last render at: " + toDisplayString($setup.time) + " (JSON dump of the first 10 fields) :", 1 /* TEXT */),
      createBaseVNode("div", {
        innerHTML: $setup.props.state.join('<br/>')
      }, null, 8 /* PROPS */, _hoisted_1$2)
    ]))
  }

  script$2.render = render$2;
  script$2.__scopeId = "data-v-83e1c77b";

  var script$1 = {
    __name: 'Row',
    props: {
      value: {
          type: String,
          default: ''
      },
      index: {
          type: Number,
          default: 0
      }
  },
    emits: ['change'],
    setup(__props, { expose: __expose, emit }) {
    __expose();

  const props = __props;




  const time = dist.useState(0);
  const onChange = (e) => {
      time.set(new Date().toISOString());
      emit('change', e.target.value, props.index);
  };
  onMounted(() => {
      time.set(new Date().toISOString());
  });

  const __returned__ = { props, emit, time, onChange, get useState() { return dist.useState }, onMounted };
  Object.defineProperty(__returned__, '__isScriptSetup', { enumerable: false, value: true });
  return __returned__
  }

  };

  const _withScopeId = n => (pushScopeId("data-v-5a62c3e9"),n=n(),popScopeId(),n);
  const _hoisted_1$1 = { class: "large-row" };
  const _hoisted_2$1 = /*#__PURE__*/ _withScopeId(() => /*#__PURE__*/createBaseVNode("label", null, "Last render at:", -1 /* HOISTED */));
  const _hoisted_3 = ["value"];

  function render$1(_ctx, _cache, $props, $setup, $data, $options) {
    return (openBlock(), createElementBlock("div", _hoisted_1$1, [
      _hoisted_2$1,
      createBaseVNode("span", null, toDisplayString($setup.time), 1 /* TEXT */),
      createBaseVNode("input", {
        value: $setup.props.value,
        onInput: $setup.onChange
      }, null, 40 /* PROPS, HYDRATE_EVENTS */, _hoisted_3)
    ]))
  }

  script$1.render = render$1;
  script$1.__scopeId = "data-v-5a62c3e9";

  var script = {
    components: {
        row: script$1,
        Dump: script$2,
    },

    setup() {
      const data = dist.useState(
        Array.from(Array(config.largeTotalRows).keys()).map((i) => `Field #${i + 1} value`)
      );
      const state = computed(() => {
          return data.slice(0, 10)
      });
      const changeRow = (v, i) => {
          console.log(v, i);
          data[i].set(() => v);
      };


      return {
        data,
          state,
        config,
          changeRow
      };
    },
  };

  const _hoisted_1 = /*#__PURE__*/createBaseVNode("h1", { class: "title is-1" }, "Appstate Large state / Large forms Benchmark", -1 /* HOISTED */);
  const _hoisted_2 = { class: "mb-4 table-container" };

  function render(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_Dump = resolveComponent("Dump");
    const _component_row = resolveComponent("row");

    return (openBlock(), createElementBlock("div", null, [
      _hoisted_1,
      createVNode(_component_Dump, {
        state: $setup.state,
        class: "mb-4"
      }, null, 8 /* PROPS */, ["state"]),
      createBaseVNode("div", _hoisted_2, [
        (openBlock(true), createElementBlock(Fragment, null, renderList($setup.data, (s, i) => {
          return (openBlock(), createBlock(_component_row, {
            value: s,
            index: i,
            key: i,
            onChange: $setup.changeRow
          }, null, 8 /* PROPS */, ["value", "index", "onChange"]))
        }), 128 /* KEYED_FRAGMENT */))
      ]),
      createCommentVNode("    <button class=\"button is-info\" @click=\"start\" :disabled=\"running.get()\">"),
      createCommentVNode("      Start"),
      createCommentVNode("    </button>")
    ]))
  }

  script.render = render;

  const routes = [
    {
      path: '/',
      component: script$t,
      children: [
        {
          name: 'hello',
          path: '/hello',
          component: script$s,
        },
        {
          name: 'appstate',
          path: '/appstate',
          component: script$3,
        },
          {
              name: 'appstateLarge',
              path: '/appstate-large',
              component: script
          },
        {
          name: 'composition-api',
          path: '/composition-api',
          component: script$a
        },
          {
              name: 'composition-api-large',
              path: 'composition-api-large',
              component: script$7
          },
          {
              name: 'vuex',
              path: '/vuex',
              component: script$o,
          },
          {
              name: 'vuex-large',
              path: '/vuex-large',
              component: script$l,
          },
          {
              name: 'pinia',
              path: '/pinia',
              component: script$h,
          },
          {
              name: 'pinia-large',
              path: '/pinia-large',
              component: script$e,
          },
        {
          path: '/',
          redirect: '/hello'
        }
      ]
    },
  ];

  var router = createRouter({
    history: createWebHistory(),
    routes
  });

  const initial = {
      data: Array.from(Array(50).keys()).map((i) =>
          Array.from(Array(50).keys()).map((j) => 0)
      ),
      running: false,
      startTime: new Date().getTime(),
      metrics: {
          totalSum: 0,
          totalCalls: 0,
          elapsed: 0,
          rate: 0,
      },
      largeData: []
  };

  var store = createStore({
      state: { ...initial },
      mutations: {
          start(state) {
              state.running = true;
          },
          stop(state) {
              state.running = false;
          },
          incrementCell(state, { row, column, amount }) {
              state.data[row][column] += amount;
          },
          updateMetrics(state, metrics) {
              state.metrics = {...metrics};
          },
          clear(state) {
              Object.assign(state, initial, { startTime: new Date().getTime() });
          },
          incrementRow(state, {i, v}) {
              state.largeData[i] = v;
          },
          largeIncrement(state, data ) {
              state.largeData = data;
          }
      },
      getters: {
          largeState(state) {
              return state.largeData.length > 10 ? state.largeData.slice(0, 10) : []
          }
      },
      actions: {
          increment({ commit, state }, { row, column, amount }) {
              commit("incrementCell", { row, column, amount });

              const elapsedMs = new Date().getTime() - state.startTime;
              commit("updateMetrics", {
                  totalSum: state.metrics.totalSum + amount,
                  totalCalls: state.metrics.totalCalls + 1,
                  elapsed: Math.floor(elapsedMs / 1000),
                  rate: Math.floor((state.metrics.totalCalls / elapsedMs) * 1000)
              });
          }
      }
  });

  const pinia = createPinia();

  const app = createApp(script$u);
  app.use(router);
  app.use(store);
  app.use(pinia);
  app.mount('#app');

})();
