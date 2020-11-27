import Mutable from './Matrix/Mutable'
import Inmutable from './Matrix/Inmutable'

import { createState } from 'solid-js'

export default () => {
    const [state, setState] = createState({ page: null })

    const router = {
        mutable: Mutable,
        inmutable: Inmutable
    }

    return (
        <div class="container my-6">
            <div class="buttons">
                <button class="button is-primary" onClick={() => setState("page", "mutable")}>Mutable Example</button>
                <button class="button is-success" onClick={() => setState("page", "inmutable")}>Inmutable Example</button>
            </div>
            { router[state.page]}
        </div>
    )
}