import { Box, Typography } from "@mui/material";
import { DataGrid, GridSortModel } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import axios from "axios";
import CreateCategoryModal from "../Components/pageComponents/Categories/CreateCategoryModal";
import EditCategoryModal from "../Components/pageComponents/Categories/EditCategoryModal";
import DeleteCategoryModal from "../Components/pageComponents/Categories/DeleteCategoryModal";
import { CategoryData } from "../interfaces";
import { getCookie } from "../utils";

export default function CategoriesPage() {
  const [data, setData] = useState<{
    categories: CategoryData[];
    totalRecordCount: { count: number }[];
  }>({ categories: [], totalRecordCount: [{ count: 1 }] });

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const [sortingModel, setSortingModel] = useState({
    sortBy: "createdAt",
    sortOrder: "asc",
  });

  function handleSortModelChange(sortModel: GridSortModel) {
    if (!sortModel[0]) {
      setSortingModel({
        sortBy: "createdAt",
        sortOrder: "asc",
      });
      return;
    }
    setSortingModel({
      sortBy: sortModel[0].field,
      sortOrder: sortModel[0].sort as string,
    });
  }

  function fetchData() {
    const token = getCookie("access_token");
    axios
      .get(
        `http://localhost:3000/category?page=${
          paginationModel.page + 1
        }&sortBy=${sortingModel.sortBy}&sortOrder=${sortingModel.sortOrder}`,
        { headers: { Authorization: "Bearer " + token }, withCredentials: true }
      )
      .then((res) => {
        setData(res.data);
      });
  }

  useEffect(fetchData, [paginationModel, sortingModel]);

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
      valueGetter: (val: string) => new Date(val).toUTCString(),
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      cellClassName: "actions",
      flex: 1,
      getActions: ({ row }: { row: CategoryData }) => {
        return [
          <EditCategoryModal category={row} mutate={fetchData} />,
          <DeleteCategoryModal category={row} mutate={fetchData} />,
        ];
      },
    },
  ];
  return (
    <Box display="flex" sx={{ ml: 2, flexDirection: "column", width: "100%" }}>
      <Box
        display="flex"
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <Box>
          <Typography variant="h1">Categories</Typography>
          <Typography variant="h6">
            You can see categories and stuff from this page
          </Typography>
        </Box>
        <Box sx={{ mr: 10 }}>
          <CreateCategoryModal mutate={fetchData} />
        </Box>
      </Box>
      <DataGrid
        getRowId={(i) => i._id}
        //@ts-expect-error does not accept the action column for some reason
        columns={columns}
        rows={data.categories}
        autoHeight
        sx={{ alignSelf: "center", mt: 10, width: "90%" }}
        rowCount={data.totalRecordCount[0]?.count ?? 0}
        paginationMode="server"
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[10, 20, 50]}
        sortingMode="server"
        onSortModelChange={handleSortModelChange}
      />
    </Box>
  );
}
