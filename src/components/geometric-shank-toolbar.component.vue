<template>
     <div class="uk-section-xsmall uk-section-secondary uk-flex uk-width-1-1">
      <span class="uk-margin-left uk-position-absolute" v-bind:uk-tooltip="'title:' + $t('components.tooltips.currentvictim')">
        {{ currentVictim }}
      </span>
      <div class="uk-container">
        <ul class="uk-iconnav">
          <li v-on:click="scv" v-bind:uk-tooltip="'title:' + $t('components.tooltips.setcurrentvictim')">
            <a uk-icon="icon: upload"></a>
          </li>
          <li v-on:click="nex" v-bind:uk-tooltip="'title:' + $t('components.tooltips.newrandomexcrept')">
            <a uk-icon="icon: comments"></a>
          </li>
          <li v-on:click="ctg" v-bind:uk-tooltip="'title:' + $t('components.tooltips.cuttextgeometrically')">
            <a uk-icon="icon: grid"></a>
          </li>
          <li v-on:click="frh" v-bind:uk-tooltip="'title:' + $t('components.tooltips.freehandtextpath')">
            <a v-if="freehand" uk-icon="icon: pencil"></a>
            <a v-else uk-icon="icon: file"></a>
          </li>
          <li v-on:click="pra" v-bind:uk-tooltip="'title:' + $t('components.tooltips.pasterandomizer')">
            <a uk-icon="icon: settings"></a>
          </li>
          <li v-on:click="ccu" v-bind:uk-tooltip="'title:' + $t('components.tooltips.clearcutupcanvas')">
            <a uk-icon="icon: file-edit"></a>
          </li>
          <li v-on:click="cal" v-bind:uk-tooltip="'title:' + $t('components.tooltips.clearall')">
            <a uk-icon="icon: trash"></a>
          </li>
          <li>
            <a uk-icon="icon: more-vertical"></a>
          </li>          
          <li v-on:click="sse" v-bind:uk-tooltip="'title:' + $t('components.tooltips.showsegments')">
            <a uk-icon="icon: paint-bucket"></a>
          </li>
          <li>
            <a uk-icon="icon: more-vertical"></a>
          </li>
          <li v-on:click="pcu" v-bind:uk-tooltip="'title:' + $t('components.tooltips.printcutup')">
            <a uk-icon="icon: album"></a>
          </li>   
        </ul>
      </div>
    </div>
</template>

<script>
export default {
  props: ["currentVictim"],
  data: function() {
    return {
      freehand: false
    };
  },
  methods: {
    scv: function() {
      this.$emit("scv");
    },
    nex: function() {
      this.$emit("nex");
    },
    ctg: function() {
      this.$emit("ctg");
    },
    pra: function() {
      this.$emit("pra");
    },
    ccu: function() {
      this.$emit("ccu");
    },
    cal: function() {
      this.$emit("cal");
    },
    sse: function() {
      this.$emit("sse");
    },
    pcu: function() {
      this.$emit("pcu");
    },
    frh: function() {
      this.freehand = !this.freehand;
      this.$emit("frh", this.freehand);
    }
  }
};
</script>

<style>
</style>
