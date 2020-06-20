---
id: global-state
title: Global state
sidebar_label: Global state
---

import { PreviewSample } from '../src/PreviewSample'

## Creating and using global state

Create the state and use it within and outside of a React component. Few lines of code. No boilerplate!

<PreviewSample example="global-getting-started" />

The state is created by [createState](typedoc-appstate-fast-core#createstate). The first argument is the initial state value. The result value is an instance of [State](typedoc-appstate-fast-core#state),
which **can be** used directly to get and set the state value outside of a React component.

When you need to use the state in a functional React component,
pass the created state to [useState](typedoc-appstate-fast-core#usestate) function
and use the returned result in the component's logic.
The returned result is an instance of [State](typedoc-appstate-fast-core#state) too,
which **must be** used within a React component (during rendering
or in effects) and/or it's children components.

Read more about [createState](typedoc-appstate-fast-core#createstate) and [useState](typedoc-appstate-fast-core#usestate) in the [API reference](typedoc-appstate-fast-core).
