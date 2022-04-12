import { Box, Container } from "@chakra-ui/react";
import Footer from "./Footer";
import BackToTop from "../components/BackToTop";
import Navbar from "./Navbar";
import { Helmet } from "react-helmet";
import { useLocation, useParams } from "react-router-dom";

const Layout = ({ children }) => {
  const location = useLocation();
  const { symbol } = useParams();

  let pathname = location.pathname.replace(/[-//]/g, " ").split("");
  pathname = pathname.map((char, index) => {
    if (index === 0 || pathname[index - 1] === " ") {
      return char.toUpperCase();
    }

    return char;
  });
  let pageTitle = pathname[1] ? pathname.join("") : "Overview";

  return (
    <Box>
      <Helmet>
        <title>
          {symbol
            ? `${symbol.replace("-", " / ")}  | JunoSwap`
            : `${pageTitle}  | JunoSwap`}
        </title>
      </Helmet>

      <Box className="hero-bg">
        <Navbar />

        <Container pt={12} pb={24} minW="100vw" minH="100vh">
          {children}
        </Container>

        <Footer />
      </Box>

      <BackToTop />
    </Box>
  );
};

export default Layout;
