import './stylesheets/main.scss';
import i18n from './locales/index';
import * as UIkit from 'uikit';
import * as Icons from 'uikit/dist/js/uikit-icons.js'

UIkit.use(Icons);

import Vue from 'vue';
import GeometricShank from './components/GeometricShank.component';
  
// Component registration

Vue.component('geometric-shank', GeometricShank);

// Creating a root instance

new Vue ({
  template: `
    <div id="GeometricShankApp">
      <geometric-shank></geometric-shank>
    </div>`,
  el: '#app',
  i18n
});
