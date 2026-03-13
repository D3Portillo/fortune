/** `true` when not in production environment */
export const isDevEnv = () => {
  return process.env.NODE_ENV != "production"
}

export const isConnectedOrDevEnv = (address?: string | null) => {
  return Boolean(address) || isDevEnv()
}
