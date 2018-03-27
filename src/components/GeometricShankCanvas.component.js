import Vue from 'vue';
import UtilityMixin from '../mixins/utility.mixin';
import * as R from 'ramda';

export default {
    template: `
        <div class="uk-flex uk-position-relative uk-flex-column uk-width-1-1 uk-height-1-1 uk-overflow-auto uk-padding-small">
            <canvas class="uk-position-absolute" ref="shankCanvas"></canvas>
            <div class="uk-position-absolute uk-overflow-auto uk-padding-small">
                <div class="geometric-shank-canvas-line" v-for="line in wrapedText">
                    {{ line }}
                </div>
            </div>
        </div>
    `,
    props: ['computedExcrept'],
    mixins: [UtilityMixin],
    data: function () {
        return {
            ctx: null,
            wrapedText: []
        }
    },
    methods: {
        setCanvasDimensions: function () {
            this.$refs.shankCanvas.setAttribute('width', this.$el.clientWidth);
            this.$refs.shankCanvas.setAttribute('height', this.$el.clientHeight - 20);
        },
        calculateWrap: function (textAreaWidth) {
            this.wrapedText = this.computeTextWrap(this.computedExcrept, this.getTextWidth(this.ctx), textAreaWidth);
        }
    },
    mounted: function () {
        this.setCanvasDimensions();
        this.ctx = this.$refs.shankCanvas.getContext("2d");
        this.ctx.font = window.getComputedStyle(this.$el).font;
    }
}