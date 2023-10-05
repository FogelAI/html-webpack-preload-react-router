module.exports = (pages) => `
        const isStructureEqual = (pathname, path, asterisk) => {
          pathname = pathname.split('/')
          path = path.split('/')
          if ((pathname.length < path.length) || path=='') return false
          return pathname.every((segment, ind) => (segment === path[ind]) || (path[ind] && path[ind].includes(':')) || ((path[ind] === undefined || path[ind] == '')))
        }
        let { pathname } = window.location
        pathname = pathname.replace(/\\/$/, '')
        const pages = ${JSON.stringify(pages)}
        for (const { path, scripts, css, data, asterisk } of pages) {
          const match = pathname === path || isStructureEqual(pathname, path, asterisk)
          
          if (!match) continue
          
          scripts.forEach(script => {
            document.head.appendChild(
              Object.assign(document.createElement('link'), { rel: 'preload', href: '/' + script, as: 'script' })
            )
          })

          css.forEach(cssItem => {
            document.head.appendChild(
              Object.assign(document.createElement('link'), { rel: 'preload', href: '/' + cssItem, as: 'style' })
            )
          })

          if (!data) continue
          
          data.forEach(({ url, dynamicPathIndexes, crossorigin, preconnectURL }) => {
            let fullURL = url
            
            if (dynamicPathIndexes) {
              const pathnameArr = pathname.split('/')
              const dynamics = dynamicPathIndexes.map(index => pathnameArr[index])
              let counter = 0
              
              fullURL = url.replace(/\\$/g, match => dynamics[counter++])
            }
            document.head.appendChild(
              Object.assign(document.createElement('link'), { rel: 'preload', href: fullURL, as: 'fetch', crossOrigin: crossorigin })
            )
            if (preconnectURL) {
              document.head.appendChild(
                Object.assign(document.createElement('link'), { rel: 'preconnect', href: preconnectURL })
              )
            }
          })
        }
`;
