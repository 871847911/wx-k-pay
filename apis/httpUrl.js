
/*
注意改接口修改只要在小写的httpurl即可
因为部分接口已经加了app，工程量巨大
你们切换httpurl这个就可以使用
// */
// const httpurl = 'https://app.vdongchina.com/frontapi'
const httpurl = "https://studyanimal.vdongchina.com/frontapi"//
const httpUrl = httpurl+"/app"
module.exports = {
  httpUrl,
  httpurl
}