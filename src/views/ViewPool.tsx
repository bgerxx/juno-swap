import {
  Badge,
  Button,
  Container,
  Heading,
  HStack,
  Image,
  Stack,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TokenCharts from "../components/charts/TokenCharts";
import Layout from "../layout";
import { getAssets, getCurrentPool } from "../services";
import numeral from "numeral";
import { Link } from "react-router-dom";
import { uniqBy } from "lodash";
import PoolData from "../components/PoolData";
import dayjs from "dayjs";

export default function ViewPool() {
  const { symbol } = useParams();
  const [current, setCurrent] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [price, setPrice] = useState<string | null>(null);
  const [tokenType, setTokenType] = useState<boolean>(true);
  const [images, setImages] = useState<string[] | null>(null);

  async function getPool(symbol: string) {
    const assets = await getAssets();
    const tokens = assets.tokens;
    const poolPrice = await getCurrentPool(symbol);
    let rounded = numeral(poolPrice.price).format("0.00a");
    let poolList: any[] = [];
    let tokenData: any[] = [];

    tokens.forEach((_) => {
      if (_.pool_id === symbol) {
        poolList.push({
          name: _.pool_id,
          type: "pool",
          date: _.date,
          logoURI: _.logoURI,
          native: _.native,
        });
      }
    });

    for (const property in poolList) {
      //eslint-disable-next-line
      tokens.forEach((_) => {
        let name = poolList[property].name;
        if (name.substring(0, name.indexOf("-")) === _.symbol) {
          tokenData.push({
            ...poolList[property],
            logos: [_.logoURI, poolList[property].logoURI],
          });
        }
      });
    }

    tokenData = uniqBy(tokenData, "name");

    let data = tokenData.filter((_) => {
      if (_.name === symbol) {
        return {
          name: _.name,
          logos: _.logos,
          date: _.date,
          native: _.native,
        };
      }

      return null;
    });

    setPrice(rounded);
    setCurrent(symbol);
    setImages(data[0].logos);
    setTokenType(data[0].native);
    setDate(dayjs(data[0].date).format("MMM DD, YYYY"));
    setName(data[0].name);
  }

  useEffect(() => {
    if (symbol && !name) {
      getPool(symbol);
    }
    // eslint-disable-next-line
  }, [symbol, name]);

  return (
    <Stack direction={{ base: "column", xl: "row" }}>
      <Layout>
        {name && images && (
          <Stack fontSize="xl" alignItems="center">
            <Container minW="80vw" textAlign="left">
              <Stack
                direction={{ base: "column", xl: "row" }}
                px={10}
                justifyContent="space-between"
              >
                <VStack>
                  <HStack w="100%">
                    <Heading as="h3" size="lg" className="token-header">
                      {current?.replace("-", "/")}
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

                  <HStack w="100%">
                    <Image
                      src={images[0]}
                      alt={name}
                      height="45px"
                      width="45px"
                      className="chart-image"
                    />

                    <Image
                      src={images[1]}
                      alt={name}
                      height="45px"
                      width="45px"
                      className="chart-image"
                    />

                    <Heading as="h2" size="xl" py={1} ml={3}>
                      ${price}
                    </Heading>
                  </HStack>
                </VStack>

                <VStack>
                  <HStack w="100%">
                    <Link to="/">
                      <Button>
                        <i
                          className="fas fa-download"
                          style={{ marginRight: "10px" }}
                        />
                        Add Liquidity
                      </Button>
                    </Link>

                    <Link to="/">
                      <Button>Trade</Button>
                    </Link>
                  </HStack>
                </VStack>
              </Stack>

              <Stack
                direction={{ base: "column", xl: "row" }}
                spacing={{ base: 6, xl: 2 }}
                pt={6}
              >
                <Container maxW={{ base: "100vw", xl: "20vw" }}>
                  {current && <PoolData poolId={current} />}
                </Container>
                <Container maxW={{ base: "100vw", xl: "60vw" }}>
                  {current && date && (
                    <TokenCharts symbol={current} date={date} />
                  )}
                </Container>
              </Stack>
            </Container>
          </Stack>
        )}
      </Layout>
    </Stack>
  );
}
