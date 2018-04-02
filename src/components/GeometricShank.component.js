import GeometricShankToolbar from './GeometricShankToolbar.component';
import GeometricShankWindow from './GeometricShankWindow.component';
const electron = window.require("electron");

export default ({
  template: `
  <div class="uk-flex uk-flex-column uk-height-viewport">
    <nav class="uk-navbar-container geometric-shank-navbar" uk-navbar>
      <div class="uk-navbar-left">
          <ul class="uk-navbar-nav">
            <li class="uk-active">
                 <a href="#">
                     <div>
                         <span class="uk-text-bold">Geometric shank</span>
                         <div class="uk-navbar-subtitle">Cut-up method spike</div>
                     </div>
                 </a>
             </li>
          </ul>
      </div>
    </nav>
    <div class="uk-flex">
      <geometric-shank-toolbar v-on:nex="newRandomExcrept" v-on:cal="clearCutupExcrept" v-on:ctg="cutTextGeometrically" v-on:pra="pasteCutUpSegments"></geometric-shank-toolbar>
    </div>
    <div class="uk-flex uk-flex-1">
      <geometric-shank-window ref="gsw"></geometric-shank-window>
    </div>
  </div>
  `,
  methods: {
    newRandomExcrept: function() {
      this.$refs.gsw.newRandomExcrept();
    },
    cutTextGeometrically: function() {
      this.$refs.gsw.cutTextGeometrically();
    },
    pasteCutUpSegments: function() {
      this.$refs.gsw.pasteCutUpSegments();
    },
    clearCutupExcrept: function() {
      this.$refs.gsw.clearCutupExcrept();
    }
  },
  components: {
    'geometric-shank-toolbar': GeometricShankToolbar,
    'geometric-shank-window': GeometricShankWindow
  }
})
