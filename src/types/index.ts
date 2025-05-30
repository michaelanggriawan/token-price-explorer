export interface Token {
  name: string;
  chainId: number;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpc: string[];
  explorer: string;
  icon?: string;
  supportedTokens: string[]
}


export interface SelectedToken {
  address: string;
  chain: string;
  decimals: number;
  symbol: string;
  name: string;
  tokenPrice: {
    amount: number;
    total: number;
    unitPrice: number;
  }
}