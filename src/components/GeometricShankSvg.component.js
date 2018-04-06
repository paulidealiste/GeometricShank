import Vue from 'vue';
import UtilityMixin from '../mixins/utility.mixin';
import * as R from 'ramda';
import * as d3 from 'd3';
import { GeometricShankCutLines } from './svg-elements/GeometricShankCutLines.svg'
import { GeometricShankText } from './svg-elements/GeometricShankText.svg';

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
            cutPositions: null,
            selections: {
                baseSvg: null,
                svg: null,
                body: null
            },
            properties: {
                width: null,
                height: null,
                charWidth: null,
                lineHeight: null,
                clipID: null
            },
            elements: {
                gsln: null,
                gstx: null
            },
            heightPadding: 30,
            widthPadding: 0
        }
    },
    methods: {
        render: function () {
            this.wrapedExcrept = this.computeTextWrap(this.computedExcrept, this.properties.width-20, this.properties.lineHeight);
            this.structure();
            this.elements.gstx = new GeometricShankText(this.selections, this.properties);
            this.elements.gstx.bindDataAndRender(this.wrapedExcrept, this.wordCharClicked, this.getClicked);
            this.elements.gsln = new GeometricShankCutLines(this.selections, this.properties, this.elements.gstx.selections);
        },
        structure: function () {
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
        getClicked: function (line, mouseX, lineWidth) {
            return this.getClickedWord(line, mouseX, lineWidth).foundWord;
        },
        wordCharClicked: function (word) {
            this.$emit('sendCutupString', word);
        },
        cutTextGeometrically: function () {
            this.elements.gsln.drawCrossCut(this.wordsOnCutUpLines);
        },
        wordsOnCutUpLines: function (cutPositions) {
            this.cutPositions = cutPositions;
            this.$emit('sendCutupString', this.getAllWordsOnCutUpLines(this.cutPositions).join(' '));
        },
        pasteCutUpSegments: function () {
            this.$emit('clearCutupExcrept');
            let completeCutup = this.getCutUpSegments(this.cutPositions);
            this.$emit('sendCutupString', this.packCutupSegments(completeCutup, this.cutPositions.fieldColors));
        },
        setHW: function (svgClientRect) {
            this.properties.height = svgClientRect.height - this.heightPadding;
            this.properties.width = svgClientRect.width - this.widthPadding;
        },
    },
    mounted: function () {
        this.selections.baseSvg = d3.select(this.$el)
            .append('svg')
            .attr('width', '100%')
            .attr('height', '100%');
        this.setHW(this.selections.baseSvg.node().getBoundingClientRect());
        this.properties.charWidth = this.getCharWidth();
        this.properties.lineHeight = this.getLineHeight(this.$el);
        this.properties.clipID = this.getRandomID();
    }
}
