import container from "../inversify.config";
import AuthUtils from "../auth/AuthUtils";
import { DEP_TYPES } from "../shared/CustomTypes";
import {
  YAR_AUTH_SCHEME,
  YAR_SESSION_COOKIE_NAME,
} from "../shared/constants/AuthConstants";
const { COOKIE_KEY } = process.env;
const authUtils: AuthUtils = container.get<AuthUtils>(DEP_TYPES.AuthUtils);
const yarOptions = {
  name: "twitter-cookie",
  maxCookieSize: 0,
  storeBlank: false,
  cookieOptions: {
    password: COOKIE_KEY,
    isSecure: false,
    path: "/",
    ignoreErrors: false,
  },
  cache: {
    cache: "session_cache",
  },
};
const Authentication = {
  name: "authentication",
  version: "1.0",
  once: true,
  register: async (server: any, options: any) => {
    //await server.register(require("@hapi/cookie"));
    await server.register({
      plugin: require("@hapi/yar"),
      options: yarOptions,
    });
    server.auth.strategy("session", YAR_AUTH_SCHEME, {
      cookie: {
        name: YAR_SESSION_COOKIE_NAME,
      },
      validateFunc: authUtils.validateSession,
    });

    server.auth.default("session");
  },
};
export default Authentication;
