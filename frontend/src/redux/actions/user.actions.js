import axios from 'axios'
import {
    LOGIN_USER_REQUEST,
    LOGIN_USER_SUCCESS,
    LOGIN_USER_FAIL,
    CLEAR_ERRORS,
    REGISTER_USER_FAIL,
    REGISTER_USER_REQUEST,
    REGISTER_USER_SUCCESS,
    LOAD_USER_REQUEST,
    LOAD_USER_SUCCESS,
    LOAD_USER_FAIL,
    LOGOUT_USER_SUCCESS,
    LOGOUT_USER_FAIL
} from '../constants/user.constants'



export const login = (email, password) => async (dispatch) => {
    try {

        dispatch({ type: LOGIN_USER_REQUEST })

        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true
        }

        const { data } = await axios.post(`http://localhost:4000/api/v1/login`, {
            email, password
        }, config);


        dispatch({
            type: LOGIN_USER_SUCCESS,
            payload: data.user

        })

    } catch (error) {
        dispatch({
            type: LOGIN_USER_FAIL,
            payload: error.response.data.message
        })
    }
}

export const register = (userData) => async (dispatch) => {
    try {

        dispatch({ type: REGISTER_USER_REQUEST })

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            withCredentials: true
        }

        const { data } = await axios.post(`http://localhost:4000/api/v1/register`, userData, config)

        dispatch({
            type: REGISTER_USER_SUCCESS,
            payload: data.user
        })

    } catch (error) {
        dispatch({
            type: REGISTER_USER_FAIL,
            payload: error.response.data.message
        })
    }
}

// Load user
export const loadUser = () => async (dispatch) => {
    try {

        dispatch({ type: LOAD_USER_REQUEST })

        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true
        }

        const { data } = await axios.get(`http://localhost:4000/api/v1/me`, config)
        dispatch({
            type: LOAD_USER_SUCCESS,
            payload: data.user

        })

    } catch (error) {
        dispatch({
            type: LOAD_USER_FAIL,
            payload: error.response.data.message
        })
    }
}

// Load user
export const logout = () => async (dispatch) => {
    try {

        await axios.get(`http://localhost:4000/api/v1/logout`, { withCredentials: true })

        dispatch({ type: LOGOUT_USER_SUCCESS })

    } catch (error) {
        dispatch({
            type: LOGOUT_USER_FAIL,
            payload: error.response.data.message
        })
    }
}


export const clearErros = () => async (dispatch) => {
    dispatch({ type: CLEAR_ERRORS })
}
