import { Plugin, State } from '@appstate-fast/core';
export interface LoggerExtensions {
    log(): void;
}
export declare function Logger(): Plugin;
export declare function Logger<S>($this: State<S>): LoggerExtensions;
