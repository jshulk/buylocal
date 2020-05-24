import "reflect-metadata";
const httpMethods = {
  Get: "GET",
  Post: "POST",
  Put: "PUT",
  Patch: "PATCH",
  Delete: "DELETE",
  "*": "ALL",
};
interface Route {
  id: string;
  method: string;
  path: string;
  handler: Function;
  options: any;
}

export function RestController(baseUrl: string) {
  return (target: any) => {
    target.prototype.baseUrl = baseUrl;
    target.prototype.routes = () => {
      const rawRoutes = target.prototype.rawRoutes || [];
      return rawRoutes.map((route: any) => {
        return {
          ...route,
          path: baseUrl,
        };
      });
    };

    return target;
  };
}

export function Controller(baseUrl: string) {
  return (target: any) => {
    target.prototype.baseUrl = baseUrl;
    target.prototype.routes = function routes() {
      let self = this;
      const rawRoutes = target.prototype.rawRoutes || [];

      return rawRoutes.map((route: any) => {
        return {
          ...route,
          path: `${baseUrl}${route.path}`,
          handler: route.handler.bind(self),
        };
      });
    };
    return target;
  };
}

export function RouteConfig(config: object) {
  return (target: any, key: string, descriptor: any) => {
    setRoute({
      target,
      key,
      options: {
        config,
      },
    });
  };
}

export const Route = (method: string, path: string, routeOptions: any) => {
  return (target: any, key: string, descriptor: any) => {
    setRoute({
      target,
      key,
      options: {
        method,
        path,
        options: routeOptions,
        handler: descriptor.value,
      },
    });
  };
};

export const Get = (path?: string | object, options?: object) => {
  return Route(
    httpMethods.Get,
    typeof path === "string" ? path : "",
    typeof path === "object" ? path : options
  );
};

export const Post = (path?: string | object, options?: object) => {
  return Route(
    httpMethods.Post,
    typeof path === "string" ? path : "",
    typeof path === "object" ? path : options
  );
};

export const Put = (path?: string | object, options?: object) => {
  return Route(
    httpMethods.Put,
    typeof path === "string" ? path : "",
    typeof path === "object" ? path : options
  );
};

export const Patch = (path?: string | object, options?: object) => {
  return Route(
    httpMethods.Patch,
    typeof path === "string" ? path : "",
    typeof path === "object" ? path : options
  );
};

export const Delete = (path?: string | object, options?: object) => {
  return Route(
    httpMethods.Delete,
    typeof path === "string" ? path : "",
    typeof path === "object" ? path : options
  );
};

export const All = (path?: string | object, options?: object) => {
  return Route(
    httpMethods["*"],
    typeof path === "string" ? path : "",
    typeof path === "object" ? path : options
  );
};

const setRoute = ({
  target,
  key,
  options,
}: {
  target: any;
  key: string;
  options: any;
}) => {
  target.rawRoutes = target.rawRoutes || [];
  const routes = target.rawRoutes;
  const routeId = `${target.constructor.name}.${key}`;
  const found = routes.find((el: any) => el.id === routeId);
  const defaultRoute = { options: { id: routeId } };

  if (!found) {
    target.rawRoutes.push(extend(defaultRoute, options));
  } else {
    // extend the route
    extend(found, options);
  }

  return target;
};

const extend = (target: any, source: any) => {
  if (source) {
    for (let key in source) {
      if (source.hasOwnProperty(key)) {
        target[key] = source[key];
      }
    }
  }
  return target;
};
