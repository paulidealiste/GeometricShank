<template>
  <div class="uk-grid-collapse uk-child-width-expand@s uk-text-small uk-width-1-1" uk-grid>
    <div class="uk-flex uk-width-1-3@s uk-padding-small">
      <div
        class="uk-card uk-card-default uk-card-body uk-width-1-1 uk-flex uk-padding-small"
        ref="wet"
      >
        <geometric-shank-textarea
          v-bind:computed-excrept="computedExcrept"
          v-bind:loading="loading"
          v-on:ut="userTyped"
        ></geometric-shank-textarea>
      </div>
    </div>
    <div class="uk-flex uk-width-1-3@s uk-padding-small">
      <div
        class="uk-card uk-card-primary uk-card-body uk-width-1-1 uk-flex uk-overflow-auto uk-padding-remove"
      >
        <geometric-shank-svg
          v-bind:computed-excrept="computedExcrept"
          ref="gsc"
          v-on:sendCutupString="addCutupString"
          v-on:clearCutupExcrept="clearCutupExcrept"
          v-on:sendPackageString="addPackageString"
        ></geometric-shank-svg>
      </div>
    </div>
    <div class="uk-flex uk-width-1-3@s uk-padding-small">
      <div
        class="uk-card uk-card-default uk-card-body uk-width-1-1 uk-flex uk-padding-remove uk-overflow-auto uk-position-relative"
      >
        <p class="uk-text-small uk-position-cover uk-padding-small" v-html="cutupExcrept"></p>
      </div>
    </div>
  </div>
</template>

<script>
import GeometricShankSvg from "./geometric-shank-svg.component.vue";
import GeometricShangTextarea from "./geometric-shank-textarea.component.vue";
import UtilityMixin from "../mixins/utility.mixin";
import ErrorsMixin from "../mixins/errors.mixin";
import NotificationsMixin from "../mixins/notifications.mixin";

export default {
  mixins: [UtilityMixin, ErrorsMixin, NotificationsMixin],
  data: function () {
    return {
      workingExcrept: "",
      cutupExcrept: "",
      loading: false,
      charLimit: 1360
    };
  },
  methods: {
    newRandomExcrept: function (currentVictim) {
      this.loading = true;
      this.cutupExcrept = "";
      window.electron.reachForExcrept(currentVictim);
      window.electron.excreptReached((data) => {
        this.workingExcrept = data
          .replace(/[\r\n]/g, " ")
          .replace(/ {2,}/g, " ")
          .trim();
        this.workingExcrept = this.trimToOverflow(
          this.$refs.wet,
          this.workingExcrept,
          20
        ).trim();
        this.loading = false;
      });
    },
    addCutupString: function (word) {
      let isLetter = c => c.toLowerCase() != c.toUpperCase();
      if (word != null && word != "") {
        if (this.cutupExcrept[this.cutupExcrept.length - 1] != " " && isLetter(word[0])) {
          this.cutupExcrept += " " + word;
        } else {
          this.cutupExcrept += word;
        }
      }
    },
    addPackageString: function (packedHTML) {
      this.cutupExcrept += packedHTML;
    },
    cutTextGeometrically: function () {
      this.$refs.gsc.cutTextGeometrically();
    },
    manageFreehandMode: function (freehand) {
      this.$refs.gsc.manageFreehandMode(freehand);
    },
    pasteCutUpSegments: function () {
      this.$refs.gsc.pasteCutUpSegments();
    },
    clearCutupExcrept: function () {
      this.cutupExcrept = "";
    },
    clearAll: function () {
      this.clearCutupExcrept();
      this.workingExcrept = "";
    },
    showSegments: function () {
      this.$refs.gsc.showSegments();
    },
    printCutup: function () {
      const toto = this.computeTextWrap(
        this.rawText(this.cutupExcrept),
        this.$refs.gsc.properties.width - 20,
        this.$refs.gsc.properties.lineHeight
      );
      window.electron.printToto(toto);
      window.electron.totoPrinted((data) => {
        const message = this.$t("components.dialogs.printsuccess") + "<br>" + data;
        this.PlainOkNotify(message);
      });
    },
    userTyped: function (typed) {
      this.workingExcrept = typed
        .replace(/[\r\n]/g, " ")
        .replace(/ {2,}/g, " ")
        .trim();
      this.workingExcrept = this.trimToOverflow(
        this.$refs.wet,
        this.workingExcrept,
        20
      ).trim();
    },
    resizeListener() {
      this.$refs.gsc.resizeListener();
    }
  },
  computed: {
    computedExcrept: function () {
      this.$nextTick(function () {
        document.querySelector("textarea").scrollTop = 0;
        if (this.$refs.gsc.initialized) {
            this.$refs.gsc.render();
        } else {
          setTimeout(() => {
            this.$refs.gsc.initialize();
            this.$refs.gsc.render();
          })
        }
      });
      return this.workingExcrept;
    }
  },
  components: {
    "geometric-shank-svg": GeometricShankSvg,
    "geometric-shank-textarea": GeometricShangTextarea
  }
};
</script>

<style>
</style>
