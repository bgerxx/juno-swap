import { Box, Divider, Heading, Stack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { getPool24H, getTokenLiquidity } from "../services";
import numeral from "numeral";

export default function PoolData({ poolId }) {
  const [tvl, setTvl] = useState<string | null>(null);
  const [volume24, setVolume24] = useState<string | null>(null);

  async function getTokens(poolId: string) {
    const tvl1 = await getTokenLiquidity(
      poolId.substring(0, poolId.indexOf("-"))
    );
    const tvl2 = await getTokenLiquidity(
      poolId.substring(poolId.indexOf("-") + 1)
    );

    const actual24h = await getPool24H(poolId);
    const combinedTvl = tvl1.liquidity_usd + tvl2.liquidity_usd;

    let rounded = numeral(combinedTvl).format("0.00a");
    setTvl(rounded);

    rounded = numeral(actual24h.volumes).format("0.00a");
    setVolume24(rounded);
  }

  useEffect(() => {
    if (!tvl && poolId) {
      getTokens(poolId);
    }
    // eslint-disable-next-line
  }, [tvl, poolId]);

  return (
    <Box>
      <Stack
        direction={{ base: "column" }}
        alignItems="left"
        justifyContent="center"
      >
        <Stack
          spacing={10}
          direction={{ base: "column" }}
          alignItems="left"
          justifyContent="center"
          className="token-table"
          p={10}
        >
          <Box textAlign="left">
            <Heading as="h3" size="md" className="token-header">
              TVL
            </Heading>

            <Heading as="h2" size="xl">
              ${tvl}
            </Heading>
          </Box>

          <Divider />

          <Box textAlign="left">
            <Heading as="h3" size="md" className="token-header">
              24H Trading Volume
            </Heading>

            <Heading as="h2" size="xl">
              ${volume24}
            </Heading>
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
}
