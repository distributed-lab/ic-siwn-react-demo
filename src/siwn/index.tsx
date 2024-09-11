import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import {
  SIWN_IDENTITY_SERVICE,
  State,
  TSiwnIdentityContext,
  SignedDelegation as ServiceSignedDelegation,
  PrepareLoginDetails,
  LoginDetails,
} from './types'
import { type ActorConfig, type HttpAgentOptions } from '@dfinity/agent'
import { IDL } from '@dfinity/candid'
import { callGetDelegation, callLogin, callPrepareLogin, createAnonymousActor } from './provider'
import { normalizeError } from './error'
import { DelegationIdentity, Ed25519KeyIdentity } from '@dfinity/identity'
import { createDelegationChain } from './delegation'
import {
  clearIdentity,
  clearMessage,
  loadIdentity,
  loadMessage,
  saveIdentity,
  saveMessage,
} from './local-storage'
import { useNear } from '@/near'
import { SignedMessage, SignMessageParams } from '@near-wallet-selector/core'

export * from './types'

export const SiwnIdentityContext = createContext<TSiwnIdentityContext | undefined>(undefined)

export const useSiwnIdentity = (): TSiwnIdentityContext => {
  const context = useContext(SiwnIdentityContext)
  if (!context) {
    throw new Error('useSiwnIdentity must be used within an SiwnIdentityProvider')
  }
  return context
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function SiwnIdentityProvider<T extends SIWN_IDENTITY_SERVICE>({
  httpAgentOptions,
  actorOptions,
  idlFactory,
  canisterId,
  children,
}: {
  httpAgentOptions?: HttpAgentOptions

  actorOptions?: ActorConfig

  idlFactory: IDL.InterfaceFactory

  canisterId: string

  children: ReactNode
}) {
  const { accountId: connectedNearAddress, signMessage } = useNear()

  const [state, setState] = useState<State>({
    isInitializing: true,
    prepareLoginStatus: 'idle',
    loginStatus: 'idle',
  })

  const updateState = (newState: Partial<State>) => {
    setState(prevState => ({
      ...prevState,
      ...newState,
    }))
  }

  const prepareLogin = async (): Promise<PrepareLoginDetails | undefined> => {
    if (!state.anonymousActor) {
      throw new Error(
        'Hook not initialized properly. Make sure to supply all required props to the SiwnIdentityProvider.',
      )
    }
    if (!connectedNearAddress) {
      throw new Error(
        'No Near address available. Call prepareLogin after the user has connected their wallet.',
      )
    }

    updateState({
      prepareLoginStatus: 'preparing',
      prepareLoginError: undefined,
    })

    try {
      const prepareLoginOkResponse = await callPrepareLogin(
        state.anonymousActor,
        connectedNearAddress,
      )

      updateState({
        prepareLoginOkResponse,
        prepareLoginStatus: 'success',
      })

      return prepareLoginOkResponse
    } catch (e) {
      const error = normalizeError(e)
      console.error(error)
      updateState({
        prepareLoginStatus: 'error',
        prepareLoginError: error,
      })
    }
  }

  async function rejectLoginWithError(error: Error | unknown, message?: string) {
    const e = normalizeError(error)
    const errorMessage = message || e.message

    console.error(e)

    updateState({
      prepareLoginOkResponse: undefined,
      loginStatus: 'error',
      loginError: new Error(errorMessage),
    })
  }

  const onLoginSignatureSettled = async (message: SignedMessage) => {
    const sessionIdentity = Ed25519KeyIdentity.generate()
    const sessionPublicKey = sessionIdentity.getPublicKey().toDer()

    if (!state.anonymousActor || !connectedNearAddress) {
      rejectLoginWithError(new Error('Invalid actor or address.'))
      return
    }

    const params = loadMessage()

    let loginOkResponse: LoginDetails
    try {
      loginOkResponse = await callLogin(
        state.anonymousActor,
        message.signature,
        connectedNearAddress,
        message.publicKey,
        sessionPublicKey,
        params.nonce.toString('base64'),
      )
    } catch (e) {
      rejectLoginWithError(e, 'Unable to login.')
      return
    }

    let signedDelegation: ServiceSignedDelegation
    try {
      signedDelegation = await callGetDelegation(
        state.anonymousActor,
        connectedNearAddress,
        sessionPublicKey,
        loginOkResponse.expiration,
      )
    } catch (e) {
      rejectLoginWithError(e, 'Unable to get identity.')
      return
    }

    const delegationChain = createDelegationChain(
      signedDelegation,
      loginOkResponse.user_canister_pubkey,
    )

    const identity = DelegationIdentity.fromDelegation(sessionIdentity, delegationChain)

    saveIdentity(connectedNearAddress, sessionIdentity, delegationChain)
    clearMessage()

    updateState({
      loginStatus: 'success',
      identityAddress: connectedNearAddress,
      identity,
      delegationChain,
    })

    return identity
  }

  const login = async () => {
    if (!state.anonymousActor) {
      rejectLoginWithError(
        new Error(
          'Hook not initialized properly. Make sure to supply all required props to the SiwnIdentityProvider.',
        ),
      )
      return
    }
    if (!connectedNearAddress) {
      rejectLoginWithError(
        new Error(
          'No Near address available. Call login after the user has connected their wallet.',
        ),
      )
      return
    }
    if (state.prepareLoginStatus === 'preparing') {
      rejectLoginWithError(new Error("Don't call login while prepareLogin is running."))
      return
    }

    updateState({
      loginStatus: 'logging-in',
      loginError: undefined,
    })

    try {
      let prepareLoginOkResponse = state.prepareLoginOkResponse
      if (!prepareLoginOkResponse) {
        prepareLoginOkResponse = await prepareLogin()
        if (!prepareLoginOkResponse) {
          throw new Error('Prepare login failed did not return a SIWN message.')
        }
      }

      const params: SignMessageParams = {
        message: prepareLoginOkResponse.message,
        recipient: connectedNearAddress,
        nonce: Buffer.from(prepareLoginOkResponse.nonce, 'base64'),
        callbackUrl: prepareLoginOkResponse.callback_url,
      }

      await signMessage(params)
      saveMessage(params)
    } catch (e) {
      rejectLoginWithError(e)
    }
  }

  function clear() {
    updateState({
      isInitializing: false,
      prepareLoginStatus: 'idle',
      prepareLoginError: undefined,
      prepareLoginOkResponse: undefined,
      loginStatus: 'idle',
      loginError: undefined,
      identity: undefined,
      identityAddress: undefined,
      delegationChain: undefined,
    })
    clearIdentity()
  }

  useEffect(() => {
    try {
      const [a, i, d] = loadIdentity()
      updateState({
        identityAddress: a,
        identity: i,
        delegationChain: d,
        isInitializing: false,
      })
    } catch (e) {
      if (e instanceof Error) {
        // eslint-disable-next-line no-console
        console.log('Could not load identity from local storage: ', e.message)
      }
      updateState({
        isInitializing: false,
      })
    }
  }, [])

  useEffect(() => {
    if (state.isInitializing) return
    clear()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectedNearAddress])

  useEffect(() => {
    const a = createAnonymousActor({
      idlFactory,
      canisterId,
      httpAgentOptions,
      actorOptions,
    })
    updateState({
      anonymousActor: a,
    })
  }, [idlFactory, canisterId, httpAgentOptions, actorOptions])

  return (
    <SiwnIdentityContext.Provider
      value={{
        ...state,
        prepareLogin,
        isPreparingLogin: state.prepareLoginStatus === 'preparing',
        isPrepareLoginError: state.prepareLoginStatus === 'error',
        isPrepareLoginSuccess: state.prepareLoginStatus === 'success',
        isPrepareLoginIdle: state.prepareLoginStatus === 'idle',
        login,
        onLoginSignatureSettled,
        isLoggingIn: state.loginStatus === 'logging-in',
        isLoginError: state.loginStatus === 'error',
        isLoginSuccess: state.loginStatus === 'success',
        isLoginIdle: state.loginStatus === 'idle',
        clear,
      }}
    >
      {children}
    </SiwnIdentityContext.Provider>
  )
}
