import { DelegationChain, DelegationIdentity } from '@dfinity/identity'
import { LoginStatus, PrepareLoginStatus } from './state'
import { SignedMessage } from '@near-wallet-selector/core'

export type TSiwnIdentityContext = {
  isInitializing: boolean

  prepareLogin: () => void
  onLoginSignatureSettled: (message: SignedMessage) => void

  prepareLoginStatus: PrepareLoginStatus

  isPreparingLogin: boolean
  isPrepareLoginError: boolean
  isPrepareLoginSuccess: boolean
  isPrepareLoginIdle: boolean

  prepareLoginError?: Error

  login: () => Promise<void>

  loginStatus: LoginStatus

  isLoggingIn: boolean
  isLoginError: boolean
  isLoginSuccess: boolean
  isLoginIdle: boolean

  loginError?: Error

  delegationChain?: DelegationChain
  identity?: DelegationIdentity
  identityAddress?: string

  clear: () => void
}
