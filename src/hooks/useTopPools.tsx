import { useEffect, useState } from "react";
import { getAssets, getTopPools } from "../services";
import numeral from "numeral";
import MissingToken from "../assets/images/missing-token.webp";
import { Link } from "react-router-dom";
import { HStack, Image } from "@chakra-ui/react";
import { uniqBy } from "lodash";

export const useTopPools = () => {
  const [data, setData] = useState<any[any]>(null);

  async function fetch() {
    const tokens: any[any] = [];
    const summary = await getTopPools();
    const assets = await getAssets();
    const tokenList = assets.tokens;
    let poolList: any[] = [];
    let tokenData: any[] = [];
    let itr = 0;

    for (const property in summary) {
      tokenList.forEach((_) => {
        if (_.pool_id === property) {
          poolList.push({
            name: _.pool_id,
            type: "pool",
            logoURI: _.logoURI,
          });
        }
      });

      for (const property in poolList) {
        //eslint-disable-next-line
        tokenList.forEach((_) => {
          let name = poolList[property].name;
          if (name.substring(0, name.indexOf("-")) === _.symbol) {
            tokenData.push({
              ...poolList[property],
              logos: [_.logoURI, poolList[property].logoURI],
            });
          }
        });
      }

      let token = uniqBy(tokenData, "name");
      token = token.sort((a, b) => b.liquidity - a.liquidity);

      let link = token[0]?.pool_id
        ? token[0].pool_id.replace("-", "/")
        : property.replace("-", "/");

      tokens.push({
        image: token[0]?.logos[0] ? (
          <HStack>
            <Image
              src={token[itr].logos[0]}
              alt={token[itr].name}
              className="token-image"
            />

            {token[itr].logos[1] && (
              <Image
                src={token[itr].logos[1]}
                alt={token[itr].name}
                className="token-image"
              />
            )}
          </HStack>
        ) : (
          <Image src={MissingToken} alt={property} className="token-image" />
        ),
        name: (
          <Link to={`/token-pool/${property}`} className="token-link">
            {link}
          </Link>
        ),
        tvl: `$${numeral(summary[property]["token_liquidity_usd"]).format(
          "0.00a"
        )}`,
        volume24: `$${numeral(summary[property]["volume 24h"]).format(
          "0.00a"
        )}`,
        volume7: `$${numeral(summary[property]["volume 7d"]).format("0.00a")}`,
        liquidity: summary[property]["token_liquidity_usd"],
      });

      itr++;
    }

    tokens.sort((a, b) => b.liquidity - a.liquidity);
    const topPools = tokens.map((token, index) => {
      return {
        number: index + 1,
        ...token,
      };
    });

    setData(topPools);
  }

  useEffect(() => {
    if (!data) {
      fetch();
    }
  }, [data]);

  return data;
};
