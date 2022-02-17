import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { Typography } from "@mui/material";
import ReactMarkdown from 'react-markdown'

const Message = () => {
    let history = useNavigate();
    const { id } = useParams();
    const [message, setMessage] = useState();

    useEffect(() => {
        axios.get(`https://task4-itransition-mail.herokuapp.com/messages/byId/${id}`).then((response) => {
            if (response.data.error) history("*");
            setMessage(response.data);
        });
    }, [id, history]);

    console.log(message);

    if (!message) {
        return(<></>)
    } else {
        return (
            <div className="messageContainer">
                <Typography className="msg-item msg-from" variant="h4">
                    From: {message.fromUsername}
                </Typography>
                <Typography className="msg-item msg-topic" variant="subtitle1">
                    Topic: {message.topic}
                </Typography>
                <Typography className="msg-item msg-text" variant="body2">
                    <ReactMarkdown>{message.text}</ReactMarkdown>
                </Typography>
            </div>
        );
    }
};

export default Message;