import { Box, Typography } from "@mui/material";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ItemsPage() {

  const [data, setData] = useState([]);
  useEffect(() => {
    axios.get('http://localhost:3000/item?page=1&sortBy&sortOrder=ascending').then(res => {
      if (res.data.items) {
        setData(res.data.items)
      }
    })
  }, [])

  const columns = [
    {
      field: "name",
      headerName: "Name",
    },
    {
      field: "category",
      headerName: "Category",
    },
    {
      field: "supplier",
      headerName: "Supplier",
    },
    {
      field: "quantity",
      headerName: "Quantity",
    },
    {
      field: "price",
      headerName: "Price",
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      cellClassName: "actions",
      getActions: (
        {
          /*id */
        }
      ) => {
        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Save"
            sx={{
              color: "primary.main",
            }}
            onClick={() => {}}
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Cancel"
            className="textPrimary"
            onClick={() => {}}
            color="inherit"
          />,
        ];
      },
    },
  ];
  return (
    <Box display="flex" sx={{ ml: 2, flexDirection: "column", width: "100%" }}>
      <Typography variant="h1">Items</Typography>
      <Typography variant="h6">
        You can see items and stuff from this page
      </Typography>
      <DataGrid
        columns={columns}
        rows={[]}
        paginationModel={{ page: 1, pageSize: 10 }}
        autoHeight
        sx={{ alignSelf: "center", mt: 10, width: "90%" }}
      />
    </Box>
  );
}
