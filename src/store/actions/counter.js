import { INDEX_DATA, INDEX_DETAIL, TYPE_DATA, TYPE_LIST, LOAD_MORE } from '../types/counter'
import { createAction } from 'redux-actions'

export const get_index_data = createAction(INDEX_DATA, () => {
  return new Promise(resolve => {
    wx.request({
      url: 'http://news-at.zhihu.com/api/4/news/latest',
      headers: {
        'Content-Type': 'application/json'
      },
      success (res) {
        resolve({
          banner: res.data.top_stories,
          list: [{ header: '今日热闻' }].concat(res.data.stories)
        })
      }
    })
  })
})

export const get_index_detail = createAction(INDEX_DETAIL, (id) => {
  return new Promise(resolve => {
    wx.request({
      url: 'http://news-at.zhihu.com/api/4/news/' + id,
      headers: {
        'Content-Type': 'application/json'
      },
      success (res) {

        if (res.data.body) {
          var body = res.data.body;
          var text = body.match(/\&#[0-9]*;/g);
          text = text ? text.join('') : ''

          var pictures = body.match(/(http:|https:)\/\/(pic|static)[ \S]+?\.(jpg|jpeg|gif|png)/g);
          pictures ? pictures.shift() : []
          
          // console.log(pictures)
          res.data.pictures = pictures
          body = body.match( /<p>.*?<\/p>/g );
          var ss = [];

          if (body) {
            
            for( var i = 0, len = body.length; i < len;i++ ) {
              ss[ i ] = /<img.*?>/.test( body[ i ] );
              if( ss[ i ] ) {
                body[ i ] = body[ i ].match( /(http:|https:).*?\.(jpg|jpeg|gif|png)/ );
              } else {
                body[ i ] = body[ i ].replace( /<p>/g, '' )
                .replace( /<\/p>/g, '' )
                .replace( /<strong>/g, '' )
                .replace( /<\/strong>/g, '' )
                .replace( /<a.*?\/a>/g, '' )
                .replace( /&nbsp;/g, ' ' )
                .replace( /&ldquo;/g, '"' )
                .replace( /&rdquo;/g, '"' );
              }
            }

            res.data.body = body.join('')
            .replace(/(http|https)[ \S]+?\.(jpg|jpeg|gif|png),/ig, '')
            .replace(/http:,/ig,'')
            .replace(/jpg/ig,'')
            .replace(/<s[　 \S]+?\/span>/ig,'')
            .replace(/<iframe[ \S]+?<\/iframe>/ig,'')
            .replace(/<\/span>/ig,'')
            .replace(/<span>/ig,'')
            
          }else{
            // body = res.data.body
            var delStart = res.data.body.search(/<div class=\"content\">/g) + 22
            res.data.body = res.data.body.slice(delStart)
            var delEnd = res.data.body.search(/<\/div>/g)
            res.data.body = res.data.body.slice(0,delEnd).replace(/\<br\>/g, '　')
            res.data.body = res.data.body.replace(/<a[ \S]+?<\/a>/ig,'')
            res.data.body = res.data.body.replace(/<img[ \S]+?>/ig,'')
            res.data.body = res.data.body.replace(/<b>/ig,'')
            res.data.body = res.data.body.replace(/<\/b>/ig,'')
            res.data.body = res.data.body.replace(/<s[　 \S]+?\/span>/ig,'')
            // console.log(res.data.body)
          }

          // console.log(res.data.body,text)
          res.data.body = res.data.body + text;
        }

        resolve({
          text: res.data.body,
          img: res.data.images ? res.data.images[0] : res.data.theme.thumbnail,
          image_source: res.data.image_source,
          title: res.data.title,
          pictures: res.data.pictures
        })
      }
    })
  })
})

export const loadMore = createAction(LOAD_MORE, (data) => {
  
  return new Promise(resolve => {
    wx.request({
      url: 'http://news.at.zhihu.com/api/4/news/before/'+data,
      headers: {
        'Content-Type': 'application/json'
      },
      success (res) {

        let date = res.data.date
        let year = date.substr(0,4)
        let month = date.substr(4,2)
        let day = date.substr(6,2)
        let Date = year + '-' + month + '-' + day
        resolve({
          list: [{ header: Date }].concat(res.data.stories)
        })
      }
    })
  })
})

export const get_type_data = createAction(TYPE_DATA, () => {
  return new Promise(resolve => {
    wx.request({
      url: 'http://news-at.zhihu.com/api/4/themes',
      headers: {
        'Content-Type': 'application/json'
      },
      success (res) {

        resolve({
          list: res.data.others
        })
      }
    })
  })
})

export const get_type_list = createAction(TYPE_LIST, (id) => {
  return new Promise(resolve => {
    wx.request({
      url: 'http://news-at.zhihu.com/api/4/theme/' + id,
      headers: {
        'Content-Type': 'application/json'
      },
      success (res) {
        // console.log(res)
        resolve({
          name: res.data.name,
          list: res.data.stories
        })
      }
    })
  })
})