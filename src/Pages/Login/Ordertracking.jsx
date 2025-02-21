import React, { useState } from "react";
import {
  Box,
  TextField,
  Typography,
  InputAdornment,
  Dialog,
  IconButton,
  Stack,
  useMediaQuery,
  Chip,
} from "@mui/material";
import SweetAlert from "react-bootstrap-sweetalert"
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import images from "../../assets/map2.jpeg";
import Loader from "./Loder";
import { DataGrid } from "@mui/x-data-grid";
import axios from "../../axios";

function Ordertracking() {
  const isMobile = useMediaQuery("(max-width:600px)");
   const [updatemessage, setUpdatemessage] = useState(false)
  const [openLoader, setOpenLoader] = useState(false);
const [searchvalue, setSearchvalue] = useState("")
const [rows, setRows] = useState([]);
  const StatusChip = ({ status }) => {
    let color = "default";
    if (status === "Shipped") color = "primary";
    else if (status === "In Transit") color = "warning";
    else if (status === "Delivered") color = "success";

    return <Chip label={status} color={color} size="small" />;
  };

 
  
  const getallorder = async () => {
    setOpenLoader(true);
    setRows([]);
   
  
    setTimeout(async () => {
      try {
        const res = await axios.instance.get(`Getordersearch?search=${searchvalue}`);
        const formattedRows = res.data.map((user) => ({
          id: user._id,
          product: user.product,
          quantity: user.quantity,
          status: user.status,
        }));
  
        if (formattedRows.length === 0) {
          setUpdatemessage(true);
        }
  
        setRows(formattedRows);
        setSearchvalue('')
      } catch (error) {
        console.error("Error fetching users:", error);
        setUpdatemessage(true);
      } finally {
        setOpenLoader(false); 
      }
    }, 2000); 
  };
  

      const columns = [
        { field: "product", headerName: "Product", flex: 1, minWidth: 150 },
        { field: "quantity", headerName: "Qty", flex: 0.5, minWidth: 150 },
        { 
          field: "status", 
          headerName: "Status", 
          flex: 0.5, 
          minWidth: 80,
          renderCell: (params) => (
            <Chip 
              label={params.value} 
              sx={{ 
                backgroundColor: 
                  params.value === "Pending" ? "#FFA726" : 
                  params.value === "In Progress" ? "#42A5F5" : 
                  params.value === "Completed" ? "#66BB6A" : "#BDBDBD",
                color: "white",
                fontWeight: "bold"
              }} 
            />
          ) 
        },     
        
      ];

 

  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: `url(${images})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        flexDirection: "column",
      }}
    >
   
      <Box
        sx={{
          width: "90%",
          maxWidth: 400,
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          padding: isMobile ? 2 : 4,
          borderRadius: 3,
          textAlign: "center",
          mb: 2, 
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", color: "#536493", mb: 2 }}
        >
          Track Your Order Status
        </Typography>

     
        <TextField
          fullWidth
          variant="outlined"
          autoComplete="off"
          value={searchvalue}
          onChange={(e)=>setSearchvalue(e.target.value)}
          placeholder="Enter your tracking number"
          sx={{
            backgroundColor: "#fff",
            borderRadius: 2,
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={getallorder} color="primary">
                  <ArrowRightIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {rows.length > 0 && (
  <Box
    sx={{
      width: "90%",
      maxWidth: isMobile ? 360 : 700,
      height: 250,
      backgroundColor: "white",
      borderRadius: 3,
      padding: 2,
      boxShadow: 2,
      overflowX: "auto", 
    }}
  >
    <DataGrid
      rows={rows}
      columns={columns}
      pageSize={3}
      disableSelectionOnClick
      autoHeight
      sx={{
        "& .MuiDataGrid-columnHeaders": {
          backgroundColor: "#f0f0f0",
        },
        "& .MuiDataGrid-root": {
          border: "none",
        },
      }}
    />
  </Box>
)}

{updatemessage ? (
        <SweetAlert
          title="No Product Found"
          timeout={2000}
          style={{
            position: "absolute",
            justifyContent: "center",
            alignItems: "center",
          }}
          showCloseButton={false}
          showConfirm={false}
          warning
          onConfirm={() => {
            setUpdatemessage(false)
          }}
         
        ></SweetAlert>
      ) : null}
      <Dialog
        open={openLoader}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: "transparent",
            boxShadow: "none",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          },
        }}
      >
        <Stack
          sx={{
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            backgroundColor: "#ffffff00",
          }}
        >
          <Loader />
        </Stack>
      </Dialog>
    </Box>
  );
}

export default Ordertracking;
