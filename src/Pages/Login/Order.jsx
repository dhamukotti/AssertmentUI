import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Chip } from "@mui/material";
import {
  Box,
  Modal,
  useMediaQuery,
  useTheme,
  Typography,
  TextField,
  MenuItem,
  IconButton,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import axios from "../../axios";
import SweetAlert from "react-bootstrap-sweetalert"
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};
function Order() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const colors = tokens(theme.palette.mode);
  
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [rows, setRows] = useState([]);
  const [successmessage, setSuccessmessage] = useState(false)
  const [updatemessage, setUpdatemessage] = useState(false)
  const [deletemessage, setDeletemessage] = useState(false)
  const [deleteid, setDeleteid] = useState("")
    const [formData, setFormData] = useState({
        product:"",
        quantity:"",
        status:"",
        priority:"",
        createdBy:""
    });
  
    const [errors, setErrors] = useState({});
    const [show, setShow] = useState(false);
  
    const handleClose1 = () => setShow(false);
   
  
    useEffect(() => {
      getallorder();
    }, []);
  
    const validate = () => {
        let tempErrors = {};
      
        if (!formData.product.trim()) {
          tempErrors.product = "Product is required.";
        } else if (formData.product.length < 3) {
          tempErrors.product = "Product must be at least 3 characters.";
        }
      
        if (!formData.quantity) {
          tempErrors.quantity = "Quantity is required.";
        } else if (isNaN(formData.quantity) || formData.quantity <= 0) {
          tempErrors.quantity = "Enter a valid quantity.";
        }
      
        if (!formData.status) {
          tempErrors.status = "Please select a status.";
        } else if (!["Pending", "In Progress", "Completed"].includes(formData.status)) {
          tempErrors.status = "Invalid status selected.";
        }
      
        if (!formData.priority) {
          tempErrors.priority = "Please select a priority.";
        } else if (!["Low", "Medium", "High"].includes(formData.priority)) {
          tempErrors.priority = "Invalid priority selected.";
        }
      
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
      };
      
  
    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value,  createdBy: JSON.parse(sessionStorage.getItem("user"))?.id || null  },);
    };
  
    const getallorder = async () => {
      try {
        const res = await axios.instance.get("/orders");
        const formattedRows = res.data.map((user, index) => ({
          id: user._id,
          product: user.product,
          quantity: user.quantity,
          status: user.status,
        }));
        setRows(formattedRows);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
  
    const handleOpen = () => {
      setEditMode(false);
      setFormData({  product:"",
        quantity:"",
        status:"",
        priority:"",});
      setOpen(true);
    };
  
    const handleEdit = (order) => {
      console.log(order,'user')
      setEditMode(true);
      setSelectedUserId(order.id);
      setFormData({
        product: order.product || "", 
        quantity: order.quantity || "", 
        status: order.status || "Pending", 
        priority: order.priority || "Medium",
      });
            setOpen(true);
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!validate()) return;
  
      try {
        if (editMode) {
       
          await axios.instance.put(`/updateorder/${selectedUserId}`, {
            product: formData.product,
            quantity: formData.quantity,
            status: formData.status,
            priority:formData.priority,
         
          });
        } else {
          await axios.instance.post("/createorder", formData, {
            headers: { "Content-Type": "application/json" },
          });
        }
        
        getallorder();
        handleClose();
        setUpdatemessage(true)
      } catch (error) {
        console.error("Error:", error);
      }
    };
  
    const handleClose = () => {
      setOpen(false);
      setFormData({ name: "", email: "", password: "", role: "" });
      setSelectedUserId(null);
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
      },      {
        field: "actions",
        headerName: "Actions",
        flex: 0.5,
        minWidth: 100,
        sortable: false,
        renderCell: (params) => (
          
          <>
            <IconButton onClick={() => handleEdit(params.row)}>
              <EditIcon color="secondary" />
            </IconButton>
            <IconButton onClick={() => handleDelete(params.row.id)}>
              <DeleteIcon color="error" />
            </IconButton>
          </>
        ),
      },
    ];
  
    const handleDelete = async (id) => {
      console.log(id,'deleteid')
      setDeleteid(id)
    setShow(true)
    };
  
  
    const DeleteBank = async () => {
      const delte = await axios.instance
        .delete(`/deleteorder/${deleteid}`, {
          headers: {
           
            "Content-Type": "application/json",
          },
        })
        .then(res => {
            getallorder()
          setShow(false)
         setDeletemessage(true)
            
          
        })
    }
  return (
<Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Header title="Orders" subtitle="Order Management" />
        <Button
          sx={{
            backgroundColor: colors.blueAccent[700],
            color: "white",
            fontSize: "14px",
            fontWeight: "bold",
            padding: "10px 20px",
            "&:hover": { backgroundColor: colors.blueAccent[700] },
          }}
          onClick={handleOpen}
          startIcon={<AddIcon />}
        >
          Add User
        </Button>
      </Box>

      <Box
        sx={{
          height: 400,
          width: "100%",
          overflowX: isMobile ? "auto" : "hidden",
          "& .MuiDataGrid-root": { fontSize: isMobile ? "12px" : "14px" },
        }}
      >
        {/* <DataGrid  rows={rows} columns={columns} pageSizeOptions={[5, 10]} disableRowSelectionOnClick autoHeight /> */}
    
        <DataGrid
  rows={rows}
  columns={columns}
  pageSizeOptions={[5]}
  pageSize={5}
  pagination
  disableSelectionOnClick
  autoHeight
/>
      </Box>

      <Modal open={open} onClose={handleClose} aria-labelledby="modal-title">
  <Box sx={style}>
    <Typography id="modal-title" variant="h6" component="h2" gutterBottom>
      {editMode ? "Edit Order" : "New Order"}
    </Typography>
    <form onSubmit={handleSubmit} noValidate>
      <TextField 
        fullWidth 
        label="Product Name"
        name="product"
        value={formData.product}
        onChange={handleChange}
        margin="normal"
        required 
        autoComplete="off"
        error={!!errors.product} 
        helperText={errors.product} 
      />
      <TextField 
        fullWidth 
        label="Quantity"
        name="quantity"
        type="number"
        value={formData.quantity}
        onChange={handleChange}
        margin="normal"
        required
        autoComplete="off"
        error={!!errors.quantity} 
        helperText={errors.quantity} 
      />
      <TextField 
        select 
        fullWidth 
        label="Status"
        name="status"
        value={formData.status}
        onChange={handleChange} 
        margin="normal" 
        required
        error={!!errors.status} 
        helperText={errors.status}
      >
        <MenuItem value="Pending">Pending</MenuItem>
        <MenuItem value="In Progress">In Progress</MenuItem>
        <MenuItem value="Completed">Completed</MenuItem>
      </TextField>
      <TextField 
        select 
        fullWidth 
        label="Priority"
        name="priority"
        value={formData.priority}
        onChange={handleChange} 
        margin="normal" 
        required
        error={!!errors.priority} 
        helperText={errors.priority}
      >
        <MenuItem value="Low">Low</MenuItem>
        <MenuItem value="Medium">Medium</MenuItem>
        <MenuItem value="High">High</MenuItem>
      </TextField>
      <Box display="flex" justifyContent="space-between" mt={2}>
        <Button onClick={handleClose} variant="outlined">Cancel</Button>
        <Button type="submit" variant="contained" color="primary">{editMode ? "Update Order" : "Submit Order"}</Button>
      </Box>
    </form>
  </Box>
</Modal>

      {successmessage ? (
        <SweetAlert
          title="Order Added Successfullly"
          timeout={2000}
          style={{
            position: "absolute",
            justifyContent: "center",
            alignItems: "center",
          }}
          showCloseButton={false}
          showConfirm={false}
          success
          onConfirm={() => {
            setSuccessmessage(false)
          }}
         
        ></SweetAlert>
      ) : null}


{deletemessage ? (
        <SweetAlert
          title="Order Deleted Successfullly"
          timeout={2000}
          style={{
            position: "absolute",
            justifyContent: "center",
            alignItems: "center",
          }}
          showCloseButton={false}
          showConfirm={false}
          success
          onConfirm={() => {
            setDeletemessage(false)
          }}
         
        ></SweetAlert>
      ) : null}
      {updatemessage ? (
        <SweetAlert
          title="Order Updated Successfullly"
          timeout={2000}
          style={{
            position: "absolute",
            justifyContent: "center",
            alignItems: "center",
          }}
          showCloseButton={false}
          showConfirm={false}
          success
          onConfirm={() => {
            setUpdatemessage(false)
          }}
         
        ></SweetAlert>
      ) : null}
  <Modal open={show} onClose={handleClose} aria-labelledby="modal-title" centered>
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
          textAlign: "center",
          borderRadius: 2,
        }}
      >
        <WarningAmberIcon sx={{ fontSize: 100, color: "orange" }} />
        <Typography variant="h5" id="modal-title" gutterBottom>
          Are you sure?
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          You won&apos;t be able to revert this!
        </Typography>
        <Box mt={3} display="flex" justifyContent="center" gap={2}>
          <Button variant="contained" color="primary" onClick={DeleteBank}>
            Yes, delete it!
          </Button>
          <Button variant="contained" color="error" onClick={handleClose1}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
    </Box>
  )
}

export default Order