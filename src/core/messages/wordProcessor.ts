
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
