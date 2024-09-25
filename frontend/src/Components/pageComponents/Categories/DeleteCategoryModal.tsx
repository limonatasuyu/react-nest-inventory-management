import { GridActionsCellItem } from "@mui/x-data-grid";
import { Button, Modal, Box, Typography } from "@mui/material";
import { SyntheticEvent, useState } from "react";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import { CategoryData } from "../../../interfaces";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import toast from "react-hot-toast";
import { getCookie } from "../../../utils";

export default function DeleteCategoryModal({
  category,
  mutate,
}: {
  category: CategoryData;
  mutate: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    const token = getCookie("access_token");
    axios
      .delete("https://react-nest-inventory-management-production.up.railway.app/category/" + category._id, {
        headers: { Authorization: "Bearer " + token },
        withCredentials: true,
      })
      .then(() => {
        setOpen(false);
        toast.success('Category deleted succesfully.');
        mutate();
      })
      .catch((err) => {
        toast.error(err.response?.data.message ?? err.message)
      })
      .finally(() => {
        setSubmitting(false);
      });
  }

  return (
    <>
      <GridActionsCellItem
        icon={<DeleteIcon />}
        label="Cancel"
        className="textPrimary"
        onClick={() => setOpen(true)}
        color="inherit"
        sx={{
          "&:focus": { outline: "none" },
        }}
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
          <Typography variant="h4">Delete Category</Typography>
          <Box display="flex" sx={{ alignItems: "end", gap: 1 }}>
            <WarningAmberIcon color="warning" />
            <Typography variant="caption" color="warning">
              Warning: This action is not reversable
            </Typography>
          </Box>
          <form onSubmit={handleSubmit} style={{ marginTop: "1rem" }}>
            <Box display="flex" sx={{ flexDirection: "column", gap: 2 }}>
              <Box display="flex" sx={{ gap: 1, justifyContent: "center" }}>
                <Button
                  variant="contained"
                  color="warning"
                  type="submit"
                  disabled={submitting}
                >
                  Delete
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
