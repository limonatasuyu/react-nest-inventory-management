import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Divider,
} from "@mui/material";
import axios from "axios";
import { useState, useEffect } from "react";
import { getCookie } from "../utils";
import CategoryIcon from "@mui/icons-material/Category";
import InventoryIcon from "@mui/icons-material/Inventory";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import WarningIcon from "@mui/icons-material/Warning";
import PendingIcon from "@mui/icons-material/PendingActions";
import UpdateIcon from "@mui/icons-material/Update";
import { LowStockItemsModal } from "../Components/pageComponents/Dashboard/LowStockItemsModal";
import { PendingOrdersModal } from "../Components/pageComponents/Dashboard/PendingOrdersModal";

export default function HomePage() {
  const [metrics, setMetrics] = useState<{
    lowStockItems: {
      name: string;
      price: number;
      quantity: number;
      _id: string;
    }[];
    pendingOrders: {
      item: { name: string; _id: string };
      quantity: number;
      supplier: { name: string; _id: string };
      _id: string;
    }[];
    totalCategories: number;
    totalItems: number;
    totalOrders: number;
    totalSuppliers: number;
  } | null>(null);

  const [recentActivities, setRecentActivities] = useState<{
    category: {
      create: number;
      update: number;
      delete: number;
    };
    item: {
      create: number;
      update: number;
      delete: number;
    };
    order: {
      create: number;
      update: number;
    };
    supplier: {
      create: number;
      update: number;
      delete: number;
    };
  } | null>(null);

  useEffect(() => {
    const token = getCookie("access_token");
    axios
      .get("https://react-nest-inventory-management-production.up.railway.app/metrics", {
        headers: { Authorization: "Bearer " + token },
        withCredentials: true,
      })
      .then((res) => {
        if (res.data) {
          setMetrics(res.data);
        }
      });

    axios
      .get("https://react-nest-inventory-management-production.up.railway.app/updates", {
        headers: { Authorization: "Bearer " + token },
        withCredentials: true,
      })
      .then((res) => {
        if (res.data) {
          setRecentActivities(res.data);
        }
      });
  }, []);

  return (
    <Box sx={{ padding: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={3}>
          <Card sx={{ backgroundColor: "#e3f2fd" }}>
            <CardContent>
              <Avatar sx={{ bgcolor: "#1976d2" }}>
                <CategoryIcon />
              </Avatar>
              <Typography variant="h6" sx={{ marginTop: 2 }}>
                Total Categories
              </Typography>
              <Typography variant="h4" color="textPrimary">
                {metrics?.totalCategories || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ backgroundColor: "#ffebee" }}>
            <CardContent>
              <Avatar sx={{ bgcolor: "#d32f2f" }}>
                <InventoryIcon />
              </Avatar>
              <Typography variant="h6" sx={{ marginTop: 2 }}>
                Total Items
              </Typography>
              <Typography variant="h4" color="textPrimary">
                {metrics?.totalItems || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ backgroundColor: "#e8f5e9" }}>
            <CardContent>
              <Avatar sx={{ bgcolor: "#388e3c" }}>
                <ShoppingCartIcon />
              </Avatar>
              <Typography variant="h6" sx={{ marginTop: 2 }}>
                Total Orders
              </Typography>
              <Typography variant="h4" color="textPrimary">
                {metrics?.totalOrders || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ backgroundColor: "#f3e5f5" }}>
            <CardContent>
              <Avatar sx={{ bgcolor: "#8e24aa" }}>
                <LocalShippingIcon />
              </Avatar>
              <Typography variant="h6" sx={{ marginTop: 2 }}>
                Total Suppliers
              </Typography>
              <Typography variant="h4" color="textPrimary">
                {metrics?.totalSuppliers || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Low Stock Items */}
        <Grid item xs={12} md={6}>
          <Card sx={{ backgroundColor: "#fffde7" }}>
            <CardContent>
              <Avatar sx={{ bgcolor: "#fbc02d" }}>
                <WarningIcon />
              </Avatar>
              <Typography variant="h6" sx={{ marginTop: 2 }}>
                Low Stock Items
              </Typography>
              <List>
                {metrics?.lowStockItems?.slice(0, 3).map((item) => (
                  <ListItem key={item._id}>
                    <ListItemText
                      primary={`name: ${item.name}  price: $${item.price}`}
                      secondary={`Quantity: ${item.quantity}`}
                    />
                  </ListItem>
                ))}
              </List>
              {(metrics?.lowStockItems?.length as number) > 3 && (
                <LowStockItemsModal items={metrics?.lowStockItems ?? []} />
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Pending Orders */}
        <Grid item xs={12} md={6}>
          <Card sx={{ backgroundColor: "#e0f7fa" }}>
            <CardContent>
              <Avatar sx={{ bgcolor: "#00acc1" }}>
                <PendingIcon />
              </Avatar>
              <Typography variant="h6" sx={{ marginTop: 2 }}>
                Pending Orders
              </Typography>
              <List>
                {metrics?.pendingOrders?.slice(0, 3).map((order) => (
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
              {(metrics?.pendingOrders?.length as number) > 3 && (
                <PendingOrdersModal orders={metrics?.pendingOrders ?? []} />
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card sx={{ backgroundColor: "#f1f8e9", padding: 2 }}>
            <CardContent>
              <Avatar sx={{ bgcolor: "#8bc34a", marginBottom: 2 }}>
                <UpdateIcon />
              </Avatar>
              <Typography variant="h6" gutterBottom>
                Recent Updates
              </Typography>

              {/* Categories Updates */}
              <Grid container spacing={2} sx={{ marginBottom: 2 }}>
                <Grid item xs={12} sm={6}>
                  <Card sx={{ backgroundColor: "#e3f2fd", padding: 2 }}>
                    <CardContent>
                      <Avatar sx={{ bgcolor: "#1976d2" }}>
                        <CategoryIcon />
                      </Avatar>
                      <Typography variant="subtitle1" sx={{ marginTop: 1 }}>
                        Categories
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {recentActivities?.category?.create
                          ? `Created: ${recentActivities.category.create}`
                          : "No new categories created"}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {recentActivities?.category?.update
                          ? `Updated: ${recentActivities.category.update}`
                          : "No categories updated"}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {recentActivities?.category?.delete
                          ? `Deleted: ${recentActivities.category.delete}`
                          : "No categories deleted"}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Items Updates */}
                <Grid item xs={12} sm={6}>
                  <Card sx={{ backgroundColor: "#ffebee", padding: 2 }}>
                    <CardContent>
                      <Avatar sx={{ bgcolor: "#d32f2f" }}>
                        <InventoryIcon />
                      </Avatar>
                      <Typography variant="subtitle1" sx={{ marginTop: 1 }}>
                        Items
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {recentActivities?.item?.create
                          ? `Created: ${recentActivities.item.create}`
                          : "No new items created"}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {recentActivities?.item?.update
                          ? `Updated: ${recentActivities.item.update}`
                          : "No items updated"}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {recentActivities?.item?.delete
                          ? `Deleted: ${recentActivities.item.delete}`
                          : "No items deleted"}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Orders Updates */}
                <Grid item xs={12} sm={6}>
                  <Card sx={{ backgroundColor: "#e8f5e9", padding: 2 }}>
                    <CardContent>
                      <Avatar sx={{ bgcolor: "#388e3c" }}>
                        <ShoppingCartIcon />
                      </Avatar>
                      <Typography variant="subtitle1" sx={{ marginTop: 1 }}>
                        Orders
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {recentActivities?.order?.create
                          ? `Created: ${recentActivities.order.create}`
                          : "No new orders created"}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {recentActivities?.order?.update
                          ? `Updated: ${recentActivities.order.update}`
                          : "No orders updated"}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Suppliers Updates */}
                <Grid item xs={12} sm={6}>
                  <Card sx={{ backgroundColor: "#f3e5f5", padding: 2 }}>
                    <CardContent>
                      <Avatar sx={{ bgcolor: "#8e24aa" }}>
                        <LocalShippingIcon />
                      </Avatar>
                      <Typography variant="subtitle1" sx={{ marginTop: 1 }}>
                        Suppliers
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {recentActivities?.supplier?.create
                          ? `Created: ${recentActivities.supplier.create}`
                          : "No new suppliers created"}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {recentActivities?.supplier?.update
                          ? `Updated: ${recentActivities.supplier.update}`
                          : "No suppliers updated"}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {recentActivities?.supplier?.delete
                          ? `Deleted: ${recentActivities.supplier.delete}`
                          : "No suppliers deleted"}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
