import { request, post } from "./utils.js"
const app_id = 'wxfa88e2a745f2212b'
const app_secret = 'da51db7e5809d1c4083e9e4f2288b30f'
const template_id = 'NFoTd6yd4ElC5tECOjhss0QAFgiy9okyUFxXZkt7cAk'
const city_id = '101190401'
const today = new Date()
today.setTime(new Date().getTime() + 24 * 60 * 60 * 1000)
const tomorrow = today.getDate()
request(`http://t.weather.sojson.com/api/weather/city/${city_id}`).then(weather => {
  const info = JSON.parse(weather.data).data.forecast.find(e => e.date == tomorrow)
  console.log('info: ', info)
  request(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${app_id}&secret=${app_secret}`).then(res => {
    const token = JSON.parse(res.data)['access_token']
    const data = JSON.stringify({
      "touser": "o5Mgt67K0EyParamTUIyhKriBE3g",
      "template_id": template_id,
      "url": "",
      "topcolor": "#FF0000",
      "data": {
        "date": {
          "value": info.ymd,
          "color": "#FF0000"
        },
        "city_nm": {
          "value": '苏州市',
          "color": "#FF0000"
        },
        "weather": {
          "value": info.type,
          "color": "#FF0000"
        },
        "max_temperature": {
          "value": info.high,
          "color": "#FF0000"
        },
        "min_temperature": {
          "value": info.low,
          "color": "#FF0000"
        },
      }
    })
    post({
      protocol: 'https:',
      host: 'api.weixin.qq.com',
      path: `/cgi-bin/message/template/send?access_token=${token}`,
      method: 'POST',
      'headers': {
        'Content-Type': 'application/json'
      },
      'maxRedirects': 20
    }, data).then(res => {
      console.log('res: ', res)
    })
  })
})

