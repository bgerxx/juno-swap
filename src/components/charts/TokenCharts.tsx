import {
  Box,
  Button,
  Center,
  Divider,
  Heading,
  HStack,
  Stack,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { getHolcPrices, getTokenTVL, getVolumeHistory } from "../../services";
import { createChart } from "lightweight-charts";
import numeral from "numeral";
import dayjs from "dayjs";

export default function TokenCharts({ symbol }) {
  const [current, setCurrent] = useState<string | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [total, setTotal] = useState<string | null>(null);
  const [metric, setMetric] = useState<string>("p");
  const [duration, setDuration] = useState<string>("d");

  async function getVolume(symbol: string) {
    const summary = await getVolumeHistory(symbol, "12M", duration);
    let tokens: any[] = [];
    let volume: number = 0;
    let day = "";

    for (const total in summary) {
      tokens.push({
        time: dayjs(summary[total].date).format("YYYY-MM-DD"),
        value: summary[total].volumes,
      });

      day = summary[total].date;
      volume = summary[total].volumes;
    }

    const rounded = numeral(volume).format("0.00a");

    const chart = createChart(`volume-${duration}`, {
      layout: {
        background: { color: "transparent" },
        textColor: "rgba(49,130,206,1)",
      },
      height: 300,
    });

    chart.timeScale().fitContent();

    const histogramSeries = chart.addHistogramSeries({
      color: "rgba(49,130,206,0.8)",
    });

    histogramSeries.setData(tokens);

    setDate(dayjs(day).format("MMM DD, YYYY"));
    setTotal(rounded);
  }

  async function getLiquidity(current: string) {
    const summary = await getTokenTVL(current, "12M", duration);
    let tokens: any[] = [];
    let liquidity: number = 0;
    let day = "";

    for (const total in summary) {
      tokens.push({
        time: dayjs(summary[total].date).format("YYYY-MM-DD"),
        value: summary[total].liquidity,
      });

      day = summary[total].date;
      liquidity = summary[total].liquidity;
    }

    const rounded = numeral(liquidity).format("0.00a");

    const chart = createChart(`liquidity-${duration}`, {
      layout: {
        background: { color: "transparent" },
        textColor: "rgba(229,62,62,1)",
      },
      height: 300,
    });

    chart.timeScale().fitContent();

    const areaSeries = chart.addAreaSeries({
      lineColor: "rgba(229,62,62,1)",
      topColor: "rgba(229,62,62,0.8)",
      bottomColor: "rgba(229,62,62,0.5)",
    });

    areaSeries.setData(tokens);

    setDate(dayjs(day).format("MMM DD, YYYY"));
    setTotal(rounded);
  }

  async function getPrice(current: string) {
    const summary = await getHolcPrices(current, "12M", duration);
    let tokens: any[] = [];
    let day = "";

    for (const total in summary) {
      tokens.push({
        time: dayjs(summary[total].date).format("YYYY-MM-DD"),
        open: summary[total].open,
        high: summary[total].max,
        low: summary[total].min,
        close: summary[total].close,
      });

      day = summary[total].date;
    }

    const rounded =
      tokens[tokens.length - 1].close > 0.01
        ? numeral(tokens[tokens.length - 1].close).format("0.00a")
        : numeral(tokens[tokens.length - 1].close).format("0.00000a");

    const chart = createChart(`price-${duration}`, {
      layout: {
        background: { color: "transparent" },
        textColor: "rgba(56,161,105,1)",
      },
      height: 300,
    });

    chart.timeScale().fitContent();

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: "rgba(56,161,105,0.5)",
      downColor: "rgba(229,62,62,0.5)",
    });

    candlestickSeries.setData(tokens);

    setDate(dayjs(day).format("MMM DD, YYYY"));
    setTotal(rounded);
  }

  useEffect(() => {
    if (symbol) {
      setCurrent(symbol);
      setTotal(null);
    }
  }, [symbol]);

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
    <Box p={6} className="token-table">
      <Stack
        direction={{ base: "column", xl: "row" }}
        justifyContent={{ base: "center", xl: "space-between" }}
        alignItems="center"
      >
        <Box textAlign="left" display={{ base: "none", xl: "block" }}>
          <Heading as="h2" size="xl">
            ${total}
          </Heading>

          <Heading as="h5" size="sm" color="gray">
            {date}
          </Heading>
        </Box>

        <VStack textAlign="center" display={{ base: "block", xl: "none" }}>
          <Heading as="h2" size="xl" py={1}>
            ${total}
          </Heading>

          <Heading as="h5" size="sm" py={1} color="gray">
            {date}
          </Heading>
        </VStack>

        <VStack
          justifyContent={{ base: "center", xl: "right" }}
          py={{ base: 0, xl: 0 }}
        >
          <HStack
            sx={{ borderRadius: 15 }}
            justifyContent="space-between"
            bg={useColorModeValue("gray.300", "gray.700")}
            p={0}
            m={0}
          >
            <Button
              fontSize="xs"
              disabled={metric === "p"}
              onClick={() => handleMetric("p")}
              bg={useColorModeValue("gray.300", "gray.700")}
              color={useColorModeValue("black", "white")}
              _hover={{ bg: useColorModeValue("white", "black") }}
              _disabled={{ bg: useColorModeValue("white", "black") }}
              className="chart-button"
            >
              Price
            </Button>
            <Button
              fontSize="xs"
              disabled={metric === "l"}
              onClick={() => handleMetric("l")}
              bg={useColorModeValue("gray.300", "gray.700")}
              _hover={{ bg: useColorModeValue("white", "black") }}
              _disabled={{ bg: useColorModeValue("white", "black") }}
              className="chart-button"
            >
              TVL
            </Button>
            <Button
              fontSize="xs"
              disabled={metric === "v"}
              onClick={() => handleMetric("v")}
              sx={{ borderRadius: 15 }}
              bg={useColorModeValue("gray.300", "gray.700")}
              color={useColorModeValue("black", "white")}
              _hover={{ bg: useColorModeValue("white", "black") }}
              _disabled={{ bg: useColorModeValue("white", "black") }}
              className="chart-button"
            >
              Volume
            </Button>
          </HStack>

          <HStack
            sx={{ borderRadius: 15 }}
            justifyContent="space-between"
            bg={useColorModeValue("gray.300", "gray.700")}
            p={0}
            m={0}
          >
            <Button
              fontSize="xs"
              disabled={duration === "d"}
              onClick={() => handleDuration("d")}
              bg={useColorModeValue("gray.300", "gray.700")}
              _hover={{ bg: useColorModeValue("white", "black") }}
              _disabled={{ bg: useColorModeValue("white", "black") }}
              className="chart-button"
            >
              D
            </Button>
            <Button
              fontSize="xs"
              disabled={duration === "w"}
              onClick={() => handleDuration("w")}
              bg={useColorModeValue("gray.300", "gray.700")}
              color={useColorModeValue("black", "white")}
              _hover={{ bg: useColorModeValue("white", "black") }}
              _disabled={{ bg: useColorModeValue("white", "black") }}
              className="chart-button"
            >
              W
            </Button>
            <Button
              fontSize="xs"
              disabled={duration === "M"}
              onClick={() => handleDuration("M")}
              bg={useColorModeValue("gray.300", "gray.700")}
              _hover={{ bg: useColorModeValue("white", "black") }}
              _disabled={{ bg: useColorModeValue("white", "black") }}
              className="chart-button"
            >
              M
            </Button>
          </HStack>
        </VStack>
      </Stack>

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
