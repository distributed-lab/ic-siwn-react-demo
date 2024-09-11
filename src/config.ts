export type Config = {
  APP_NAME: string
  IC_SIWN_CANISTER_ID: string
}

export const config: Config = {
  APP_NAME: import.meta.env.VITE_APP_NAME,
  IC_SIWN_CANISTER_ID: import.meta.env.VITE_IC_SIWN_CANISTER_ID,
}
