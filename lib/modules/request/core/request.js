"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createRequest = void 0;

const pluckResponseFields = (response, body) => ({
  headers: response.headers,
  redirected: response.redirected,
  status: response.status,
  statusText: response.statusText,
  type: response.type,
  ok: response.ok,
  url: response.url,
  body
});

const createRequest = fetchFn => async config => {
  const {
    url,
    ...requestConfig
  } = config;
  const result = await fetchFn(url, requestConfig);

  try {
    return pluckResponseFields(result, await result.json());
  } catch {
    return pluckResponseFields(result, undefined);
  }
};

exports.createRequest = createRequest;