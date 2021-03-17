import { useState } from 'react';
import useSWR from 'swr';
import { requestReferral, requestUpdateReferral, requestCreateReferral } from 'lib/api';

export default function useReferral(
  referralId = null,
  { initialReferral = {}, token, ...options } = {}
) {
  const [error, setError] = useState(null);
  const { data, mutate } = useSWR(referralId, id => requestReferral(id, { token }), {
    initialData: initialReferral,
    ...options
  });

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
    referral: data,
    error,
    loading: data === null,
    updateReferral: withErrorHandling(async referral => {
      await requestUpdateReferral(referral, { token });
      mutate({ ...data, referral });
    }),
    createReferral: withErrorHandling(async referral => {
      await requestCreateReferral(referral, { token });
    })
  };
}
