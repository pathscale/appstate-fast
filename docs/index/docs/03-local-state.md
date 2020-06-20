---
id: local-state
title: Local state
sidebar_label: Local state
---

import { PreviewSample } from '../src/PreviewSample'

## Creating and using local state

When a state is used by only one component, and maybe it's children,
it is recommended to use *local* state instead of [*global* state](global-state).
In this case [useState](typedoc-appstate-fast-core#usestate) behaves similarly to `React.useState`, but the
returned instance of [State](typedoc-appstate-fast-core#state) has got more features.

<PreviewSample example="local-getting-started" />

Read more about [useState](typedoc-appstate-fast-core#usestate) and [State](typedoc-appstate-fast-core#state) in the [API reference](typedoc-appstate-fast-core).
