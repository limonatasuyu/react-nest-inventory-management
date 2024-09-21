import { GridActionsCellItem } from "@mui/x-data-grid";
import { Button, Modal, Box, Typography, TextField } from "@mui/material";
import { useFormik } from "formik";
import { useState, useEffect } from "react";
import {
  SupplierSchema,
  supplierSchema,
} from "../../../validators/supplier-validator";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import { SupplierData } from "../../../interfaces";
import toast from "react-hot-toast";

export default function EditSupplierModal({
  supplier,
  mutate,
}: {
  supplier: SupplierData;
  mutate: () => void;
}) {
  const [open, setOpen] = useState(false);

  console.log("supplier: ", supplier);
  const formik = useFormik<SupplierSchema>({
    initialValues: {
      name: supplier.name,
      contactInfo: supplier.contactInfo,
      address: supplier.address,
    },
    onSubmit: async (values) => {
      const token = window.sessionStorage.getItem("access_token");
      await axios
        .put(
          "http://localhost:3000/supplier/",
          { ...values, supplierId: supplier._id },
          {
            headers: { Authorization: "Bearer " + token },
          }
        )
        .then(() => {
          setOpen(false);
          toast.success("Supplier updated succesfully.");
          mutate();
        })
        .catch((err) => {
          toast.error(err);
        });
      formik.setSubmitting(false);
    },
    validationSchema: supplierSchema,
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
          <Typography variant="h4">Edit Supplier</Typography>
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
                label="Contact Information"
                name="contactInfo"
                onChange={formik.handleChange}
                value={formik.values.contactInfo}
                error={Boolean(
                  formik.touched.contactInfo && formik.errors.contactInfo
                )}
                helperText={
                  formik.touched.contactInfo && formik.errors.contactInfo
                }
              />
              <TextField
                label="Address"
                name="address"
                onChange={formik.handleChange}
                value={formik.values.address}
                error={Boolean(formik.touched.address && formik.errors.address)}
                helperText={formik.touched.address && formik.errors.address}
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
