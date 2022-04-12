import {
  Box,
  Button,
  Center,
  Divider,
  Heading,
  HStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { getHistoricalLiquidity } from "../../services";
import { createChart } from "lightweight-charts";
import numeral from "numeral";
import dayjs from "dayjs";

export default function TotalLiquidity() {
  const [total, setTotal] = useState<string | null>(null);
  const [duration, setDuration] = useState<string>("d");
  const [date, setDate] = useState<string>("");

  async function getTokens() {
    const summary = await getHistoricalLiquidity("12M", duration);
    let tokens: any[] = [];
    let liquidity: number = 0;
    let day = "";

    for (const total in summary) {
      tokens.push({
        time: dayjs(summary[total].date).format("YYYY-MM-DD"),
        value: summary[total].total_liquidity,
      });

      liquidity += summary[total].total_liquidity;
      day = summary[total].date;
    }

    const rounded = numeral(liquidity).format("0.00a");

    const chart = createChart(`liquidity-${duration}`, {
      layout: {
        background: { color: "transparent" },
        textColor: "rgba(229,62,62,1)",
      },
      height: 300,
    });

    const areaSeries = chart.addAreaSeries({
      lineColor: "rgba(229,62,62,1)",
      topColor: "rgba(229,62,62,0.8)",
      bottomColor: "rgba(229,62,62,0.5)",
    });

    areaSeries.setData(tokens);

    setDate(dayjs(day).format("MMM DD, YYYY"));
    setTotal(rounded);
  }

  useEffect(() => {
    if (!total) {
      getTokens();
    }
    // eslint-disable-next-line
  }, [total]);

  function handleDuration(value: string) {
    setDuration(value);
    setTotal(null);
  }

  return (
    <Box className="liquidity-chart" p={3}>
      <HStack justifyContent="space-between">
        <Box textAlign="left">
          <Heading as="h4" size="sm" color={"rgba(229,62,62,1)"}>
            TVL
          </Heading>

          <Heading as="h2" size="lg">
            ${total}
          </Heading>

          <Heading as="h5" size="sm" py={1} color="gray">
            {date}
          </Heading>
        </Box>
        <Box textAlign="right">
          <Button
            disabled={duration === "d"}
            onClick={() => handleDuration("d")}
          >
            D
          </Button>
          <Button
            disabled={duration === "w"}
            onClick={() => handleDuration("w")}
            mx={3}
          >
            W
          </Button>
          <Button
            disabled={duration === "M"}
            onClick={() => handleDuration("M")}
          >
            M
          </Button>
        </Box>
      </HStack>

      <Center height="25px">
        <Divider size="xl" my={3} />
      </Center>

      <Box minH="300px">
        {duration === "d" && <Box id="liquidity-d" />}
        {duration === "w" && <Box id="liquidity-w" />}
        {duration === "M" && <Box id="liquidity-M" />}
      </Box>
    </Box>
  );
}
