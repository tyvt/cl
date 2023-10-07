export const sleep = (millSeconds) => {
  let now = new Date()
  const exitTime = now.getTime() + millSeconds
  while (true) {
    now = new Date()
    if (now.getTime() > exitTime) {
      return
    }
  }
}