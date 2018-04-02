import * as R from 'ramda';

export default {
    methods: {
        getCharWidth(font, char) {
            let canvas = document.createElement('canvas');
            let ctx = canvas.getContext('2d');
            ctx.font = window.getComputedStyle(this.$el).font;
            let metrics = ctx.measureText(char != null ? char : "M");
            return metrics.width;
        },
        getLineHeight(HTMLElement) {
            return parseInt(window.getComputedStyle(HTMLElement).lineHeight.replace('px', ''))
        },
        getRandomID() {
            return Math.random().toString(36).substring(7);
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
        computeTextWrap(text, charWidth, lineLength) {
            let wraped = [];
            let words = text.split(' ');
            let temp = '';
            R.forEach((w) => {
                if (temp.length * charWidth > lineLength) {
                    temp += ' ' + w;
                    wraped = R.append(temp.trim(), wraped);
                    temp = '';
                } else {
                    temp += ' ' + w;
                }
            }, words);
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
            if (isLetter(R.last(R.last(po)))) {
                let foundIndex = R.last(po).split(' ').length - 1;
                let foundWord = words[foundIndex < 0 ? 0 : foundIndex].replace(/\W/g, '');
                return foundWord;
            } else {
                return R.last(R.last(po));
            }
        },
        getAllWordsOnCutUpLines(cutPositions) {
            let words = [];
            for (let i = 0; i < cutPositions.lines.length; i++) {
                let culine = cutPositions.lines[i];
                let cuveccut = cutPositions.verticalCut[i];
                words.push(this.getClickedWord(culine.lineText, cuveccut.x, culine.lineWidth));
            }
            return words;
        },
        getCutUpSegments(cutPositions) {
            const horizontalSeparate = R.curry((list, hob) => {
                let hind = (y1, y2) => y1 == y2;
                let index = R.findIndex((line) => line.y1 >= hob.y1 && line.y2 >= hob.y2, cutPositions.lines);
                return R.splitAt(index, cutPositions.lines);
            });
            const separated = horizontalSeparate(cutPositions.lines);
            let horizontalSegments = R.map((hc) => separated(hc), cutPositions.horizontalCut);
            return R.pluck('lineText', R.flatten(this.shuffleArray(horizontalSegments[0])));
        }
    }
}