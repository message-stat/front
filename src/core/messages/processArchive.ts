import { ZipReader, BlobReader, TextWriter, BlobWriter, TextReader, Entry } from '@zip.js/zip.js'
import axios from 'axios'
import { FastHTMLParser } from 'fast-html-dom-parser'
import { ref } from 'vue'
import { IMessage, ISendMessageSession, ISendSession, ISendWordSession, IWord } from '../types'
import { convertDate, HTMLElementParser, readFile, readZip } from './utils'
import { textProcess, wordProcessor } from './wordProcessor'
import { sha256 } from 'js-sha256'

const TIME_STEP = 1000 * 60 * 60 * 24

function roundToStep(time: number) {
  return Math.round(time / TIME_STEP) * TIME_STEP
}

const archiveInfo = ref({
  conerstationCount: 0,
  messageCount: 0,
})

const processedInfo = ref({
  conerstationCount: 0,
  messageCount: 0,
  outboxMessageCount: 0,
  words: 0,
})

const sending = ref(false)

function resetStats() {
  processedInfo.value = {
    conerstationCount: 0,
    messageCount: 0,
    outboxMessageCount: 0,
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


  const dom = await readFile(files.find(f => f.filename == 'index.html'))
  const userID = `${JSON.parse(atob(dom.getElementsByName('jd')[0].attributes[1].value)).user_id}`


  return { converstations, userID }
}

type Message = {
  date: number,
  out: boolean,
  wordCount: number,
  charCount: number,
}

async function processMessages(messages: Message[], converstationId: number, chatHash: string, minDate: number) {

  const isChat = converstationId < 0

  messages = messages.reverse()

  let lastInboxMessage: Message = null
  let lastOutboxMessage: Message = null

  let msg: IMessage[] = []

  for (const message of messages) {

    if (message.out && message.date > minDate) {
      msg.push({
        date: new Date(message.date),
        words: message.wordCount,
        symbols: message.charCount,
        timeFromLastSend: lastOutboxMessage ? (message.date - lastOutboxMessage.date) / 1000 : -1,
        timeFromLastReceive: lastInboxMessage ? (message.date - lastInboxMessage.date) / 1000 : -1,
      })
    }

    if (message.out) lastOutboxMessage = message
    else lastInboxMessage = message

  }

  if (msg.length > 0) {
    messagesSendSession.push({
      messages: msg,
      chatId: chatHash,
      isChat,
    })
  }
}

async function processConverstation(dom: HTMLElementParser, minDate: number) {
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


  let currentSession: ISendWordSession & { time: number } = null
  const outbox = messages.filter(m => m.out)
  outbox
    .filter(m => m.date > minDate)
    .forEach(message => {
      const words = message.text.split(/\s/g).filter(t => t)

      const time = roundToStep(message.date)

      const wordsToSend: IWord[] = words
        .map(t => ({
          text: wordProcessor(t),
          debug: message.text
        }))
        .filter(t => t.text)


      if (currentSession?.time == time) {
        currentSession.words.push(...wordsToSend)
      } else {
        if (currentSession) wordSendSessions.push(currentSession)

        currentSession = {
          words: wordsToSend,
          beginTime: new Date(time),
          time
        }
      }

      processedInfo.value.words += wordsToSend.length

      message.wordCount = words.length
      message.charCount = words.reduce((acc, w) => acc + w.length, 0)
    })

  if (currentSession) wordSendSessions.push(currentSession)

  processedInfo.value.outboxMessageCount += outbox.length
  processedInfo.value.messageCount += messagesText.length

  return messages
}

async function processArchive(file: File) {
  resetStats()
  processing = true
  stop = false
  sendSessionLoop()

  const { converstations, userID } = await readArchive(file)
  hashedUserId = sha256.hex(userID)

  const lastSend = (await axios.get(`${import.meta.env.VITE_API_URL}/lastSend/${hashedUserId}`)).data


  for (const key in converstations) {
    if (stop) break;

    const chatHash = sha256.hex(`${+key}`)
    let lastDate = 0

    if (lastSend[chatHash]) {
      lastDate = (new Date(`${lastSend[chatHash]}Z+3`)).getTime()
    }

    const converstation = converstations[key].sort((a, b) => a.filename.localeCompare(b.filename, undefined, { numeric: true }))

    const messages: Message[] = []

    for (const file of converstation) {
      if (stop) break;
      const dom = await readFile(file)
      const m = await processConverstation(dom, lastDate)
      messages.push(...m)
    }

    await processMessages(messages, +key, chatHash, lastDate)
    processedInfo.value.conerstationCount++
  }

  processing = false
}

let wordSendSessions: ISendWordSession[] = []
let messagesSendSession: ISendMessageSession[] = []
let hashedUserId: string = null

async function sendSessionLoop() {
  while (wordSendSessions.length || messagesSendSession.length || processing) {
    if (wordSendSessions.length == 0 && messagesSendSession.length == 0) {
      await new Promise(r => setTimeout(r, 200))
      continue
    }

    const tempWord = wordSendSessions
    const tempMessage = messagesSendSession
    try {
      wordSendSessions = []
      messagesSendSession = []

      const data: ISendSession = {
        userId: hashedUserId,
        words: tempWord.map(t => ({ words: t.words, beginTime: t.beginTime })),
        messages: tempMessage.map(t => ({ messages: t.messages, chatId: t.chatId, isChat: t.isChat }))
      }

      await axios.post(import.meta.env.VITE_API_URL + '/send', data)

    } catch (e) {
      wordSendSessions.push(...tempWord)
      messagesSendSession.push(...tempMessage)

      console.error(e)
    }
  }

  sending.value = false
}
