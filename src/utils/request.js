export function request(options) {
  const { url, onProgress } = options
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest()
    xhr.responseType = "arraybuffer"
    xhr.addEventListener("readystatechange", () => {
      if (xhr.readyState === xhr.DONE) {
        resolve(xhr.response)
      }
    })
    if (onProgress) {
      xhr.addEventListener("progress", (e) => {
        onProgress(e.loaded)
      })
    }
    xhr.open('get', url)
    xhr.send()
  })
}
