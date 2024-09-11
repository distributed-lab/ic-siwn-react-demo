import {
  Network,
  NetworkId,
  setupWalletSelector,
  SignedMessage,
  SignMessageParams,
  Wallet,
  WalletSelector,
} from '@near-wallet-selector/core'
import { setupMyNearWallet } from '@near-wallet-selector/my-near-wallet'
import { createContext, ReactNode, useContext, useMemo, useState } from 'react'

export type TNearContext = {
  init: () => Promise<boolean>
  signIn: () => Promise<void>
  signOut: () => Promise<void>
  signMessage: (params: SignMessageParams) => Promise<SignedMessage | void>
  accountId?: string
  isConnected: boolean
}

export const NearContext = createContext<TNearContext | undefined>(undefined)

export const useNear = (): TNearContext => {
  const context = useContext(NearContext)
  if (!context) {
    throw new Error('useNear must be used within an TNearContextProvider')
  }
  return context
}

export const NearContextProvider = ({
  children,
  network = 'testnet',
}: {
  children: ReactNode
  network?: Network | NetworkId
}) => {
  const [selector, setSelector] = useState<WalletSelector | null>(null)
  const [wallet, setWallet] = useState<Wallet | null>(null)
  const [accountId, setAccountId] = useState<string>('')

  const init = async () => {
    const _selector = await setupWalletSelector({
      network,
      modules: [setupMyNearWallet()],
    })

    setSelector(_selector)

    const isSignedIn = _selector.isSignedIn()

    if (isSignedIn) {
      setWallet(await _selector.wallet())
      setAccountId(_selector?.store?.getState()?.accounts?.[0]?.accountId ?? '')
    }

    return isSignedIn
  }

  const signIn = async () => {
    if (!selector || Boolean(accountId)) return

    const _wallet = await selector.wallet('my-near-wallet')
    setWallet(_wallet)
    await _wallet.signIn({
      contractId: '',
      methodNames: [],
      accounts: [],
    })
  }

  const signOut = async () => {
    if (!wallet) return

    await wallet.signOut()
    setWallet(null)
    setAccountId('')
  }

  const signMessage = async (params: SignMessageParams) => {
    if (!wallet) return

    return wallet.signMessage?.(params)
  }

  const isConnected = useMemo(() => Boolean(accountId), [accountId])

  return (
    <NearContext.Provider value={{ init, signIn, signOut, signMessage, accountId, isConnected }}>
      {children}
    </NearContext.Provider>
  )
}
