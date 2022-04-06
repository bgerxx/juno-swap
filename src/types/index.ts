export interface Token {
  date: string;
  symbol?: string;
  price: number;
  denom: string;
}

export interface Holc {
  date: string;
  denom: string;
  open: number;
  min: number;
  max: number;
  close: number;
}

export interface TokenLiquidity {
  date: string;
  symbol: string;
  liquidity_usd: number;
  liquidity_natif: number;
}

export interface TotalLiquidity {
  date: string;
  total_liquidity: number;
}

export interface HistoricalLiquidity {
  date: string;
  liquidity: number;
}

export interface TotalVolume {
  date: string;
  volume_total: number;
}

export interface TokenVolume {
  date: string;
  volumes: number;
}
