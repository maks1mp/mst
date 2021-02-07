import qs from 'query-string';

export const ENDPOINT = '//localhost:3001/';

class ApiCall {
  constructor(domain) {
    this.domain = domain;
  }

  async perform(url, data, config) {
    const request = await fetch(`${this.domain}${url}`, {
      ...config,
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      }
    });

    return await request.json();
  }

  async get(path, searchParams) {
    return await this.perform(`${path}?${qs.stringify(searchParams)}`);
  }

  async post(path, payload) {
    return await this.perform(path, payload, {
      method: 'POST'
    });
  }

  async put(path, payload) {
    return await this.perform(path, payload, {
      method: 'PUT'
    });
  }

  async delete(path) {
    return await this.perform(path, null, {
      method: 'DELETE'
    });
  }
}

export default new ApiCall(ENDPOINT);