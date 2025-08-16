import { Hono } from "hono";
import { z } from "zod";
import { auth } from "../src/lib/auth";
import { describeRoute } from "hono-openapi";
import { validator as zValidator } from "hono-openapi/zod";

const bookSchema = z.object({
  bookName: z.string(),
  authorName: z.string().optional(),
  isAvailable: z.boolean().default(true),
});

// Type assertion helper to bypass Zod-OpenAPI type conflicts
const asOpenAPISchema = <T>(schema: T) => schema as any;

const bookRouter = new Hono();

bookRouter.post(
  "/",
  describeRoute({
    description: "Create a new book",
    requestBody: {
      description: "Book data to create",
      content: {
        "application/json": { schema: asOpenAPISchema(bookSchema) },
      },
      required: true,
    },
    responses: {
      201: {
        description: "Book created successfully",
        content: {
          "application/json": { 
            schema: asOpenAPISchema(z.object({
              message: z.string(),
              book: bookSchema,
              userId: z.string(),
            }))
          },
        },
      },
      400: {
        description: "Validation error",
        content: {
          "application/json": {
            schema: asOpenAPISchema(z.object({
              message: z.string(),
              errors: z.string(),
            })),
          },
        },
      },
      401: {
        description: "Unauthorized",
        content: {
          "application/json": {
            schema: asOpenAPISchema(z.object({
              message: z.string(),
            })),
          },
        },
      },
    },
  }),
  zValidator("json", bookSchema),
  async (c) => {
    try {
      const session = await auth.api.getSession({ headers: c.req.raw.headers });

      if (!session) {
        return c.json({ message: "Unauthorized" }, 401);
      }

      const validatedData = c.req.valid("json");

      return c.json(
        {
          message: "Book created successfully",
          book: validatedData,
          userId: session.user.id,
        },
        201
      );
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return c.json(
          {
            message: "Validation error",
            errors: error.message,
          },
          400
        );
      }

      return c.json(
        {
          message: "Internal server error",
        },
        500
      );
    }
  }
);

bookRouter.get(
  "/",
  describeRoute({
    description: "Get user information (protected endpoint)",
    responses: {
      200: {
        description: "User information retrieved successfully",
        content: {
          "application/json": { 
            schema: asOpenAPISchema(z.object({
              message: z.string(),
              user: z.object({
                id: z.string(),
                email: z.string(),
                name: z.string().optional(),
              }),
            }))
          },
        },
      },
      401: {
        description: "Unauthorized",
        content: {
          "application/json": {
            schema: asOpenAPISchema(z.object({
              message: z.string(),
            })),
          },
        },
      },
    },
  }),
  async (c) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });

    if (!session) {
      return c.json({ message: "Unauthorized" }, 401);
    }

    return c.json(
      { 
        message: "User information retrieved successfully",
        user: {
          id: session.user.id,
          email: session.user.email,
          name: session.user.name,
        }
      },
      200
    );
  }
);

export default bookRouter;
