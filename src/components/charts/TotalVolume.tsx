import {
  Box,
  Button,
  Center,
  Divider,
  Heading,
  HStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { getHistoricalVolume } from "../../services";
import { createChart } from "lightweight-charts";
import numeral from "numeral";
import dayjs from "dayjs";

export default function TotalLiquidity() {
  const [total, setTotal] = useState<string | null>(null);
  const [duration, setDuration] = useState<string>("d");

  async function getTokens() {
    const summary = await getHistoricalVolume("12M", duration);
    let tokens: any[] = [];
    let volume: number = 0;

    for (const total in summary) {
      tokens.push({
        time: dayjs(summary[total].date).format("YYYY-MM-DD"),
        value: summary[total].volume_total,
      });

      volume += summary[total].volume_total;
    }

    const rounded = numeral(volume).format("0.00a");

    const chart = createChart(`volume-${duration}`, {
      layout: {
        background: { color: "transparent" },
        textColor: "rgba(49,130,206,1)",
      },
      height: 300,
    });

    const areaSeries = chart.addHistogramSeries({
      color: "rgba(49,130,206,0.8)",
    });

    areaSeries.setData(tokens);

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
    <Box className="volume-chart" p={3}>
      <HStack justifyContent="space-between">
        <Box textAlign="left">
          <Heading as="h4" size="sm" color={"rgba(49,130,206,1)"}>
            Volume 24H
          </Heading>

          <Heading as="h2" size="lg">
            ${total}
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
        {duration === "d" && <Box id="volume-d" />}
        {duration === "w" && <Box id="volume-w" />}
        {duration === "M" && <Box id="volume-M" />}
      </Box>
    </Box>
  );
}
