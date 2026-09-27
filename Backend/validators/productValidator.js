import { z } from "zod";

const productSchema = z.object({
    name: z.string().trim().min(1, "Name is required"),
    category: z.string().trim().min(1, "Category is required"),
    price: z.coerce.number().min(0, "Price cannot be negative"),
    stock: z.coerce.number().int().min(0, "Stock cannot be negative"),
    image: z.string().optional(),
});

const productValidator = (req, res, next) => {
  const result = productSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: result.error.issues.map((e) => e.message).join(", "),
    });
  }

  next();
};

export default productValidator;