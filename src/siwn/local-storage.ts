import { DelegationChain, DelegationIdentity, Ed25519KeyIdentity } from '@dfinity/identity'

import type { SiwnIdentityStorage } from './types'
import { SignMessageParams } from '@near-wallet-selector/core'

const STORAGE_KEY = 'siwnIdentity'

export function loadIdentity() {
  const storedState = localStorage.getItem(STORAGE_KEY)

  if (!storedState) {
    throw new Error('No stored identity found.')
  }

  const s: SiwnIdentityStorage = JSON.parse(storedState)
  if (!s.address || !s.sessionIdentity || !s.delegationChain) {
    throw new Error('Stored state is invalid.')
  }

  const d = DelegationChain.fromJSON(JSON.stringify(s.delegationChain))
  const i = DelegationIdentity.fromDelegation(
    Ed25519KeyIdentity.fromJSON(JSON.stringify(s.sessionIdentity)),
    d,
  )

  return [s.address, i, d] as const
}

export function saveIdentity(
  address: string,
  sessionIdentity: Ed25519KeyIdentity,
  delegationChain: DelegationChain,
) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      address,
      sessionIdentity: sessionIdentity.toJSON(),
      delegationChain: delegationChain.toJSON(),
    }),
  )
}

export function clearIdentity() {
  localStorage.removeItem(STORAGE_KEY)
}

export type SavedMessage = Omit<SignMessageParams, 'nonce'> & { nonce: string }

export function saveMessage(message: SignMessageParams) {
  localStorage.setItem(
    'siwnMessage',
    JSON.stringify({ ...message, nonce: message.nonce.toString('base64') }),
  )
}

export function loadMessage(): SavedMessage {
  const storedState = localStorage.getItem('siwnMessage')

  if (!storedState) {
    throw new Error('No stored message found.')
  }

  return JSON.parse(storedState) as SavedMessage
}

export function clearMessage() {
  localStorage.removeItem('siwnMessage')
}
