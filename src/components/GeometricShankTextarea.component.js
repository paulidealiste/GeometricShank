export default ({
    template: `
    <form class="uk-flex uk-flex-1">
        <trinity-rings-spinner v-show="loading" class="uk-position-center"
            :animation-duration="1500"
            :size="66"
            :color="'#fbbb29'"></trinity-rings-spinner>
        <textarea v-model="internalComputedExcrept" class="uk-textarea" @keydown="userTyping"></textarea>
    </form>
    `,
    props: ['loading', 'computedExcrept', 'charLimit'],
    computed: {
        internalComputedExcrept: {
            get() { return this.computedExcrept },
            set(v) { this.$emit('ut', v) }
        }
    },
    methods: {
        userTyping(evt) {
            if (this.computedExcrept.length >= this.charLimit) {
                if (evt.keyCode >= 48 && evt.keyCode <= 90) {
                    evt.preventDefault()
                    return
                }
            }
        }
    }

});