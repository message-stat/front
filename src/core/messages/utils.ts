import { BlobReader, Entry, TextWriter, ZipReader } from "@zip.js/zip.js";
import { FastHTMLParser } from 'fast-html-dom-parser'


export type HTMLElementParser = {
  childNodes: HTMLElementParser[]
  textContent: string
  outerHTML: string
  innerHTML: string
  element: string
  getElementsByClassName(string: string): HTMLElementParser[]
}

export async function readZip(file: File) {
  return await (new ZipReader(new BlobReader(file))).getEntries({ filenameEncoding: 'windows-1251' });
}

export async function readFile(file: Entry) {
  const content = await file.getData(new TextWriter('windows-1251'))
  return new FastHTMLParser(content) as HTMLElementParser
}

export function convertDate(date: string) {
  const match = { 'янв': 'jun', 'фев': 'feb', 'мар': 'mar', 'апр': 'apr', 'май': 'may', 'июн': 'jun', 'июл': 'jul', 'авг': 'aug', 'сен': 'sep', 'окт': 'oct', 'ноя': 'nov', 'дек': 'dec', }

  const month = date.split(' ')[1]

  return Date.parse(
    date
      .replace(' в ', ' ')
      .replace(month, match[month])
  )
}
