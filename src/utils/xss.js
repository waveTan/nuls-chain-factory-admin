import filterXSS from 'xss'
// console.log(filterXSS.whiteList, '====whiteList')
filterXSS.whiteList['a'] = ['style', 'class', 'id', 'target', 'href', 'title']
filterXSS.whiteList['span'] = ['class', 'title', 'aria-hidden', 'style']
filterXSS.stripIgnoreTag = true

export default filterXSS