import { Container, Heading, Stack } from "@chakra-ui/react";
import TopNative from "../components/tables/TopNative";
import { useTopNative } from "../hooks/useTopNative";
import Layout from "../layout";

export default function NativeTokens() {
  const topNative = useTopNative();

  return (
    <Stack direction={{ base: "column", xl: "row" }}>
      <Layout>
        <Stack fontSize="xl" alignItems="center" spacing={8}>
          <Heading as="h1" size="xl" className="token-header">
            Native Tokens
          </Heading>

          <Container maxW="container.xl">
            {topNative && <TopNative data={topNative} />}
          </Container>
        </Stack>
      </Layout>
    </Stack>
  );
}
