import { Button, Modal, Box, Typography, TextField } from "@mui/material";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import {
  CategorySchema,
  categorySchema,
} from "../../../validators/category-validator";
import axios from "axios";
import toast from "react-hot-toast";
import { getCookie } from "../../../utils";

export default function CreateCategoryModal({
  mutate,
}: {
  mutate: () => void;
}) {
  const [open, setOpen] = useState(false);

  const formik = useFormik<CategorySchema>({
    initialValues: { name: "", description: "" },
    onSubmit: async (values) => {
      const token = getCookie("access_token");
      await axios
        .post("https://react-nest-inventory-management-production.up.railway.app/category", values, {
          headers: { Authorization: "Bearer " + token },
          withCredentials: true,
        })
        .then(() => {
          setOpen(false);
          toast.success('Category created succesfully.');
          mutate();
        })    
        .catch((err) => toast.error(err.response?.data.message ?? err.message));
      formik.setSubmitting(false);
    },
    validationSchema: categorySchema,
  });

  useEffect(() => {
    formik.resetForm()
  }, [open])

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="contained">
        Create New Category
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
          <Typography variant="h4">Create Category</Typography>
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
