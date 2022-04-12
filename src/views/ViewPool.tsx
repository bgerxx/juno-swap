import {
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
import Layout from "../layout";
import { getAssets, getCurrentPool } from "../services";
import { Link } from "react-router-dom";
import { uniqBy } from "lodash";
import PoolData from "../components/PoolData";
import PoolCharts from "../components/charts/PoolCharts";

export default function ViewPool() {
  const { symbol } = useParams();
  const [current, setCurrent] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [images, setImages] = useState<string[] | null>(null);
  const [currentPool, setCurrentPool] = useState<any>([]);
  const [ratio, setRatio] = useState<number[]>([0, 0]);
  const symbol1 = symbol?.substring(0, symbol.indexOf("-"));
  const symbol2 = symbol?.substring(symbol.indexOf("-") + 1);

  async function getPool(symbol: string) {
    const getPool = await getCurrentPool(symbol);
    const assets = await getAssets();
    const tokens = assets.tokens;
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

    const currentRatio = getPool[symbol].ratio;

    setRatio([(1 / currentRatio).toFixed(2), currentRatio.toFixed(2)]);
    setCurrent(symbol);
    setImages(data[0].logos);
    setName(data[0].name);
    setCurrentPool(getPool);
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
                px={12}
                justifyContent="space-between"
              >
                <VStack>
                  <HStack w="100%">
                    <Heading as="h2" size="lg" className="token-header">
                      {current?.replace("-", " / ")}
                    </Heading>
                  </HStack>

                  <HStack
                    w="100%"
                    p={0.5}
                    bg="gray.100"
                    borderRadius="15px"
                    className="pool-shadow"
                  >
                    <Image
                      src={images[0]}
                      alt={symbol1}
                      height="35px"
                      width="35px"
                      className="chart-image"
                    />

                    <Heading as="h4" size="xs" py={1} ml={3} color="black">
                      1 {symbol1} = {ratio[0]} {symbol2}
                    </Heading>
                  </HStack>

                  <HStack
                    w="100%"
                    p={0.5}
                    bg="gray.100"
                    borderRadius="15px"
                    className="pool-shadow"
                  >
                    <Image
                      src={images[1]}
                      alt={symbol2}
                      height="35px"
                      width="35px"
                      className="chart-image"
                    />

                    <Heading as="h4" size="xs" py={1} ml={3} color="black">
                      1 {symbol2} = {ratio[1]} {symbol1}
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
                  {current && images && (
                    <PoolData
                      poolId={current}
                      images={images}
                      currentPool={currentPool}
                    />
                  )}
                </Container>
                <Container maxW={{ base: "100vw", xl: "60vw" }}>
                  {current && <PoolCharts symbol={current} />}
                </Container>
              </Stack>
            </Container>
          </Stack>
        )}
      </Layout>
    </Stack>
  );
}
