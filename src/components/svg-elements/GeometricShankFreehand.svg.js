import * as d3 from 'd3';
import * as R from 'ramda';

export function GeometricShankFreehand(baseSelections, baseProperties, freehandDragEnd) {
    this.selections = {
        baseSelections: baseSelections,
        activeFreehandContainer: null,
        activeFreehand: null
    };
    this.callbacks = {
        freehandDragEnd: freehandDragEnd
    }
    this.baseProperties = baseProperties;
    this.textLines = null;
    this.freehandCurveGenerator = d3.line()
        .curve(d3.curveBasis)
        .x(function (d) { return d.x })
        .y(function (d) { return d.y });
    this.freehandDragBehaviourElement = null;
    this.freehandCutpositions = {
        xPos: null,
        yPos: null,
        line: null
    };
    this.dragObject = {
        path: null
    };
    this.transition = d3.transition().duration(350).ease(d3.easeLinear);
}

GeometricShankFreehand.prototype = Object.create(GeometricShankFreehand.prototype);
GeometricShankFreehand.prototype.constructor = GeometricShankFreehand;

GeometricShankFreehand.prototype.switchOn = function (textLineSelections) {
    let _this = this;
    _this.createTextLines(textLineSelections);
    _this.selections.activeFreehandContainer = _this.selections.baseSelections.svg
        .append('g')
        .attr('class', 'activeFreehandContainer');
    _this.freehandDragBehaviourElement = _this.selections.baseSelections.svg
        .call(d3.drag().on('start', function () {
            return _this.freehandDragStart();
        }).on('drag', function () {
            return _this.freehandDragging();
        }).on('end', function () {
            return _this.freehandDragEnd();
        }));
};

GeometricShankFreehand.prototype.createTextLines = function (textLineSelections) {
    let _this = this;
    _this.textLines = [];
    if (textLineSelections) {
        textLineSelections.textLinesContainer.selectAll('text').each(function (d, i, k) {
            let cutext = d3.select(k[i]);
            let lineDef = {
                x1: 0,
                y1: parseFloat(cutext.attr('y')),
                x2: _this.baseProperties.width,
                y2: parseFloat(cutext.attr('y')),
                lineWidth: cutext.node().getBBox().width,
                lineText: d
            };
            _this.textLines.push(lineDef);
        });
    }
};

GeometricShankFreehand.prototype.freehandDragStart = function () {
    let _this = this;
    _this.dragObject.path = [d3.event.subject];
    if (_this.selections.activeFreehand) _this.clear();
    _this.selections.activeFreehand = _this.selections.activeFreehandContainer
        .append('path')
        .datum(_this.dragObject.path)
        .attr('class', 'activeFreehand')
        .attr('clip-path', 'url(#' + _this.baseProperties.clipID + ')');
    _this.dragObject.x0 = d3.event.x;
    _this.dragObject.y0 = d3.event.y;
};

GeometricShankFreehand.prototype.freehandDragging = function () {
    let _this = this;
    _this.dragObject.x1 = d3.event.x;
    _this.dragObject.y1 = d3.event.y;
    let dx = _this.dragObject.x1 - _this.dragObject.x0;
    let dy = _this.dragObject.y1 - _this.dragObject.y0;
    if (dx * dx + dy * dy > 100) {
        _this.dragObject.x0 = _this.dragObject.x1;
        _this.dragObject.y0 = _this.dragObject.y1;
        _this.dragObject.path.push({
            x: _this.dragObject.x0,
            y: _this.dragObject.y0
        });
    } else {
        _this.dragObject.path[_this.dragObject.path.length - 1] = {
            x: _this.dragObject.x1,
            y: _this.dragObject.y1
        }
    }
    _this.selections.activeFreehand.attr('d', _this.freehandCurveGenerator);
};

GeometricShankFreehand.prototype.freehandDragEnd = function () {
    let _this = this;
    console.log(_this.textLines);
    console.log(_this.dragObject.path);
    // Quadtree ? 
    _this.callbacks.freehandDragEnd(_this.dragObject.path);
};

GeometricShankFreehand.prototype.switchOff = function () {
    let _this = this;
    _this.selections.baseSelections.svg.on('.drag', null);
    _this.clear();
};

GeometricShankFreehand.prototype.clear = function () {
    let _this = this;
    if (_this.selections.activeFreehand) {
        _this.selections.activeFreehand
            .attr('opacity', 1)
            .transition(_this.transition)
            .attr('opacity', 0)
            .remove();
    }
};
