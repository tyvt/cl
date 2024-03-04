import { reactive, ref, onMounted } from 'vue'
export default function useLoadMore(listFunction, type = 'pad') {
  const list = ref([])
  const total = ref(1)
  const status = ref('more')
  const pageParams = reactive({
    pageNum: 0,
    pageSize: 10,
  })
  function padList(rows) {
    type == 'pad' ? list.value.push(...rows) : list.value.unshift(...rows)
  }
  function refreshList(rows) {
    list.value = []
    list.value = rows
  }
  function refresh() {
    list.value = []
    pageParams.pageNum = 0
    status.value = 'more'
    getList()
  }
  async function getList() {
    if (status.value == 'no-more') {
      return
    }
    status.value = 'loading'
    pageParams.pageNum += 1
    const fn = listFunction.bind(this, pageParams)
    fn().then((res) => {
      if (pageParams.pageNum == 1) {
        total.value = res.total
      }
      const totalPages = Math.ceil(res.total / pageParams.pageSize)
      if (pageParams.pageNum >= totalPages) {
        status.value = 'no-more'
      } else {
        status.value = 'more'
      }
      pageParams.pageNum != 1
        ? padList(res.rows)
        : refreshList(res.rows)
    })
  }
  // 非页面类型的自主注册
  function registerObserver() {
    let intersectionObserver
    // #ifdef MP-WEIXIN
    intersectionObserver = uni.createIntersectionObserver(this)
    intersectionObserver
      .relativeToViewport()
      .observe('.load-more', getList)
    // #endif
    // #ifdef H5
    intersectionObserver = new IntersectionObserver((entries) => {
      /*
       * 如果 intersectionRatio 为 0，则目标在视野外，
       * 我们不需要做任何事情。
       */
      if (entries[0].intersectionRatio <= 0) return
      getList()
    })
    // 开始监听
    intersectionObserver.observe(
      document.querySelector('.load-more'),
      getList
    )
    // #endif
  }
  onMounted(() => {
    // #ifdef MP-WEIXIN
    // #endif
    // #ifdef H5
    if (document.querySelector('.load-more')) {
      registerObserver()
    }
    // #endif
  })
  return {
    list,
    total,
    status,
    pageParams,
    refresh,
    registerObserver
  }
}
