// Optional MetaMask helper to autofill an Ethereum address. No hard dependency:
// the app works fully without a wallet installed.

interface EthereumProvider {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>
}

declare global {
  interface Window {
    ethereum?: EthereumProvider
  }
}

export function hasWallet(): boolean {
  return typeof window !== "undefined" && Boolean(window.ethereum)
}

export async function connectWallet(): Promise<string> {
  if (!hasWallet()) {
    throw new Error("No Ethereum wallet detected. Install MetaMask to use this feature.")
  }
  const accounts = (await window.ethereum!.request({
    method: "eth_requestAccounts",
  })) as string[]
  if (!accounts || accounts.length === 0) {
    throw new Error("No account selected.")
  }
  return accounts[0]
}
