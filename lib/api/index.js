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

export function requestSnapshot(snapshotId, options) {
  return request(`/snapshots/${snapshotId}`, options);
}

export function requestUpdateSnapshot(snapshot, options) {
  return request(`/snapshots/${snapshot.id}`, {
    method: 'PATCH',
    body: snapshot,
    ...options
  });
}

export function requestResources(options) {
  return request(`/resources`, { method: 'GET', ...options });
}
export function requestPrompts(options) {
  return request(`/prompts`, { method: 'GET', ...options });
}
