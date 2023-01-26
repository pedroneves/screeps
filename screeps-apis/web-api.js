// @ts-check
import { URL, URLSearchParams } from 'node:url';
import { ScreepAPIBaseIError, MissingTokenError } from './error.js';

class WebAPIError extends ScreepAPIBaseIError {
  constructor({ message, response }) {
    super({ message });
    this.response = response;
  }
}

const PROTO = 'https';
const HOST = 'screeps.com';

const getOrigin = () => `${PROTO}://${HOST}`;

export const fetchCode = async (token = '') => {
  if (!token) throw new MissingTokenError();

  const searchParams = new URLSearchParams({ _token: token });

  const url = new URL('/api/user/code', getOrigin());
  url.search = searchParams.toString();

  const response = await fetch(url, {
    method: 'GET',
  });

  if (response.ok) return response.json();

  throw new WebAPIError({
    message: 'Failed to fetch code',
    response,
  });
};

export const sendCode = async (token, data) => {
  if (!token) throw new MissingTokenError();
  if (!data) throw new Error('Missing data');
  if (typeof data !== 'string')
    throw new Error('Data must be a JSON stringified');

  try {
    JSON.parse(data);
  } catch (error) {
    throw new Error('Data is not JSON parseable');
  }

  const searchParams = new URLSearchParams({ _token: token });

  const url = new URL('/api/user/code', getOrigin());
  url.search = searchParams.toString();

  const headers = new Headers();
  headers.set('Content-Type', 'application/json; charset=utf-8');

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: data,
  });

  if (response.ok) return response.json();

  throw new WebAPIError({
    message: 'Failed to commit code',
    response,
  });
};
