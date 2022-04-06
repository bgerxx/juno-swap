import { Box, Container, Heading, Stack } from "@chakra-ui/react";
import TopNative from "../components/tables/TopNative";
import TopCW20 from "../components/tables/TopCW20";
import TotalLiquidity from "../components/charts/TotalLiquidity";
import TotalVolume from "../components/charts/TotalVolume";
import TopPools from "../components/tables/TopPools";
import { useTopPools } from "../hooks/useTopPools";
import { useTopCW20 } from "../hooks/useTopCW20";
import { useTopNative } from "../hooks/useTopNative";
import Layout from "../layout";
import { useEffect, useState } from "react";
import Loading from "../components/Loading";

export default function Home() {
  const [loading, setLoading] = useState<boolean>(true);
  const topNative = useTopNative();
  const topCW20 = useTopCW20();
  const topPools = useTopPools();
  const display = { minHeight: "115vh" };
  const hidden = {
    zIndex: 1,
    height: "100vh",
    width: "100vw",
    position: "fixed",
    backgroundColor: "#000",
    overflow: "hidden",
  };

  useEffect(() => {
    if (loading) {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  }, [loading]);

  return (
    <Box sx={loading ? hidden : display}>
      {loading && <Loading loading={loading} />}

      <Stack direction={{ base: "column", xl: "row" }}>
        <Layout>
          <Stack fontSize="xl" alignItems="center" spacing={8}>
            <Heading as="h1" size="xl" className="token-header">
              JunoSwap Overview
            </Heading>
            <Container maxW="container.xl">
              <Stack
                direction={{ base: "column", xl: "row" }}
                alignItems="center"
                spacing={8}
              >
                <TotalLiquidity />

                <TotalVolume />
              </Stack>
            </Container>

            <Container maxW="container.xl">
              {topNative && <TopNative data={topNative} />}
            </Container>
            <Container maxW="container.xl">
              {topCW20 && <TopCW20 data={topCW20} />}
            </Container>
            <Container maxW="container.xl">
              {topPools && <TopPools data={topPools} />}
            </Container>
          </Stack>
        </Layout>
      </Stack>
    </Box>
  );
}
