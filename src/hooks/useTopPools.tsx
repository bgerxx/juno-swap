import { useEffect, useState } from "react";
import { getAssets, getTopPools } from "../services";
import numeral from "numeral";
import MissingToken from "../assets/images/missing-token.webp";
import { Link } from "react-router-dom";
import { Image } from "@chakra-ui/react";

export const useTopPools = () => {
  const [data, setData] = useState<any[any]>(null);

  async function fetch() {
    const tokens: any[any] = [];
    const summary = await getTopPools();
    const assets = await getAssets();
    const tokenList = assets.tokens;

    for (const property in summary) {
      let token = tokenList.filter((_) => {
        if (_.pool_id === property) {
          return {
            pool_id: _.pool_id,
            logoURI: _.logoURI,
          };
        }

        return null;
      });

      tokens.push({
        image: token[0]?.logoURI ? (
          <Image
            src={token[0].logoURI}
            alt={property}
            className="token-image"
          />
        ) : (
          <Image src={MissingToken} alt={property} className="token-image" />
        ),
        name: (
          <Link to={`/${property}`} className="token-link">
            {token[0]?.pool_id
              ? token[0].pool_id.replace("-", "/")
              : property.replace("-", "/")}
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
