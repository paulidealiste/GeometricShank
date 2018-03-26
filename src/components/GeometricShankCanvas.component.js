import Vue from 'vue';
import UtilityMixin from '../mixins/utility.mixin';
import * as R from 'ramda';

export default {
    template: `
        <div class="uk-width-1-1 uk-height-1-1">
            <canvas ref="shankCanvas"></canvas>
        </div>
    `,
    props: ['computedExcrept'],
    mixins: [UtilityMixin],
    data: function() {
        return {
            ctx: null
        }
    },
    methods: {
        setCanvasDimensions: function() {
            this.$refs.shankCanvas.setAttribute('width', this.$el.clientWidth);
            this.$refs.shankCanvas.setAttribute('height', this.$el.clientHeight - 20);
        },
        getCanvasWidth: function() {
            return this.$refs.shankCanvas.clientWidth;
        },
        checkLengthAndRenderLine: function(word) {

        },
        fillCanvasTextWrap: function(text) {
            let words = this.computedExcrept.split(' ');
            R.forEach(this.checkLengthAndRenderLine, words);
        }
    },
    mounted: function() {
        this.setCanvasDimensions();
        this.ctx = this.$refs.shankCanvas.getContext("2d");
        this.ctx.font = window.getComputedStyle(this.$el).font;
    }
}