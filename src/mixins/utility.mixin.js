import * as R from 'ramda';

export default {
    methods: {
        getTextWidth(context, text, font) {
            if (context != null) {
                let metrics = context.measureText(text != null ? text : "M");
                return metrics.width;
            } else {
                return 0;
            }
        },
        getLineHeight(HTMLElement) {
            return parseInt(window.getComputedStyle(HTMLElement).lineHeight.replace('px', ''))
        },
        computeTextWrap(text, charWidth, lineLength) {
            let wraped = [];
            let words = text.split(' ');
            let temp = '';
            R.forEach((w) => {
                if (temp.length * charWidth >= lineLength) {
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