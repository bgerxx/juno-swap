import { Container, Heading, Stack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../layout";
import { getAssets } from "../services";
const dayjs = require("dayjs");

export default function ViewPool() {
  const { symbols } = useParams();
  const [current, setCurrent] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [tokenList, setTokenList] = useState<any>([]);
  const [date, setDate] = useState<string | null>(null);

  async function getToken(symbol: string) {
    setCurrent(symbol);
    const assets = await getAssets();
    const tokens = assets.tokens;
    setTokenList(tokens);

    let data = tokens.filter((_) => {
      if (_.symbol === symbols) {
        return {
          name: _.name,
          logoURI: _.logoURI,
          date: _.date,
        };
      }

      return null;
    });

    console.log(current);
    setDate(dayjs(data[0].date).format("MMM DD, YYYY"));
    setName(data[0]?.name);
  }

  useEffect(() => {
    if (symbols && !tokenList[0]) {
      getToken(symbols);
    }
    // eslint-disable-next-line
  }, [symbols, tokenList]);

  return (
    <Stack direction={{ base: "column", xl: "row" }}>
      <Layout>
        <Stack fontSize="xl" alignItems="center">
          <Container minW="80vw" textAlign="center">
            <Heading as="h1" size="2xl" px={6} className="token-header">
              {name}
            </Heading>

            <Heading as="h5" size="sm" color="gray" py={1}>
              {date}
            </Heading>

            <Stack
              direction={{ base: "column", xl: "row" }}
              spacing={{ base: 16, xl: 2 }}
              pt={6}
            >
              <Container maxW={{ base: "100vw", xl: "20vw" }}></Container>
              <Container maxW={{ base: "100vw", xl: "60vw" }}></Container>
            </Stack>
          </Container>
        </Stack>
      </Layout>
    </Stack>
  );
}
