export const info = (...args: any[]) => {
  if (process.env.NODE_ENV === 'development') {
    console.log.apply(this, args)
  }
}

export const fatal = (...args: any[]) => {
  if (process.env.NODE_ENV === 'development') {
    console.error.apply(this, args)
  }
}
