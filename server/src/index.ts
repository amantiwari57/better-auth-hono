import { Hono } from "hono";
import { auth } from "./lib/auth";
import { cors } from "hono/cors";
import { openAPISpecs } from "hono-openapi";
import route from "../routes/route";
import { apiReference } from "@scalar/hono-api-reference";

const app = new Hono();

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:8080"],
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS", "PUT", "PATCH"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  })
);

app.on(["POST", "GET"], "/api/auth/**", (c) => auth.handler(c.req.raw));
app.route("/", route);

app.get(
  "/openapi",
  openAPISpecs(app, {
    documentation: {
      info: {
        title: "Books API",
        version: "1.0.0",
        description: "API for managing books",
      },
      servers: [{ url: "http://localhost:8080", description: "Local Server" }],
    },
  })
);

app.get(
  "/docs",
  apiReference({
    theme: "saturn",
    spec: { url: "/openapi" },
  })
);
app.get("/", async (c) => {
  try {
    return c.json({ message: "welcome to dev server" }, { status: 200 });
  } catch (error) {
    return c.json({ message: "an unexpected error occured" });
  }
});

export default {
  port: 8080,
  fetch: app.fetch,
};
