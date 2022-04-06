import { Container, Heading, Stack } from "@chakra-ui/react";
import TopPools from "../components/tables/TopPools";
import { useTopPools } from "../hooks/useTopPools";
import Layout from "../layout";

export default function TokenPools() {
  const topPools = useTopPools();

  return (
    <Stack direction={{ base: "column", xl: "row" }}>
      <Layout>
        <Stack fontSize="xl" alignItems="center" spacing={8}>
          <Heading as="h1" size="xl" className="token-header">
            Token Pools
          </Heading>

          <Container maxW="container.xl">
            {topPools && <TopPools data={topPools} />}
          </Container>
        </Stack>
      </Layout>
    </Stack>
  );
}
