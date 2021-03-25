import { useState } from 'react';
import { requestCreateConversation } from 'lib/api';

export default function useConversation({ token, ...options } = {}) {
  const [error, setError] = useState(null);
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
    error,
    createConversation: withErrorHandling(async conversation => {
      return await requestCreateConversation(conversation, { token });
    })
  };
}
