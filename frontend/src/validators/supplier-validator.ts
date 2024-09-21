import * as yup from "yup";

export const supplierSchema = yup.object({
  name: yup.string().required("Name is required."),
  contactInfo: yup.string().required("Contact info is requried."),
  address: yup.string().required("Address is requried."),
});

export type SupplierSchema = yup.InferType<typeof supplierSchema>;
