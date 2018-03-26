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
        }
    }
}