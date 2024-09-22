import * as yup from "yup";
import dayjs from "dayjs";

export const orderSchema = yup.object({
  supplierId: yup.string().required("Supplier is required."),
  itemId: yup.string().required("Item is required."),
  quantity: yup
    .number()
    .min(1, "Quantity must be greater than 1")
    .required("Item is required."),
  dateOrdered: yup
    .object()
    .test({ message: "Date is invalid", test: (value) => dayjs.isDayjs(value) })
    .test({
      message: "Date must be later than today",
      test: (value: dayjs.Dayjs) => value.isAfter(dayjs(new Date())),
    })
    .required("Order date is required."),
});

export type OrderSchema = yup.InferType<typeof orderSchema>;
