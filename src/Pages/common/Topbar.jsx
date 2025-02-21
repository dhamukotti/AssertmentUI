import { Box, IconButton, useTheme } from "@mui/material";
import { useContext } from "react";
import { ColorModeContext, tokens } from "../../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";

import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import profile from '../../assets/jj.jpg'
import { useNavigate } from 'react-router-dom';

const Topbar = () => {
  const navigate = useNavigate();

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

const logout = ()=>{
  navigate('/login')
  sessionStorage.setItem('isAuthProtected',false)
}

  return (
    <Box display="flex" justifyContent="space-between" p={2}>
    
      <Box
        display="flex"
        backgroundColor={colors.primary[400]}
        borderRadius="3px"
      >
     
      </Box>

    
      <Box display="flex">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
        <IconButton onClick={logout}>
          <NotificationsOutlinedIcon />
        </IconButton>
        
       
         <Stack direction="row" spacing={2}>
      <Avatar alt="Remy Sharp" src={profile}
        sx={{ width: 30, height: 30 }}
      />
    </Stack>
      </Box>
    </Box>
  );
};

export default Topbar;
