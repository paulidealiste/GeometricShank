const electron = window.require("electron");
import Vue from 'vue';
import GeometricShankCanvas from './GeometricShankCanvas.component';

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
            <textarea v-model="workingExcrept" class="uk-textarea"></textarea>
          </form>
        </div>
      </div>
      <div class="uk-flex uk-width-1-3@s uk-flex-1 uk-padding-small">
        <div class="uk-card uk-card-primary uk-card-body uk-width-1-1 uk-flex uk-flex-1 uk-overflow-auto uk-padding-small">
          <geometric-shank-canvas v-bind:computed-excrept="computedExcrept"></geometric-shank-canvas>
        </div>
      </div>
      <div class="uk-flex uk-width-1-3@s uk-flex-1 uk-padding-small">
        <div class="uk-card uk-card-default uk-card-body uk-width-1-1 uk-flex uk-flex-1">
          <p class="uk-text-small uk-position-cover uk-padding-small">Lorem ipsum <a href="#">dolor</a> sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        </div>
      </div>
    </div>
  `,
  data: function() {
    return {
      workingExcrept: '',
      loading: false
    };
  },
  methods: {
    newRandomExcrept: function() {
      this.loading = true;
      electron.ipcRenderer.send('reachForExcrept');
      electron.ipcRenderer.on('excreptReached', (event, arg) => {
        this.workingExcrept = arg.replace(/[\r\n]/g, ' ').trim();
        this.loading = false;
      });
    }
  },
  computed: {
    computedExcrept: function() {
      return this.workingExcrept;
    }
  },
  components: {
    'geometric-shank-canvas': GeometricShankCanvas
  }
})
