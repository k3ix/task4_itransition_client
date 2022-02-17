import React, {useContext, useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import * as Yup from 'yup';
import ReactMde from 'react-mde';
import * as Showdown from 'showdown';
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

const WriteMessageForUser = () => {
    const { authState } = useContext(AuthContext);
    const [freeText, setFreeText] = useState("Write your message");
    const [selectedTab, setSelectedTab] = useState("write");
    const [forUser, setForUser] = useState();
    let history = useNavigate();
    const { userId } = useParams();

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
        });

        axios.get(`https://task4-itransition-mail.herokuapp.com/users/byId/${userId}`).then((response) => {
            setForUser(response.data);
        });
    }, [history]);

    const initialValues = {
        topic: "",
    }

    const validationSchema = Yup.object().shape({
        topic: Yup.string().required(),
    })

    const onSubmit = (data) => {
        console.log(data);
        data.fromUserId = authState.id;
        data.fromUsername = authState.username;
        data.text = freeText;
        data.forUsername = forUser.username;
        data.forUserId = forUser.id;
        console.log(data);
        axios.post("https://task4-itransition-mail.herokuapp.com/messages/write-message", data)
            .then( async (response) => {
                if (response.data.error) {
                    alert(response.data.error);
                } else {
                    data.id = response.data.id;
                    console.log('send');
                    await socket.emit("sendMessage", data);
                    history("/");
                }
            });
    }



    return (
        <div className="writeMessage">
            <Formik initialValues={initialValues}
                    onSubmit={onSubmit}
                    validationSchema={validationSchema}>
                <Form>
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

export default WriteMessageForUser;