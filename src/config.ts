export type Config = {
  APP_NAME: string
}

export const config: Config = {
  APP_NAME: import.meta.env.VITE_APP_NAME,
}
