import { useState } from "../src";
import { computed } from "vue";

describe("test", () => {    

    it("should work with a computed", () => {
        const state = useState({ count: 0 });
        const count = computed(() => {
            return state.count.value
        });

        expect(count.value).toBe(0);
        state.count.set(state.count.value + 1);
        expect(count.value).toBe(1);
        state.count.set(state.count.value - 1);
        expect(count.value).toBe(0);
    });

    it.todo("should work with a watch");
});
