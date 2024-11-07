import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GOLDRUSH_API_KEY } from "@/utils/constants/helpers";
import {
  calculatePercentageChange,
  getAddressType,
} from "@/utils/functions/helper";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { SortAscIcon, SortDescIcon, ArrowUpDownIcon } from "lucide-react";
import { TableSkeleton } from "@/components/shared/table-skeleton";

export function TransactionsHistoryList({ address }: { address: string }) {
  const [tokenData, setTokenData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [sortField, setSortField] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    const fetchWalletBalance = async () => {
      if (!address || !GOLDRUSH_API_KEY) return;
      setLoading(true);

      const endpoint =
        getAddressType(address) === "HD"
          ? `https://api.covalenthq.com/v1/btc-mainnet/address/${address}/hd_wallets/?key=${GOLDRUSH_API_KEY}`
          : `https://api.covalenthq.com/v1/btc-mainnet/address/${address}/balances_v2/?key=${GOLDRUSH_API_KEY}`;

      const response = await fetch(endpoint);
      const data = await response.json();
      setTokenData(data.data.items);
      setLoading(false);
    };

    fetchWalletBalance();
  }, [address]);

  const handleSort = (field: string) => {
    const isAsc = sortField === field && sortOrder === "asc";
    setSortField(field);
    setSortOrder(isAsc ? "desc" : "asc");
  };

  const sortedData = useMemo(() => {
    if (!sortField) return tokenData;
    return [...tokenData].sort((a, b) => {
      const fieldA = a[sortField];
      const fieldB = b[sortField];

      if (typeof fieldA === "number" && typeof fieldB === "number") {
        return sortOrder === "asc" ? fieldA - fieldB : fieldB - fieldA;
      } else if (typeof fieldA === "string" && typeof fieldB === "string") {
        return sortOrder === "asc"
          ? fieldA.localeCompare(fieldB)
          : fieldB.localeCompare(fieldA);
      }
      return 0;
    });
  }, [tokenData, sortField, sortOrder]);

  const TableHeadRender = (field: string, label: string) => (
    <TableHead onClick={() => handleSort(field)}>
      <div className="flex items-center gap-2">
        {label}
        {sortField === field ? (
          sortOrder === "asc" ? (
            <SortAscIcon className="h-4 w-4" />
          ) : (
            <SortDescIcon className="h-4 w-4" />
          )
        ) : (
          <ArrowUpDownIcon className="h-4 w-4" />
        )}
      </div>
    </TableHead>
  );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {TableHeadRender("contract_display_name", "Token")}
          {TableHeadRender("quote_rate", "Price")}
          {TableHeadRender("balance", "Balance")}
          {TableHeadRender("quote", "Value")}
          {TableHeadRender("quote_24h", "24H Change")}
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          <TableSkeleton length={5} />
        ) : (
          sortedData.map((tokenDetails) => (
            <TableRow key={tokenDetails.child_address}>
              <TableCell className="flex items-center gap-2">
                <Image
                  src={tokenDetails.logo_url}
                  alt={tokenDetails.contract_name}
                  width={24}
                  height={24}
                />
                <div className="flex flex-col">
                  <p className="text-foreground-light dark:text-foreground-dark">
                    {tokenDetails.contract_display_name}
                  </p>
                  <p className="text-secondary-light dark:text-secondary-dark text-xs">
                    {tokenDetails.contract_ticker_symbol}
                  </p>
                </div>
              </TableCell>
              <TableCell>${tokenDetails.quote_rate.toLocaleString()}</TableCell>
              <TableCell>
                {(
                  tokenDetails.balance /
                  Math.pow(10, tokenDetails.contract_decimals)
                ).toFixed(4)}
              </TableCell>
              <TableCell>{tokenDetails.pretty_quote}</TableCell>
              <TableCell
                className={
                  tokenDetails.quote - tokenDetails.quote_24h > 0
                    ? "text-success"
                    : tokenDetails.quote - tokenDetails.quote_24h < 0
                    ? "text-danger"
                    : ""
                }
              >
                {calculatePercentageChange(
                  tokenDetails.quote,
                  tokenDetails.quote_24h
                )}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
