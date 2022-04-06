import { Container, Stack, Center } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <Center
      sx={{
        bottom: 0,
        left: 0,
        position: "absolute",
        width: "100%",
        height: 75,
        backgroundColor: "transparent",
      }}
    >
      <Container
        as={Stack}
        py={{ base: 2 }}
        direction={{ base: "column" }}
        spacing={4}
        justify={{ base: "center" }}
        align={{ base: "center" }}
      >
        <Link to="/" className="token-link">
          © {new Date().getFullYear()} JunoSwap
        </Link>
      </Container>
    </Center>
  );
}
