import { select } from 'd3';

export function GeometricShankText(baseSelections, baseProperties) {
    this.selections = {
        baseSelections: baseSelections,
        textLinesContainer: null,
        textLines: null
    };
    this.baseProperties = baseProperties;
    this.callbacks = {
        wordCharClicked: null,
        getClickedWord: null
    };
}

GeometricShankText.prototype = Object.create(GeometricShankText.prototype);
GeometricShankText.prototype.constructor = GeometricShankText;

GeometricShankText.prototype.bindDataAndRender = function (data, wcCallback, gcCallback) {
    let _this = this;
    _this.callbacks.wordCharClicked = wcCallback;
    _this.callbacks.getClickedWord = gcCallback;
    _this.selections.textLinesContainer = _this.selections.baseSelections.svg
        .append('g')
        .attr('class', 'textLineContainer');
    _this.renderTextLines(data);
};

GeometricShankText.prototype.renderTextLines = function (data) {
    let _this = this;
    _this.selections.textLines = _this.selections.textLinesContainer.selectAll('text.textLineLine')
        .data(data, function (d) { return d; });
    _this.selections.textLines
        .enter()
        .append('text')
        .attr('class', 'textLineLine selectWordCursor noselect')
        .attr('x', 0)
        .attr('y', (d, i) => {
            return (i + 1) * _this.baseProperties.lineHeight
        })
        .attr('clip-path', 'url(#' + _this.baseProperties.clipID + ')')
        .text((d) => { return d })
        .on('click', (event, d) => {
            let word = _this.callbacks.getClickedWord(d, event.layerX, select(event.target).node().getBBox().width);
            _this.callbacks.wordCharClicked(word);
        });
    _this.selections.textLines
        .merge(_this.selections.textLines);
    _this.selections.textLines.exit().remove();
};

GeometricShankText.prototype.setCursor = function (freehand) {
    let _this = this;
    if (_this.selections.textLines) {
        if (freehand) {
            _this.selections.textLinesContainer.selectAll('text').attr('class', 'textLineLine cutWordsCursor noselect');
        } else {
            _this.selections.textLinesContainer.selectAll('text').attr('class', 'textLineLine selectWordCursor noselect');
        }
    }
};