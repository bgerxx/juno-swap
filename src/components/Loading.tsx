import { Box, Image } from "@chakra-ui/react";
import Logo from "../assets/images/junoswap.webp";

export default function Loading({ loading }) {
  return (
    <>
      {loading && (
        <Box className="loader">
          <Image src={Logo} w="84px" h="62px" />
        </Box>
      )}
    </>
  );
}
