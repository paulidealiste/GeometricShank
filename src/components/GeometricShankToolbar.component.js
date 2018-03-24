export default ({
  template: `
    <div class="uk-section-xsmall uk-section-secondary uk-flex uk-width-1-1">
    <div class="uk-container">
        <ul class="uk-iconnav">
          <li v-on:click="nex" uk-tooltip="title: New random excrept">
            <a uk-icon="icon: comments"></a>
          </li>
          <li v-on:click="ctg" uk-tooltip="title: Cut text geometrically">
            <a uk-icon="icon: grid"></a>
          </li>
          <li v-on:click="pra" uk-tooltip="title: Paste randomizer">
            <a uk-icon="icon: file-edit"></a>
          </li>
          <li v-on:click="cal" uk-tooltip="title: Clear all">
            <a uk-icon="icon: trash"></a>
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
  }
})
