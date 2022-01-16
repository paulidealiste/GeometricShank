import * as R from 'ramda';
import { drag, select } from 'd3';
import { GeometricShankGrid } from './GeometricShankGrid.svg';

export function GeometricShankCutLines(baseSelections, baseProperties, textLineSelections) {
    this.selections = {
        baseSelections: baseSelections,
        cutLinesContainer: null,
        cutLines: null,
        auxCutLines: null,
    };
    this.grid = null;
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
    this.segmentPalette = [
        '#00A0B0',
        '#FF7A22',
        '#99173C',
        '#6A4A3C',
        '#005F6B',
        '#00B4CC',
        '#555152',
        '#2E2633'
    ];
    this.dragBumper = { h: baseProperties.width * 0.2, v: baseProperties.height * 0.1 };
    this.dragBounds = { top: 0 + this.dragBumper.v, left: 0 + this.dragBumper.h, bottom: baseProperties.height - this.dragBumper.h, right: baseProperties.width - this.dragBumper.v };
}

GeometricShankCutLines.prototype = Object.create(GeometricShankCutLines.prototype);
GeometricShankCutLines.prototype.constructor = GeometricShankCutLines;

GeometricShankCutLines.prototype.drawCrossCut = function (getAllWordsOnCutUpLines) {
    let _this = this;
    _this.callbacks.getAllWordsOnCutUpLines = getAllWordsOnCutUpLines;
    if (_this.selections.cutLinesContainer) _this.selections.cutLinesContainer.remove();
    _this.selections.cutLinesContainer = _this.selections.baseSelections.svg
        .append('g')
        .attr('class', 'cutLinesContainer');
    _this.drawCutLines();
    _this.drawAuxCutLines();
    _this.displaySegmentNumbering();
    _this.calculateCutPositions();
    _this.callbacks.getAllWordsOnCutUpLines(_this.cutPositions);
};

GeometricShankCutLines.prototype.drawCutLines = function () {
    let _this = this;
    let cutLinesData = [{
        x1: _this.baseProperties.width / 2,
        y1: 0,
        x2: _this.baseProperties.width / 2,
        y2: _this.baseProperties.height,
    }, {
        x1: 0,
        y1: _this.baseProperties.height / 2,
        x2: _this.baseProperties.width,
        y2: _this.baseProperties.height / 2,
    }];
    _this.selections.cutLines = _this.selections.cutLinesContainer.selectAll('line.cutLine').data(cutLinesData);
    _this.selections.cutLines
        .enter()
        .append('line')
        .style('stroke', '#FF0066')
        .style('stroke-width', 2)
        .attr('class', 'cutLinesGrab')
        .attr('clip-path', 'url(#' + _this.baseProperties.clipID + ')')
        .attr('x1', function (d) { return d.x1 })
        .attr('y1', function (d) { return d.y1 })
        .attr('x2', function (d) { return d.x2 })
        .attr('y2', function (d) { return d.y2 })
        .call(drag().on('start', function (d, i, k) {
            return _this.cutLineDragStart(d, i, k);
        }).on('drag', function (d, i, k) {
            return _this.cutLineDragging(d, i, k);
        }).on('end', function (d, i, k) {
            return _this.cutLineDragEnd(d, i, k);
        }));
    _this.selections.cutLines
        .merge(_this.selections.cutLines);
    _this.selections.cutLines.exit().remove();
};

GeometricShankCutLines.prototype.cutLineDragStart = function (d, i, k) {
    let _this = this;
}

GeometricShankCutLines.prototype.cutLineDragging = function (d, i, k) {
    let _this = this;
    let line = select(k[i]);
    if (d.x1 == d.x2) {
        if (d.x1 + event.dx > _this.dragBounds.left && d.x1 + event.dx < _this.dragBounds.right) {
            d.x1 += event.dx;
            d.x2 = d.x1;
        }
    } else if (d.y1 == d.y2) {
        if (d.y1 + event.dy > _this.dragBounds.top && d.y1 + event.dy < _this.dragBounds.bottom) {
            d.y1 += event.dy;
            d.y2 = d.y1;
        }
    }
    line
        .attr('x1', d.x1)
        .attr('y1', d.y1)
        .attr('x2', d.x2)
        .attr('y2', d.y2)
}

GeometricShankCutLines.prototype.cutLineDragEnd = function (d, i, k) {
    let _this = this;
    _this.calculateCutPositions();
    _this.callbacks.getAllWordsOnCutUpLines(_this.cutPositions);
    _this.displaySegmentNumbering();
}

GeometricShankCutLines.prototype.drawAuxCutLines = function () {
    let _this = this;
    _this.cutPositions.lines = [];

    _this.textLineSelections.textLinesContainer.selectAll('text').each(function (d, i, k) {
        let cutext = select(k[i]);
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
        .style('stroke', 'none')
        .attr('clip-path', 'url(#' + _this.baseProperties.clipID + ')')
        .attr('x1', function (d) { return d.x1 })
        .attr('y1', function (d) { return d.y1 })
        .attr('x2', function (d) { return d.x2 })
        .attr('y2', function (d) { return d.y2 });
    _this.selections.auxCutLines
        .merge(_this.selections.cutLines);
    _this.selections.auxCutLines.exit().remove();
};

GeometricShankCutLines.prototype.calculateCutPositions = function () {
    let _this = this;
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

GeometricShankCutLines.prototype.displaySegmentNumbering = function () {
    let _this = this;
    _this.grid = new GeometricShankGrid(_this.selections, _this.baseProperties, _this.segmentPalette);
    _this.grid.calculate();
}

GeometricShankCutLines.prototype.showSegments = function () {
    let _this = this;
    _this.grid.renderGrid();
}

GeometricShankCutLines.prototype.getGridCells = function () {
    let _this = this;
    return _this.grid.getCells();
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