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
        }
    }
}