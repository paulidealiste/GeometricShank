<template>
  <div class="uk-flex uk-position-relative uk-flex-column uk-width-1-1 uk-height-1-1 uk-overflow-auto uk-padding-small">
  </div>
</template>

<script>
import UtilityMixin from "../mixins/utility.mixin";
import * as d3 from "d3";
import { GeometricShankCutLines } from "./svg-elements/GeometricShankCutLines.svg";
import { GeometricShankText } from "./svg-elements/GeometricShankText.svg";
import { GeometricShankHTML } from "./svg-elements/GeometricShankHTML.svg";
import { GeometricShankFreehand } from "./svg-elements/GeometricShankFreehand.svg";

export default {
  props: ["computedExcrept"],
  mixins: [UtilityMixin],
  data: function() {
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
        gstx: null,
        gsht: null,
        gsfh: null
      },
      heightPadding: 30,
      widthPadding: 0
    };
  },
  methods: {
    render: function() {
      this.wrapedExcrept = this.computeTextWrap(
        this.computedExcrept,
        this.properties.width - 20,
        this.properties.lineHeight
      );
      this.structure();
      this.elements.gstx = new GeometricShankText(
        this.selections,
        this.properties
      );
      this.elements.gstx.bindDataAndRender(
        this.wrapedExcrept,
        this.wordCharClicked,
        this.getClicked
      );
      this.elements.gsln = new GeometricShankCutLines(
        this.selections,
        this.properties,
        this.elements.gstx.selections
      );
      this.elements.gsht = new GeometricShankHTML();
      this.elements.gsfh = new GeometricShankFreehand(
        this.selections,
        this.properties,
        this.wordsOnFreehandPath
      );
    },
    structure: function() {
      if (this.selections.svg != null) {
        this.selections.svg.remove();
        d3.select("div.gridHolderCarry").remove();
      }
      this.selections.svg = this.selections.baseSvg.append("g");
      this.selections.svg
        .append("defs")
        .append("clipPath")
        .attr("id", this.properties.clipID)
        .append("rect")
        .attr("width", this.properties.width)
        .attr("height", this.properties.height);
      this.selections.body = this.selections.svg
        .append("rect")
        .attr("class", "noFill")
        .attr("width", this.properties.width)
        .attr("height", this.properties.height);
    },
    getClicked: function(line, mouseX, lineWidth) {
      return this.getClickedWord(line, mouseX, lineWidth).foundWord;
    },
    wordCharClicked: function(word) {
      this.$emit("sendCutupString", word);
    },
    cutTextGeometrically: function() {
      this.elements.gsln.drawCrossCut(this.wordsOnCutUpLines);
    },
    manageFreehandMode: function(freehand) {
      if (freehand) {
        this.selections.svg.attr("class", "cutWordsCursor");
        this.elements.gstx.setCursor(true);
        this.elements.gsfh.switchOn(this.elements.gstx.selections);
      } else {
        this.selections.svg.attr("class", "");
        this.elements.gstx.setCursor(false);
        this.elements.gsfh.switchOff();
      }
    },
    wordsOnFreehandPath: function(freehandCutpositions) {
      this.$emit(
        "sendCutupString",
        this.prepareAndSetFreehandCutup(freehandCutpositions).join(" ")
      );
    },
    wordsOnCutUpLines: function(cutPositions) {
      this.cutPositions = cutPositions;
      this.$emit(
        "sendCutupString",
        this.getAllWordsOnCutUpLines(this.cutPositions).join(" ")
      );
    },
    pasteCutUpSegments: function() {
      if (this.cutPositions) {
        let completeCutup = this.getCutUpSegments(this.cutPositions);
        let completeCutupSegments = this.packCutupSegments(
          completeCutup,
          this.cutPositions.fieldColors
        );
        let simpleHTML = this.elements.gsht.simpleHTMLSegments(
          completeCutupSegments
        );
        let linedCutupSegments = this.lineCompleteCutupColor(
          completeCutupSegments
        );
        let packedHTML = this.elements.gsht.packedHTMLSegments(
          linedCutupSegments
        );
        // this.elements.gsln.getGridCells()
        // this.$emit('sendCutupString', simpleHTML);
        this.$emit("sendPackageString", packedHTML);
      }
    },
    showSegments: function() {
      this.elements.gsln.showSegments();
    },
    setHW: function(svgClientRect) {
      this.properties.height = svgClientRect.height - this.heightPadding;
      this.properties.width = svgClientRect.width - this.widthPadding;
    },
    resizeListener: function() {
      this.selections.baseSvg.remove();
      this.selections.baseSvg = d3
        .select(this.$el)
        .append("svg")
        .attr("width", "100%")
        .attr("height", "100%");
      this.$nextTick(function() {
        this.setHW(this.selections.baseSvg.node().getBoundingClientRect());
        this.render();
      });
    }
  },
  mounted: function() {
    this.selections.baseSvg = d3
      .select(this.$el)
      .append("svg")
      .attr("width", "100%")
      .attr("height", "100%");
    this.$nextTick(function() {
      this.setHW(this.selections.baseSvg.node().getBoundingClientRect());
    });
    this.properties.charWidth = this.getCharWidth();
    this.properties.lineHeight = this.getLineHeight(this.$el);
    this.properties.clipID = this.getRandomID();
  }
};
</script>

<style>
</style>
