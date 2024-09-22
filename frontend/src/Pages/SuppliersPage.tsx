import { Box, Typography } from "@mui/material";
import { DataGrid, GridSortModel } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import axios from "axios";
import CreateSupplierModal from "../Components/pageComponents/Suppliers/CreateSupplierModal";
import EditSupplierModal from "../Components/pageComponents/Suppliers/EditSupplierModal";
import DeleteSupplierModal from "../Components/pageComponents/Suppliers/DeleteSupplierModal";
import { SupplierData } from "../interfaces";
import { getCookie } from "../utils";

export default function SuppliersPage() {
  const [data, setData] = useState<{
    suppliers: SupplierData[];
    totalRecordCount: { count: number }[];
  }>({ suppliers: [], totalRecordCount: [{ count: 1 }] });

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
        `http://localhost:3000/supplier?page=${
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
      field: "contactInfo",
      headerName: "Contact",
      flex: 1,
    },
    {
      field: "address",
      headerName: "Address",
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
      getActions: ({ row }: { row: SupplierData }) => {
        return [
          <EditSupplierModal supplier={row} mutate={fetchData} />,
          <DeleteSupplierModal supplier={row} mutate={fetchData} />,
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
          <Typography variant="h1">Suppliers</Typography>
          <Typography variant="h6">
            You can see suppliers and stuff from this page
          </Typography>
        </Box>
        <Box sx={{ mr: 10 }}>
          <CreateSupplierModal mutate={fetchData} />
        </Box>
      </Box>
      <DataGrid
        getRowId={(i) => i._id}
        //@ts-expect-error does not accept the action column for some reason
        columns={columns}
        rows={data.suppliers}
        autoHeight
        sx={{ alignSelf: "center", mt: 10, width: "90%" }}
        rowCount={data.totalRecordCount[0]?.count ?? 1}
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
