import type { DerEncodedPublicKey, Signature } from '@dfinity/agent'
import type { SignedDelegation as ServiceSignedDelegation, PublicKey } from './types'
import { Principal } from '@dfinity/principal'
import { Delegation } from '@dfinity/identity'
import { DelegationChain, type SignedDelegation } from '@dfinity/identity'

export const asSignature = (signature: Uint8Array | number[]): Signature => {
  const arrayBuffer: ArrayBuffer = (signature as Uint8Array).buffer
  const s: Signature = arrayBuffer as Signature
  s.__signature__ = undefined
  return s
}

export const asDerEncodedPublicKey = (publicKey: Uint8Array | number[]): DerEncodedPublicKey => {
  const arrayBuffer: ArrayBuffer = (publicKey as Uint8Array).buffer
  const pk: DerEncodedPublicKey = arrayBuffer as DerEncodedPublicKey
  pk.__derEncodedPublicKey__ = undefined
  return pk
}

export const createDelegationChain = (
  signedDelegation: ServiceSignedDelegation,
  publicKey: PublicKey,
) => {
  const delegations: SignedDelegation[] = [
    {
      delegation: new Delegation(
        (signedDelegation.delegation.pubkey as Uint8Array).buffer,
        signedDelegation.delegation.expiration,
        signedDelegation.delegation.targets[0] as Principal[],
      ),
      signature: asSignature(signedDelegation.signature),
    },
  ]
  return DelegationChain.fromDelegations(delegations, asDerEncodedPublicKey(publicKey))
}
