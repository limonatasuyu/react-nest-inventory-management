import { GridActionsCellItem } from "@mui/x-data-grid";
import {
  Button,
  Modal,
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  FormHelperText,
  Select,
} from "@mui/material";
import { useFormik } from "formik";
import { useState, useEffect } from "react";
import { ItemSchema, itemSchema } from "../../../validators/item-validator";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import { ItemData } from "../../../interfaces";
import toast from "react-hot-toast";
import { getCookie } from "../../../utils";

export default function EditItemModal({
  item,
  mutate,
  suppliers,
  categories,
}: {
  item: ItemData,
  mutate: () => void;
  suppliers: { name: string; _id: string }[];
  categories: { name: string; _id: string }[];
}) {
  const [open, setOpen] = useState(false);

  const formik = useFormik<ItemSchema>({ 
    initialValues: {
      name: item.name,
      categoryId: item.category._id,
      supplierId: item.supplier._id,
      quantity: item.quantity,
      price: item.price,
      description: item.description,
    },
    onSubmit: async (values) => {
      const token = getCookie("access_token");
      await axios
        .put(
          "https://react-nest-inventory-management-production.up.railway.app/item/",
          { ...values, itemId: item._id },
          {
            headers: { Authorization: "Bearer " + token },
            withCredentials: true
          }
        )
        .then(() => {
          setOpen(false);
          toast.success("Item updated succesfully.");
          mutate();
        })
        .catch((err) => {
          toast.error(err.response?.data.message ?? err.message)
        });
      formik.setSubmitting(false);
    },
    validationSchema: itemSchema,
  });

  useEffect(() => {
    formik.resetForm();
  }, [open]);

  return (
    <>
      <GridActionsCellItem
        icon={<EditIcon />}
        label="Save"
        sx={{
          color: "primary.main",
          "&:focus": { outline: "none" },
        }}
        onClick={() => setOpen(true)}
      />
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
          <Typography variant="h4">Edit Item</Typography>
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
                <InputLabel id="item-select-label">Category</InputLabel>
                <Select
                  labelId="item-select-label"
                  id="item-select"
                  value={formik.values.categoryId}
                  label="Item"
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
                <InputLabel id="item-select-label">Item</InputLabel>
                <Select
                  labelId="item-select-label"
                  id="item-select"
                  value={formik.values.supplierId}
                  label="Item"
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
                  Edit
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
