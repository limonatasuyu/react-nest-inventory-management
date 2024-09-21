import { GridActionsCellItem } from "@mui/x-data-grid";
import { Button, Modal, Box, Typography } from "@mui/material";
import { SyntheticEvent, useState } from "react";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import { OrderData } from "../../../interfaces";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import toast from "react-hot-toast";

export default function DeleteOrderModal({
  order,
  mutate,
}: {
  order: OrderData;
  mutate: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    const token = window.sessionStorage.getItem("access_token");
    axios
      .delete("http://localhost:3000/order/" + order._id, {
        headers: { Authorization: "Bearer " + token },
      })
      .then(() => {
        setOpen(false);
        toast.success('Order deleted succesfully.');
        mutate();
      })
      .catch((err) => {
        toast.error(err);
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
          <Typography variant="h4">Delete Order</Typography>
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
