import type { ActorMethod } from '@dfinity/agent'
import type { Principal } from '@dfinity/principal'

export type Address = string

export type CanisterPublicKey = PublicKey

export interface Delegation {
  pubkey: PublicKey
  targets: [] | [Array<Principal>]
  expiration: Timestamp
}

export type GetDelegationResponse = { Ok: SignedDelegation } | { Err: string }

export interface LoginOkResponse {
  user_canister_pubkey: CanisterPublicKey
  expiration: Timestamp
}

export type LoginResponse = { Ok: LoginOkResponse } | { Err: string }

export interface PrepareLoginOkResponse {
  nonce: string
  siwn_message: SiwnMessage
}

export type PrepareLoginResponse = { Ok: PrepareLoginOkResponse } | { Err: string }

export type PublicKey = Uint8Array | number[]

export type SessionKey = PublicKey

export interface SignedDelegation {
  signature: Uint8Array | number[]
  delegation: Delegation
}

export type SiwnMessage = string

export type SiwnSignature = string

export type Timestamp = bigint

export type Nonce = string

export interface SIWN_IDENTITY_SERVICE {
  siwn_prepare_login: ActorMethod<[Address], PrepareLoginResponse>
  siwn_login: ActorMethod<[SiwnSignature, Address, SessionKey, Nonce], LoginResponse>
  siwn_get_delegation: ActorMethod<[Address, SessionKey, Timestamp], GetDelegationResponse>
}
