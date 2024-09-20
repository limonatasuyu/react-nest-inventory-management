import { Button, Modal, Box, Typography, TextField } from "@mui/material";
import { useFormik } from "formik";
import { useState } from "react";
import { CategorySchema, categorySchema } from "../validators/category-validator";
import axios from "axios";

export default function CreateCategoryModal() {
  const [open, setOpen] = useState(false);

  const formik = useFormik<CategorySchema>({
    initialValues: { name: "", description: "" },
    onSubmit: async (values) => {
      const token = window.sessionStorage.getItem('access_token')
      await axios.post('http://localhost:3000/category', values, {  headers: { Authorization: 'Bearer ' + token }}).then(() => {setOpen(false)})
      formik.setSubmitting(false);
    },
    validationSchema: categorySchema
  });

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
                <Button variant="contained" color="success" type="submit" disabled={formik.isSubmitting}>
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
