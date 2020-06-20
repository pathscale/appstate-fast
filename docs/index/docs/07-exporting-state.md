---
id: exporting-state
title: Exporting state
sidebar_label: Exporting state
---

import { PreviewSample } from '../src/PreviewSample'

If you would like to implement and expose a custom global state without exposing Appstate-fast details,
you can wrap a state object by a custom interface. For example:

<PreviewSample example="global-getting-started-interface" />

The other more complex example can be found in [the demo application](https://vue3.dev/demo-todolist), where settings state is mapped directly to a hook with returns state access interface when used.
