import { Hono } from 'hono'
import { auth } from './lib/auth'
import { cors } from "hono/cors";
import route from '../routes/route' 

const app = new Hono()

app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:8080"],
  allowHeaders: ["Content-Type", "Authorization"],
  allowMethods: ["POST", "GET", "OPTIONS"],
  exposeHeaders: ["Content-Length"],
  maxAge: 600,
  credentials: true,
}));

app.on(["POST", "GET"], "/api/auth/**", (c) => auth.handler(c.req.raw));
app.route("/", route);



export default {
  port: 8080,
  fetch: app.fetch,
}
