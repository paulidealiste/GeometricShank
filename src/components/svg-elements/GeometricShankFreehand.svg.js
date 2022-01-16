import * as R from 'ramda';
import { easeLinear, select, line, quadtree, curveBasis, transition, drag } from 'd3';

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
    this.freehandCurveGenerator = line()
        .curve(curveBasis)
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
    this.transition = transition().duration(350).ease(easeLinear);
}

GeometricShankFreehand.prototype = Object.create(GeometricShankFreehand.prototype);
GeometricShankFreehand.prototype.constructor = GeometricShankFreehand;

GeometricShankFreehand.prototype.switchOn = function (textLineSelections) {
    let _this = this;
    _this.createTextLines(textLineSelections);
    if (_this.selections.activeFreehandContainer) _this.selections.activeFreehandContainer.remove();
    _this.selections.activeFreehandContainer = _this.selections.baseSelections.svg
        .append('g')
        .attr('class', 'activeFreehandContainer');
    _this.freehandDragBehaviourElement = _this.selections.baseSelections.svg
        .call(drag().on('start', (event, d) => {
            return _this.freehandDragStart(event, d);
        }).on('drag', (event, d) => {
            return _this.freehandDragging(event, d);
        }).on('end', function (event, d) {
            return _this.freehandDragEnd(event, d);
        }));
};

GeometricShankFreehand.prototype.createTextLines = function (textLineSelections) {
    let _this = this;
    _this.textLines = quadtree()
        .x(function (d) { return d.x })
        .y(function (d) { return d.y });
    if (textLineSelections) {
        textLineSelections.textLinesContainer.selectAll('text').each(function (d, i, k) {
            let cutext = select(k[i]);
            let lineDef = {
                x: 0,
                y: parseFloat(cutext.attr('y')),
                lineWidth: cutext.node().getBBox().width,
                lineText: d
            };
            _this.textLines.add(lineDef);
        });
    }
};

GeometricShankFreehand.prototype.freehandDragStart = function(event, d) {
    let _this = this;
    _this.dragObject.path = [event.subject];
    if (_this.selections.activeFreehand) _this.clear();
    _this.selections.activeFreehand = _this.selections.activeFreehandContainer
        .append('path')
        .datum(_this.dragObject.path)
        .attr('class', 'activeFreehand')
        .attr('clip-path', 'url(#' + _this.baseProperties.clipID + ')');
    _this.dragObject.x0 = event.x;
    _this.dragObject.y0 = event.y;
};

GeometricShankFreehand.prototype.freehandDragging = function(event, d) {
    let _this = this;
    _this.dragObject.x1 = event.x;
    _this.dragObject.y1 = event.y;
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

GeometricShankFreehand.prototype.freehandDragEnd = function(event, d) {
    let _this = this;
    let filterSafe = R.reject(R.isNil);
    let freehandCutpositions = R.map((pathPoint) => {
        let line = R.clone(_this.textLines.find(pathPoint.x, pathPoint.y));
        if (line != null) {
            line.x = pathPoint.x;
            return line;
        }
    }, _this.dragObject.path)
    _this.callbacks.freehandDragEnd(filterSafe(freehandCutpositions));
};

GeometricShankFreehand.prototype.switchOff = function () {
    let _this = this;
    _this.selections.baseSelections.svg.on('.drag', null);
    _this.clear();
};

GeometricShankFreehand.prototype.clear = function () {
    let _this = this;
    const trs = transition().duration(350).ease(easeLinear);
    if (_this.selections.activeFreehand) {
        _this.selections.activeFreehand
            .attr('opacity', 1)
            .transition(trs)
            .attr('opacity', 0)
            .remove();
    }
};
