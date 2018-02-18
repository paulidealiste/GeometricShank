import FontAwesomeIcon from '@fortawesome/vue-fontawesome';
import { faRandom, faCut, faPaste, faTrash } from '@fortawesome/fontawesome-free-solid';

export default ({
  template: `
    <div class="uk-section-xsmall uk-section-secondary uk-flex uk-width-1-1">
      <div class="uk-container">
        <ul class="uk-iconnav">
          <li v-on:click="nex" uk-tooltip="title: New random excrept">
            <a><font-awesome-icon :icon="randomIcon" /></a>
          </li>
          <li v-on:click="ctg" uk-tooltip="title: Cut text geometrically">
            <a><font-awesome-icon :icon="cutIcon" /></a>
          </li>
          <li v-on:click="pra" uk-tooltip="title: Paste randomizer">
            <a><font-awesome-icon :icon="pasteIcon" /></a>
          </li>
          <li v-on:click="cal" uk-tooltip="title: Clear all">
            <a><font-awesome-icon :icon="trashIcon" /></a>
          </li>
        </ul>
      </div>
    </div>
  `,
  methods: {
    nex: function() {
      this.$emit('nex');
    },
    ctg: function() {
      this.$emit('ctg');
    },
    pra: function() {
      this.$emit('pra');
    },
    cal: function() {
      this.$emit('cal');
    },
  },
  computed: {
    randomIcon () {
      return faRandom;
    },
    cutIcon () {
      return faCut;
    },
    pasteIcon () {
      return faPaste;
    },
    trashIcon () {
      return faTrash;
    }
  },
  components: {
    FontAwesomeIcon
  }
})
