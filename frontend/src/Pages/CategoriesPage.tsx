import { Box, Typography } from "@mui/material";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import axios from "axios";
import CreateCategoryModal from "../Components/CreateCategoryModal";
import EditCategoryModal from "../Components/EditCategoryModal";
import { CategoryData } from '../interfaces';

export default function ItemsPage() {
  const [data, setData] = useState<{
    categories: CategoryData[];
    totalPageCount: number;
  }>({ categories: [], totalPageCount: 1 });
  useEffect(() => {
    const token = window.sessionStorage.getItem("access_token");
    axios
      .get(
        "http://localhost:3000/category?page=1&sortBy=name&sortOrder=ascending",
        { headers: { Authorization: "Bearer " + token } }
      )
      .then((res) => {
        setData(res.data);
      });
  }, []);

  const columns = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
    },
    {
      field: "description",
      headerName: "Description",
      flex: 1,
    },
    {
      field: "createdAt",
      headerName: "Created At",
      flex: 1,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      cellClassName: "actions",
      flex: 1,
      getActions: ({ row }: { row: CategoryData }) => {
        return [
          <EditCategoryModal category={row} />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Cancel"
            className="textPrimary"
            onClick={() => {}}
            color="inherit"
            sx={{
              "&:focus": { outline: "none" },
            }}
          />,
        ];
      },
    },
  ];
  return (
    <Box display="flex" sx={{ ml: 2, flexDirection: "column", width: "100%" }}>
      <Box
        display="flex"
        sx={{ justifyContent: "space-between", alignItems: "center" }}
      >
        <Box>
          <Typography variant="h1">Categories</Typography>
          <Typography variant="h6">
            You can see categories and stuff from this page
          </Typography>
        </Box>
        <Box sx={{ mr: 10 }}>
          <CreateCategoryModal />
        </Box>
      </Box>
      <DataGrid
        getRowId={(i) => i._id}
        //@ts-expect-error does not accept action column for some reason
        columns={columns}
        rows={data.categories}
        paginationModel={{ page: 1, pageSize: 10 }}
        autoHeight
        sx={{ alignSelf: "center", mt: 10, width: "90%" }}
      />
    </Box>
  );
}
