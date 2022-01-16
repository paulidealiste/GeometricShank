import { notification } from 'uikit';

export default {
    methods: {
        TrackMainErrors: () => {
            window.electron.mainProcessError((message) => {
                notification(
                    '<span uk-icon="icon: check"></span><span class="uk-text-small uk-position-center">' +
                      message +
                      "</span>", {status: 'danger'}
                )
            });
        }
    }
}