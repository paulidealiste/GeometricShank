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
        }
    }
}