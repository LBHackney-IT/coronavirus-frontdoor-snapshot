import useReferral from './useReferral';
import { enableFetchMocks } from 'jest-fetch-mock';
import { renderHook } from '@testing-library/react-hooks';

describe('useReferral', () => {
  beforeAll(() => {
    enableFetchMocks();
  });

  const expectedReferral = {
    id: 'IRFaVaY2b',
    firstName: 'My',
    lastName: 'Referral'
  };

  beforeEach(() => {
    fetch.mockReset();
    fetch.mockResponse(JSON.stringify(expectedReferral));
  });

  xit('fetches a referral', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useReferral(expectedReferral.id));

    await waitForNextUpdate();
    expect(result.current.referral).toStrictEqual(expectedReferral);
  });
});
