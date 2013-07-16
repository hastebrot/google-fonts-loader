/// <reference path="./definitions/node.d.ts" />

var _ = require("lodash")
var fs = require("fs")
var sa = require("superagent")

export class CssLoader {
  private userAgents: any = {
    // Internet Explorer 9.0.
    eot: "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0)",

    // Safari 5.1.4.
    ttf: "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/534.54.16 (KHTML, like Gecko) " +
      "Version/5.1.4 Safari/534.54.16",

    // Chrome 27.0.
    woff: "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) " +
      "Chrome/27.0.1453.110 Safari/537.36"
  };

  download(url: string, callback: (format: string, content: string) => void) {
    _.forEach(this.userAgents, (userAgentString, userAgentKey) => {
      sa.get(url).set("User-Agent", userAgentString)
        .end(function(err, res) {
          callback(userAgentKey, res.text)
        })
    })
  }
}

function main() {
  var exampleUrls = {
    single: "http://fonts.googleapis.com/css?family=Droid+Serif",
    multi: "http://fonts.googleapis.com/css?family=UnifrakturMaguntia|" +
      "Open+Sans:300italic,400italic,600italic,700italic,400,300,600,700,800"
  }

  var provider = new CssLoader()
  _.forEach(exampleUrls, (url, urlKey) => {
    var rootDir = "./tmp/css_examples"
    if (!fs.existsSync(rootDir)) {
      fs.mkdirSync(rootDir)
    }

    provider.download(url, (format: string, content: string) => {
      var fileName = "fonts-" + urlKey + "-" + format + ".css"
      var filePath = rootDir + "/" + fileName

      console.log(filePath)
      fs.writeFileSync(filePath, content)
    })
  })
}

if (require.main === module) {
  main()
}

