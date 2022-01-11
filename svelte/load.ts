export class ResponseError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }

  toResponse() {
    return {
      status: this.status,
      error: this,
    };
  }
}

export async function handleResponse(responsePromise: Promise<Response>): Promise<Response> {
  let response = await responsePromise;
  if (response.ok) {
    return response;
  } else {
    throw new ResponseError(response.status, await response.text());
  }
}

export async function handleJsonResponse<T>(responsePromise: Promise<Response>): Promise<T> {
  let response = await handleResponse(responsePromise);
  return response.json();
}
