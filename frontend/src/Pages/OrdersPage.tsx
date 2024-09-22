import { Box, Typography } from "@mui/material";
import {
  DataGrid,
  GridSortModel,
  GridRenderCellParams,
  GridValidRowModel,
} from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import axios from "axios";
import CreateOrderModal from "../Components/pageComponents/Orders/CreateOrderModal";
import EditOrderModal from "../Components/pageComponents/Orders/EditOrderModal";
import DeleteOrderModal from "../Components/pageComponents/Orders/DeleteOrderModal";
import { OrderData } from "../interfaces";
import { getCookie } from "../utils";

export default function OrdersPage() {
  const [data, setData] = useState<{
    orders: OrderData[];
    totalRecordCount: { count: number }[];
  }>({ orders: [], totalRecordCount: [{ count: 1 }] });
  const [itemsData, setItemsData] = useState([]);
  const [suppliersData, setSuppliersData] = useState([]);

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

  async function fetchItemsSelect() {
    const token = getCookie("access_token");
    axios
      .get("http://localhost:3000/item/select", {
        headers: { Authorization: "Bearer " + token },
        withCredentials: true,
      })
      .then((res) => {
        setItemsData(res.data);
      });
    axios
      .get("http://localhost:3000/supplier/select", {
        headers: { Authorization: "Bearer " + token },
        withCredentials: true,
      })
      .then((res) => {
        setSuppliersData(res.data);
      });
  }

  function fetchData() {
    const token = getCookie("access_token");
    axios
      .get(
        `http://localhost:3000/order?page=${paginationModel.page + 1}&sortBy=${
          sortingModel.sortBy
        }&sortOrder=${sortingModel.sortOrder}`,
        { headers: { Authorization: "Bearer " + token }, withCredentials: true, }
      )
      .then((res) => {
        setData(res.data);
      });
  }

  useEffect(fetchData, [paginationModel, sortingModel]);
  useEffect(() => {
    fetchItemsSelect();
  }, []);

  const columns = [
    {
      field: "item",
      headerName: "Item",
      flex: 1,
      valueGetter: (val: { name: string }) => val.name,
    },
    {
      field: "supplier",
      headerName: "Supplier",
      flex: 1,
      valueGetter: (val: { name: string }) => val.name,
    },
    {
      field: "dateOrdered",
      headerName: "Order Date",
      flex: 1,
      valueGetter: (val: string) => new Date(val).toUTCString(),
    },
    {
      field: "createdAt",
      headerName: "Created At",
      flex: 1,
      valueGetter: (val: string) => new Date(val).toUTCString(),
    },
    {
      field: "quantity",
      headerName: "Quantity",
      flex: 1,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (params: GridRenderCellParams<GridValidRowModel, string>) => {
        let color: "warning" | "error" | "success";
        if (params.value === "pending") color = "warning";
        else if (params.value === "failed") color = "error";
        else color = "success";
        return (
          <Typography sx={{ mt: 1.5 }} color={color}>
            {params.value}
          </Typography>
        );
      },
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      cellClassName: "actions",
      flex: 1,
      getActions: ({ row }: { row: OrderData }) => {
        return [
          <EditOrderModal order={row} mutate={fetchData} items={itemsData} suppliers={suppliersData} />,
          <DeleteOrderModal order={row} mutate={fetchData} />,
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
          <Typography variant="h1">Orders</Typography>
          <Typography variant="h6">
            You can see orders and stuff from this page
          </Typography>
        </Box>
        <Box sx={{ mr: 10 }}>
          <CreateOrderModal mutate={fetchData} items={itemsData} suppliers={suppliersData} />
        </Box>
      </Box>
      <DataGrid
        getRowId={(i) => i._id}
        //@ts-expect-error does not accept the action column for some reason
        columns={columns}
        rows={data.orders}
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
