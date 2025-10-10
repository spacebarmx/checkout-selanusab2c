import { HttpError } from './errorHandler';

interface FetchConfig extends RequestInit {
    baseURL?: string;
    headers?: Record<string, string>;
}

const createFetchInstance = (config: FetchConfig) => {
    const baseURL = config.baseURL || '';
    const defaultHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        ...config.headers,
    };
    const defaultOptions = config;

    const mergeHeaders = (requestHeaders?: Record<string, string>): Headers => {
        const headers = new Headers(defaultHeaders);

        if (requestHeaders) {
            Object.entries(requestHeaders).forEach(([key, value]) => {
                headers.set(key, value);
            });
        }

        return headers;
    };

    const request = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
        const url = `${baseURL}${endpoint}`;
        const mergedOptions: RequestInit = {
            ...defaultOptions,
            ...options,
            headers: mergeHeaders(options.headers as Record<string, string>),
        };

        const response = await fetch(url, mergedOptions);

        if (!response.ok) {
            throw new HttpError(response.statusText, response);
        }

        if (response.status === 204) {
            return null as T;
        }

        return response.json() as Promise<T>;
    };

    return {
        get: <T>(endpoint: string, options?: RequestInit) =>
            request<T>(endpoint, { ...options, method: 'GET' }),

        post: <T>(endpoint: string, body: any, options?: RequestInit) =>
            request<T>(endpoint, {
                ...options,
                method: 'POST',
                body: JSON.stringify(body),
            }),

        put: <T>(endpoint: string, body: any, options?: RequestInit) =>
            request<T>(endpoint, {
                ...options,
                method: 'PUT',
                body: JSON.stringify(body),
            }),

        delete: <T>(endpoint: string, options?: RequestInit) =>
            request<T>(endpoint, { ...options, method: 'DELETE' }),
    };
};

export default createFetchInstance;
