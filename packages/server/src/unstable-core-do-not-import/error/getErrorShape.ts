import { getHTTPStatusCodeFromError } from '../http/getHTTPStatusCode';
import type { ProcedureType } from '../procedure';
import type { AnyRootConfig } from '../rootConfig';
import { TRPC_ERROR_CODES_BY_KEY } from '../rpc';
import type { DefaultErrorShape } from './formatter';
import type { TRPCError } from './TRPCError';

/**
 * @internal
 */
export function getErrorShape<TConfig extends AnyRootConfig>(opts: {
  config: TConfig;
  error: TRPCError;
  type: ProcedureType | 'unknown';
  path: string | undefined;
  input: unknown;
  ctx: TConfig['$types']['ctx'] | undefined;
}): TConfig['$types']['errorShape'] {
  const { path, error, config } = opts;
  const { code } = opts.error;
  const shape: DefaultErrorShape = {
    message: error.message,
    code: TRPC_ERROR_CODES_BY_KEY[code],
    data: {
      code,
      httpStatus: getHTTPStatusCodeFromError(error),
    },
  };
  if (config.isDev && typeof opts.error.stack === 'string') {
    shape.data.stack = opts.error.stack;
  }
  if (typeof path === 'string') {
    shape.data.path = path;
  }
  return config.errorFormatter({ ...opts, shape });
}
