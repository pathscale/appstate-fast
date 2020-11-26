<template>
  <div>
    <h1 class="title is-1">Hi</h1>
    <p>
        These benchmarks have ben configured to randomly update cells in a matrix of size 50x50 every 10ms for 20 seconds
    </p>

    <br />
    
    <p>Metrics</p>
    
    <ul>
        <li>
            <strong>TOTAL_SUM</strong>: global sum, incremented on very cell update
        </li>

        <li>
            <strong>CELL_UPDATES</strong>: amount of cells that have been updated
        </li>

        <li>
            <strong>AVERAGE_UPDATE_RATE</strong>: elapsed time divided by the amount of updates
        </li>
    </ul>
    <!-- <br />
    <p>
        Everytime a cell is updated +1 is added to metric <strong>total matrix updates</strong>
        <br />
        Everytime a cell is updated a global sum accumulator is updated <i>acc += change</i>
    </p> -->
  </div>
</template>