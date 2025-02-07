import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useLoggerStore = defineStore('logger', () => {
    const logs = ref([]);

    function logMessage(message) {
        logs.value.push({ message });
    }

    function clearLogs() {
        logs.value = [];
    }

    return {
        logs,
        logMessage,
        clearLogs
    };
});
