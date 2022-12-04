import { useStorage } from "@vueuse/core";
import { sha256 } from "js-sha256";
import { computed } from "vue";


export const userId = useStorage('userId', null, localStorage);

export const userIdHash = computed(() => userId.value ? sha256.hex(userId.value) : null);
