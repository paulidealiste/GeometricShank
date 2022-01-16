import { select } from 'd3';

export function GeometricShankHTML() {
};

GeometricShankHTML.prototype = Object.create(GeometricShankHTML.prototype);
GeometricShankHTML.prototype.constructor = GeometricShankHTML;

GeometricShankHTML.prototype.simpleHTMLSegments = function (completeCutupSegments) {
    let completeCutupHTML = '';
    for (let i = 0; i < completeCutupSegments.length; i++) {
        let segm = completeCutupSegments[i];
        let segString = '<span style="color: ' + segm.color + '">' + segm.text + '</span>';
        completeCutupHTML += ' ' + segString;
    }
    return completeCutupHTML;
};

GeometricShankHTML.prototype.packedHTMLSegments = function (linedCutupSegments) {
    let packaged = select(document.createElement('div'));
    let htmlCutup = packaged.selectAll('span.segmentDiv').data(linedCutupSegments);
    htmlCutup
        .enter()
        .append('span')
        .attr('class', 'segmentSpan')
        .attr('style', d => 'color: ' + d.color)
        .html(d => d.text + ' ');
    return packaged.node().outerHTML;
};