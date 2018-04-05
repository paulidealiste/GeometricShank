import * as d3 from 'd3';
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
    this.cutPositions = {
        verticalCut: [],
        horizontalCut: [],
        lines: [],
        fieldNumber: 0,
        fieldColors: []
    };
    this.callbacks = {
        getAllWordsOnCutUpLines: null
    };
    this.segmentPalette = ['#1693A5', '#ADD8C7', '#FBB829', '#FF0066', '#556270', '#ff6666', '#ff8080', '#fbbb29', '#ff9900', '#ff7a22', '#1693a5', '#036564'];
}

GeometricShankCutLines.prototype = Object.create(GeometricShankCutLines.prototype);
GeometricShankCutLines.prototype.constructor = GeometricShankCutLines;

GeometricShankCutLines.prototype.drawCrossCut = function (getAllWordsOnCutUpLines) {
    var _this = this;
    _this.callbacks.getAllWordsOnCutUpLines = getAllWordsOnCutUpLines;
    _this.selections.cutLinesContainer = _this.selections.baseSelections.svg
        .append('g')
        .attr('class', 'cutLinesContainer');
    _this.drawCutLines();
    _this.drawAuxCutLines();
    _this.calculateCutPositions();
    _this.callbacks.getAllWordsOnCutUpLines(_this.cutPositions);
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
    _this.cutPositions.lines = [];

    _this.textLineSelections.textLinesContainer.selectAll('text').each(function(d, i, k) {
        let cutext = d3.select(k[i]);
        let lineDef = {
            x1: 0,
            y1: parseFloat(cutext.attr('y')),
            x2: _this.baseProperties.width,
            y2: parseFloat(cutext.attr('y')),
            lineWidth: cutext.node().getBBox().width,
            lineText: d
        };
        _this.cutPositions.lines.push(lineDef);
     });

    _this.selections.auxCutLines = _this.selections.cutLinesContainer.selectAll('line.cutLine').data(_this.cutPositions.lines);
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

GeometricShankCutLines.prototype.calculateCutPositions = function () {
    var _this = this;
    _this.cutPositions.horizontalCut = [];
    _this.cutPositions.verticalCut = [];
    _this.cutPositions.fieldNumber = _this.selections.cutLines.enter().nodes().length * _this.selections.cutLines.enter().nodes().length;
    _this.cutPositions.fieldColors = R.take(_this.cutPositions.fieldNumber, _this.segmentPalette);
    _this.selections.cutLines.enter().each(function (d) {
        if (d.y1 == d.y2) {
            _this.cutPositions.horizontalCut.push(d);
        } else {
            _this.selections.auxCutLines.enter().each(function (e) {
                let inter = _this.calculateIntersection(d, e);
                _this.cutPositions.verticalCut.push(inter);
            });
        }
    });
}

GeometricShankCutLines.prototype.calculateIntersection = function (l1, l2) {
    let a1 = l1.y2 - l1.y1;
    let b1 = l1.x1 - l1.x2;
    let c1 = a1 * l1.x1 + b1 * l1.y1;

    let a2 = l2.y2 - l2.y1;
    let b2 = l2.x1 - l2.x2;
    let c2 = a2 * l2.x1 + b2 * l2.y1;

    let determinant = a1 * b2 - a2 * b1;
    let xi = (b2 * c1 - b1 * c2) / determinant;
    let yi = (a1 * c2 - a2 * c1) / determinant;

    return {
        x: xi,
        y: yi
    }
};