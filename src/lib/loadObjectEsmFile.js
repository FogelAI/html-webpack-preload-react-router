const fs = require("fs");
const path = require("path");
const parser = require("@babel/parser");
const generate = require("@babel/generator").default;
const traverse = require("@babel/traverse").default;
const t = require("@babel/types");

function getESMObject(filename) {
  const content = fs.readFileSync(filename, "utf-8");
  const astParsed = parser.parse(content, {
    sourceType: "module",
    plugins: ["jsx"],
  });
  const moduleContent = { imports: {}, routes: [] };
  astParsed.program.body.forEach((node) => {
    if (t.isImportDeclaration(node) && node.source.value.includes(".route")) {
      const importPath = node.source.value;
      if (importPath.startsWith(".")) {
        const filenameDir = path.dirname(filename);
        moduleContent["imports"][node.specifiers[0].imported.name] =
          require.resolve(path.resolve(filenameDir, importPath));
      } else {
        moduleContent["imports"][node.specifiers[0].imported.name] =
          path.resolve(importPath);
      }
    }
    if (t.isExportNamedDeclaration(node)) {
      traverse(astParsed, {
        ObjectProperty: function (path) {
          if (
            ["element", "errorElement", "loader", "action", "lazy"].includes(
              path.node.key.name
            )
          ) {
            path.remove();
          }
        },
      });
      moduleContent["routes"] = JSON.parse(
        generate(node.declaration.declarations[0].init, {
          concise: true,
          comments: false,
        }).code.replace(
          /[ ]+([ a-zA-Z0-9-\/*.?()=+]+)(?<! )(?<!:)|[ ]+["]?([ a-zA-Z0-9-\/:*.?()&=+]+)(?<! )(?<!:)["]?/g,
          '"$1$2"'
        )
      );
      // console.log(generate(node.declaration.declarations[0].init,{concise:true}).code.replace(/element: (.|\n)*?[,][ ]/g,"").replace(/(?! )(['"])?([a-zA-Z0-9 ]*?)(['"])?: /g, '"$2": '))
      // console.log(generate(node.declaration.declarations[0].init,{concise:true}).code.replace(/element: (.|\n)*?[,][ ]/g,"").replace(/(?! )(['"])?([a-zA-Z0-9 ]*?)(['"])?: /g, '"$2": ').replace(/(: )([a-zA-Z0-9]*)[, ]/g, ': "$2" '))
      // JSON.parse(generate(node.declaration.declarations[0].init,{concise:true}).code.replace(/element: (.|\n)*?(}[`",]+)/g, "").replace(/(?! )(['"])?([a-zA-Z0-9 ]*?)(['"])?: /g, '"$2": ').replace(/(: )([a-zA-Z0-9]+)/g, ': "$2" '))
      // working console.log(JSON.parse(generate(node.declaration.declarations[0].init,{concise:true, comments: false}).code.replace(/[,]? element: ([`][a-zA-Z<>\/\n ={}$'".-]*[`]|["][a-zA-Z<>\/\n ={}$'`.-]*["]|['][a-zA-Z<>\/\n ={}$'`.-]*['])/g, "").replace(/[ ]+([ a-zA-Z0-9-\/*.?()=+]+)(?<! )(?<!:)|[ ]+["]?([ a-zA-Z0-9-\/:*.?()=+]+)(?<! )(?<!:)["]?/g, '"$1$2"')));
      // working console.log(JSON.parse(generate(node.declaration.declarations[0].init,{concise:true}).code.replace(/[,]? element: ([`]?[a-zA-Z<>\/\n ={}'"-]*[`]?|["]?[a-zA-Z<>\/\n ={}'`-]*["]?|[']?[a-zA-Z<>\/\n ={}'`-]*[']?)/g, "").replace(/[ ]*["]?([ a-zA-Z0-9-]+)["]?[ ]*:[ ]*["]?([ a-zA-Z0-9-\/:*.?()=+]*)(?<! )["]?/g, '"$1":"$2"').replace(/""[ ]*([{[])/g,"$1")));
      // working moduleContent["routes"] = JSON.parse(generate(node.declaration.declarations[0].init,{concise:true}).code.replace(/[,]? element: ([`]?[a-zA-Z<>\/\n ={}'"-]*[`]?|["]?[a-zA-Z<>\/\n ={}'`-]*["]?|[']?[a-zA-Z<>\/\n ={}'`-]*[']?)/g, "").replace(/[ ]*["]?([ a-zA-Z0-9-]+)["]?[ ]*:[ ]*["]?([ a-zA-Z0-9-\/:*.?()=+]*)(?<! )["]?/g, '"$1":"$2"').replace(/""[ ]*([{[])/g,"$1"));
      // https://regex101.com/r/1mdsg6/1
      // https://regex101.com/delete/xgdsw9YQdCC5jnWGbjiJvw9QfPGLnEKRrsmg
      // https://regex101.com/delete/1/33Z95dOEIYvsvj5gzPKwcASsCKPjZkLbC277
      // https://stackoverflow.com/questions/44562635/regular-expression-add-double-quotes-around-values-and-keys-in-javascript
      // moduleContent["routes"] = eval(generate(node.declaration.declarations[0].init,{concise:true}).code.replace(/(?! )(['"])?([a-zA-Z0-9 ]*?)(['"])?: /g, '"$2": ').replace(/(: )([a-zA-Z0-9]+)/g, ': "$2" '));
      // console.log(JSON.stringify(eval(generate(node.declaration.declarations[0].init,{concise:true}).code.replace(/(?! )(['"])?([a-zA-Z0-9 ]*?)(['"])?: /g, '"$2": ').replace(/(: )([a-zA-Z0-9]+)/g, ': "$2" '))));
      // console.log(moduleContent["routes"]);
      // moduleContent["routes"] = JSON.parse(generate(node.declaration.declarations[0].init,{concise:true}).code.replace(/, element: (.|\n)*?(}[`"]|,)/g,"").replace(/(?! )(['"])?([a-zA-Z0-9 ]*?)(['"])?: /g, '"$2": ').replace(/(: )([a-zA-Z0-9]+)/g, ': "$2" '));
      // moduleContent["routes"] = JSON.parse(generate(node.declaration.declarations[0].init,{concise:true}).code.replace(/element: (.|\n)*?[,][ ]/g,"").replace(/(['"])?([a-zA-Z0-9]+)(['"])?: /g, '"$2": '));
    }
  });
  function pairImportedRoutes(routes) {
    routes.forEach((route) => {
      if (typeof route.children === "string") {
        route.children = getESMObject(moduleContent.imports[route.children]);
      } else if (Array.isArray(route.children)) {
        pairImportedRoutes(route.children);
      }
    });
  }
  pairImportedRoutes(moduleContent.routes);
  return moduleContent.routes;
}

module.exports = getESMObject;
