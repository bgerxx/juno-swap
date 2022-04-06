import ReactDOM from "react-dom";
import App from "./App";
// clients
import { ChakraProvider, extendTheme, ColorModeScript } from "@chakra-ui/react";
// assets
import "./assets/css/global.css";
// configs
const theme = extendTheme({
  initialColorMode: "dark",
  useSystemColorMode: true,
});

ReactDOM.render(
  <ChakraProvider theme={theme}>
    <ColorModeScript />
    <App />
  </ChakraProvider>,
  document.getElementById("root")
);
