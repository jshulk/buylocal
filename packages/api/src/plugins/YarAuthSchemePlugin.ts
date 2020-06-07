import { Request, ResponseToolkit, Server } from "@hapi/hapi";
import {
  YarRequest,
  DynamicObject,
  AuthSchemeOptions,
} from "../shared/CustomTypes";
import { unauthorized, isBoom } from "@hapi/boom";
import Hoek from "@hapi/hoek";
import {
  YAR_AUTH_SCHEME,
  YAR_AUTH_KEY,
} from "../shared/constants/AuthConstants";

export const YarAuthSchemePlugin = {
  version: "1.0.0",
  name: "YarAuthSchemePlugin",
  register: (server: Server, options: any) => {
    server.auth.scheme(YAR_AUTH_SCHEME, internals.implementation);
  },
};
const internals: DynamicObject = {};
internals.implementation = (server: Server, options: AuthSchemeOptions) => {
  const scheme = {
    authenticate: async (request: YarRequest, h: ResponseToolkit) => {
      const validate = async () => {
        const { cookie, validateFunc } = options;
        const { name } = cookie;
        const session = request.state[name];
        if (!session) {
          return h.unauthenticated(unauthorized(null, YAR_AUTH_SCHEME));
        }
        if (!validateFunc) {
          const user = request.yar.get(YAR_AUTH_KEY);
          if (user) {
            return h.authenticated({ credentials: user, artifacts: user });
          } else {
            return h.unauthenticated(unauthorized(null, YAR_AUTH_SCHEME));
          }
        }
        try {
          const result = await validateFunc(request, session);
          Hoek.assert(
            typeof result === "object",
            "Invalid return from validateFunc"
          );
          Hoek.assert(
            Object.prototype.hasOwnProperty.call(result, "valid"),
            "validateFunc must have valid property in return"
          );
          if (!result.valid) throw unauthorized(null, YAR_AUTH_SCHEME);
          let credentials = request.yar.get(YAR_AUTH_KEY);
          credentials = result.credentials || credentials;
          return h.authenticated({ credentials, artifacts: credentials });
        } catch (error) {
          let authError =
            isBoom(error) && error.typeof === unauthorized ? error : null;
          if (!authError) {
            authError = unauthorized("Invalid Cookie");
            authError.data = error;
          }
          return h.unauthenticated(authError);
        }
      };
      return await validate();
    },
  };
  return scheme;
};

export default YarAuthSchemePlugin;
