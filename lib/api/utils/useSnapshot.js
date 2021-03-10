import { useState } from 'react';
import useSWR from 'swr';
import { requestSnapshot, requestUpdateSnapshot, requestCreateSnapshot } from 'lib/api';

export default function useSnapshot(
  snapshotId=null,
  { initialSnapshot={}, token, ...options } = {}
) {
  const [error, setError] = useState(null);
  const { data, mutate } = useSWR(
    snapshotId,
    id => requestSnapshot(id, { token }),
    {
      initialData: initialSnapshot,
      ...options
    }
  );

  function withErrorHandling(fn) {
    return async (...args) => {
      try {
        await fn(...args);
      } catch (err) {
        setError(err);
      }
    };
  }

  return {
    snapshot: data,
    error,
    loading: data === null,
    updateSnapshot: withErrorHandling(async snapshot => {
      await requestUpdateSnapshot(snapshot, { token });
      mutate({ ...data, snapshot });
    }),
    createSnapshot: withErrorHandling(async snapshot => {
      console.log("useSnapshot")
      await requestCreateSnapshot(snapshot, { token });
    }),
  };
}
