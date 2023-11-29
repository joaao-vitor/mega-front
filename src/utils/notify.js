import { ref } from 'vue'
import { notify } from 'notiwind'

export function useNotification() {
    const showSuccess = (message) => {
        notify(
            {
                group: 'success',
                title: 'Success!',
                text: message,
            },
            2000
        )
    }

    const showError = (message) => {
        notify(
            {
                group: 'error',
                title: 'Erro!',
                text: message,
            },
            2000
        )
    }
    return {
        showError,
        showSuccess,
    }
}
