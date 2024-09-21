import * as yup from "yup";

export const orderSchema = yup.object({
  itemId: yup.string().required("Item is required."),
  quantity: yup
    .number()
    .min(1, "Quantity must be greater than 1")
    .required("Item is required."),
  dateOrdered: yup
    .date()
    .min(new Date(), "Date must be later than today")
    .required("Order date is required."),
});

export type OrderSchema = yup.InferType<typeof orderSchema>;
