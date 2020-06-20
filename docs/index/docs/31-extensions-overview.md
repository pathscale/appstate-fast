---
id: extensions-overview
title: Plugins system overview
sidebar_label: Overview
---

import { PreviewSample } from '../src/PreviewSample'

> Please, submit pull request if you would like yours plugin included in the list.

## Standard extensions

Plugin | Description | Example | Package | Version
-|-|-|-|-
Initial | Enables access to an initial value of a [State](typedoc-appstate-fast-core#state) and allows to check if the current value of the state is modified (compares with the initial value). Helps with tracking of *modified* form field(s). | [Demo](./extensions-initial) | `@appstate-fast/initial` | [![npm version](https://img.shields.io/npm/v/@appstate-fast/initial.svg?maxAge=300&label=version&colorB=007ec6)](https://www.npmjs.com/package/@appstate-fast/initial)
Touched | Helps with tracking of *touched* form field(s). | [Demo](./extensions-touched) | `@appstate-fast/touched` | [![npm version](https://img.shields.io/npm/v/@appstate-fast/touched.svg?maxAge=300&label=version&colorB=007ec6)](https://www.npmjs.com/package/@appstate-fast/touched)
Validation | Enables validation and error / warning messages for a state. Usefull for validation of form fields and form states. | [Demo](./extensions-validation) | `@appstate-fast/validation` | [![npm version](https://img.shields.io/npm/v/@appstate-fast/validation.svg?maxAge=300&label=version&colorB=007ec6)](https://www.npmjs.com/package/@appstate-fast/validation)
Persistence | Enables persistence of managed states to browser's local storage. | [Demo](./extensions-persistence) | `@appstate-fast/persistence` | [![npm version](https://img.shields.io/npm/v/@appstate-fast/persistence.svg?maxAge=300&label=version&colorB=007ec6)](https://www.npmjs.com/package/@appstate-fast/persistence)

## Development tools

Plugin | Description | Example | Package | Version
-|-|-|-|-
DevTools | Development tools for Appstate-fast. Install [Chrome browser's extension](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=en) and [activate the plugin](./devtools) in your app. [Learn more](./devtools) about using the development tools. | [Demo](https://vue3.dev/demo-todolist) | `@appstate-fast/devtools` | [![npm version](https://img.shields.io/npm/v/@appstate-fast/devtools.svg?maxAge=300&label=version&colorB=007ec6)](https://www.npmjs.com/package/@appstate-fast/devtools)
Logger | Simpler alternative to development tools. Logs state updates and current value of a state to the development console. | | `@appstate-fast/logger` | [![npm version](https://img.shields.io/npm/v/@appstate-fast/logger.svg?maxAge=300&label=version&colorB=007ec6)](https://www.npmjs.com/package/@appstate-fast/logger)

## Special extensions

Plugin | Description | Example | Package | Version
-|-|-|-|-
Labelled | Allows to assign string metadata to a state. | [Demo](./extensions-labelled) | `@appstate-fast/labelled` | [![npm version](https://img.shields.io/npm/v/@appstate-fast/labelled.svg?maxAge=300&label=version&colorB=007ec6)](https://www.npmjs.com/package/@appstate-fast/labelled)
Untracked | It allows to get and set a state without triggering rerendering. It also allows to trigger rerendering even when a state has not been updated. You should understand what you are doing if you decide to use this plugin. | [Demo](./performance-managed-rendering#untracked-plugin) | `@appstate-fast/untracked` | [![npm version](https://img.shields.io/npm/v/@appstate-fast/untracked.svg?maxAge=300&label=version&colorB=007ec6)](https://www.npmjs.com/package/@appstate-fast/untracked)
Downgraded | Turns off optimizations for a StateLink by stopping tracking of it's value usage and assuming the entire state is *used* if StateLink's value is accessed at least once. | [Docs](./performance-managed-rendering) | `@appstate-fast/core` | [![npm version](https://img.shields.io/npm/v/@appstate-fast/core.svg?maxAge=300&label=version&colorB=007ec6)](https://www.npmjs.com/package/@appstate-fast/core)

## Compatibility extensions

Plugin | Description | Example | Package | Version
-|-|-|-|-
Proxy Polyfill | Makes the Appstate-fast working in older browsers, for example IE11. All features are supported with two known differences in polyfilled behaviour: 1) `State[key]` will return `undefined` if `State[self].value[key]` property does not exist. 2) `State[self].value[key] = 'some new value'` will not throw but will mutate the object in the state without notifying any of rendered components or plugins. | [Demo](https://github.com/pathscale/appstate-fast/tree/master/docs/demos/ie11) | `@appstate-fast/proxy-polyfill` | [![npm version](https://img.shields.io/npm/v/@appstate-fast/proxy-polyfill.svg?maxAge=300&label=version&colorB=007ec6)](https://www.npmjs.com/package/@appstate-fast/proxy-polyfill)
