import { useStorage } from "@vueuse/core";


export const userId = useStorage('userId', null, localStorage);
