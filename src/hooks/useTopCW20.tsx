import { useEffect, useState } from "react";
import { getAssets, getTotalSummary } from "../services";
import numeral from "numeral";
import MissingToken from "../assets/images/missing-token.webp";
import { Link } from "react-router-dom";
import { Image } from "@chakra-ui/react";

export const useTopCW20 = () => {
  const [data, setData] = useState<any[any]>(null);

  async function fetch() {
    let tokens: any[] = [];
    const summary = await getTotalSummary(false);
    const assets = await getAssets();
    const tokenList = assets.tokens;

    for (const property in summary) {
      let token = tokenList.filter((_) => {
        if (_.symbol === property) {
          return {
            name: _.name,
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
          <Link to={`/cw-20-token/${property}`} className="token-link">
            {token[0]?.name ? (
              <>
                {token[0].name} <span>({property})</span>
              </>
            ) : (
              property
            )}
          </Link>
        ),
        price:
          summary[property]["price"] > 0.01
            ? `$${numeral(summary[property]["price"]).format("0.00a")}`
            : `$${numeral(summary[property]["price"]).format("0.00000a")}`,
        volume24: `$${numeral(summary[property]["volume_usd"]).format(
          "0.00a"
        )}`,
        tvl: `$${numeral(summary[property]["liquidity_usd"]).format("0.00a")}`,
        liquidity: summary[property]["liquidity_usd"],
      });
    }

    tokens.sort((a, b) => b.liquidity - a.liquidity);
    const topCW20 = tokens.map((token, index) => {
      return {
        number: index + 1,
        ...token,
      };
    });

    setData(topCW20);
  }

  useEffect(() => {
    if (!data) {
      fetch();
    }
  }, [data]);

  return data;
};
