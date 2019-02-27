var reg_phone = function (num) {
  //const reg = /^0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$/;
  const reg =/^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/;
  return reg.test(num) ? true : false
}

var reg_email = function (email) {
  const reg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
  return reg.test(email) ? true : false
}

var reg_idCard = function (id) {
  var reg = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
  return reg.test(id) ? true : false
}

module.exports = {
  reg_phone,
  reg_email,
  reg_idCard
}