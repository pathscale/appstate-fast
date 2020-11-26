<template>
  <div class="container my-6">
    <v-columns>
      <v-column size="is-2">
        <v-menu>
          <v-menu-list label="Appstate Benchmark">
            <v-menu-item label="Introduction" @click="redirect('/hello')" />
            <v-menu-item label="Appstate" @click="redirect('/appstate')" />
            <v-menu-item
              label="Composition API"
              @click="redirect('/composition-api')"
            />
            <v-menu-item label="Vuex" @click="redirect('/vuex')" />
          </v-menu-list>
        </v-menu>
      </v-column>
      <v-column>
        <router-view />
      </v-column>
    </v-columns>
  </div>
</template>

<script>
import {
  VColumns,
  VColumn,
  VMenu,
  VMenuList,
  VMenuItem,
} from "@pathscale/vue3-ui";
import { reactive } from "vue";

import { useRoute, useRouter } from "vue-router";

export default {
  name: "App",
  components: { VColumns, VColumn, VMenu, VMenuList, VMenuItem },
  setup() {
    const router = useRouter();
    return {
      redirect: (to) => router.push(to),
    };
  },
};
</script>
