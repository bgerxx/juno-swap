import axios from "axios";
import {
  HistoricalLiquidity,
  Holc,
  Token,
  TokenLiquidity,
  TokenVolume,
  TotalLiquidity,
  TotalVolume,
} from "../types";

const apiAxios = axios.create({
  baseURL: "https://api-junoswap.enigma-validator.com",
  headers: { "content-type": "application/json" },
});

/**
 * This end point returns image assets
 */

// returns all token and pool assets
export const getAssets = async (): Promise<any> => {
  return (
    await axios.get(
      `https://raw.githubusercontent.com/CosmosContracts/junoswap-asset-list/main/token_list.json`
    )
  ).data;
};

/**
 * These end points return summary information
 */

// returns all tokens current prices, liquidity, and volumes
export const getTotalSummary = async (native: boolean): Promise<any> => {
  return (await apiAxios.get(`/summary/tokens/current/${native}`)).data;
};

// return current liquidity, volume (24H), and volume (7d) for pools
export const getTopPools = async (): Promise<any> => {
  return (await apiAxios.get(`/summary/pools/current`)).data;
};

/**
 * These endpoints return price information
 */

// returns all tokens current prices
export const getAllPrices = async (): Promise<any> => {
  return (await apiAxios.get(`/prices/tokens/current`)).data;
};

// return current price for a specific token
export const getCurrentPrice = async (symbol: string): Promise<Token> => {
  return (await apiAxios.get(`/prices/tokens/current/${symbol}`)).data;
};

// return historical prices for a specific token
export const getHistoricalPrices = async (
  symbol: string,
  timeRange: string,
  granularity: string
): Promise<Token[]> => {
  return (
    await apiAxios.get(
      `/prices/tokens/historical/${symbol}/${timeRange}/${granularity}`
    )
  ).data;
};

// return historical holc prices for a specific token
export const getHolcPrices = async (
  symbol: string,
  timeRange: string,
  granularity: string
): Promise<Holc[]> => {
  return (
    await apiAxios.get(
      `/prices/tokens/historical/holc/${symbol}/${timeRange}/${granularity}`
    )
  ).data;
};

/**
 * These end points return liquidity information
 */

// return total current liquidity
export const getCurrentLiquidity = async (): Promise<TotalLiquidity> => {
  return (await apiAxios.get(`/liquidity/total/current`)).data;
};

// return total historal liquidity
export const getHistoricalLiquidity = async (
  timeRange: string,
  granularity: string
): Promise<TotalLiquidity[]> => {
  return (
    await apiAxios.get(
      `/liquidity/total/historical/${timeRange}/${granularity}`
    )
  ).data;
};

// return total historal liquidity
export const getTokenTVL = async (
  symbol: string,
  timeRange: string,
  granularity: string
): Promise<HistoricalLiquidity[]> => {
  return (
    await apiAxios.get(
      `/liquidity/tokens/historical/${symbol}/${timeRange}/${granularity}`
    )
  ).data;
};

// return current liquidity for a specific token
export const getTokenLiquidity = async (
  symbol: string
): Promise<TokenLiquidity> => {
  return (await apiAxios.get(`/liquidity/tokens/current/${symbol}`)).data;
};

/**
 * These end points return volume information
 */

// return total historal volume
export const getHistoricalVolume = async (
  timeRange: string,
  granularity: string
): Promise<TotalVolume[]> => {
  return (
    await apiAxios.get(`/volumes/total/historical/${timeRange}/${granularity}`)
  ).data;
};

// return current liquidity for a specific token
export const getTokenVolume = async (symbol: string): Promise<TokenVolume> => {
  return (await apiAxios.get(`/volumes/tokens/${symbol}/sliding/current`)).data;
};

// return total current volumes since midnight (UTC)
export const getCurrentVolume = async (): Promise<number> => {
  return (await apiAxios.get(`/volumes/total/current`)).data;
};

// return total current volumes over the last 24h
export const getCurrent24Volume = async (): Promise<number> => {
  return (await apiAxios.get(`/volumes/total/sliding/current`)).data;
};

// return total current volumes over a duration of time
export const getVolumeHistory = async (
  symbol: string,
  timeRange: string,
  granularity: string
): Promise<TokenVolume[]> => {
  return (
    await apiAxios.get(
      `/volumes/tokens/historical/${symbol}/${timeRange}/${granularity}`
    )
  ).data;
};

/**
 * These end points return pool data
 */

// return current liquidity pool data for a specific pool
export const getCurrentPool = async (poolId: string): Promise<any> => {
  return (await apiAxios.get(`/liquidity/pools/current/${poolId}`)).data;
};

// return current volumes for a specfic pool over the last 24h
export const getPool24H = async (poolId: string): Promise<TokenVolume> => {
  return (await apiAxios.get(`/volumes/pools/${poolId}/sliding/current`)).data;
};
