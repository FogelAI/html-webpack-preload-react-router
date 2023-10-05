const getESMObject = require("./loadObjectEsmFile.js");
const htmlTemplate = require("./htmlTemplatePreloadPages.js");

function createHtmlPreloadPages(compilation, mainRoutesFilename) {
  const flatRoutes = (routes) => {
    let currentRoutes = routes;
    let data = [];
    let queue = [];
    let nodes = {};
    queue.push({
      arr: currentRoutes,
      parentFullPath: "",
    });
    while (queue.length) {
      nodes = queue.shift();
      nodes.arr.forEach((node) => {
        const path =
          nodes.parentFullPath +
          (node.path
            ? "/" + node.path?.replace(/(^\/)|(\/\*$)|(\*$)/g, "")
            : "");
        data.push({
          path: path,
          chunkName: node.chunkName,
          data: node.data,
          asterisk: node.path && new RegExp(/\/\*$/).test(node.path),
        });
        if (node.children) {
          queue.push({ arr: node.children, parentFullPath: path });
        }
      });
    }
    return data;
  };
  const addAssetsToRoutes = (routes, assets) => {
    const pages = routes.map(({ chunkName, path, data, asterisk }) => {
      const scripts = assets.filter((name) =>
        new RegExp(`[/.]${chunkName}[._](.+)\\.js$`).test(name)
      );
      const css = assets.filter((name) =>
        new RegExp(`[/.]${chunkName}[._](.+)\\.css$`).test(name)
      );

      if (data && !Array.isArray(data)) data = [data];

      return { path, scripts, css, data, asterisk };
    });
    return pages;
  };
  const mainRoutes = getESMObject(mainRoutesFilename);
  const routes = flatRoutes(mainRoutes);
  const assets = compilation.getAssets().map(({ name }) => name);
  const pages = addAssetsToRoutes(routes, assets);
  const htmlContentInjectedWithPages = htmlTemplate(pages);
  return htmlContentInjectedWithPages;
}

module.exports = createHtmlPreloadPages;
