import { createSlice } from '@reduxjs/toolkit';
import { UserLocalStorageData } from "../../Constants/Constants";
export const loginSlice = createSlice({
    name: 'login',
    initialState: {
        status: false,
        username: '',
    },
    reducers: {
        setLoginState: (state,action) => {
            console.log(action.payload)
            state.status = action.payload.status;
            state.username = action.payload.username;
            localStorage.setItem(UserLocalStorageData, JSON.stringify(action.payload))
        },
        setUserInitialState: (state, action) => {
            state.status = action.payload.status;
            state.username = action.payload.username;
        }
    },
});

export const { setLoginState,setUserInitialState } = loginSlice.actions;

export const selectLoginState = (state) => state.login;

export default loginSlice.reducer;
