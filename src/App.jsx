import React, {useEffect, useState} from 'react';
import './App.css';
import BoxComponent from "./Components/BoxComponent";
import {useDispatch, useSelector} from "react-redux";
import {selectLoginState, setLoginState, setUserInitialState} from "./features/login/loginSlice";
import { UserLocalStorageData } from "./Constants/Constants";
import {useNavigate} from "react-router-dom";


function App() {
  const loginState = useSelector(selectLoginState);
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');

    console.log(loginState);

    const nav = useNavigate()

    useEffect(() => {
        let data = localStorage.getItem(UserLocalStorageData)
            if (!data) {
                nav("/login")
            }
            else {
                data = JSON.parse(data)
                dispatch(setUserInitialState(data))
            }
    },[])

    const loginNow = () => {
        dispatch(setLoginState({status: true, username: username}))
        nav("/")
    }

    return (
        <>
            {loginState.status ? (
                <BoxComponent value={4}/>
            ) : (
                <>
                    <input value={username} onChange={(e) => setUsername(e.target.value)}/>
                    <button onClick={() => loginNow()}>Login</button>
                </>
            )}
        </>

    );
}

export default App;
