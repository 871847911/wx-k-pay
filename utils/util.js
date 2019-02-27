const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}

function timestampToTime(timestamp) {
    var date = new Date(timestamp), //时间戳为10位需*1000，时间戳为13位的话不需乘1000
        Y = date.getFullYear() + '-',
        M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-',
        D = date.getDate() + ' ',
        h = date.getHours() + ':',
        m = date.getMinutes() + ':',
        s = date.getSeconds();
    return Y + M + D + h + m + s;
}

function uuid() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    return uuid;
}


function upDataKey(tempFilePaths) { //拼接图片路径
    return new Promise((resolve, reject) => {
        wx.getImageInfo({
            src: tempFilePaths,
            success: function(res) {
                let dates = new Date()
                let key = uuid()
                const year = dates.getFullYear()
                const month = formatNumber(dates.getMonth() + 1)
                const day = formatNumber(dates.getDate())
                let upDataType = res.type
                let keys = `temp/image/${upDataType}/${year}${month}${day}/${key}`
                resolve(keys)
                return;
            },
            fail: function(res) {
                reject(res)
                return;
            }
        })
    })
}

const { reg_phone, reg_email, reg_idCard } = require('./applyForm.js')

function stotime(s) {//转换分秒
  let t = '';
  if (s > -1) {
    let min = Math.floor(s / 60) % 60;
    let sec = Math.ceil(s % 60);
    if (min < 10) { t += "0"; }
    t += min + ":";
    if (sec < 10) { t += "0"; }
    t += sec;
  }
  return t;
}

module.exports = {
    formatTime,
    reg_phone,
    reg_email,
    reg_idCard,
    timestampToTime,
    upDataKey,
  stotime
}
