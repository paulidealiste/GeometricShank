import Vue from 'vue';
import UtilityMixin from '../mixins/utility.mixin';
import * as R from 'ramda';
import * as d3 from 'd3';

export default {
    template: `
        <div class="uk-flex uk-position-relative uk-flex-column uk-width-1-1 uk-height-1-1 uk-overflow-auto uk-padding-small">
        </div>
    `,
    props: ['computedExcrept'],
    mixins: [UtilityMixin],
    data: function () {
        return {
            wrapedExcrept: [],
            ctx: null,
            selections: {
                baseSvg: null,
                svg: null,
                body: null,
                textContainer: null,
                textLines: null
            },
            properties: {
                width: null,
                height: null,
                charWidth: null,
                lineHeight: null,
                clipID: null
            },
            heightPadding: 30,
            widthPadding: 10
        }
    },
    methods: {
        render: function (textBoxWidth) {
            this.wrapedExcrept = this.computeTextWrap(this.computedExcrept, this.properties.charWidth, textBoxWidth);
            this.structure();
            this.bind();
        },
        structure: function () {
            let custom = document.createElement('custom');
            if (this.selections.svg != null) this.selections.svg.remove();
            this.selections.svg = this.selections.baseSvg
                .append('g');
            this.selections.svg
                .append('defs')
                .append('clipPath')
                .attr('id', this.properties.clipID)
                .append('rect')
                .attr('width', this.properties.width)
                .attr('height', this.properties.height);
            this.selections.body = this.selections.svg
                .append('rect')
                .attr('class', 'noFill')
                .attr('width', this.properties.width)
                .attr('height', this.properties.height);
        },
        bind: function () {
            this.selections.textLines = this.selections.svg.selectAll('text.excreptLine').data(this.wrapedExcrept)
                .enter()
                .append('text')
                .attr('class', 'excreptLine noselect')
                .attr('x', 0)
                .attr('y', (d, i) => {
                    return (i + 1) * this.properties.lineHeight
                })
                .text((d) => { return d })
                .on('click', (d, i, k) => {
                    let word = this.getClickedWord(d, d3.mouse(k[i])[0], d3.select(k[i]).node().getBBox().width);
                    this.$emit('clickedWord', word);
                });
            //Update
            this.selections.textLines
                .merge(this.selections.textLines);
            //Exit
            let exit = this.selections.textLines.exit().remove();
        },
        setHW: function () {
            this.properties.height = this.$el.clientHeight - this.heightPadding;
            this.properties.width = this.$el.clientWidth - this.widthPadding;
        }
    },
    mounted: function () {
        this.setHW();
        this.selections.baseSvg = d3.select(this.$el)
            .append('svg')
            .attr('width', this.properties.width)
            .attr('height', this.properties.height);
        this.properties.charWidth = this.getCharWidth(window.getComputedStyle(this.$el).font);
        this.properties.lineHeight = this.getLineHeight(this.$el);
        this.properties.clipID = this.getRandomID();
    }
}
