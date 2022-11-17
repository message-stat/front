export interface IWord {
  text: string,
  date: Date,
  debug: string
}

export interface ISendSession {
  words: IWord[];
  beginTime: Date;
}

export interface IMessage {
  date: Date,
  words: number,
  symbols: number,
  isChat: boolean,
  timeFromLastSend: number,
  timeFromLastReceive: number,
  chatId: number,
}

