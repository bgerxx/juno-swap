import { Box, Container, Img } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import { getAssets } from "../services";

export default function TokenSearch({ position }) {
  const [tokenList, setTokenList] = useState<any[]>([]);

  async function getTokens() {
    let assets = await getAssets();

    setTokenList(assets.tokens);
  }

  useEffect(() => {
    if (!tokenList[0]) {
      getTokens();
    }
  }, [tokenList]);

  const handleOnSearch = (string, results) => {
    // onSearch will have as the first callback parameter
    // the string searched and for the second the results.
    console.log(string, results);
  };

  const handleOnHover = (result) => {
    // the item hovered
    console.log(result);
  };

  const handleOnSelect = (item) => {
    // the item selected
    if (item.natve) {
      window.location.assign(`/native-token/${item.symbol}`);
    } else {
      window.location.assign(`/cw-20-token/${item.symbol}`);
    }
  };

  const handleOnFocus = () => {
    console.log("Focused");
  };

  const formatResult = (item) => {
    return (
      <Box className="search-result">
        <Img
          src={item.logoURI}
          alt={item.symbol}
          height={30}
          width={30}
          className="search-image"
        />
        {item.symbol}
      </Box>
    );
  };

  return (
    <Container className="token-search-bar" sx={{ position: position }} py={4}>
      <ReactSearchAutocomplete
        items={tokenList}
        onSearch={handleOnSearch}
        onHover={handleOnHover}
        onSelect={handleOnSelect}
        onFocus={handleOnFocus}
        formatResult={formatResult}
        showIcon={false}
        placeholder="Search Tokens"
      />
    </Container>
  );
}
