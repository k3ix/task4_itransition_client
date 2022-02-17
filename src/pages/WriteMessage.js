import React, { useContext, useEffect, useState } from 'react';
import * as Yup from 'yup';
import ReactMde from 'react-mde';
import * as Showdown from 'showdown';
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { AuthContext } from "../helpers/AuthContext";
import axios from 'axios';
import io from 'socket.io-client';

import "react-mde/lib/styles/css/react-mde-all.css";
let socket;

const converter = new Showdown.Converter({
    tables: true,
    simplifiedAutoLink: true,
    strikethrough: true,
    tasklists: true
});

const WriteMessage = () => {
    const { authState } = useContext(AuthContext);
    const [freeText, setFreeText] = useState("Write your message");
    const [selectedTab, setSelectedTab] = useState("write");
    let history = useNavigate();

    useEffect(() => {
        socket = io("https://task4-itransition-mail.herokuapp.com")
    }, []);

    useEffect(() => {
        axios.get("https://task4-itransition-mail.herokuapp.com/users/auth", {
            headers: {
                accessToken: localStorage.getItem("accessToken"),
            }
        }).then((response) => {
            if (response.data.error) {
                localStorage.removeItem("accessToken");
                history("/login");
            }
        })
    }, []);
    const initialValues = {
        topic: "",
        username: "",
    }

    const validationSchema = Yup.object().shape({
        topic: Yup.string().required(),
        username: Yup.string().required()
    })

    const onSubmit = (data) => {
        data.text = freeText;
        data.fromUserId = authState.id;
        data.fromUsername = authState.username;
        let userForApi = {
            username: ""
        };
        const usernames = data.username.split(",")
        usernames.forEach(async (value) => {
            const dataForApi = Object.assign({},data);
            userForApi.username = value.trim();
            await axios.post("https://task4-itransition-mail.herokuapp.com/users/userByUsername", userForApi)
                .then(async (response) => {
                if (!response.data.error) {
                    dataForApi.forUsername = response.data.username;
                    dataForApi.forUserId = response.data.id;
                    await axios.post("https://task4-itransition-mail.herokuapp.com/messages/write-message", dataForApi)
                        .then((response) => {
                            if (response.data.error) {
                                alert(response.data.error);
                            } else {
                                dataForApi.id = response.data.id;

                                socket.emit("sendMessage", dataForApi);
                            }
                        });
                    history("/");
                }
            });
        })
    }

    return (
        <div className="writeMessage">
            <Formik initialValues={initialValues}
                    onSubmit={onSubmit}
                    validationSchema={validationSchema}>
                <Form>
                    <ErrorMessage name="nameOrEmail" component="span"/>
                    <Field
                        autoComplete="off"
                        id="writeMessageFormField"
                        name="username"
                        placeholder="Enter username to send" />
                    <ErrorMessage name="password" component="span"/>
                    <Field
                        autoComplete="off"
                        id="writeMessageFormField"
                        name="topic"
                        placeholder="Enter a topic for your message"/>
                    <ReactMde
                        value={freeText}
                        onChange={setFreeText}
                        selectedTab={selectedTab}
                        onTabChange={setSelectedTab}
                        generateMarkdownPreview={markdown =>
                            Promise.resolve(converter.makeHtml(markdown))
                        }
                        childProps={{
                            writeButton: {
                                tabIndex: -1
                            }
                        }}
                    />
                    <button type="submit" className="submitbtn">Send message</button>
                </Form>
            </Formik>
        </div>
    );
};

export default WriteMessage;