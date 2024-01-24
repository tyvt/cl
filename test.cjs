var request = require('request')
var options = {
  'method': 'POST',
  'url': 'https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=76_NpsLvYm9w6SM6kgBsZDaxNpbmJkDKEQ05I1m467hssc6ZI-m_80yhAemsUs3ir7emRvA_ptxZXhscQ4YqBOG6YuXR5ZMSDCQYg81J8VTA11wrVp_l2cvdi2Dw-kQOFeAAAFDU',
  'headers': {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    "touser": "o5Mgt67K0EyParamTUIyhKriBE3g",
    "template_id": "NFoTd6yd4ElC5tECOjhss0QAFgiy9okyUFxXZkt7cAk",
    "url": "",
    "topcolor": "#FF0000",
    "data": {
      "date": {
        "value": "1",
        "color": "#FF0000"
      },
      "city_nm": {
        "value": "city_nm",
        "color": "#FF0000"
      },
      "weather": {
        "value": "weather",
        "color": "#FF0000"
      },
      "max_temperature": {
        "value": "max_temperature",
        "color": "#FF0000"
      },
      "min_temperature": {
        "value": "min_temperature",
        "color": "#FF0000"
      }
    }
  })

}
request(options, function (error, response) {
  if (error) throw new Error(error)
  console.log(response.body)
})
