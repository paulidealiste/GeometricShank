const electron = window.require("electron");

export default ({
  template: `
    <div class="uk-flex uk-text-small uk-flex-1">
      <div class="uk-flex uk-width-1-3@s uk-flex-1 uk-padding-small">
        <div class="uk-card uk-card-default uk-card-body uk-width-1-1 uk-flex uk-flex-1">
          <form class="uk-flex uk-flex-1">
             <textarea v-model="workingExcrept" class="uk-textarea"></textarea>
          </form>
        </div>
      </div>
      <div class="uk-flex uk-width-1-3@s uk-flex-1 uk-padding-small">
        <div class="uk-card uk-card-primary uk-card-body uk-width-1-1 uk-flex uk-flex-1">
          <p class="uk-text-small">
            {{ computedExcrept }}
          </p>
        </div>
      </div>
      <div class="uk-flex uk-width-1-3@s uk-flex-1 uk-padding-small">
        <div class="uk-card uk-card-default uk-card-body uk-width-1-1 uk-flex uk-flex-1">
          <p class="uk-text-small">Lorem ipsum <a href="#">dolor</a> sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        </div>
      </div>
    </div>
  `,
  data: function() {
    return {
      workingExcrept: ''
    };
  },
  methods: {
    newRandomExcrept: function() {
      electron.ipcRenderer.send('reachForExcrept');
      electron.ipcRenderer.on('excreptReached', (event, arg) => {
        this.workingExcrept = arg;
      });
    }
  },
  computed: {
    computedExcrept: function() {
      return this.workingExcrept + Math.random();
    }
  }
})
