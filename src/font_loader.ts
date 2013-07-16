/// <reference path="./definitions/node.d.ts" />

var _ = require("lodash")
var fs = require("fs")
var http = require("http")
var path = require("path")

import _cssParser = require("./css_parser")

export class FontLoader {
  downloadFonts(rootDir: string, fontDefinition: _cssParser.FontDefinition) {
    var fontName = fontDefinition.locals[0]
    var fontUrl = fontDefinition.urls[0]

    var fileName = this.fetchFileName(fontName, fontUrl)
    var filePath = rootDir + "/" + fileName
    console.log(fileName)
    this.downloadFont(fontUrl, filePath)
  }

  private fetchFileName(fontName: string, fontUrl: string) {
    return fontName + path.extname(fontUrl)
  }

  private downloadFont(sourceFontUrl: string, targetFilePath: string) {
    var file = fs.createWriteStream(targetFilePath)
    http.get(sourceFontUrl, function(res) {
      res.pipe(file)
    })
  }
}

function main() {
  var cssFile = "./tmp/css_examples/fonts-multi-ttf.css"
  var cssText = fs.readFileSync(cssFile).toString()

  var rootDir = "./tmp/css_fonts"
  if (!fs.existsSync(rootDir)) {
    fs.mkdirSync(rootDir)
  }

  var fontParser = new _cssParser.CssParser()
  var fontLoader = new FontLoader()

  var fontDefinitions = fontParser.parse(cssText)
  _.forEach(fontDefinitions, (fontDefinition: _cssParser.FontDefinition) => {
    fontLoader.downloadFonts(rootDir, fontDefinition)
  })
}

if (require.main === module) {
  main()
}
