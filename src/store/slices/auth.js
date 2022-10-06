// third-party
import { createSlice } from '@reduxjs/toolkit';

// project imports
import axios from 'utils/axios';
import { dispatch } from '../index';

// ----------------------------------------------------------------------

const initialState = {
    error: null,
    auth: {}
};

const slice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // HAS ERROR
        hasError(state, action) {
            state.error = action.payload;
        },

        // GET USERS STYLE 1
        addUserSuccess(state, action) {
            state.auth = action.payload;
        },

        reset(state, action) {
            state.auth = action.payload;
        }
    }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function addUser(name, email) {
    return async () => {
        try {
            const response = await axios.post('v1/auth/register', { name, email });
            if (response.status === 201) {
                dispatch(
                    slice.actions.addUserSuccess({
                        register: response.data
                    })
                );
            } else {
                dispatch(
                    slice.actions.addUserSuccess({
                        register: response.data
                    })
                );
            }
            return response.data;
        } catch (error) {
            dispatch(slice.actions.hasError(error));
            return error;
        }
    };
}

export function resetAuthUser() {
    dispatch(slice.actions.reset({}));
}
