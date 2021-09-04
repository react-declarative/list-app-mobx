import { makeObservable } from "mobx";
import { action } from "mobx";

import errorData from "../../utils/errorData";

import SessionService from "./SessionService";
import RouterService from "./RouterService";

import { CC_DENIED, CC_ERROR, CC_ORIGIN } from "../../config";

type JSON = Record<string, unknown>;

const CC_TOKEN = 'CC-Token';

const UNAUTHORIZED = 401;
const FORBIDDEN = 403;
const INTERNAL = 500;

class BaseError { }

const createError = (type: string): typeof BaseError =>
  class extends BaseError {
    type = ''
    constructor() {
      super();
      this.type = type;
    }
  };

const UnauthorizedError = createError('unauthorized-error');
const ForbiddenError = createError('forbidden-error');
const InternalError = createError('internal-error');

const processStatus = (code: number) => {
  if (code === UNAUTHORIZED) {
    throw new UnauthorizedError();
  } else if (code === FORBIDDEN) {
    throw new ForbiddenError();
  } else if (code === INTERNAL) {
    throw new InternalError();
  }
};

export class ApiService {

  constructor(
    private sessionService: SessionService,
    private routerService: RouterService,
  ) {
    makeObservable(this, {
      delete: action.bound,
      get: action.bound,
      post: action.bound,
      put: action.bound,
      patch: action.bound,
      uploadFile: action.bound,
    });
  }

  handleError(e: Error): void {
    if (e instanceof ForbiddenError) {
      this.routerService.push(CC_DENIED);
    } else if (e instanceof InternalError) {
      this.routerService.push(CC_ERROR);
    } else if (e instanceof UnauthorizedError) {
      this.sessionService.dispose();
      this.routerService.push(CC_DENIED);
    } else {
      this.routerService.push(CC_ERROR);
    }
    // eslint-disable-next-line no-console
    console.log(errorData(e));
  }

  handleSearchParams<D = Record<string, unknown>>(url: URL, params?: D) {
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (typeof value === 'object') {
          url.searchParams.set(key, JSON.stringify(value));
        } else if (typeof value === 'number') {
          url.searchParams.set(key, value.toString());
        } else if (typeof value === 'string') {
          url.searchParams.set(key, value.toString());
        } else {
          throw new Error(`Unknown param type ${key}`);
        }
      }
    }
  }

  async request<T = JSON, D = Record<string, unknown>>(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    url: URL,
    data?: D
  ): Promise<T> {
    return new Promise(async (res, rej) => {
      try {
        const request = await fetch(url.toString(), {
          method,
          headers: {
            ...(this.sessionService.sessionId && ({
              [CC_TOKEN]: this.sessionService.sessionId,
            })),
            'Content-type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        const json = await request.json() as T;
        processStatus(request.status);
        if ('error' in json) {
          rej(json);
        } else {
          res(json);
        }
      } catch (e) {
        this.handleError(e as Error);
      }
    });
  }

  public async get<T = JSON, D = Record<string, unknown>>(url: URL | string, data?: D): Promise<T> {
    const targetUrl = typeof url === 'string' ? new URL(`${CC_ORIGIN}/${url}`) : url;
    this.handleSearchParams<D>(targetUrl, data);
    return this.request<T>('GET', targetUrl);
  }

  public async delete<T = JSON, D = Record<string, unknown>>(url: URL | string, data?: D): Promise<T> {
    const targetUrl = typeof url === 'string' ? new URL(`${CC_ORIGIN}/${url}`) : url;
    this.handleSearchParams<D>(targetUrl, data);
    return this.request<T, D>('DELETE', targetUrl);
  }

  public async post<T = JSON, D = Record<string, unknown>>(url: URL | string, data?: D): Promise<T> {
    if (typeof url === 'string') {
      return this.request<T, D>('POST', new URL(`${CC_ORIGIN}/${url}`), data);
    }
    return this.request<T, D>('POST', url, data);
  }

  public async put<T = JSON, D = Record<string, unknown>>(url: URL | string, data?: D): Promise<T> {
    if (typeof url === 'string') {
      return this.request<T, D>('PUT', new URL(`${CC_ORIGIN}/${url}`), data);
    }
    return this.request<T, D>('PUT', url, data);
  }

  public async patch<T = JSON, D = Record<string, unknown>>(url: URL | string, data?: D): Promise<T> {
    if (typeof url === 'string') {
      return this.request<T, D>('PATCH', new URL(`${CC_ORIGIN}/${url}`), data);
    }
    return this.request<T, D>('PATCH', url, data);
  }

  public uploadFile<T = JSON>(url: URL | string, file: File): Promise<T> {
    return new Promise<T>((res) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', file.name);
      const xhr = new XMLHttpRequest();
      if (typeof url === 'string') {
        xhr.open('POST', `${CC_ORIGIN}/${url}`, true);
      } else {
        xhr.open('POST', url.toString(), true);
      }
      this.sessionService.sessionId && xhr.setRequestHeader(CC_TOKEN, this.sessionService.sessionId);
      xhr.onload = () => {
        try {
          const json = JSON.parse(xhr.responseText) as T;
          processStatus(xhr.status);
          if ('error' in json) {
            throw new Error(JSON.stringify(json));
          }
          res(json);
        } catch (e) {
          this.handleError(e as Error);
        }
      };
      xhr.send(formData);
    });
  }

};

export default ApiService;
