import { MessageLength, WordPosition } from "../types"

export function textProcess(text: string) {

  let res = text
    .replace(/&(\S)+;/g, '') // remove special char lile &quot; &nbsp;
    .replace(/(www|http:|https:)+[^\s]+[\w]+\/?/g, '') // remove links

  res = res.match(/([a-zA-Z]+)|([а-яА-Я|ё|Ë]+)|\s/g)?.join(' ') // allow only letters and spaces


  return res ?? ''
}

export function wordProcessor(word: string) {
  return word.toLowerCase()
}


export function messageLength(length: number) {
  if (length == 1) return MessageLength.single
  if (length <= 5) return MessageLength.short
  if (length <= 15) return MessageLength.medium
  return MessageLength.long
}
export function wordPosition(index: number, length: number) {
  if (index == 0) return WordPosition.first
  if (index + 1 == length) return WordPosition.last

  if (index <= length * 0.33) return WordPosition.begin
  if (index >= length * 0.66) return WordPosition.end

  return WordPosition.center
}
