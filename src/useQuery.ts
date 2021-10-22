import { useQuery as useReactQuery, UseQueryOptions } from "react-query";

// whatever you use for http requests
import axiosFetch from './fetcher';

export type QueryKey = (string | null)[];
export type Options<T> = Omit<UseQueryOptions<T, any, any, any>, "queryKey"> & {
  params?: object;
};

/** Create the query key using the endpoint and params and any additional values */
export const getQueryKey = (
  queryKey: QueryKey,
  params: object = {},
  additionalKeys: (string | number)[] = []
) => {
  const paramKeys = Object.entries(params).map(
    ([key, value]) => `${key}-${value}`
  );

  return [...queryKey, ...paramKeys, ...additionalKeys];
};

const fetcher = async (queryKey: QueryKey, params?: object) => {
  // return early if any of the keys are null so we don't do a useless fetch (in place of Apollo's `skip`)
  if (queryKey.some(key => key === null || key === undefined)) {
    return null;
  }

  const endpoint = queryKey.join("/");
  const { data } = await axiosFetch.get(endpoint, { params });

  return data;
};

/** 
 * A wrapper around React Query's useQuery to provide autogeneration of query keys and defaults
 */
export const useQuery = <T extends any>(
  /** Query key is joined to make endpoint */
  queryKey: QueryKey,
  /** Pass any query options or params */
  options: Options<T> = {}
) => {
  const { params, ...queryOptions } = options;

  return useReactQuery<T, string>(
    getQueryKey(queryKey, params),
    () => fetcher(queryKey, params),
    {
      onError: (...props) => {
        // automatically log errors here

        queryOptions.onError(...props);
      },
      ...queryOptions
    }
  );
};
