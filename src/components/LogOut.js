import React from 'react';
import { useNavigate } from "react-router-dom";
import {Button, Chip} from "@mui/material";
import { IconButton } from "@mui/material";
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';


const LogOut = ( authState, setAuthState ) => {
    let history = useNavigate();

    const logOut = () => {
        localStorage.removeItem("accessToken");
        setAuthState(false);
        history('/login');
    }
    return (
        <div style={{float: "right"}}>
            <IconButton label={authState.authState.username} style={{color: "white", float: "left"}}>
                <PersonOutlineIcon style={{ color: "white" }}/>
                <Chip label={authState.authState.username} style={{color: "white", backgroundColor: "#000"}}/>
            </IconButton>
            <Button variant="text" className="navbtn logoutbtn" onClick={logOut} className="logoutbtn">Log Out</Button>
        </div>
    );
};

export default LogOut;