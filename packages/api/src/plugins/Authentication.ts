const { COOKIE_KEY } = process.env;
import container from "../inversify.config";
import AuthUtils from "../auth/AuthUtils";
import { DEP_TYPES } from "../shared/CustomTypes";
const authUtils: AuthUtils = container.get<AuthUtils>(DEP_TYPES.AuthUtils);
const Authentication = {
  name: "authentication",
  version: "1.0",
  once: true,
  register: async (server: any) => {
    await server.register(require("@hapi/cookie"));
    server.auth.strategy("session", "cookie", {
      cookie: {
        name: "twitter-cookie",
        password: COOKIE_KEY,
        isSecure: false,
        isHttpOnly: false,
        path: "/api",
      },
      validateFunc: authUtils.validateSession,
    });

    server.auth.default("session");
  },
};
export default Authentication;
