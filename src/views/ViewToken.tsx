import {
  Badge,
  Box,
  Container,
  Heading,
  HStack,
  Stack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TokenCharts from "../components/charts/TokenCharts";
import Layout from "../layout";
import { getAssets, getCurrentPrice } from "../services";
import TokenData from "../components/TokenData";
import numeral from "numeral";
const dayjs = require("dayjs");

export default function ViewPool() {
  const { symbol } = useParams();
  const [current, setCurrent] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [tokenList, setTokenList] = useState<any>([]);
  const [date, setDate] = useState<string | null>(null);
  const [price, setPrice] = useState<string | null>(null);
  const [tokenType, setTokenType] = useState<boolean>(true);

  async function getToken(symbol: string) {
    const assets = await getAssets();
    const tokens = assets.tokens;
    const actualPrice = await getCurrentPrice(symbol);

    let rounded = numeral(actualPrice.price).format("0.00a");
    setPrice(rounded);
    setCurrent(symbol);
    setTokenList(tokens);

    let data = tokens.filter((_) => {
      if (_.symbol === symbol) {
        return {
          name: _.name,
          logoURI: _.logoURI,
          date: _.date,
          native: _.native,
        };
      }

      return null;
    });

    setTokenType(data[0].native);
    setDate(dayjs(data[0].date).format("MMM DD, YYYY"));
    setName(data[0]?.name);
  }

  useEffect(() => {
    if (symbol && !tokenList[0]) {
      getToken(symbol);
    }
    // eslint-disable-next-line
  }, [symbol, tokenList]);

  return (
    <Stack direction={{ base: "column", xl: "row" }}>
      <Layout>
        <Stack fontSize="xl" alignItems="center">
          <Container minW="80vw" textAlign="left">
            <Box px={10}>
              <HStack>
                <Heading as="h3" size="lg" className="token-header">
                  {name}
                </Heading>

                <Heading as="h5" size="md" color="gray" pt={1}>
                  ({symbol})
                </Heading>

                <Badge
                  color="white"
                  bg="black"
                  px={2}
                  py={1}
                  sx={{ borderRadius: 15 }}
                >
                  {tokenType ? "Native" : "CW-20"}
                </Badge>
              </HStack>

              <Heading as="h2" size="xl" py={1}>
                ${price}
              </Heading>
            </Box>

            <Stack
              direction={{ base: "column", xl: "row" }}
              spacing={{ base: 16, xl: 2 }}
              pt={6}
            >
              <Container maxW={{ base: "100vw", xl: "20vw" }}>
                {current && tokenList[0] && (
                  <TokenData symbol={current} tokenList={tokenList} />
                )}
              </Container>
              <Container maxW={{ base: "100vw", xl: "60vw" }}>
                {current && date && (
                  <TokenCharts symbol={current} date={date} />
                )}
              </Container>
            </Stack>
          </Container>
        </Stack>
      </Layout>
    </Stack>
  );
}
