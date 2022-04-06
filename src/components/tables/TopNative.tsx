import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  chakra,
  Button,
  Text,
  TableContainer,
  Heading,
  HStack,
} from "@chakra-ui/react";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import { useTable, useSortBy, usePagination } from "react-table";
import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";

export default function TopNative({ data }) {
  const location = useLocation();
  const path = location.pathname;

  const columns = useMemo(
    () => [
      {
        Header: "#",
        accessor: "number",
      },
      {
        Header: "Token",
        accessor: "image",
      },
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Price",
        accessor: "price",
      },
      {
        Header: "Volume 24H",
        accessor: "volume24",
      },
      {
        Header: "TVL",
        accessor: "tvl",
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    pageOptions,
    page,
    state: { pageIndex },
    previousPage,
    nextPage,
    canPreviousPage,
    canNextPage,
  } = useTable(
    { columns, data, initialState: { pageIndex: 0, pageSize: 10 } },
    useSortBy,
    usePagination
  );

  return (
    <Box className="token-table">
      <HStack pb={3} justifyContent="space-between">
        <Heading as="h3" size="lg" className="token-header">
          Top Native Tokens
        </Heading>
        {path === "/" && (
          <Link to="/native-tokens">
            <Button float="right">Explore</Button>
          </Link>
        )}
      </HStack>

      <TableContainer m={5}>
        <Table
          {...getTableProps()}
          colorScheme="purple"
          size="sm"
          variant="simple"
        >
          <Thead>
            {headerGroups.map((headerGroup, index) => (
              <Tr {...headerGroup.getHeaderGroupProps()} key={index}>
                {headerGroup.headers.map((column) => (
                  <Th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    isNumeric={column.isNumeric}
                  >
                    {column.render("Header")}
                    <chakra.span>
                      {column.isSorted ? (
                        column.isSortedDesc ? (
                          <TriangleDownIcon
                            aria-label="sorted descending"
                            ml={3}
                          />
                        ) : (
                          <TriangleUpIcon
                            aria-label="sorted ascending"
                            ml={3}
                          />
                        )
                      ) : null}
                    </chakra.span>
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>

          <Tbody {...getTableBodyProps()}>
            {page.map((row, _) => {
              prepareRow(row);
              return (
                <Tr key={_} {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <Td
                        sx={{ overflowX: "hidden", fontWeight: "bold" }}
                        {...cell.getCellProps()}
                      >
                        {cell.render("Cell")}
                      </Td>
                    );
                  })}
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>

      <Box className="button-group" alignItems="center">
        <Button
          float="left"
          leftIcon={<i arai-label="previous" className="fa fa-chevron-left" />}
          colorScheme="purple"
          variant="ghost"
          onClick={() => {
            previousPage();
          }}
          disabled={!canPreviousPage}
          mr={3}
        ></Button>

        <Text fontSize="md" display={{ base: "none", xl: "block" }}>
          Page: {pageIndex + 1} of {pageOptions.length}
        </Text>

        <Button
          float="right"
          rightIcon={<i arai-label="next" className="fa fa-chevron-right" />}
          colorScheme="purple"
          variant="ghost"
          onClick={() => {
            nextPage();
          }}
          disabled={!canNextPage}
          ml={3}
        ></Button>
      </Box>
    </Box>
  );
}
