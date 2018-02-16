import './stylesheets/main.scss';
import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';
UIkit.use(Icons);

import Vue from 'vue';
import GeometricShank from './components/GeometricShank.component';

// Component registration

Vue.component('geometric-shank', GeometricShank);

// Creating a root instance

new Vue ({
  el: '#GeometricShankApp'
});
