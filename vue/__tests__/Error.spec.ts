import { useState, self } from "../src";
import { computed } from "vue";
import { h } from "vue";

test('error: should not allow set to another state value', async () => {
    const state1 = h(() => {
        return useState({ prop1: [0, 0] })
    });

    const state2 = h(() => {
        return useState({ prop2: [0, 0] })
    });

    expect(2).toBe(2);
})

it.todo('error: should not allow create state from another state value')

it.todo('error: should not allow create state from another state value (nested)')

it.todo('error: should not allow serialization of statelink')
