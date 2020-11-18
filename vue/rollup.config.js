import typescript from "rollup-plugin-typescript2";
import commonjs from "@rollup/plugin-commonjs";
import external from "rollup-plugin-peer-deps-external";
import resolve from "@rollup/plugin-node-resolve";
import url from "@rollup/plugin-url";
import replace from "@rollup/plugin-replace";

import pkg from "./package.json";

export default {
    input: "src/index.ts",
    output: [
        {
            file: pkg.main,
            format: "cjs",
            exports: "named",
            sourcemap: true,
        },
        {
            file: pkg.module,
            format: "es",
            exports: "named",
            sourcemap: true,
        },
    ],
    plugins: [
        replace({
            // TODO esm should preserve `(process.env.NODE_ENV !== 'production')`:
            __DEV__: false,
            __LOGGING__: true,
        }),
        external(),
        url(),
        resolve(),
        typescript({
            tsconfig: "tsconfig.prod.json",
            rollupCommonJSResolveHack: true,
            clean: true,
        }),
        commonjs(),
    ],
};
