import useLoadMore from "./useLoadMore"
import loadDB from './loadDB'
import request from "./request"
let base = `https://unpkg.com/cl-lite@${document.title}/`
if (import.meta.env.MODE === 'development') {
  base = '/'
}

const SQL_WASM_JS_SIZE = 50049
const SQL_WASM_SIZE = 654690

request({
  url: `${base}dist/sql-wasm.js`,
  responseType: 'text',
  totalSize: SQL_WASM_JS_SIZE
}).then(script => {
  const scriptEl = document.createElement('script')
  scriptEl.innerHTML = script
  document.head.appendChild(scriptEl)
  request({
    url: `${base}dist/sql-wasm.wasm`,
    responseType: 'blob',
    totalSize: SQL_WASM_SIZE
  }).then(blob => {
    initSqlJs({
      locateFile: () => URL.createObjectURL(blob),
    }).then(sql => {
      window.SQL = sql
    })
  })

})



let currentCategory
window.addEventListener('load', async function () {
  if (!location.hash) {
    location.hash = '/home'
  }
  await setActiveLink()
})
window.addEventListener('hashchange', async function () {
  await setActiveLink()
})
async function setActiveLink() {
  const originHash = window.location.hash
  const hash = originHash.includes('?') ? originHash.split('?')[0] : originHash
  const urlQuery = new URLSearchParams(originHash.split('?')[1])
  const fid = urlQuery.get('fid')
  const total = urlQuery.get('count')
  const DOMList = document.querySelectorAll('section')
  DOMList.forEach(dom => {
    dom.style.display = `#/${dom.getAttribute('id')}` == hash ? 'block' : 'none'
  })
  const titleDOM = document.getElementById('header')
  const { list, loadMore, reload } = useLoadMore(getList)

  async function getList() {
    const [pageParams] = arguments
    const rows = []
    const fragment = document.createDocumentFragment()
    return new Promise((resolve, reject) => {
      const contents = window[`cl-category-${fid}`].exec(`SELECT * FROM t_topic tp WHERE url like '%/' || ${fid} || '/%' AND post_time NOTNULL ORDER BY post_time DESC LIMIT ${pageParams.pageSize} OFFSET ${(pageParams.pageNum - 1) * pageParams.pageSize}`)
      contents[0].values.forEach(e => {
        const [text, url, timestamp] = e
        const date = new Date(Number(`${timestamp}000`))
        const convertDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`

        rows.push({
          text: text,
          url: url,
          date: convertDate
        })
        const divDOM = document.createElement('div')
        divDOM.style = 'display: flex; align-items: center; justify-content: space-between;margin-bottom: 20px;'
        divDOM.onclick = () => {
          location.hash = `/detail?date=${convertDate}&title=${text}&url=${url}`
        }
        const titleContainerDOM = document.createElement('span')
        titleContainerDOM.style = 'display:flex; flex-direction: column; font-size: 14px;'
        const titleDOM = document.createElement('span')
        titleDOM.style = 'font-size: 14px;'
        titleDOM.innerText = text
        const dateDOM = document.createElement('span')
        dateDOM.style = 'font-size: 12px;margin-top: 6px; color: #999;'
        dateDOM.innerText = convertDate
        titleContainerDOM.appendChild(titleDOM)
        titleContainerDOM.appendChild(dateDOM)
        const arrowDOM = document.createElement('span')
        arrowDOM.style = 'display: flex; align-items: center; justify-content: center; font-size: 20px; color: #999;min-width: 16px;'
        arrowDOM.innerText = '›'
        divDOM.appendChild(titleContainerDOM)
        divDOM.appendChild(arrowDOM)
        fragment.appendChild(divDOM)
      })
      const listDOM = document.getElementById('list')
      listDOM.appendChild(fragment)
      resolve({
        rows: rows,
        total: total,
      })
    })
  }

  switch (hash) {
    case '#/home':
      window.removeEventListener('scroll', () => onReachBottom(loadMore))
      titleDOM.innerText = 'cl-lite'
      loadDB('cl-main', 8192).then(db => {
        const contents = db.exec(`SELECT tc.name, tc.fid, tc.count FROM t_channel tc`)
        const fragment = document.createDocumentFragment()
        contents[0].values.forEach(e => {
          const [text, fid, count] = e
          const divDOM = document.createElement('div')
          divDOM.onclick = () => {
            location.hash = `/list?fid=${fid}&title=${text}&total=${count}`
          }
          const categoryDOM = document.createElement('span')
          const countDOM = document.createElement('span')
          const arrowDOM = document.createElement('span')
          divDOM.style = 'display: flex; align-items: center; line-height: 22px; position: relative; margin-bottom: 20px;'
          categoryDOM.style = 'letter-spacing: 2px;font-size: 16px;'
          categoryDOM.innerText = text
          countDOM.style = 'font-size: 14px;margin-left: 3px;'
          countDOM.innerText = count
          arrowDOM.style = 'font-size: 20px; color: #999; position: absolute; right: 0px;'
          arrowDOM.innerText = '›'
          divDOM.appendChild(categoryDOM)
          divDOM.appendChild(countDOM)
          divDOM.appendChild(arrowDOM)
          fragment.appendChild(divDOM)
        })
        const homeDOM = document.getElementById('home')
        while (homeDOM.firstChild) {
          homeDOM.firstChild.remove()
        }
        homeDOM.appendChild(fragment)
      })
      break
    case '#/list':
      window.addEventListener('scroll', () => onReachBottom(loadMore))
      titleDOM.innerText = urlQuery.get('title')
      const PAGE_SIZE = 20
      function onReachBottom(callback) {
        if (window.scrollY + window.innerHeight >= document.getElementById('list')?.scrollHeight - 20) {
          callback()
        }
      }
      if (currentCategory != fid) {
        currentCategory = fid
        document.getElementById('list').innerHTML = ''
        loadDB('cl-main', 8192).then((db_main) => {
          const contents = db_main.exec(`SELECT tc.category_size FROM t_channel tc WHERE fid = ${fid}`)
          loadDB(`cl-category-${fid}`, contents[0].values[0][0]).then(db_category => {
            loadMore()
          })
        })
      }

      break
    case '#/detail':
      window.removeEventListener('scroll', () => onReachBottom(loadMore))
      const detailDOM = document.getElementById('detail')
      detailDOM.innerHTML = ''
      const detailQuery = new URLSearchParams(originHash.split('?')[1])
      const title = detailQuery.get('title')
      titleDOM.innerText = title
      const url = detailQuery.get('url')
      const date = detailQuery.get('date')
      loadDB('cl-main', 8192).then((db_main) => {
        const main_contents = db_main.exec(`SELECT tc.detail_size FROM t_channel tc WHERE fid = ${url.split('/')[2]}`)
        loadDB(`cl-detail-${url.split('/')[2]}`, main_contents[0].values[0][0]).then(db_detail => {
          const contents = db_detail.exec(`SELECT content FROM t_content tc WHERE url="${url}"`)
          contents[0].values.forEach(e => {
            const content = `<h3>${title}</h3><span>${date}</span><br><br>${e[0]}`
            content.replaceAll('<video', `<video controls`)
            detailDOM.innerHTML = content
            const magnetRegex = /[0-9a-fA-F]{40}/
            const MAGNET_PREFIX = "magnet:?xt=urn:btih:"
            const matchedMagnets = content.match(magnetRegex)
            if (matchedMagnets && matchedMagnets[0]) {
              const downloadButton = document.createElement('button')
              downloadButton.innerText = '复制磁链'
              downloadButton.onclick = () => {
                navigator.clipboard.writeText(`${MAGNET_PREFIX}${matched[0]}`)
              }
              detailDOM.appendChild(downloadButton)
            }
          })
        })
      })
      break
    default:
      break
  }
}