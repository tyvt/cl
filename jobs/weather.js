import { get, request } from "./utils.js"
const app_id = 'wxfa88e2a745f2212b'
const app_secret = 'da51db7e5809d1c4083e9e4f2288b30f'
const template_id = 'JWaJgToyeZaDsBXVJIvCl4AZe9KEQxLBfKPXbauGjM8'
const city_id = '101190401'
const users = ['o5Mgt6-zEHxS8Qsw9J0hs9_Hc9-g', 'o5Mgt67K0EyParamTUIyhKriBE3g']
const today = new Date()
today.setTime(new Date().getTime() + 24 * 60 * 60 * 1000)
const tomorrow = today.getDate()
get(`http://t.weather.sojson.com/api/weather/city/${city_id}`).then(weather => {
  const info = JSON.parse(weather.data).data.forecast.find(e => e.date == tomorrow)
  get(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${app_id}&secret=${app_secret}`).then(res => {
    const token = JSON.parse(res.data)['access_token']
    users.forEach(e => {
      const data = JSON.stringify({
        "touser": e,
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
          "wind": {
            "value": `${info.fx}${info.fl}`,
            "color": "#FF0000"
          },
          "sunrise": {
            "value": info.sunrise,
            "color": "#FF0000"
          },
          "sunset": {
            "value": info.sunset,
            "color": "#FF0000"
          },
        }
      })
      request({
        url: `https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${token}`,
        method: 'POST',
        'headers': {
          'Content-Type': 'application/json'
        },
      }, data).then(res => {
        console.log('res: ', res)
      })
    })
  })
})

