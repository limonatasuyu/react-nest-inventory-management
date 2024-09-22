import { useState } from "react";
import {
  Modal,
  Button,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export function LowStockItemsModal({
  items,
}: {
  items: { name: string; price: number; quantity: number; _id: string }[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        sx={{
          textDecoration: "underline",
          color: "blue",
          "&:focus": { outline: "none" },
        }}
        onClick={() => setOpen(true)}
      >
        See More
      </Button>
      <Modal open={open} onClose={setOpen}>
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
          <Box
            display="flex"
            sx={{
              width: "100%",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h4">Low Stock Items</Typography>
            <IconButton onClick={() => setOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Box display="flex" sx={{ flexDirection: "column", gap: 1 }}>
            <List>
              {items.map((item) => (
                <ListItem key={item._id}>
                  <ListItemText
                    primary={`name: ${item.name}  price: $${item.price}`}
                    secondary={`Quantity: ${item.quantity}`}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
