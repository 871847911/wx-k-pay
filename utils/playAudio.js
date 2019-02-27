/**
 * 对音频处理
 */
export const audio = {
/**
 * 判断公共音频地址和页面音频是否一直
 * globalDataAudioUrl :公共音频地址
 * pageAudioUrl :页面音频地址
 */
  ifAudioUrlSame: function (globalDataAudioUrl, pageAudioUrl){
    if (pageAudioUrl!=null){
      return (globalDataAudioUrl == pageAudioUrl)
    }else{
      return false
    }
    
  
  },
  /**
   * 储存页面uri 到公共globalData.audioUrl
   * pageAudioUrl：页面音频信息
   */
  SaveAudioUrl: function (pageAudioUrl){
     var app = getApp()
    app.globalData.audioUrl = pageAudioUrl
  },
  /**
   * 
   */
}