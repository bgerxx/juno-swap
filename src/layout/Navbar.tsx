import {
  Box,
  Flex,
  HStack,
  IconButton,
  useDisclosure,
  useColorModeValue,
  Stack,
  Text,
  FlexProps,
  Heading,
  Image,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import { ReactText, useEffect, useState } from "react";
import Logo from "../assets/images/junoswap.webp";
import { ColorModeSwitcher } from "../components/ColorModeSwitcher";
import TokenSearch from "../components/TokenSearch";
import { getCurrentPrice } from "../services";

interface LinkItemProps {
  to: string;
  name: string;
  icon: any;
}

const LinkItems: LinkItemProps[] = [
  {
    to: "/",
    name: "Overview",
    icon: <i className="fas fa-chart-line fa-lg" />,
  },
  {
    to: "/token-pools",
    name: "Pools",
    icon: <i className="fas fa-sliders fa-lg" />,
  },
  {
    to: "/native-tokens",
    name: "Native Tokens",
    icon: <i className="fas fa-coins fa-lg" />,
  },
  {
    to: "/cw-20-tokens",
    name: "CW-20 Tokens",
    icon: <i className="fas fa-chart-pie fa-lg" />,
  },
];

interface NavItemProps extends FlexProps {
  to: string;
  icon: any;
  children: ReactText;
}

const NavItem = ({ to, icon, children, ...rest }: NavItemProps) => {
  return (
    <Link to={to} style={{ textDecoration: "none" }}>
      <Flex
        p={2}
        rounded={"md"}
        _hover={{
          textDecoration: "none",
          bg: "purple.600",
          color: "white",
        }}
        {...rest}
      >
        <Text mx={{ base: 4, xl: 1 }} fontSize="sm">
          {icon} {children}
        </Text>
      </Flex>
    </Link>
  );
};

export default function Navbar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [price, setPrice] = useState<number>(0.0);

  async function getJunoPrice() {
    const token = await getCurrentPrice("JUNO");

    setPrice(token.price);
  }

  useEffect(() => {
    if (price < 1) {
      getJunoPrice();
    }
  }, [price]);

  return (
    <Box>
      <Box
        h={6}
        width="100vw"
        position="fixed"
        zIndex={10}
        textAlign={{ base: "center", xl: "right" }}
        bg={useColorModeValue("gray.900", "gray.100")}
      >
        <Heading
          as="h5"
          fontSize="sm"
          py={1}
          w={{ xl: "215px" }}
          textColor={useColorModeValue("purple.400", "purple.600")}
        >
          JUNO Price: ${price}
        </Heading>
      </Box>

      <Flex
        h={24}
        alignItems={"center"}
        justifyContent={"space-between"}
        px={3}
        pt={6}
        bg={useColorModeValue("gray.100", "gray.900")}
      >
        <IconButton
          size={"md"}
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          aria-label={"Open Menu"}
          display={{ xl: "none" }}
          onClick={isOpen ? onClose : onOpen}
        />
        <HStack spacing={1} alignItems={"center"}>
          <Box mr={3}>
            <Link to="/" className="logo">
              <Image src={Logo} w="47px" h="36px" />
            </Link>
          </Box>
          <HStack as={"nav"} display={{ base: "none", xl: "flex" }}>
            {LinkItems.map((link) => (
              <NavItem to={link.to} key={link.name} icon={link.icon}>
                {link.name}
              </NavItem>
            ))}
          </HStack>

          <HStack as={"nav"} display={{ base: "none", xl: "flex" }}>
            <TokenSearch position="absolute" />
          </HStack>
        </HStack>

        <Flex alignItems={"center"} mr={{ xl: 4 }}>
          <ColorModeSwitcher />
        </Flex>
      </Flex>

      <Box
        display={{ xl: "none" }}
        bg={useColorModeValue("gray.100", "gray.900")}
      >
        {isOpen ? (
          <Stack as={"nav"} spacing={4} mb={4}>
            <Box></Box>
            {LinkItems.map((link) => (
              <NavItem to={link.to} key={link.name} icon={link.icon}>
                {link.name}
              </NavItem>
            ))}

            <TokenSearch position="relative" />
          </Stack>
        ) : null}
      </Box>
    </Box>
  );
}
