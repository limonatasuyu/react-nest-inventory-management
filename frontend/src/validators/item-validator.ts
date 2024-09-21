import * as yup from "yup";

export const itemSchema = yup.object({
  name: yup.string().required("Name is required."),
  categoryId: yup.string().required("Category is required."),
  supplierId: yup.string().required("Supplier is required."),
  quantity: yup
    .number()
    .min(0, "Quantity must be greater than 0")
    .required("Quantity is required."),
  price: yup
    .number()
    .min(1, "Price must be greater than 1")
    .required("Price is required."),
  description: yup.string().optional(),
});

export type ItemSchema = yup.InferType<typeof itemSchema>;
