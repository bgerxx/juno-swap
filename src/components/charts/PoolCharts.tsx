import {
  Box,
  Button,
  Center,
  Divider,
  Heading,
  HStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { getHolcPrices, getTokenTVL, getVolumeHistory } from "../../services";
import { createChart } from "lightweight-charts";
import numeral from "numeral";
import dayjs from "dayjs";

export default function PoolCharts({ symbols }) {
  const [current, setCurrent] = useState<string | null>(null);
  const [heading, setHeading] = useState<string>("Volume 24H");
  const [headingColor, setHeadingColor] =
    useState<string>("rgba(49,130,206,1)");
  const [total, setTotal] = useState<string | null>(null);
  const [metric, setMetric] = useState<string>("v");
  const [duration, setDuration] = useState<string>("d");

  async function getVolume(symbols: string) {
    setHeading("Volume 24H");
    setHeadingColor("rgba(49,130,206,1)");
    const summary = await getVolumeHistory(symbols, "12M", duration);
    let tokens: any[] = [];
    let volume: number = 0;

    for (const total in summary) {
      tokens.push({
        time: dayjs(summary[total].date).format("YYYY-MM-DD"),
        value: summary[total].volumes,
      });

      volume += summary[total].volumes;
    }

    const rounded = numeral(volume).format("0.00a");

    const chart = createChart(`volume-${duration}`, {
      layout: {
        background: { color: "transparent" },
        textColor: "rgba(49,130,206,1)",
      },
      height: 300,
    });

    const histogramSeries = chart.addHistogramSeries({
      color: "rgba(49,130,206,0.8)",
    });

    histogramSeries.setData(tokens);

    setTotal(rounded);
  }

  async function getLiquidity(current: string) {
    setHeading("TVL");
    setHeadingColor("rgba(229,62,62,1)");
    const summary = await getTokenTVL(current, "12M", duration);
    let tokens: any[] = [];
    let liquidity: number = 0;

    for (const total in summary) {
      tokens.push({
        time: dayjs(summary[total].date).format("YYYY-MM-DD"),
        value: summary[total].liquidity,
      });

      liquidity += summary[total].liquidity;
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

    setTotal(rounded);
  }

  async function getPrice(current: string) {
    setHeading("Price");
    setHeadingColor("rgba(56,161,105,1)");
    const summary = await getHolcPrices(current, "12M", duration);
    let tokens: any[] = [];
    let liquidity: number = 0;

    for (const total in summary) {
      tokens.push({
        time: dayjs(summary[total].date).format("YYYY-MM-DD"),
        open: summary[total].open,
        high: summary[total].max,
        low: summary[total].min,
        close: summary[total].close,
      });

      liquidity += summary[total].max;
    }

    const rounded = numeral(liquidity).format("0.00a");

    const chart = createChart(`price-${duration}`, {
      layout: {
        background: { color: "transparent" },
        textColor: "rgba(56,161,105,1)",
      },
      height: 300,
    });

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: "rgba(56,161,105,0.5)",
      downColor: "rgba(229,62,62,0.5)",
    });

    candlestickSeries.setData(tokens);

    setTotal(rounded);
  }

  useEffect(() => {
    if (symbols) {
      setCurrent(symbols);
      setTotal(null);
    }
  }, [symbols]);

  useEffect(() => {
    if (!total && current) {
      switch (metric) {
        case "v":
          getVolume(current);
          break;

        case "l":
          getLiquidity(current);
          break;

        case "p":
          getPrice(current);
          break;
      }
    }
    // eslint-disable-next-line
  }, [total, metric, current]);

  function handleDuration(value: string) {
    setDuration(value);
    setTotal(null);
  }

  function handleMetric(value: string) {
    setMetric(value);
    setTotal(null);
  }

  return (
    <Box p={6} className="token-table" minHeight={535}>
      <Box textAlign="left" display={{ base: "block", xl: "none" }} pb={3}>
        <Heading as="h3" size="md" color={headingColor}>
          {heading}
        </Heading>

        <Heading as="h2" size="xl" py={1}>
          ${total}
        </Heading>
      </Box>

      <HStack justifyContent={{ base: "right", xl: "space-between" }} py={4}>
        <Box textAlign="left" display={{ base: "none", xl: "block" }}>
          <Heading as="h3" size="md" color={headingColor}>
            {heading}
          </Heading>

          <Heading as="h2" size="xl" py={1}>
            ${total}
          </Heading>
        </Box>

        <Box textAlign="right">
          <Button
            fontSize="sm"
            disabled={metric === "v"}
            onClick={() => handleMetric("v")}
          >
            Volume
          </Button>
          <Button
            fontSize="sm"
            disabled={metric === "l"}
            onClick={() => handleMetric("l")}
            mx={3}
          >
            TVL
          </Button>
          <Button
            fontSize="sm"
            disabled={metric === "p"}
            onClick={() => handleMetric("p")}
          >
            Price
          </Button>
        </Box>
      </HStack>
      <HStack justifyContent="right" py={3}>
        <Box textAlign="right">
          <Button
            fontSize="sm"
            disabled={duration === "d"}
            onClick={() => handleDuration("d")}
          >
            Day
          </Button>
          <Button
            fontSize="sm"
            disabled={duration === "w"}
            onClick={() => handleDuration("w")}
            mx={3}
          >
            Week
          </Button>
          <Button
            fontSize="sm"
            disabled={duration === "M"}
            onClick={() => handleDuration("M")}
          >
            Month
          </Button>
        </Box>
      </HStack>

      <Center height="25px">
        <Divider size="xl" my={3} />
      </Center>

      <Box minH="300px">
        {metric === "v" && duration === "d" && <Box id="volume-d" />}
        {metric === "v" && duration === "w" && <Box id="volume-w" />}
        {metric === "v" && duration === "M" && <Box id="volume-M" />}

        {metric === "l" && duration === "d" && <Box id="liquidity-d" />}
        {metric === "l" && duration === "w" && <Box id="liquidity-w" />}
        {metric === "l" && duration === "M" && <Box id="liquidity-M" />}

        {metric === "p" && duration === "d" && <Box id="price-d" />}
        {metric === "p" && duration === "w" && <Box id="price-w" />}
        {metric === "p" && duration === "M" && <Box id="price-M" />}
      </Box>
    </Box>
  );
}
