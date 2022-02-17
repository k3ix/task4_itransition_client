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
    }, [history]);
    console.log(authState);
    const initialValues = {
        topic: "",
        username: "",
    }

    const validationSchema = Yup.object().shape({
        topic: Yup.string().required(),
        username: Yup.string().required()
    })

    const onSubmit = async (data) => {
        data.text = freeText;
        data.fromUserId = authState.id;
        data.fromUsername = authState.username;
        let userForApi = {
            username: ""
        };
        const usernames = data.username.split(",")
        usernames.map((value) => {
            userForApi.username = value.trim();
            console.log(userForApi)
            axios.post("https://task4-itransition-mail.herokuapp.com/users/userByUsername", userForApi).then( async (response) => {
                if (!response.data.error) {
                    data.forUsername = response.data.username;
                    data.forUserId = response.data.id;
                    axios.post("https://task4-itransition-mail.herokuapp.com/messages/write-message", data)
                        .then( async (response) => {
                            if (response.data.error) {
                                alert(response.data.error);
                            } else {
                                data.id = response.data.id
                                console.log(data);
                            }
                        });
                    console.log(data)
                    setTimeout(async () => {
                        await socket.emit("sendMessage", data)
                    }, 1000)

                    history("/");
                } else {
                    alert(response.data.error);
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