import * as R from 'ramda';
import * as d3 from 'd3';

export function GeometricShankGrid(baseSelections, baseProperties, fieldColors) {
    this.baseSelections = baseSelections;
    this.baseProperties = baseProperties;
    this.fieldColors = fieldColors;
    this.selections = {
        verticalBounds: null,
        horizontalBounds: null
    }
    this.gridDefinition = null;
}

GeometricShankGrid.prototype = Object.create(GeometricShankGrid.prototype);
GeometricShankGrid.prototype.constructor = GeometricShankGrid;

GeometricShankGrid.prototype.calculate = function () {
    let _this = this;
    let cellNumber = _this.baseSelections.cutLines.enter().nodes().length * _this.baseSelections.cutLines.enter().nodes().length;
    let vl = _this.baseSelections.cutLines.enter().filter(d => d.x1 == d.x2);
    let hl = _this.baseSelections.cutLines.enter().filter(d => d.y1 == d.y2);
    _this.setBoundLines();
}

GeometricShankGrid.prototype.setBoundLines = function() {
    let _this = this;
    if (this.selections.verticalBounds) this.selections.verticalBounds.remove();
    if (this.selections.horizontalBounds) this.selections.horizontalBounds.remove();
    let vbData = [{
        x1: 0,
        y1: 0,
        x2: 0,
        y2: _this.baseProperties.height,
    }, {
        x1: _this.baseProperties.width,
        y1: 0,
        x2: _this.baseProperties.width,
        y2: _this.baseProperties.height,
    }];
    let hbData = [{
        x1: 0,
        y1: 0,
        x2: _this.baseProperties.width,
        y2: 0,
    }, {
        x1: 0,
        y1: _this.baseProperties.height,
        x2: _this.baseProperties.width,
        y2: _this.baseProperties.height,
    }];
    _this.selections.horizontalBounds = _this.baseSelections.cutLinesContainer.selectAll('line.horizontalBounds').data(hbData);
    _this.selections.horizontalBounds
        .enter()
        .append('line')
        .style('stroke', 'aquamarine')
        .style('stroke-width', 2)
        .attr('class', 'horizontalBounds')
        .attr('clip-path', 'url(#' + _this.baseProperties.clipID + ')')
        .attr('x1', function (d) { return d.x1 })
        .attr('y1', function (d) { return d.y1 })
        .attr('x2', function (d) { return d.x2 })
        .attr('y2', function (d) { return d.y2 });
    _this.selections.horizontalBounds
        .merge(_this.selections.horizontalBounds);
    _this.selections.horizontalBounds.exit().remove();

    _this.selections.verticalBounds = _this.baseSelections.cutLinesContainer.selectAll('line.verticalBounds').data(vbData);
    _this.selections.verticalBounds
        .enter()
        .append('line')
        .style('stroke', 'aquamarine')
        .style('stroke-width', 2)
        .attr('class', 'verticalBounds')
        .attr('clip-path', 'url(#' + _this.baseProperties.clipID + ')')
        .attr('x1', function (d) { return d.x1 })
        .attr('y1', function (d) { return d.y1 })
        .attr('x2', function (d) { return d.x2 })
        .attr('y2', function (d) { return d.y2 });
    _this.selections.verticalBounds
        .merge(_this.selections.verticalBounds);
    _this.selections.verticalBounds.exit().remove();
};