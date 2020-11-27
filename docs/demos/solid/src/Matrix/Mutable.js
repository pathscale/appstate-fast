import { createState, batch } from "solid-js";

// helper function to create ints
const randomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
};

// benchmark configuration
const config = {
    totalRows: 50,
    totalColumns: 50,
    callsPerInterval: 50,
    interval: 10, // ms
    MAX_TIME: 20000, // ms
};

// initial state
const init = () => ({
    data: Array.from(Array(config.totalRows).keys()).map((i) =>
        Array.from(Array(config.totalColumns).keys()).map((j) => 0)
    ),
    running: false,
    startTime: new Date().getTime(),
    stats: {
        totalSum: 0,
        totalCalls: 0,
        elapsed: 0,
        rate: 0,
    },
});

// main component
const Matrix = () => {
    const [state, setState] = createState(init());
    let timer = null;

    // updates statistics, this gets called after a cell is updated
    const updateStats = ({ amount }) => {
        const elapsedMs = new Date().getTime() - state.startTime;
        setState("stats", "totalSum", (p) => p + amount);
        setState("stats", "totalCalls", (p) => p + 1);
        setState("stats", "elapsed", Math.floor(elapsedMs / 1000));
        setState(
            "stats",
            "rate",
            Math.floor((state.stats.totalCalls / elapsedMs) * 1000)
        );
    };

    /**
     * Benchmark
     * - previous state is cleared
     * - running is marked as true to disable button
     * - set interval that on every 10ms will perform 50 updates to the matrix
     * - stats are updated
     */
    const start = () => {
        setState(init());
        setState("running", true);

        timer = setInterval(() => {
            batch(() => {
                for (let i = 0; i < config.callsPerInterval; i += 1) {
                    const amount = randomInt(0, 5);
                    const row = randomInt(0, config.totalRows);
                    const col = randomInt(0, config.totalColumns);

                    // mutate the cell in the matrix data
                    setState("data", row, col, (p) => p + amount);
                    updateStats({ amount });
                }
            });
        }, config.interval);

        // in 20 seconds from start stop the test
        setTimeout(() => {
            clearInterval(timer);
            setState("running", false);
        }, config.MAX_TIME);
    };

    return (
        <>
            <p class="title is-1">SolidJS Benchmark</p>
            <p class="subtitle is-3">Mutable State</p>

            <p>TIME_ELAPSED: {state.stats.elapsed}s</p>
            <p>TOTAL_SUM: {state.stats.totalSum}</p>
            <p>CELL_UPDATES {state.stats.totalCalls}</p>
            <p>AVERAGE_UPDATE_RATE: {state.stats.rate}cells/s</p>

            <div class="mb-4 table-container">
                <table class="table is-bordered is-fullwidth">
                    <tbody>
                        <Index each={state.data}>
                            {(row) => <TableRow data={row()} />}
                        </Index>
                    </tbody>
                </table>
            </div>
            <button
                class="button is-info"
                onClick={start}
                disabled={state.running}
            >
                Start
            </button>
        </>
    );
};

// simple row
const TableRow = (props) => (
    <tr>
        <Index each={props.data}>{(val) => <TableCell val={val()} />}</Index>
    </tr>
);

// simple cell
const TableCell = (props) => <td>{props.val.toString(16)}</td>;

export default Matrix;
