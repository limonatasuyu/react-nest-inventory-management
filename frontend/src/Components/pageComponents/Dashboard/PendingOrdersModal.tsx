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
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export function PendingOrdersModal({
  orders,
}: {
  orders: {
    item: { name: string; _id: string };
    supplier: { name: string; _id: string };
    quantity: number;
    _id: string;
  }[];
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
            <Typography variant="h4">Pending Orders</Typography>
            <IconButton onClick={() => setOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Box display="flex" sx={{ flexDirection: "column", gap: 1 }}>
            <List>
              {orders.map((order) => (
                <>
                  <ListItem key={order._id}>
                    <ListItemText
                      primary={order.item.name}
                      secondary={`Supplier: ${order.supplier.name}`}
                    />
                    Quantity: {order.quantity}
                  </ListItem>
                  <Divider />
                </>
              ))}
            </List>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
