export default function request(options) {
  const { url, responseType, totalSize } = options
  return new Promise((resolve) => {
    const PROGRESS_DOM = document.getElementById('progress')
    const xhr = new XMLHttpRequest()
    xhr.responseType = responseType
    xhr.addEventListener("readystatechange", () => {
      if (xhr.readyState === xhr.DONE) {
        PROGRESS_DOM.style.display = 'none'
        resolve(xhr.response)
      }
    })
    xhr.addEventListener("progress", (e) => {
      const PROGRESS_DOM = document.getElementById('progress')
      PROGRESS_DOM.style.display = 'block'
      PROGRESS_DOM.setAttribute('max', totalSize)
      PROGRESS_DOM.setAttribute('value', e.loaded)
    })
    xhr.open('get', url)
    xhr.send()
  })
}