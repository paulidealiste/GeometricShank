const electron = window.require("electron");
import Vue from 'vue';
import GeometricShankSvg from './GeometricShankSvg.component';
import GeometricShangTextarea from './GeometricShankTextarea.component';
import UtilityMixin from '../mixins/utility.mixin';
import * as UIkit from 'uikit';
import * as R from 'ramda';

export default ({
  template: `
    <div class="uk-flex uk-text-small uk-flex-1">
      <div class="uk-flex uk-width-1-3@s uk-flex-1 uk-padding-small">
        <div class="uk-card uk-card-default uk-card-body uk-width-1-1 uk-flex uk-flex-1 uk-padding-small" ref="wet">
          <geometric-shank-textarea v-bind:computed-excrept="computedExcrept" v-bind:loading="loading" v-bind:char-limit="charLimit" v-on:ut="userTyped"></geometric-shank-textarea>
        </div>
      </div>
      <div class="uk-flex uk-width-1-3@s uk-flex-1 uk-padding-small">
        <div class="uk-card uk-card-primary uk-card-body uk-width-1-1 uk-flex uk-flex-1 uk-overflow-auto uk-padding-remove">
          <geometric-shank-svg v-bind:computed-excrept="computedExcrept" ref="gsc" v-on:sendCutupString="addCutupString" v-on:clearCutupExcrept="clearCutupExcrept" v-on:sendPackageString="addPackageString"></geometric-shank-svg>
        </div>
      </div>
      <div class="uk-flex uk-width-1-3@s uk-flex-1 uk-padding-small">
        <div class="uk-card uk-card-default uk-card-body uk-width-1-1 uk-flex uk-flex-1 uk-padding-remove uk-overflow-auto uk-position-relative">
          <p class="uk-text-small uk-position-cover uk-padding-small" v-html="cutupExcrept">
          </p>
        </div>
      </div>
    </div>
  `,
  mixins: [UtilityMixin],
  data: function () {
    return {
      workingExcrept: '',
      cutupExcrept: '',
      loading: false,
      charLimit: 1360
    };
  },
  methods: {
    newRandomExcrept: function () {
      this.loading = true;
      this.cutupExcrept = '';
      electron.ipcRenderer.send('reachForExcrept');
      electron.ipcRenderer.on('excreptReached', (event, arg) => {
        this.workingExcrept = arg.replace(/[\r\n]/g, ' ').replace(/ {2,}/g, ' ').trim();
        this.workingExcrept = this.trimLastWord(R.slice(0, this.charLimit, this.workingExcrept));
        this.loading = false;
      });
    },
    addCutupString: function (word) {
      let isLetter = (c) => c.toLowerCase() != c.toUpperCase();
      if (R.last(this.cutupExcrept) != ' ' && isLetter(word[0])) {
        this.cutupExcrept += ' ' + word;
      } else {
        this.cutupExcrept += word;
      }
    },
    addPackageString: function (packedHTML) {
      this.clearCutupExcrept();
      this.cutupExcrept = packedHTML;
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
      this.cutupExcrept = '';
    },
    clearAll: function () {
      this.clearCutupExcrept();
      this.workingExcrept = '';
    },
    showSegments: function () {
      this.$refs.gsc.showSegments();
    },
    printCutup: function () {
      let toto = this.computeTextWrap(this.rawText(this.cutupExcrept), this.$refs.gsc.properties.width - 20, this.$refs.gsc.properties.lineHeight);
      electron.ipcRenderer.send('printToto', toto);
      electron.ipcRenderer.on('totoPrinted', (event, arg) => {
        let trans = this.$t("components.dialogs.printsuccess") + '<br>' + arg;
        let noty = R.once(UIkit.notification('<span uk-icon="icon: check"></span><span class="uk-text-small uk-position-center">' + trans + '</span>'));
        noty();
      });
      electron.ipcRenderer.on('totoNotPrinted', (event, arg) => {
        let trans = this.$t("components.dialogs.printfailure");
        let noty = R.once(UIkit.notification('<span uk-icon="icon: close"></span><span class="uk-text-small uk-position-center">' + trans + '</span>'));
        noty();
      });
    },
    userTyped: function (typed) {
      this.workingExcrept = typed.replace(/[\r\n]/g, ' ').replace(/ {2,}/g, ' ').trim();
    }
  },
  computed: {
    computedExcrept: function () {
      this.$nextTick(function () {
        this.$refs.gsc.render();
      });
      return this.workingExcrept;
    },
  },
  components: {
    'geometric-shank-svg': GeometricShankSvg,
    'geometric-shank-textarea': GeometricShangTextarea
  },
  mounted: function () {
    this.charLimit = this.calculateCharLimit(this.$refs.wet, 15);
  }
})
