<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<script>
import { mapMutations } from "vuex";
import { enquireScreen } from "@/util/util";

export default {
  name: "App",
  data() {
    return {};
  },
  created() {
    enquireScreen((isMobile) => this.SET_DEVICE(isMobile));
  },
  methods: {
    ...mapMutations(["SET_DEVICE"]),
  },
  computed: {}
};
</script>
<style lang="scss">
@import 'styles/base.css';

#app {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
