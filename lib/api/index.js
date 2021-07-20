import logger from 'lib/infrastructure/logging/logger';
import HttpStatusError from './domain/HttpStatusError';

async function request(path, { token, ...options }) {
  const url = `${process.env.NEXT_PUBLIC_API_URL}${path}`;
  logger.info(`Fetching ${url}`, options?.body);
  const response = await fetch(url, {
    ...options,
    credentials: 'same-origin',
    headers: {
      accept: 'application/json',
      authorization: token ? `Bearer ${token}` : undefined,
      'content-type': 'application/json',
      cookie: `hackneyToken=${token}`
    },
    body: options?.body ? JSON.stringify(options.body) : null
  });

  if (response.ok) {
    return response.json();
  } else {
    logger.error(`Fetching ${url} failed`, response.status);
    throw new HttpStatusError(response.status);
  }
}

export function requestByLinkId(linkId, options) {
  return request(`/referrals/status/${linkId}`, options);
}

export function requestReferral(referralId, options) {
  return request(`/referrals/${referralId}`, options);
}

export function requestUpdateReferral(referral, options) {
  return request(`/referrals/${referral.id}`, {
    method: 'PATCH',
    body: referral,
    ...options
  });
}

export function requestCreateReferral(referral, options) {
  return request(`/referrals`, {
    method: 'POST',
    body: referral,
    ...options
  });
}

export function requestCreateConversation(conversation, options) {
  return request(`/conversations`, {
    method: 'POST',
    body: conversation,
    ...options
  });
}

export function requestResources(options) {
  return request(`/resources`, { method: 'GET', ...options });
}

export function requestFssResources(options) {
  return request(`/resources/fss`, { method: 'GET', ...options });
}
