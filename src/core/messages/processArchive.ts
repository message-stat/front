import { ZipReader, BlobReader, TextWriter, BlobWriter, TextReader, Entry } from '@zip.js/zip.js'
import axios from 'axios'
import { FastHTMLParser } from 'fast-html-dom-parser'
import { ref } from 'vue'
import { IMessage, ISendSession, IWord } from '../types'
import { convertDate, HTMLElementParser, readFile, readZip } from './utils'
import { textProcess, wordProcessor } from './wordProcessor'

const TIME_STEP = 1000 * 60 * 60 * 24

const archiveInfo = ref({
  conerstationCount: 0,
  messageCount: 0,
})

const processedInfo = ref({
  conerstationCount: 0,
  messageCount: 0,
  inboxMessageCount: 0,
  words: 0,
})

const sending = ref(false)

function resetStats() {
  processedInfo.value = {
    conerstationCount: 0,
    messageCount: 0,
    inboxMessageCount: 0,
    words: 0,
  }

  archiveInfo.value = {
    conerstationCount: 0,
    messageCount: 0,
  }

  sending.value = true
}

let processing = false
let stop = false

export function useProcessor() {
  return {
    processArchive,
    stop: () => stop = true,
    archiveInfo,
    processedInfo,
    sending
  }
}

async function readArchive(file: File) {
  const files = await readZip(file)
  const converstations = files
    .filter(f => f.filename.match(/messages\/-?\d+\/messages\d+\.html/))
    .reduce((acc, f) => {
      const [folder, file] = f.filename.split('/').slice(-2)
      if (!acc[folder]) {
        acc[folder] = []
      }
      acc[folder].push(f)
      return acc
    }, {} as Record<string, Entry[]>)

  archiveInfo.value = {
    conerstationCount: Object.keys(converstations).length,
    messageCount: Object.values(converstations).reduce((acc, c) => acc + c.length, 0) * 50
  }

  return converstations
}

type Message = {
  date: number,
  out: boolean,
  wordCount: number,
  charCount: number,
}

async function processMessages(messages: Message[]) {
  console.log('processMessages', messages);
}

async function processConverstation(dom: HTMLElementParser) {
  const messagesText = dom
    .getElementsByClassName('wrap_page_content')[0]
    .getElementsByClassName('item')
    .map(t => t.getElementsByClassName('message')[0])

  const messages = messagesText
    .map(t => {
      const content = t.childNodes[1]

      const kludgesElements = content.getElementsByClassName('kludges')
      const kludges = kludgesElements.length > 0 ? kludgesElements[0].outerHTML : '</div>'

      const isOut = t.childNodes[0].childNodes.length == 0

      const text = !isOut ? '' : textProcess(content.outerHTML
        .replace(kludges, '')
        .replaceAll('<br>', ' ')
        .replace(content.element, '')
      );

      return {
        date: convertDate(t.childNodes[0].textContent.split(',')[1]),
        out: isOut,
        text,
        wordCount: 0,
        charCount: 0
      }
    })


  let currentSession: ISendSession & { time: number } = null
  messages
    .filter(t => t.out)
    .forEach(message => {
      const words = message.text.split(/\s/g)
      const time = Math.round(message.date / TIME_STEP) * TIME_STEP

      const wordsToSend: IWord[] = words
        .map(t => ({
          text: wordProcessor(t),
          date: new Date(time),
          debug: message.text
        }))
        .filter(t => t.text)

      // console.log(wordsToSend.map(t => t.text));


      if (currentSession?.time == time) {
        currentSession.words.push(...wordsToSend)
      } else {
        if (currentSession) sendSessions.push(currentSession)

        currentSession = {
          words: wordsToSend,
          beginTime: new Date(time),
          time
        }
      }

      processedInfo.value.words += wordsToSend.length

      message.wordCount = wordsToSend.length
      message.charCount = wordsToSend.reduce((acc, w) => acc + w.text.length, 0)
    })

  if (currentSession) sendSessions.push(currentSession)

  processedInfo.value.inboxMessageCount += messages.length
  processedInfo.value.messageCount += messagesText.length

  return messages
}

async function processArchive(file: File) {
  resetStats()
  processing = true
  stop = false
  sendSessionLoop()

  const converstations = await readArchive(file)

  for (const key in converstations) {
    if (stop) break;

    const converstation = converstations[key]

    const messages: Message[] = []

    for (const file of converstation) {
      if (stop) break;
      const dom = await readFile(file)
      const m = await processConverstation(dom)
      messages.push(...m)
    }

    await processMessages(messages)
    processedInfo.value.conerstationCount++
  }

  processing = false
}

let sendSessions: ISendSession[] = []

async function sendSessionLoop() {
  while (sendSessions.length || processing) {
    if (sendSessions.length == 0) {
      await new Promise(r => setTimeout(r, 200))
      continue
    }

    const temp = sendSessions
    try {
      sendSessions = []

      await axios.post(import.meta.env.VITE_SEND_URL, temp.map(t => ({
        words: t.words,
        beginTime: t.beginTime
      })))

    } catch (e) {
      sendSessions.push(...temp)
      console.error(e)
    }
  }

  sending.value = false
}
