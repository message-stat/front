import { BlobReader, Entry, TextWriter, ZipReader } from "@zip.js/zip.js";
import { FastHTMLParser } from 'fast-html-dom-parser'
import { Buffer } from 'buffer';
import { ISendMessageSession, ISendWordSession } from "../types";


export type HTMLElementParser = {
  childNodes: HTMLElementParser[]
  textContent: string
  outerHTML: string
  innerHTML: string
  element: string
  attributes: { name: string, value: string }[]
  getElementsByClassName(string: string): HTMLElementParser[]
  getElementsByName(string: string): HTMLElementParser[]
}

export async function readZip(file: File) {
  return await (new ZipReader(new BlobReader(file))).getEntries({ filenameEncoding: 'windows-1251' });
}

export async function readFile(file: Entry) {
  const content = await file.getData(new TextWriter('windows-1251'))
  return new FastHTMLParser(content) as HTMLElementParser
}

export function convertDate(date: string) {
  const match = { 'янв': 'jun', 'фев': 'feb', 'мар': 'mar', 'апр': 'apr', 'май': 'may', 'мая': 'may', 'июн': 'jun', 'июл': 'jul', 'авг': 'aug', 'сен': 'sep', 'окт': 'oct', 'ноя': 'nov', 'дек': 'dec', }

  const month = date.trim().split(' ')[1]

  return Date.parse(
    date
      .replace(' в ', ' ')
      .replace(month, match[month])
  )
}

export async function userIdByArchive(file: File) {
  const files = await readZip(file)
  const dom = await readFile(files.find(f => f.filename == 'index.html'))
  return `${JSON.parse(Buffer.from(dom.getElementsByName('jd')[0].attributes[1].value, 'base64').toString()).user_id}`
}

export function rechankSendWordSession(session: ISendWordSession) {
  const chanks: ISendWordSession[] = []
  const chankSize = 100

  let i = 0
  while (i < session.words.length) {
    chanks.push({
      beginTime: session.beginTime,
      words: session.words.slice(i, i + chankSize)
    })
    i += chankSize
  }

  return chanks
}


export function rechankSendMessageSession(session: ISendMessageSession) {
  const chanks: ISendMessageSession[] = []
  const chankSize = 1000

  let i = 0
  while (i < session.messages.length) {
    chanks.push({
      messages: session.messages.slice(i, i + chankSize),
      chatId: session.chatId,
      isChat: session.isChat,
    })
    i += chankSize
  }
  return chanks
}
