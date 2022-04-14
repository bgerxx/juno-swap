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
import { getAssets, getCurrentPrice } from "../services";
import TokenData from "../components/TokenData";
import numeral from "numeral";
import { Link } from "react-router-dom";

export default function ViewPool() {
  const { symbol } = useParams();
  const [current, setCurrent] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [price, setPrice] = useState<string | null>(null);
  const [tokenType, setTokenType] = useState<boolean>(true);
  const [image, setImage] = useState<any>(null);

  async function getToken(symbol: string) {
    const assets = await getAssets();
    const tokens = assets.tokens;
    const actualPrice = await getCurrentPrice(symbol);
    let rounded = numeral(actualPrice.price).format("0.00a");

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

    setPrice(rounded);
    setCurrent(symbol);
    setImage(data[0].logoURI);
    setTokenType(data[0].native);
    setName(data[0]?.name);
  }

  useEffect(() => {
    if (symbol && !name) {
      getToken(symbol);
    }
    // eslint-disable-next-line
  }, [symbol, name]);

  return (
    <Stack direction={{ base: "column", xl: "row" }}>
      <Layout>
        {name && image && (
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
                      {name}
                    </Heading>

                    <Heading as="h5" size="md" color="gray" pt={1}>
                      ({current})
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
                      src={image}
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
                    <Link to="/token-pools">
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
                  {current && <TokenData symbol={current} />}
                </Container>
                <Container maxW={{ base: "100vw", xl: "60vw" }}>
                  {current && <TokenCharts symbol={current} />}
                </Container>
              </Stack>
            </Container>
          </Stack>
        )}
      </Layout>
    </Stack>
  );
}
