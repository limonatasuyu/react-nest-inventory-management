import * as yup from "yup";

export const categorySchema = yup.object({
  name: yup.string().required("Name is required."),
  description: yup.string().optional(),
});

export type CategorySchema = yup.InferType<typeof categorySchema>;
