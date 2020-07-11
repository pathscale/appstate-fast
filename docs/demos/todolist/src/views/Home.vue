<template>
  <div>
    {{ state }}
    <!-- <button @click="increment">
      Count is: {{ state.count }}, double is: {{ state.double }}
    </button> -->
  </div>
</template>

<script>
import { reactive, computed, ref } from 'vue'
import React from 'react';
import { createState, useState } from '@hookstate/core';

export default {
  setup() {

    const state = reactive({
      global: useState(createState(0))
    })

    return {
      state
    }
  }
}
</script>