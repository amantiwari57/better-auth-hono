import { Hono } from "hono";
import normalRoute from "./normal.route";
import protectedRoute from "./protected.route";
import bookRouter from "./books.route";

const route = new Hono();

route.route("/normal", normalRoute);
route.route("/protected", protectedRoute);
route.route("/books", bookRouter);

export default route;
