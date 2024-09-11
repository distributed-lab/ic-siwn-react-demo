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
  publicKey: string | undefined,
  sessionPublicKey: DerEncodedPublicKey,
  nonce: string,
) => {
  if (!anonymousActor || !data || !address || !publicKey) {
    throw new Error('Invalid actor, data or address, or public key')
  }

  const loginReponse = await anonymousActor.siwn_login(
    data,
    address,
    publicKey,
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
