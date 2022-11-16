export interface IWord {
  text: string,
  date: Date,
  debug: string

}

export interface ISendSession {
  words: IWord[];
  beginTime: Date;
}
