import { Container, Heading, Stack } from "@chakra-ui/react";
import TopCW20 from "../components/tables/TopCW20";
import { useTopCW20 } from "../hooks/useTopCW20";
import Layout from "../layout";

export default function CW20Tokens() {
  const topCW20 = useTopCW20();

  return (
    <Stack direction={{ base: "column", xl: "row" }}>
      <Layout>
        <Stack fontSize="xl" alignItems="center" spacing={8}>
          <Heading as="h1" size="xl" className="token-header">
            CW-20 Tokens
          </Heading>

          <Container maxW="container.xl">
            {topCW20 && <TopCW20 data={topCW20} />}
          </Container>
        </Stack>
      </Layout>
    </Stack>
  );
}
