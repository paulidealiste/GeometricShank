import * as R from 'ramda';
import { select, selectAll, transition, easeLinear } from 'd3';


export function GeometricShankGrid(baseSelections, baseProperties, fieldColors) {
    this.baseSelections = baseSelections;
    this.baseProperties = baseProperties;
    this.fieldColors = fieldColors;
    this.selections = {
        verticalBounds: null,
        horizontalBounds: null,
        grid: null
    }
    this.gridDefinition = null;
    this.cells = null;
}

GeometricShankGrid.prototype = Object.create(GeometricShankGrid.prototype);
GeometricShankGrid.prototype.constructor = GeometricShankGrid;

GeometricShankGrid.prototype.calculate = function () {
    let _this = this;
    let sortVerticals = R.sortBy(R.prop('x1'));
    let sortHorizontals = R.sortBy(R.prop('y1'));
    let flatAppend = R.compose(R.flatten, R.append);
    let vl = _this.baseSelections.cutLines.enter().filter(d => d.x1 == d.x2).data();
    let hl = _this.baseSelections.cutLines.enter().filter(d => d.y1 == d.y2).data();
    _this.setBoundLines();
    vl = sortVerticals(flatAppend(this.selections.verticalBounds.enter().data(), vl));
    hl = sortHorizontals(flatAppend(this.selections.horizontalBounds.enter().data(), hl));
    let cols = _this.calculateCols(vl);
    let rows = _this.calculateRows(hl);
    _this.cells = _this.calculateCells(cols, rows, _this.fieldColors);
    _this.renderGrid();
};

GeometricShankGrid.prototype.calculateCells = function (cols, rows, colors) {
    let cells = [];
    let cid = 1;

    R.forEach((row) => {
        R.forEach((col) => {
            let cell = {
                width: col.width,
                height: row.height,
                cellID: cid,
                color: colors[cid - 1]
            }
            cells.push(cell);
            cid++;
        }, cols)
    }, rows);
    return cells;
};

GeometricShankGrid.prototype.calculateCols = function (vl) {
    let coldef = pair => {
        return {
            width: Math.abs(R.last(pair).x1 - R.head(pair).x1),
            height: R.head(pair).y2
        }
    };
    let cc = R.compose(R.map(coldef), R.aperture(2));
    return cc(vl);
};

GeometricShankGrid.prototype.calculateRows = function (hl) {
    let rowdef = pair => {
        return {
            width: R.head(pair).x2,
            height: Math.abs(R.last(pair).y1 - R.head(pair).y1)
        }
    };
    let cr = R.compose(R.map(rowdef), R.aperture(2));
    return cr(hl);
}

GeometricShankGrid.prototype.setBoundLines = function () {
    let _this = this;
    selectAll('line.verticalBounds').remove();
    selectAll('line.horizontalBounds').remove();
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
        .style('stroke', 'blue')
        .style('stroke-width', 0)
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
        .style('stroke-width', 0)
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

GeometricShankGrid.prototype.renderGrid = function () {
    let _this = this;
    select('div.gridHolderCarry').remove();
    let t = transition().duration(750).ease(easeLinear);

    let tlp = _this.baseSelections.baseSelections.svg.node().getBoundingClientRect();

    let gridHolder = select(document.createElement('div'))
        .attr('class', 'uk-flex uk-flex-wrap uk-position-absolute')
        .attr('style', d => 'width: ' + _this.baseProperties.width + 'px;' + 'top: ' + tlp.top + 'px; left: ' + tlp.left + 'px;');
    let grid = gridHolder.selectAll('div.gridCell')
        .data(_this.cells)
        .enter()
        .append('div')
        .attr('class', 'gridCell uk-flex uk-flex-middle uk-flex-center uk-overlay-default uk-heading-hero')
        .attr('style', d => 'color: ' + d.color + '; width: ' + d.width + 'px; height: ' + d.height + 'px')
        .html(d => '<div style="background-color:' + d.color + '; width: ' + d.width / 2 + 'px; height: ' + d.height / 2 + 'px"></div>');

    select("body")
        .append('div')
        .attr('class', 'gridHolderCarry')
        .html(gridHolder.node().outerHTML)
        .style('opacity', 0)
        .transition(t)
        .style('opacity', 1)
        .transition(t)
        .delay(1000)
        .style('opacity', 0)
        .remove();
};

GeometricShankGrid.prototype.getCells = function () {
    let _this = this;
    return _this.cells;
};