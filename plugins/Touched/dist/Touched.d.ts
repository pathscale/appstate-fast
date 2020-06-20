import { Plugin, State } from '@appstate-fast/core';
export interface TouchedExtensions {
    touched(): boolean;
    untouched(): boolean;
}
export declare function Touched(): Plugin;
export declare function Touched<S>($this: State<S>): TouchedExtensions;
