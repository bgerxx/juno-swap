import {
  Box,
  Divider,
  Heading,
  HStack,
  Image,
  Stack,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { getPool24H } from "../services";
import numeral from "numeral";

export default function PoolData({ poolId, images, currentPool }) {
  const [tvl, setTvl] = useState<string | null>(null);
  const [volume24, setVolume24] = useState<string | null>(null);
  const [locked, setLocked] = useState<any | null>(null);
  const symbol1 = poolId.substring(0, poolId.indexOf("-"));
  const symbol2 = poolId.substring(poolId.indexOf("-") + 1);

  async function getTokens(poolId: string) {
    const actual24h = await getPool24H(poolId);

    const combinedTvl =
      currentPool[poolId][symbol1].liquidity_usd +
      currentPool[poolId][symbol2].liquidity_usd;

    setLocked([
      numeral(currentPool[poolId][symbol1].liquidity_usd).format("0.00a"),
      numeral(currentPool[poolId][symbol2].liquidity_usd).format("0.00a"),
    ]);

    let rounded = numeral(combinedTvl).format("0.00a");
    setTvl(rounded);

    rounded = numeral(actual24h.volumes).format("0.00a");
    setVolume24(rounded);
  }

  useEffect(() => {
    if (!tvl && poolId && currentPool) {
      getTokens(poolId);
    }
    // eslint-disable-next-line
  }, [tvl, poolId, currentPool]);

  return (
    <Box>
      <Stack
        direction={{ base: "column" }}
        alignItems="left"
        justifyContent="center"
      >
        <Stack
          spacing={6}
          direction={{ base: "column" }}
          alignItems="left"
          justifyContent="center"
          className="token-table"
          p={6}
        >
          <Box
            textAlign="left"
            p={3}
            bg="gray.100"
            borderRadius="15px"
            color="black"
            className="pool-shadow"
          >
            <Heading as="h4" size="sm" className="token-header">
              Total Tokens Locked
            </Heading>

            <VStack w="100%" mt={3} alignItems="left" spacing={4}>
              <HStack justifyContent="space-between">
                <HStack>
                  <Image
                    src={images[0]}
                    alt={symbol1}
                    height="45px"
                    width="45px"
                    className="chart-image"
                  />

                  <Heading as="h4" size="sm" className="token-header">
                    {symbol1}
                  </Heading>
                </HStack>

                <Heading as="h4" size="sm" className="token-header">
                  ${locked && locked[0]}
                </Heading>
              </HStack>

              <HStack justifyContent="space-between">
                <HStack>
                  <Image
                    src={images[1]}
                    alt={symbol2}
                    height="45px"
                    width="45px"
                    className="chart-image"
                  />

                  <Heading as="h4" size="sm" className="token-header">
                    {symbol2}
                  </Heading>
                </HStack>

                <Heading as="h4" size="sm" className="token-header">
                  ${locked && locked[1]}
                </Heading>
              </HStack>
            </VStack>
          </Box>

          <Divider />

          <Box textAlign="left">
            <Heading
              as="h3"
              size="md"
              className="token-header"
              color="purple.500"
            >
              TVL
            </Heading>

            <Heading as="h2" size="xl">
              ${tvl}
            </Heading>
          </Box>

          <Divider />

          <Box textAlign="left">
            <Heading
              as="h3"
              size="md"
              className="token-header"
              color="purple.500"
            >
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
