import { Box, Divider, Heading, HStack, Image, Stack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
  getCurrentPrice,
  getTokenLiquidity,
  getTokenVolume,
  getVolumeHistory,
} from "../services";
import numeral from "numeral";

export default function TokenData({ symbol, tokenList }) {
  const [name, setName] = useState<string | null>(null);
  const [logoURI, setLogoURI] = useState<string | null>(null);
  const [price, setPrice] = useState<string | null>(null);
  const [tvl, setTvl] = useState<string | null>(null);
  const [volume24, setVolume24] = useState<string | null>(null);
  const [volume7, setVolume7] = useState<string | null>(null);

  async function getTokens(symbol: string) {
    const actualPrice = await getCurrentPrice(symbol);
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

    let rounded = numeral(actualPrice.price).format("0.00a");
    setPrice(rounded);

    rounded = numeral(actualTvl.liquidity_usd).format("0.00a");
    setTvl(rounded);

    rounded = numeral(actual24h.volumes).format("0.00a");
    setVolume24(rounded);

    rounded = numeral(actual7d[0].volumes).format("0.00a");
    setVolume7(rounded);
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
        spacing={8}
        direction={{ base: "column" }}
        alignItems="left"
        justifyContent="center"
      >
        <Box textAlign="left" px={6}>
          <Heading as="h3" size="md" className="token-header">
            Price
          </Heading>

          <HStack justifyContent="space-between">
            <Heading as="h2" size="xl">
              ${price}
            </Heading>

            <Box sx={{ height: 75, width: 75 }}>
              {logoURI && name && (
                <Image
                  src={logoURI}
                  alt={name}
                  className="token-image"
                  sx={{ minHeight: 75, minWidth: 75 }}
                />
              )}
            </Box>
          </HStack>
        </Box>

        <Stack
          spacing={10}
          direction={{ base: "column" }}
          alignItems="left"
          justifyContent="center"
          className="token-table"
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
