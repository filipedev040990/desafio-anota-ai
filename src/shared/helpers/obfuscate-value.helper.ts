const valuesToBeObfuscated = ['password']

export const obfuscateValue = (object: any): object => {
  valuesToBeObfuscated.forEach(word => {
    if (word in object) {
      object[word] = '[OBFUSCATED]'
    }
  })

  return object
}
