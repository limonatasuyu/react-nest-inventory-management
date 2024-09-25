import {
  Button,
  Modal,
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { OrderSchema, orderSchema } from "../../../validators/order-validator";
import axios from "axios";
import toast from "react-hot-toast";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { getCookie } from "../../../utils";

export default function CreateOrderModal({
  mutate,
  items,
  suppliers
}: {
  mutate: () => void;
  items: { name: string; _id: string }[];
  suppliers: { name: string; _id: string }[];
}) {
  const [open, setOpen] = useState(false);

  const formik = useFormik<OrderSchema>({
    initialValues: { itemId: "", supplierId: "", quantity: 0, dateOrdered: dayjs(new Date()) as unknown as Date },
    onSubmit: async (values) => {
      const token = getCookie("access_token");
      await axios
        .post("https://react-nest-inventory-management-production.up.railway.app/order", values, {
          headers: { Authorization: "Bearer " + token },
          withCredentials: true,
        })
        .then(() => {
          setOpen(false);
          toast.success("Order created succesfully.");
          mutate();
        })
        .catch((err) => {  
          toast.error(err.response?.data.message ?? err.message)
        });
      formik.setSubmitting(false);
    },
    validationSchema: orderSchema,
  });

  useEffect(() => {
    formik.resetForm();
  }, [open]);

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="contained">
        Create New Order
      </Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h4">Create Order</Typography>
          <form onSubmit={formik.handleSubmit} style={{ marginTop: "1rem" }}>
            <Box display="flex" sx={{ flexDirection: "column", gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel id="supplier-select-label">Supplier</InputLabel>
                <Select
                  labelId="supplier-select-label"
                  id="supplier-select"
                  value={formik.values.supplierId}
                  label="Supplier"
                  name="supplierId"
                  onChange={formik.handleChange}
                  error={Boolean(formik.touched.supplierId && formik.errors.supplierId)}
                >
                  {suppliers.map((item: { name: string; _id: string }) => (
                    <MenuItem value={item._id}>{item.name}</MenuItem>
                  ))}
                </Select>
                <FormHelperText
                  error={Boolean(formik.touched.supplierId && formik.errors.supplierId)}
                >
                  {formik.touched.supplierId && formik.errors.supplierId}
                </FormHelperText>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel id="item-select-label">Item</InputLabel>
                <Select
                  labelId="item-select-label"
                  id="item-select"
                  value={formik.values.itemId}
                  label="Item"
                  name="itemId"
                  onChange={formik.handleChange}
                  error={Boolean(formik.touched.itemId && formik.errors.itemId)}
                >
                  {items.map((item: { name: string; _id: string }) => (
                    <MenuItem value={item._id}>{item.name}</MenuItem>
                  ))}
                </Select>
                <FormHelperText
                  error={Boolean(formik.touched.itemId && formik.errors.itemId)}
                >
                  {formik.touched.itemId && formik.errors.itemId}
                </FormHelperText>
              </FormControl>
              <TextField
                label="Quantity"
                name="quantity"
                type="number"
                onChange={formik.handleChange}
                value={formik.values.quantity}
                error={Boolean(
                  formik.touched.quantity && formik.errors.quantity
                )}
                helperText={formik.touched.quantity && formik.errors.quantity}
              />
              <DatePicker
                label="Order Date"
                name="dateOrdered"
                onChange={(e) => formik.setFieldValue('dateOrdered', dayjs(e))}
                value={formik.values.dateOrdered as unknown as null}
                slotProps={{
                  textField: {
                    helperText:
                      formik.touched.dateOrdered &&
                      (formik.errors.dateOrdered as string),
                    error: Boolean(
                      formik.touched.dateOrdered && formik.errors.dateOrdered
                    ),
                  },
                }}
              />
              <Box display="flex" sx={{ gap: 1, justifyContent: "center" }}>
                <Button
                  variant="contained"
                  color="success"
                  type="submit"
                  disabled={formik.isSubmitting}
                >
                  Create
                </Button>
                <Button
                  variant="contained"
                  onClick={() => setOpen(false)}
                  color="inherit"
                >
                  Cancel
                </Button>
              </Box>
            </Box>
          </form>
        </Box>
      </Modal>
    </>
  );
}
