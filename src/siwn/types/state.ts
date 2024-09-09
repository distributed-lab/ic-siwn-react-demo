import type { DelegationChain, DelegationIdentity } from '@dfinity/identity'

import type { ActorSubclass } from '@dfinity/agent'
import type { PrepareLoginOkResponse, SIWN_IDENTITY_SERVICE } from './service'

export type PrepareLoginStatus = 'error' | 'preparing' | 'success' | 'idle'
export type LoginStatus = 'error' | 'logging-in' | 'success' | 'idle'

export type State = {
  anonymousActor?: ActorSubclass<SIWN_IDENTITY_SERVICE>
  isInitializing: boolean
  prepareLoginStatus: PrepareLoginStatus
  prepareLoginError?: Error
  prepareLoginOkResponse?: PrepareLoginOkResponse
  loginStatus: LoginStatus
  loginError?: Error
  identity?: DelegationIdentity
  identityAddress?: string
  delegationChain?: DelegationChain
}
