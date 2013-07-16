/// <reference path="./definitions/node.d.ts" />

var _ = require("lodash")
var fs = require("fs")

export interface CssFontDefinition {
  locals: string[];
  urls: string[];
}

export class CssFontParser {
  private fontFacePattern: RegExp = /font-face[\S\s]*?\{([\S\s]*?)\}/g;
  private localSpacelessPattern: RegExp = /local\(['"](\S+?)['"]\)/g;
  private urlPattern: RegExp = /url\((.*?)\)/g;

  parse(cssText: string): Array<CssFontDefinition> {
    var fontFaces = this.parseFontFaces(cssText)
    var fontDefinitions = []
    _.forEach(fontFaces, (fontFace: string) => {
      var fontDefinition = this.parseCssFontDefinition(fontFace)
      fontDefinitions.push(fontDefinition)
    })
    return fontDefinitions
  }

  private parseFontFaces(cssText: string): any[] {
    return this.match(this.fontFacePattern, cssText)
  }

  private parseCssFontDefinition(fontFace: string): CssFontDefinition {
    var locals = this.match(this.localSpacelessPattern, fontFace)
    var urls = this.match(this.urlPattern, fontFace)
    return {locals: locals, urls: urls}
  }

  private match(pattern: RegExp, text: string): string[] {
    var captures = []
    var result = pattern.exec(text)
    while (result != null) {
      var firstCapture = result[1]
      captures.push(firstCapture)
      result = pattern.exec(text)
    }
    return captures
  }
}

function main() {
  var cssFile = "./tmp/css_examples/fonts-multi-woff.css"
  var cssText = fs.readFileSync(cssFile).toString()

  var parser = new CssFontParser()
  var fontDefinitions = parser.parse(cssText)
  _.forEach(fontDefinitions, (fontDefinition: CssFontDefinition) => {
    console.log(fontDefinition)
  })
}

if (require.main === module) {
  main()
}
