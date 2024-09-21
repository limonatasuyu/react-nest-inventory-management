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
import { ItemSchema, itemSchema } from "../../../validators/item-validator";
import axios from "axios";
import toast from "react-hot-toast";

export default function CreateItemModal({
  mutate,
  suppliers,
  categories,
}: {
  mutate: () => void;
  suppliers: { name: string; _id: string }[];
  categories: { name: string; _id: string }[];
}) {
  const [open, setOpen] = useState(false);

  const formik = useFormik<ItemSchema>({
    initialValues: {
      name: "",
      categoryId: "",
      supplierId: "",
      quantity: 0,
      price: 0,
      description: "",
    },
    onSubmit: async (values) => {
      const token = window.sessionStorage.getItem("access_token");
      await axios
        .post("http://localhost:3000/item", values, {
          headers: { Authorization: "Bearer " + token },
        })
        .then(() => {
          setOpen(false);
          toast.success("Item created succesfully.");
          mutate();
        })
        .catch((err) => {
          toast.error(err);
        });
      formik.setSubmitting(false);
    },
    validationSchema: itemSchema,
  });

  useEffect(() => {
    formik.resetForm();
  }, [open]);

  console.log('formik.values.categoryId: ', formik.values.categoryId)
  return (
    <>
      <Button onClick={() => setOpen(true)} variant="contained">
        Create New Item
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
          <Typography variant="h4">Create Item</Typography>
          <form onSubmit={formik.handleSubmit} style={{ marginTop: "1rem" }}>
            <Box display="flex" sx={{ flexDirection: "column", gap: 2 }}>
              <TextField
                label="Name"
                name="name"
                onChange={formik.handleChange}
                value={formik.values.name}
                error={Boolean(formik.touched.name && formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
              <FormControl fullWidth>
                <InputLabel id="category-select-label">Category</InputLabel>
                <Select
                  labelId="category-select-label"
                  id="category-select"
                  value={formik.values.categoryId}
                  label="Category"
                  name="categoryId"
                  onChange={formik.handleChange}
                  error={Boolean(
                    formik.touched.categoryId && formik.errors.categoryId
                  )}
                >
                  {categories.map((item: { name: string; _id: string }) => (
                    <MenuItem value={item._id}>{item.name}</MenuItem>
                  ))}
                </Select>
                <FormHelperText
                  error={Boolean(
                    formik.touched.categoryId && formik.errors.categoryId
                  )}
                >
                  {formik.touched.categoryId && formik.errors.categoryId}
                </FormHelperText>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel id="supplier-select-label">Supplier</InputLabel>
                <Select
                  labelId="supplier-select-label"
                  id="supplier-select"
                  value={formik.values.supplierId}
                  label="Supplier"
                  name="supplierId"
                  onChange={formik.handleChange}
                  error={Boolean(
                    formik.touched.supplierId && formik.errors.supplierId
                  )}
                >
                  {suppliers.map((item: { name: string; _id: string }) => (
                    <MenuItem value={item._id}>{item.name}</MenuItem>
                  ))}
                </Select>
                <FormHelperText
                  error={Boolean(
                    formik.touched.supplierId && formik.errors.supplierId
                  )}
                >
                  {formik.touched.supplierId && formik.errors.supplierId}
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
              <TextField
                label="Price"
                name="price"
                type="number"
                onChange={formik.handleChange}
                value={formik.values.price}
                error={Boolean(formik.touched.price && formik.errors.price)}
                helperText={formik.touched.price && formik.errors.price}
              />
              <TextField
                label="Description"
                name="description"
                onChange={formik.handleChange}
                value={formik.values.description}
                error={Boolean(
                  formik.touched.description && formik.errors.description
                )}
                helperText={
                  formik.touched.description && formik.errors.description
                }
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
