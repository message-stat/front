export enum MessageLength { single = 0, short = 1, medium = 2, long = 3, }
export enum WordPosition { first = 0, begin = 1, center = 2, end = 3, last = 4 }

export interface IWord {
  text: string
  length: MessageLength
  position: WordPosition
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
