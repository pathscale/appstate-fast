import { useState } from "../src";
import { computed } from "vue";

describe("test", () => {    

    it("should work with a computed", () => {
        const state = useState({ count: 0 });
        const count = computed(() => {
            return state.count.value
        });

        expect(count.value).toBe(0);
        state.count.set(10);

        expect(count.value).toBe(10);
    });

    it.todo("should work with a watch");
});
