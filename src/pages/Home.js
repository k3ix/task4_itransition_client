import React from 'react';
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import io from 'socket.io-client';
import { AuthContext } from "../helpers/AuthContext";
import { List, ListItem, ListItemText } from '@mui/material'

let socket;

const Home = () => {
    const { authState, setAuthState } = useContext(AuthContext);
    const id = authState.id;
    const [listOfMessages, setListOfMessages] = useState([]);
    const [listOfUsers, setListOfUsers] = useState([]);
    let history = useNavigate();

    useEffect(() => {
        socket = io("https://task4-itransition-mail.herokuapp.com");

        socket.on("emitSendMessage", (data) => {
            if (data.forUserId === id) {
                data.createdAt = new Date();
                setListOfMessages(prevState => [data, ...prevState]);
            }
        });
    }, [id, setListOfMessages]);


    useEffect(() => {
        axios.get("https://task4-itransition-mail.herokuapp.com/users/auth",
            { headers: { accessToken: localStorage.getItem("accessToken") } })
            .then((response) => {
                if (response.data.error) {
                    localStorage.removeItem("accessToken");
                    setAuthState({...authState, status: false});
                    history("/login");
                } else {
                    setAuthState({
                        username: response.data.username,
                        id: response.data.id,
                        status: true,
                    });
                }
            });

        axios.get(`https://task4-itransition-mail.herokuapp.com/messages/${id}`).then((response) => {
            setListOfMessages(response.data.reverse());
        });

        axios.get("https://task4-itransition-mail.herokuapp.com/users").then((response) => {
            setListOfUsers(response.data);
        })
    }, [setAuthState, id, history]);






    return(
        <div className="main-page-container">
            <div className="messagesList-container">
                {(listOfMessages.length === 0) ? (
                    <h3>No messages for you</h3>
                ) : (
                    <>
                        <h3>Your incoming messages:</h3>
                        <List className="messagesList">
                            {listOfMessages.map((value, key) => {
                                return(
                                    <ListItem className="messageItem" key={key}
                                              disableGutters
                                              onClick={() => {history(`/message/${value.id}`)}}>
                                        <ListItemText primary={value.fromUsername} />
                                        <ListItemText className="messageTopic" primary={value.topic} />
                                        <ListItemText className="messageDate" primary={new Date(value.createdAt).toLocaleString()} />
                                    </ListItem>
                                )
                            })}
                        </List>
                    </>
                )}
            </div>
            <div className="usersList-container">
                <h3>Write message to user:</h3>
                <List className="usersList">
                    {listOfUsers.map((value, key) => {
                        return (
                            <ListItem className="userItem"
                                      key={key}
                                      onClick={() => {history(`/write-one-user-message/${value.id}`)}}>
                                <ListItemText primary={value.username} />
                            </ListItem>
                        )
                    })}
                </List>
            </div>
        </div>
    )
};

export default Home;