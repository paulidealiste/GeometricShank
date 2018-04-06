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
        calculateCharLimit(HTMLElement, padder) {
            let chw = this.getCharWidth();
            let cw = HTMLElement.clientWidth - padder;
            let CPL = Math.ceil(cw / chw);
            let lh = this.getLineHeight(HTMLElement);
            let ch = HTMLElement.clientHeight - padder;
            let ANL = Math.ceil(ch / lh);
            return Math.ceil(CPL * ANL);
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
        trimLastWord(str) {
            let lin = R.lastIndexOf(' ', str);
            return lin != -1 ? R.slice(0, lin, str) : str;
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
        getAllWordsOnCutUpLines(cutPositions) {
            let words = [];
            for (let i = 0; i < cutPositions.lines.length; i++) {
                let culine = cutPositions.lines[i];
                let cuveccut = cutPositions.verticalCut[i];
                words.push(this.getClickedWord(culine.lineText, cuveccut.x, culine.lineWidth).foundWord);
            }
            return words;
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
            let completeCutupSegments = [];
            let arrayColumn = (array, n) => R.map(x => x[n], array);
            for (let i = 0; i < completeCutupLines.length; i++) {
                let lines = completeCutupLines[i];
                let aml = R.pluck('lineText', lines);
                let sampleVerticalCutsLen = aml[0].length;
                for (let j = 0; j < sampleVerticalCutsLen; j++) {
                    completeCutupSegments.push(arrayColumn(aml, j));
                }
            }
            completeCutupSegments = this.shuffleArray(completeCutupSegments);

            let completeCutupHTML = '';
            for (let i = 0; i < cutupColors.length; i++) {
                let col = cutupColors[i];
                let seg = completeCutupSegments[i];
                console.log(col);
                console.log(seg);
                let segString = '<span style="color: ' + col + '">' + seg + '</span>';
                completeCutupHTML += ' ' + segString;
            }
            return completeCutupHTML;
        }
    }
}