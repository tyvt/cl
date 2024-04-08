import { reactive, ref, onMounted } from 'vue'
export default function useLoadMore(listFunction, type = 'pad') {
  const list = ref([])
  const total = ref(0)
  const pageParams = reactive({
    pageNum: 0,
    pageSize: 20,
  })
  function padList(rows) {
    type == 'pad' ? list.value.push(...rows) : list.value.unshift(...rows)
  }
  function refreshList(rows) {
    list.value = []
    list.value = rows
  }
  function reload() {
    list.value = []
    pageParams.pageNum = 0
    getList()
  }
  async function getList() {
    pageParams.pageNum += 1
    const fn = listFunction.bind(this, pageParams)
    fn().then((res) => {
      if (pageParams.pageNum == 1) {
        total.value = res.total
      }
      pageParams.pageNum != 1
        ? padList(res.rows)
        : refreshList(res.rows)
    })
  }
  async function loadMore() {
    await getList()
  }
  return {
    list,
    total,
    loadMore,
    reload
  }
}
