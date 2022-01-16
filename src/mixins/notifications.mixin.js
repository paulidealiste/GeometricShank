import { notification } from 'uikit';

export default {
    methods: {
        PlainOkNotify: (message) => {
            notification(
              '<span uk-icon="icon: check"></span><span class="uk-text-small uk-position-center">' +
                message +
                "</span>"
            )
        }
    }
}