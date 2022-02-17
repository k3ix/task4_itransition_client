import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from "./pages/Home";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import WriteMessage from "./pages/WriteMessage";
import WriteMessageForUser from "./pages/WriteMessageForUser";
import Message from "./pages/Message";
import PageNotFound from "./pages/PageNotFound";
import LogOut from "./components/LogOut";
import NavigationMenu from "./components/NavigationMenu";
import { useState, useEffect } from 'react';
import { AuthContext } from "./helpers/AuthContext";
import axios from 'axios';

function App() {
    const [authState, setAuthState] = useState({
        username: "",
        id: 0,
        status: false
    });

    useEffect(() => {
        axios.get("http://localhost:3001/users/auth", {
            headers: {
                accessToken: localStorage.getItem("accessToken"),
            }
        }).then((response) => {
            if (response.data.error) {
                localStorage.removeItem("accessToken");
                setAuthState({...authState, status: false});
            } else {
                setAuthState({
                    username: response.data.username,
                    id: response.data.id,
                    status: true,
                });
            }
        });
    }, []);




    return (
    <div className="App">
        <AuthContext.Provider value={{authState, setAuthState}}>
            <Router>
                <div className="navBar">
                    <NavigationMenu authState={authState} />
                    {!authState.status ? (
                        <></>
                    ) : (
                        <LogOut authState={authState} setAuthState={setAuthState} />
                    )}
                </div>
                <Routes>
                    <Route path="/" element={<Home />}/>
                    <Route path="/message/:id" element={<Message />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Registration />} />
                    <Route path="/write-message" element={<WriteMessage />} />
                    <Route path="/write-one-user-message/:userId" element={<WriteMessageForUser />} />
                    <Route path="*" element={<PageNotFound />} />
                </Routes>
            </Router>
        </AuthContext.Provider>
    </div>
    );
}

export default App;
