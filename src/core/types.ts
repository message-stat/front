export interface IWord {
  text: string
  debug: string
}

export interface ISendWordSession {
  words: IWord[]
  beginTime: Date
}

export interface IMessage {
  date: Date
  words: number
  symbols: number
  timeFromLastSend: number
  timeFromLastReceive: number
}

export interface ISendMessageSession {
  messages: IMessage[]
  chatId: string
  isChat: boolean
}

export interface ISendSession {
  messages: ISendMessageSession[]
  words: ISendWordSession[]
  userId: string
}
