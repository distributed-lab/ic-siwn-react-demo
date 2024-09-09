import {
  HttpAgent,
  type ActorConfig,
  type HttpAgentOptions,
  Actor,
  type DerEncodedPublicKey,
  type ActorSubclass,
} from '@dfinity/agent'
import type { IDL } from '@dfinity/candid'
import type { SIWN_IDENTITY_SERVICE } from './types'

export const createAnonymousActor = ({
  idlFactory,
  canisterId,
  httpAgentOptions,
  actorOptions,
}: {
  idlFactory: IDL.InterfaceFactory
  canisterId: string
  httpAgentOptions?: HttpAgentOptions
  actorOptions?: ActorConfig
}) => {
  if (!idlFactory || !canisterId) return
  const agent = new HttpAgent({ ...httpAgentOptions })

  if (process.env.DFX_NETWORK !== 'ic') {
    agent.fetchRootKey().catch(err => {
      console.warn('Unable to fetch root key. Check to ensure that your local replica is running')
      console.error(err)
    })
  }

  return Actor.createActor<SIWN_IDENTITY_SERVICE>(idlFactory, {
    agent,
    canisterId,
    ...actorOptions,
  })
}

export const callPrepareLogin = async (
  anonymousActor: ActorSubclass<SIWN_IDENTITY_SERVICE>,
  address: string | undefined,
) => {
  if (!anonymousActor || !address) {
    throw new Error('Invalid actor or address')
  }

  const response = await anonymousActor.siwn_prepare_login(address)

  if ('Err' in response) {
    throw new Error(response.Err)
  }

  return response.Ok
}

export const callLogin = async (
  anonymousActor: ActorSubclass<SIWN_IDENTITY_SERVICE>,
  data: string | undefined,
  address: string | undefined,
  sessionPublicKey: DerEncodedPublicKey,
  nonce: string,
) => {
  if (!anonymousActor || !data || !address) {
    throw new Error('Invalid actor, data or address')
  }

  const loginReponse = await anonymousActor.siwn_login(
    data,
    address,
    new Uint8Array(sessionPublicKey),
    nonce,
  )

  if ('Err' in loginReponse) {
    throw new Error(loginReponse.Err)
  }

  return loginReponse.Ok
}

export const callGetDelegation = async (
  anonymousActor: ActorSubclass<SIWN_IDENTITY_SERVICE>,
  address: string | undefined,
  sessionPublicKey: DerEncodedPublicKey,
  expiration: bigint,
) => {
  if (!anonymousActor || !address) {
    throw new Error('Invalid actor or address')
  }

  const response = await anonymousActor.siwn_get_delegation(
    address,
    new Uint8Array(sessionPublicKey),
    expiration,
  )

  if ('Err' in response) {
    throw new Error(response.Err)
  }

  return response.Ok
}
