import { Box, Typography } from "@mui/material";
import { DataGrid, GridSortModel } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import axios from "axios";
import CreateItemModal from "../Components/pageComponents/Items/CreateItemModal";
import EditItemModal from "../Components/pageComponents/Items/EditItemModal";
import DeleteItemModal from "../Components/pageComponents/Items/DeleteItemModal";
import { ItemData } from "../interfaces";

export default function ItemsPage() {
  const [data, setData] = useState<{
    items: ItemData[];
    totalRecordCount: { count: number }[];
  }>({ items: [], totalRecordCount: [{ count: 1 }] });
  const [categoriesData, setCategoriesData] = useState([]);
  const [suppliersData, setSuppliersData] = useState([]);

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const [sortingModel, setSortingModel] = useState({
    sortBy: "createdAt",
    sortItem: "asc",
  });

  function handleSortModelChange(sortModel: GridSortModel) {
    if (!sortModel[0]) {
      setSortingModel({
        sortBy: "createdAt",
        sortItem: "asc",
      });
      return;
    }
    setSortingModel({
      sortBy: sortModel[0].field,
      sortItem: sortModel[0].sort as string,
    });
  }

  async function fetchItemsSelect() {
    axios
      .get("https://react-nest-inventory-management-production.up.railway.app/category/select", {
        withCredentials: true,
      })
      .then((res) => {
        setCategoriesData(res.data);
      });

    axios
      .get("https://react-nest-inventory-management-production.up.railway.app/supplier/select", {
        withCredentials: true,
      })
      .then((res) => {
        setSuppliersData(res.data);
      });
  }

  function fetchData() {
    axios
      .get(
        `https://react-nest-inventory-management-production.up.railway.app/item?page=${
          paginationModel.page + 1
        }&sortBy=${sortingModel.sortBy}&sortItem=${sortingModel.sortItem}`,
        { withCredentials: true }
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
      field: "name",
      headerName: "Name",
      flex: 1,
    },
    {
      field: "category",
      headerName: "Category",
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
      field: "price",
      headerName: "Price",
      flex: 1,
    },
    {
      field: "quantity",
      headerName: "Quantity",
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
      getActions: ({ row }: { row: ItemData }) => {
        return [
          <EditItemModal
            item={row}
            mutate={fetchData}
            categories={categoriesData}
            suppliers={suppliersData}
          />,
          <DeleteItemModal item={row} mutate={fetchData} />,
        ];
      },
    },
  ];
  return (
    <Box display="flex" sx={{ ml: 2, flexDirection: "column", width: "100%" }}>
      <Box display="flex" sx={{ justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
        <Box>
          <Typography variant="h1">Items</Typography>
          <Typography variant="h6">You can see items and stuff from this page</Typography>
        </Box>
        <Box sx={{ mr: 10 }}>
          <CreateItemModal mutate={fetchData} categories={categoriesData} suppliers={suppliersData} />
        </Box>
      </Box>
      <DataGrid
        getRowId={(i) => i._id}
        //@ts-expect-error does not accept the action column for some reason
        columns={columns}
        rows={data.items}
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
