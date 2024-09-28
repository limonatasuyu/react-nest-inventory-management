import { GridActionsCellItem } from "@mui/x-data-grid";
import { Button, Modal, Box, Typography, TextField } from "@mui/material";
import { useFormik } from "formik";
import { useState, useEffect } from "react";
import {
  CategorySchema,
  categorySchema,
} from "../../../validators/category-validator";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import { CategoryData } from "../../../interfaces";
import toast from "react-hot-toast";

export default function EditCategoryModal({
  category,
  mutate,
}: {
  category: CategoryData;
  mutate: () => void;
}) {
  const [open, setOpen] = useState(false);

  console.log("category: ", category);
  const formik = useFormik<CategorySchema>({
    initialValues: { name: category.name, description: category.description },
    onSubmit: async (values) => {
      await axios
        .put(
          "https://react-nest-inventory-management-production.up.railway.app/category/",
          { ...values, categoryId: category._id },
          {
            withCredentials: true,
          },
        )
        .then(() => {
          setOpen(false);
          toast.success("Category updated succesfully.");
          mutate();
        })
        .catch((err) => {
          toast.error(err.response?.data.message ?? err.message)
        });
      formik.setSubmitting(false);
    },
    validationSchema: categorySchema,
  });

  useEffect(() => {
    formik.resetForm()
  }, [open])

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
          <Typography variant="h4">Edit Category</Typography>
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
