// Define la estructura de un error HTTP
export class HttpError extends Error {
    response: Response;

    constructor(message: string, response: Response) {
        super(message);
        this.name = 'HttpError';
        this.response = response;
    }
}

// Define un tipo genérico para la respuesta de la API
export interface ApiResponse<T> {
    data: T | null;
    error: HttpError | null;
    status: number;
}
