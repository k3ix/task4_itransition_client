import React from 'react';
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";


const NavigationMenu = ( authState ) => {
    let history = useNavigate();

    const homeClick = () => {
        history('/');

    };

    const loginClick = () => {
        history("/login");
    };

    const registerClick = () => {
        history("/register");
    }

    const writemessageClick = () => {
        history("/write-message")
    }

    return (
        <div>
            <Button variant="text" className="navbtn" onClick={registerClick}>Registration</Button>
            {!authState.authState.status ? (
                <>
                    <Button variant="text" className="navbtn" onClick={loginClick}>Log In</Button>
                </>
            ) : (
                <>
                    <Button variant="text" className="navbtn" onClick={homeClick}>Main Page</Button>
                    <Button variant="text" className="navbtn" onClick={writemessageClick}>Write Message</Button>
                </>
            )
            }
        </div>
    );
};

export default NavigationMenu;