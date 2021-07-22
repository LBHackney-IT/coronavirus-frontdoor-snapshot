import { useState } from 'react';
import useSWR from 'swr';
import {
  requestReferral,
  requestUpdateReferral,
  requestCreateReferral,
  requestUpdateReferralStatus
} from 'lib/api';

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
        return await fn(...args);
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
      return await requestCreateReferral(referral, { token });
    }),
    updateReferralStatus: withErrorHandling(async referral => {
      return await requestUpdateReferralStatus(referral, { token });
    })
  };
}
