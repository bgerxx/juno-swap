import { Box, Divider, Heading, Stack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
  getTokenLiquidity,
  getTokenVolume,
  getVolumeHistory,
} from "../services";
import numeral from "numeral";

export default function TokenData({ symbol, tokenList }) {
  const [name, setName] = useState<string | null>(null);
  const [logoURI, setLogoURI] = useState<string | null>(null);
  const [tvl, setTvl] = useState<string | null>(null);
  const [volume24, setVolume24] = useState<string | null>(null);
  const [volume7, setVolume7] = useState<string | null>(null);

  async function getTokens(symbol: string) {
    const actualTvl = await getTokenLiquidity(symbol);
    const actual24h = await getTokenVolume(symbol);
    const actual7d = await getVolumeHistory(symbol, "7d", "w");

    let token = tokenList.filter((_) => {
      if (_.symbol === symbol) {
        return {
          name: _.name,
          logoURI: _.logoURI,
        };
      }

      return null;
    });

    setName(token[0]?.name);
    setLogoURI(token[0]?.logoURI);

    let rounded = numeral(actualTvl.liquidity_usd).format("0.00a");
    setTvl(rounded);

    rounded = numeral(actual24h.volumes).format("0.00a");
    setVolume24(rounded);

    rounded = numeral(actual7d[0].volumes).format("0.00a");
    setVolume7(rounded);

    console.log(name);
    console.log(logoURI);
  }

  useEffect(() => {
    if (!tvl && symbol) {
      getTokens(symbol);
    }
    // eslint-disable-next-line
  }, [tvl]);

  return (
    <Box>
      <Stack
        direction={{ base: "column" }}
        alignItems="left"
        justifyContent="center"
      >
        <Stack
          spacing={12}
          direction={{ base: "column" }}
          alignItems="left"
          justifyContent="center"
          className="token-table"
          py={8}
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

          <Divider />

          <Box textAlign="left">
            <Heading as="h3" size="md" className="token-header">
              7D Trading Volume
            </Heading>

            <Heading as="h2" size="xl">
              ${volume7}
            </Heading>
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
}
