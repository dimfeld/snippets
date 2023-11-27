export function returnJson(request: Request) : boolean {
  return request.headers.get('accept')?.includes('application/json') ?? false;
}

export function formDataToJson<T = unknown>(
  form: FormData | T
): T | Record<string, string> {
  if (typeof (form as FormData)?.entries == 'function') {
    let output: Record<string, string> = {};
    for (let [key, val] of (form as FormData).entries()) {
      output[key] = val;
    }

    return output;
  } else {
    return form as T;
  }
}
