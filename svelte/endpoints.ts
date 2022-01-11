import type { RequestHandler } from '@sveltejs/kit';
import { DefaultBody } from '@sveltejs/kit/types/endpoint';
import { ReadOnlyFormData } from '@sveltejs/kit/types/helper';
import { ServerRequest, ServerResponse } from '@sveltejs/kit/types/hooks';
import { Theme } from './styles';
import Accepts from 'accepts';

export type TracksomeLocals<Authed extends boolean = true> = {
  userId: Authed extends true ? number : number | null;
  theme: Theme;
  defaultDarkMode: boolean;
  timezone: string;
};

type Typify<T> = { [K in keyof T]: Typify<T[K]> };

type TracksomeRequestHandler<Input = unknown, Output = DefaultBody> = RequestHandler<
  TracksomeLocals,
  Input | ReadOnlyFormData,
  Typify<Output>
>;
export type { TracksomeRequestHandler as RequestHandler };

export function parseNumber(value: string | null): number | undefined {
  let v = parseInt(value, 10);
  if (Number.isNaN(v)) {
    return undefined;
  }
  return v;
}

export function responseAccepts(
  request: ServerRequest,
  responses: Record<string, () => ServerResponse | Promise<ServerResponse>>
): ServerResponse | Promise<ServerResponse> {
  // @ts-ignore Different types but they overlap in the proper places.
  let accepts = new Accepts(request);

  let acceptedTypes = Object.keys(responses).filter((t) => t !== 'default');

  let contentType = accepts(acceptedTypes) || 'default';

  return responses[contentType]();
}
