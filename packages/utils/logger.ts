export const info = (...args: unknown[]) => {
  if (process.env.NODE_ENV === 'development') {
    console.log.apply(this, args)
  }
}

export const fatal = (...args: unknown[]) => {
  if (process.env.NODE_ENV === 'development') {
    console.error.apply(this, args)
  }
}
