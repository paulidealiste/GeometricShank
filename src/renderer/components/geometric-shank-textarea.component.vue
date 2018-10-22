<template>
    <form class="uk-flex uk-flex-1">
        <textarea v-model="internalComputedExcrept" class="uk-textarea uk-overflow-hidden" @keydown="userTyping"></textarea>
    </form>
</template>

<script>
export default {
  props: ["loading", "computedExcrept"],
  computed: {
    internalComputedExcrept: {
      get() {
        return this.computedExcrept;
      },
      set(v) {
        this.$emit("ut", v);
      }
    }
  },
  methods: {
    userTyping(evt) {}
  }
};
</script>

<style>
</style>
