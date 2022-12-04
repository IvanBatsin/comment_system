import React from 'react';

interface IUseAsyncInternal<T, U = any> {
  loading: boolean,
  error: any,
  value: T | undefined,
  execute: (params?: U) => Promise<T>
}

type IUseAsync<T> = Pick<IUseAsyncInternal<T>, 'error' | 'loading' | 'value'>

const useAsyncInternal = <T, U = any>(func: (params?: any) => Promise<T>, dependencies: any[] = [], initialLoadidng: boolean = false): IUseAsyncInternal<T, U> => {
  const [loading, setLoading] = React.useState<boolean>(initialLoadidng);
  const [error, setError] = React.useState<string>();
  const [value, setValue] = React.useState<T>();

  const execute = React.useCallback((...params: any) => {
    setLoading(true);
    return func(...params)
      .then(data => {
        setError(undefined);
        setValue(data);
        return data;
      })
      .catch(error => {
        setError(JSON.stringify(error));
        setValue(undefined);
        return Promise.reject(error);
      })
      .finally(() => setLoading(false));
  }, dependencies);

  return { loading, value, error, execute };
}

export const useAsync = <T>(func: () => Promise<T>, dependencies: any[] = []): IUseAsync<T> => {
  const { execute, ...state } = useAsyncInternal(func, dependencies, true);

  React.useEffect(() => {
    execute();
  }, [execute]);

  return state;
}

export const useAsyncFn = <T, U>(func: (params: U) => Promise<T>, dependencies: any[] = []): IUseAsyncInternal<T, U> => {
  return useAsyncInternal<T, U>(func, dependencies, false);
}