/**
 * If you're making an adapter for tRPC and looking at this file for reference, you should import types and functions from `@trpc/server` and `@trpc/server/http`
 *
 * @example
 * ```ts
 * import type { AnyTRPCRouter } from '@trpc/server'
 * import type { HTTPBaseHandlerOptions } from '@trpc/server/http'
 * ```
 */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import http from 'http';
// @trpc/server
import type { AnyRouter } from '../@trpc/server';
import type {
  NodeHTTPCreateContextFnOptions,
  NodeHTTPHandlerOptions,
} from './node-http';
import { nodeHTTPRequestHandler } from './node-http';

export type CreateHTTPHandlerOptions<TRouter extends AnyRouter> =
  NodeHTTPHandlerOptions<TRouter, http.IncomingMessage, http.ServerResponse>;

export type CreateHTTPContextOptions = NodeHTTPCreateContextFnOptions<
  http.IncomingMessage,
  http.ServerResponse
>;

export function createHTTPHandler<TRouter extends AnyRouter>(
  opts: CreateHTTPHandlerOptions<TRouter>,
) {
  return async (req: http.IncomingMessage, res: http.ServerResponse) => {
    // Get procedure path and remove the leading slash, `/procedure -> procedure`
    // Use dummy hostname if one is not provided.
    const path = new URL(req.url!, 'http://127.0.0.1').pathname.slice(1);

    await nodeHTTPRequestHandler({
      // FIXME: no typecasting should be needed here
      ...(opts as CreateHTTPHandlerOptions<AnyRouter>),
      ...(opts as any),
      req,
      res,
      path,
    });
  };
}

export function createHTTPServer<TRouter extends AnyRouter>(
  opts: CreateHTTPHandlerOptions<TRouter>,
) {
  const handler = createHTTPHandler(opts);
  return http.createServer(handler);
}
