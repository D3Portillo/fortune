/** `true` when not in production environment (Node or Vercel) */
export const isDevEnv = () => {
  return (
    process.env.NODE_ENV != "production" ||
    process.env.NEXT_PUBLIC_VERCEL_ENV != "production"
  )
}

export const isConnectedOrDevEnv = (address?: string | null) => {
  return Boolean(address) || isDevEnv()
}
