const electron = window.require("electron");
import Vue from 'vue';
import GeometricShankSvg from './GeometricShankSvg.component';
import * as R from 'ramda';

export default ({
  template: `
    <div class="uk-flex uk-text-small uk-flex-1">
      <div class="uk-flex uk-width-1-3@s uk-flex-1 uk-padding-small">
        <div class="uk-card uk-card-default uk-card-body uk-width-1-1 uk-flex uk-flex-1 uk-padding-small">
          <form class="uk-flex uk-flex-1">
            <trinity-rings-spinner v-show="loading" class="uk-position-center"
              :animation-duration="1500"
              :size="66"
              :color="'#008080'"
            ></trinity-rings-spinner>
            <textarea v-model="workingExcrept" class="uk-textarea" ref="wet"></textarea>
          </form>
        </div>
      </div>
      <div class="uk-flex uk-width-1-3@s uk-flex-1 uk-padding-small">
        <div class="uk-card uk-card-primary uk-card-body uk-width-1-1 uk-flex uk-flex-1 uk-overflow-auto uk-padding-remove">
          <geometric-shank-svg v-bind:computed-excrept="computedExcrept" ref="gsc" v-on:sendCutupString="addCutupString"></geometric-shank-svg>
        </div>
      </div>
      <div class="uk-flex uk-width-1-3@s uk-flex-1 uk-padding-small">
        <div class="uk-card uk-card-default uk-card-body uk-width-1-1 uk-flex uk-flex-1 uk-padding-remove uk-overflow-auto uk-position-relative">
          <p class="uk-text-small uk-position-cover uk-padding-small">
            {{ cutupExcrept }}
          </p>
        </div>
      </div>
    </div>
  `,
  data: function() {
    return {
      workingExcrept: '',
      cutupExcrept: '',
      loading: false
    };
  },
  methods: {
    newRandomExcrept: function() {
      this.loading = true;
      this.cutupExcrept = '';
      electron.ipcRenderer.send('reachForExcrept');
      electron.ipcRenderer.on('excreptReached', (event, arg) => {
        this.workingExcrept = arg.replace(/[\r\n]/g, ' ').trim();
        this.loading = false;
      });
    },
    addCutupString: function(word) {
      let isLetter = (c) => c.toLowerCase() != c.toUpperCase(); 
      if (R.last(this.cutupExcrept) != ' ' && isLetter(word[0])) {
        this.cutupExcrept += ' ' + word;
      } else {
        this.cutupExcrept += word;
      }
    },
    cutTextGeometrically: function() {
      this.$refs.gsc.cutTextGeometrically();
    },
    clearCutupExcrept: function() {
      this.cutupExcrept = '';
    }
  },
  computed: {
    computedExcrept: function() {
      this.$nextTick(function () {
        this.$refs.gsc.render(this.$refs.wet.clientWidth - 20);
      });
      return this.workingExcrept;
    }
  },
  components: {
    'geometric-shank-svg': GeometricShankSvg
  }
})
