/// <reference types="vite/client" />

interface ImportMetaEnv {
  VITE_APP_NAME: string
  VITE_IC_SIWN_CANISTER_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
