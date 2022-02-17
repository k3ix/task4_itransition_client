import React from 'react';
import {Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const Login = () => {
    let history = useNavigate();

    const initialValues = {
        nameOrEmail: "",
        password: "",
    };

    const validationSchema = Yup.object().shape({
        nameOrEmail: Yup.string().required("Username or E-Mail are required."),
        password: Yup.string().required("Password is required."),
    });

    const onSubmit = (data) => {
        axios.post("https://task4-itransition-mail.herokuapp.com/users/login", data).then((response) => {
            if (response.data.error) {
                alert(response.data.error)
            } else {
                localStorage.setItem("accessToken", response.data);
                history("/");
                history(0);
            }
        });
    };





    return (
        <div className="loginPage">
            <Formik
                initialValues={initialValues}
                onSubmit={onSubmit}
                validationSchema={validationSchema}>
                <Form className="loginForm">
                    <ErrorMessage name="nameOrEmail" component="span"/>
                    <Field
                        autoComplete="off"
                        id="loginFormField"
                        name="nameOrEmail"
                        placeholder="Enter username or e-mail" />
                    <ErrorMessage name="password" component="span"/>
                    <Field
                        autoComplete="off"
                        type="password"
                        id="loginFormField"
                        name="password"
                        placeholder="Password"/>
                    <button type="submit" className="submitbtn">Log In</button>
                </Form>
            </Formik>
        </div>
    );
};

export default Login;