import { Box, Image } from "@chakra-ui/react";
import Logo from "../assets/images/junoswap.webp";

export default function Fallback() {
  return (
    <Box className="fallback">
      <Image src={Logo} w="84px" h="62px" />
    </Box>
  );
}
