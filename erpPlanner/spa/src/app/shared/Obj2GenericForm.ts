
export type InputType = 'text' | 'textarea' | 'number' | 'date' | 'button' | 'checkbox' | 'datetime-local' | 'email' | 'file' | 'password' | 'radio' | 'range'
export type GenericForm<T> = Record<keyof Partial<T>, { type: InputType, value: any }>
export function Obj2GenericForm<T>(obj: T) {
  const returnObj = {} as GenericForm<T>;
  for (const key in obj) {

    let inputType: InputType

    if (typeof obj[key] === 'boolean')
      inputType = 'checkbox'

    else if (obj[key] instanceof Date)
      inputType = 'date'

    else if (typeof obj[key] === 'number')
      inputType = 'number'

    else if (typeof obj[key] === 'string' && (obj[key] as string).length > 10 || (key as string).includes('description'))
      inputType = 'textarea'

    else inputType = 'text'

    returnObj[key] = {
      type: inputType,
      value: inputType === 'date' ? (obj[key] as Date).toISOString().split('T')[0] : obj[key]
    }
  }
  return returnObj
}


