import * as R from 'ramda';

export function GeometricShankCutLines(baseSelections, baseProperties, textLineSelections) {
    this.selections = {
        baseSelections: baseSelections,
        cutLinesContainer: null,
        cutLines: null,
        auxCutLines: null
    };
    this.baseProperties = baseProperties;
    this.textLineSelections = textLineSelections;
    this.cutLinesData = null;
    this.properties = {
        icw: null
    }
}

GeometricShankCutLines.prototype = Object.create(GeometricShankCutLines.prototype);
GeometricShankCutLines.prototype.constructor = GeometricShankCutLines;

GeometricShankCutLines.prototype.drawCrossCut = function () {
    var _this = this;
    _this.selections.cutLinesContainer = _this.selections.baseSelections.svg
        .append('g')
        .attr('class', 'cutLinesContainer');
    _this.drawCutLines();
    _this.drawAuxCutLines();
};

GeometricShankCutLines.prototype.drawCutLines = function () {
    var _this = this;
    let cutLinesData = [{
        x1: _this.baseProperties.width / 2,
        y1: 0,
        x2: _this.baseProperties.width / 2,
        y2: _this.baseProperties.height
    }, {
        x1: 0,
        y1: _this.baseProperties.height / 2,
        x2: _this.baseProperties.width,
        y2: _this.baseProperties.height / 2
    }];
    _this.selections.cutLines = _this.selections.cutLinesContainer.selectAll('line.cutLine').data(cutLinesData);
    _this.selections.cutLines
        .enter()
        .append('line')
        .style('stroke', 'red')
        .attr('x1', function (d) { return d.x1 })
        .attr('y1', function (d) { return d.y1 })
        .attr('x2', function (d) { return d.x2 })
        .attr('y2', function (d) { return d.y2 });
    _this.selections.cutLines
        .merge(_this.selections.cutLines);
    _this.selections.cutLines.exit().remove();
};

GeometricShankCutLines.prototype.drawAuxCutLines = function () {
    var _this = this;
    let lineDef = {
        x1: 0,
        y1: _this.baseProperties.lineHeight,
        x2: _this.baseProperties.width,
        y2: _this.baseProperties.lineHeight
    };
    let allAuxLines = R.repeat(lineDef, _this.textLineSelections.textLines.enter().data().length);
    let mapIndexed = R.addIndex(R.map);
    let mapToLineHeight = (ld, idx) => {
        let l = R.clone(ld);
        l.y2 *= idx + 1;
        l.y1 *= idx + 1;
        return l;
    }
    allAuxLines = mapIndexed(mapToLineHeight, allAuxLines);
    _this.selections.auxCutLines = _this.selections.cutLinesContainer.selectAll('line.cutLine').data(allAuxLines);
    _this.selections.auxCutLines
        .enter()
        .append('line')
        .style('stroke', 'grey')
        .attr('x1', function (d) { return d.x1 })
        .attr('y1', function (d) { return d.y1 })
        .attr('x2', function (d) { return d.x2 })
        .attr('y2', function (d) { return d.y2 });
    _this.selections.auxCutLines
        .merge(_this.selections.cutLines);
    _this.selections.auxCutLines.exit().remove();
};