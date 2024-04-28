export default function useLoadMore(listFunction, type = 'pad') {
  let list = []
  let total = 0
  const pageParams = {
    pageNum: 0,
    pageSize: 20,
  }
  function padList(rows) {
    type == 'pad' ? list.push(...rows) : list.unshift(...rows)
  }
  function refreshList(rows) {
    list = []
    list = rows
  }
  function reload() {
    list = []
    pageParams.pageNum = 0
    getList()
  }
  async function getList() {
    pageParams.pageNum += 1
    const fn = listFunction.bind(this, pageParams)
    fn().then((res) => {
      if (pageParams.pageNum == 1) {
        total = res.total
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