import axios from "axios";
import { Data } from "plotly.js-basic-dist";
import { ComputedRef, ref, Ref, shallowRef, watch, watchEffect } from "vue";
import { LoadChartResult } from "../../core/analytics/defaultChart";

export function useChartLoader<T = { x: number, y: number }>(params: {
  url: string;
  params: Ref<any>;
  process: (result: T[], isUser: boolean) => Partial<Data>;
  userAddition?: Partial<Data>;
  serverAddition?: Partial<Data>;
  autoReload?: boolean;
}) {

  const data = shallowRef<Data[]>([])
  const loading = ref(false);
  const elapsed = ref(0);

  if (params.autoReload) {
    watch(params.params, () => {
      load()
    }, { deep: true, immediate: true })
  }

  async function load() {
    if (loading.value) return;
    loading.value = true;

    const res = await axios.get(`${import.meta.env.VITE_API_URL}/load/${params.url}`, {
      params: {
        ...params.params.value,
      }
    })

    const { server, user } = res.data as LoadChartResult<T>


    data.value = [{
      ...params.process(server, false),
      ...params.serverAddition as any,
    }]

    if (user) {
      data.value.push({
        ...params.process(user, true),
        ...params.userAddition as any,
      })
    }

    loading.value = false;
    elapsed.value = res.data.elapsed;

    console.log("loaded", data.value);

  }

  return {
    data, loading, elapsed, load
  }
}
