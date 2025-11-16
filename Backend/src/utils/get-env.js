export const  getEnv = (key, defaultValue) => {
  const value = process.env[key]
  if (!value) {
    if (defaultValue) {
      return defaultValue
    }
    throw new Error(`Missing environment variable: ${key}`)
  }
  return value
}


