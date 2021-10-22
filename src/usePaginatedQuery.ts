import { SetStateAction, useEffect, useState } from "react";
import { useQuery, UseQueryResult } from "react-query";

import {axiosInstance} from './fetcher';
import { QueryKey, Options, getQueryKey } from "./useQuery";

const paginatedFetch = async (
  queryKey: QueryKey,
  page: number,
  params?: object
) => {
  // return early if any of the keys are null so we don't do a useless fetch (in place of Apollo's `skip`)
  if (queryKey.some(key => key === null || key === undefined)) {
    return null;
  }

  const endpoint = queryKey.join("/");

  const { data } = await axiosInstance.get<{info: {count: number}, results: any}>(endpoint, {
    params: {
      // pass pagination params
      page,
      ...params
    }
  });
  const {info, results} = data;

  results.contentCount = info.count;

  return results;
};

interface UsePaginatedQuery<T> {
  queryResponse: UseQueryResult<T[]>;
  contentCount: number;
  page: number;
  setPage: React.Dispatch<SetStateAction<number>>;
}

/** https://github.com/axioscode/plus-web-client/wiki/React-Query#usepaginatedquery */
export const usePaginatedQuery = <T extends any>(
  /** Query key is joined to make endpoint */
  queryKey: QueryKey,
  /** Pass any query options or params */
  options: Options<T> = {}
): UsePaginatedQuery<T> => {
  const [page, setPage] = useState<number>(1);
  // persists content count across page changes
  const [contentCount, setContentCount] = useState(0);

  const { params, ...queryOptions } = options;

  const reactQueryResponse = useQuery<any & { contentCount: number }, string>(
    getQueryKey(queryKey, params, [page]),
    () => paginatedFetch(queryKey, page, params),
    {
      ...queryOptions
    }
  );
  const currContentCount = reactQueryResponse.data?.contentCount;

  useEffect(() => {
    if (
      currContentCount !== contentCount &&
      currContentCount &&
      currContentCount > 0
    ) {
      setContentCount(currContentCount);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currContentCount]);

  return {
    queryResponse: reactQueryResponse,
    contentCount,
    page,
    setPage
  };
};
