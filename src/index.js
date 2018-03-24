import './stylesheets/main.scss';
import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';
UIkit.use(Icons);

import Vue from 'vue';
import GeometricShank from './components/GeometricShank.component';
import 'epic-spinners/dist/lib/epic-spinners.min.css'
import { TrinityRingsSpinner } from 'epic-spinners/dist/lib/epic-spinners.min.js'
  
// Component registration

Vue.component('geometric-shank', GeometricShank);
Vue.component('trinity-rings-spinner', TrinityRingsSpinner);

// Creating a root instance

new Vue ({
  el: '#GeometricShankApp'
});
