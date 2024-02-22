/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";

export interface FilteredToken {
  address: string;
  name: string;
  symbol: string;
  logoURI: string;
}

interface UseFetchTokenResult {
  loading: boolean;
  error: string | null;
  tokens: FilteredToken[] | null;
  fetchTokenListPerPage: () => Promise<void>;
  totalLength: number;
  hasMore: boolean;
}

const TOKEN_LIST_API_URL = "/api/token/token";
const pageSize = 20;

const useTokenList = (chainId: number, tokenIdentifier: string): UseFetchTokenResult => {
  const [tokens, setTokens] = useState<FilteredToken[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(0);
  const [totalLength, setTotalLength] = useState<number>(0);

  const fetchTokenList = async () => {
    setLoading(true);
    setError(null);
    const apiUrl = `${TOKEN_LIST_API_URL}?chainId=${chainId}&tokenIdentifier=${encodeURIComponent(
      tokenIdentifier,
    )}&page=0&limit=${pageSize}`;

    try {
      const response = await fetch(apiUrl);

      if (!response.ok) throw new Error("Failed to fetch token data");

      const data = await response.json();
      setTokens(data.tokens || []);
      setTotalLength(data.totalLength || 0);
      setPage(1);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  const fetchTokenListPerPage = async () => {
    if (loading || (tokens && totalLength <= tokens.length)) return; // check if all tokens are already fetched
    setLoading(true);

    const apiUrl = `${TOKEN_LIST_API_URL}?chainId=${chainId}&tokenIdentifier=${encodeURIComponent(
      tokenIdentifier,
    )}&page=${page}&limit=${pageSize}`;

    try {
      const response = await fetch(apiUrl);

      if (!response.ok) throw new Error("Failed to fetch more token data");

      const data = await response.json();
      if (data.tokens && data.tokens.length > 0) {
        setTokens(prevTokens => [...prevTokens, ...data.tokens]);
        setPage(prevPage => prevPage + 1);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  const hasMore = tokens ? totalLength > tokens.length : false;

  useEffect(() => {
    fetchTokenList();
  }, [chainId, tokenIdentifier]);

  return { loading, error, tokens, fetchTokenListPerPage, totalLength, hasMore };
};

export default useTokenList;
