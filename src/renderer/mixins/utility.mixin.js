import * as R from 'ramda';

export default {
    methods: {
        getCharWidth() {
            let char = '.';
            let classes = ['textDimensionCalculation', 'uk-text-small'];
            let div = document.createElement('div');
            div.setAttribute('class', classes.join(' '));
            div.innerHTML = char;
            document.body.appendChild(div);
            let chw = div.getBoundingClientRect().width;
            div.parentNode.removeChild(div);
            return chw;
        },
        getLineHeight(HTMLElement) {
            return parseInt(window.getComputedStyle(HTMLElement).lineHeight.replace('px', ''))
        },
        getRandomID() {
            return Math.random().toString(36).substring(7);
        },
        trimToOverflow(HTMLElement, text, elpad) {
            let classes = ['uk-text-small uk-overflow-auto'];
            let div = document.createElement('div');
            div.setAttribute('class', classes.join(' '));
            let ch = HTMLElement.clientHeight - elpad + 'px'
            let cw = HTMLElement.clientWidth - elpad + 'px';
            div.setAttribute("style", "max-width: " + cw + "; max-height: " + ch + "");
            document.body.appendChild(div);
            let words = text.split(' ');
            let trimmedText = '';
            div.innerHTML = text;
            if (div.scrollHeight > div.offsetHeight) {
                div.innerHTML = '';
                let cw = 0;
                let lh = this.getLineHeight(div);
                while (div.scrollHeight <= div.offsetHeight) {
                    trimmedText = div.innerHTML + ' ' + words[cw];
                    cw++;
                    div.innerHTML = trimmedText;
                }
            } else {
                trimmedText = text;
            }
            div.parentNode.removeChild(div);
            return trimmedText;
        },
        shuffleArray(array) {
            var m = array.length, t, i;
            while (m) {
                i = Math.floor(Math.random() * m--);
                t = array[m];
                array[m] = array[i];
                array[i] = t;
            }
            return array;
        },
        computeTextWrap(text, containerWidth, lh) {
            let wraped = [];
            let words = text.split(' ');
            let classes = ['lineBreakerCalculation', 'uk-text-small'];
            let div = document.createElement('div');
            div.setAttribute('class', classes.join(' '));
            div.style.width = containerWidth + 'px';
            div.style.lineHeight = lh + 'px';
            div.innerHTML = R.head(words);
            document.body.appendChild(div);

            let controlHeight = div.getBoundingClientRect().height;

            let temp = R.head(words);
            R.forEach((w) => {
                div.innerHTML = div.innerHTML + ' ' + w;
                if (div.getBoundingClientRect().height > controlHeight) {
                    controlHeight = div.getBoundingClientRect().height;
                    wraped.push(temp.trim());
                    temp = w;
                } else {
                    temp += ' ' + w;
                }
            }, R.tail(words));
            wraped.push(temp);

            div.parentNode.removeChild(div);
            return wraped;
        },
        getClickedWord(line, mouseX, lineWidth) {
            let chw = lineWidth / line.length;
            let words = line.split(' ');
            let chap = (a, b) => [a + b, a + b];
            let largerThanOrEqualTo = (str) => (str.length - 1) * chw <= mouseX;
            let isLetter = (c) => c.toLowerCase() != c.toUpperCase();
            let maped = R.mapAccum(chap, '', line.split(''));
            let po = R.takeWhile(largerThanOrEqualTo, maped[1]);
            let foundIndex = R.last(po).split(' ').length - 1;
            if (isLetter(R.last(R.last(po)))) {
                let foundWord = words[foundIndex < 0 ? 0 : foundIndex].replace(/\W/g, '');
                return {
                    foundIndex: foundIndex,
                    foundLength: foundIndex * chw,
                    foundWord: foundWord
                };
            } else {
                return {
                    foundIndex: foundIndex,
                    foundLength: foundIndex * chw,
                    foundWord: R.last(R.last(po))
                };
            }
        },
        getLineOnHorizontalCut(lines, horizontalCut) {
            let whl = R.findIndex((line) => {
                return line.y1 > horizontalCut.y1;
            }, lines);
            return lines[whl];
        },
        getAllWordsOnCutUpLines(cutPositions) {
            let words = [];
            for (let i = 0; i < cutPositions.lines.length; i++) {
                let culine = cutPositions.lines[i];
                let cuveccut = cutPositions.verticalCut[i];
                if (culine.lineText != null && culine.lineText != '') {
                    words.push(this.getClickedWord(culine.lineText, cuveccut.x, culine.lineWidth).foundWord);
                }
            }
            for (let i = 0; i < cutPositions.horizontalCut.length; i++) {
                let cuhorcut = cutPositions.horizontalCut[i];
                let horizline = this.getLineOnHorizontalCut(cutPositions.lines, cuhorcut);
                if (horizline != null) {
                    words.push(horizline.lineText);
                }
            }
            return words;
        },
        prepareAndSetFreehandCutup(freehandCutPositions) {
            let getWord = (cp) => this.getClickedWord(cp.lineText, cp.x, cp.lineWidth).foundWord;
            let freehandWordsRep = R.map(getWord, freehandCutPositions);

            let filterIndexed = R.addIndex(R.filter);
            let freehandWords = filterIndexed((item, idx, list) => {
                return item != list[idx + 1];
            }, freehandWordsRep);

            return freehandWords;
        },
        getCutUpSegments(cp) {
            let cutPositions = R.clone(cp);
            const verticalSeparate = (line, vob) => {
                let index = this.getClickedWord(line.lineText, vob.x, line.lineWidth).foundIndex;
                let splitWords = R.split(' ', line.lineText);
                let splitLines = R.splitAt(index, splitWords);
                line.lineText = R.map((sl) => sl.join(' '), splitLines);
                return line;
            };
            const horizontalSeparate = (cutLines, hob) => {
                let index = R.findIndex((line) => line.y1 >= hob.y1 && line.y2 >= hob.y2, cutLines);
                return R.splitAt(index, list);
            };

            let verticalCutup = [];
            let horizontalCutup = [];
            for (let i = 0; i < cutPositions.lines.length; i++) {
                let culine = cutPositions.lines[i];
                let cuveccut = cutPositions.verticalCut[i];
                verticalCutup.push(verticalSeparate(culine, cuveccut));
            }
            for (let j = 0; j < cutPositions.horizontalCut.length; j++) {
                let hob = cutPositions.horizontalCut[j];
                let index = R.findIndex((line) => line.y1 >= hob.y1 && line.y2 >= hob.y2, verticalCutup);
                horizontalCutup.push(R.take(index, verticalCutup));
                verticalCutup = R.drop(index, verticalCutup);
            }
            horizontalCutup.push(verticalCutup);
            return horizontalCutup;
        },
        packCutupSegments(completeCutupLines, cutupColors) {
            let mapIndexed = R.addIndex(R.map);
            let completeCutupSegments = [];
            let arrayColumn = (array, n) => R.map(x => x[n], array);
            for (let i = 0; i < completeCutupLines.length; i++) {
                let lines = completeCutupLines[i];
                let aml = R.pluck('lineText', lines);
                let sampleVerticalCutsLen = aml[0].length;
                for (let j = 0; j < sampleVerticalCutsLen; j++) {
                    let cuseg = {
                        text: arrayColumn(aml, j),
                    }
                    completeCutupSegments.push(cuseg);
                }
            }

            completeCutupSegments = mapIndexed((cuseg, index) => {
                cuseg.color = cutupColors[index];
                return cuseg;
            }, completeCutupSegments);

            completeCutupSegments = this.shuffleArray(completeCutupSegments);

            return completeCutupSegments;
        },
        lineCompleteCutupColor(completeCutupSegments) {
            let maxSegmentLen = -Infinity;
            let linedComplete = R.map((ccs) => {
                if (maxSegmentLen < ccs.text.length) {
                    maxSegmentLen = ccs.text.length;
                }
                let colors = R.repeat(ccs.color, ccs.text.length);
                let linedSegment = R.map((lpai) => {
                    return {
                        text: R.head(lpai),
                        color: R.last(lpai)
                    }
                }, R.zip(ccs.text, colors));
                return linedSegment;
            }, completeCutupSegments);

            const arrayColumn = (array, n) => R.map(x => x[n], array);
            let rangedVersion = R.range(0, maxSegmentLen);

            let cli = R.map((n) => {
                return arrayColumn(linedComplete, n);
            }, rangedVersion);

            const notNull = (x) => x != null;
            return R.filter(notNull, R.flatten(cli));
        },
        rawText: function (text) {
            var div = document.createElement("div");
            div.innerHTML = text;
            let rawtext = div.textContent || div.innerText || "";
            return rawtext;
        }
    },
}