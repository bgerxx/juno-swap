import { Box, Container, Img, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import { getAssets, getTopPools } from "../services";
import { uniqBy } from "lodash";

export default function TokenSearch({ position }) {
  const [tokenList, setTokenList] = useState<any[]>([]);

  async function getTokens() {
    const assets = await getAssets();
    const pools = await getTopPools();
    const tokens = assets.tokens;
    let poolList: any[] = [];
    let tokenData: any[] = [];

    for (const property in pools) {
      tokens.forEach((_) => {
        if (_.pool_id === property) {
          poolList.push({
            name: _.pool_id,
            type: "pool",
            logoURI: _.logoURI,
          });
        }
      });
    }

    for (const property in poolList) {
      //eslint-disable-next-line
      tokens.forEach((_) => {
        let name = poolList[property].name;
        if (name.substring(0, name.indexOf("-")) === _.symbol) {
          tokenData.push({
            ...poolList[property],
            logos: [_.logoURI, poolList[property].logoURI],
          });
        }
      });
    }

    tokens.forEach((_) => {
      tokenData.push({
        name: _.symbol,
        logos: [_.logoURI],
        type: _.native ? "native" : "cw-20",
      });
    });

    tokenData = uniqBy(tokenData, "name");

    setTokenList(tokenData);
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
    switch (item.type) {
      case "native":
        window.location.assign(`/native-token/${item.name}`);
        break;
      case "cw-20":
        window.location.assign(`/cw-20-token/${item.name}`);
        break;
      case "pool":
        window.location.assign(`/token-pool/${item.name}`);
        break;
    }
  };

  const handleOnFocus = () => {
    console.log("Focused");
  };

  const formatResult = (item) => {
    return (
      <Box w="100%" className="search-result">
        <Box maxW="300px">
          <Box>
            <Img
              src={item.logos[0]}
              alt={item.name}
              height={30}
              width={30}
              className="search-image"
            />

            {item.logos[1] && (
              <Img
                src={item.logos[1]}
                alt={item.name}
                height={30}
                width={30}
                className="search-image"
              />
            )}
          </Box>

          <Text size="m" float="right">
            {item.name}
          </Text>
        </Box>
      </Box>
    );
  };

  return (
    <Container className="token-search-bar" sx={{ position: position }} py={4}>
      {tokenList[0] && (
        <ReactSearchAutocomplete
          items={tokenList}
          onSearch={handleOnSearch}
          onHover={handleOnHover}
          onSelect={handleOnSelect}
          onFocus={handleOnFocus}
          showIcon={false}
          formatResult={formatResult}
          placeholder="Search pools or tokens"
        />
      )}

      {!tokenList[0] && (
        <ReactSearchAutocomplete
          items={tokenList}
          onSearch={handleOnSearch}
          onHover={handleOnHover}
          onSelect={handleOnSelect}
          onFocus={handleOnFocus}
          showIcon={false}
          formatResult={formatResult}
          placeholder="Search pools or tokens"
        />
      )}
    </Container>
  );
}
