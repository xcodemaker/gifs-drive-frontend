// third-party
import { createSlice } from '@reduxjs/toolkit';
import fileDownload from 'js-file-download';

// project imports
import axios from 'utils/axios';
import { dispatch } from '../index';

// ----------------------------------------------------------------------

const initialState = {
    error: null,
    gifUpload: {},
    gifList: []
};

const slice = createSlice({
    name: 'file',
    initialState,
    reducers: {
        // HAS ERROR
        hasError(state, action) {
            state.error = action.payload;
        },

        gifUploadSuccess(state, action) {
            state.gifUpload = action.payload;
        },

        getGifListSuccess(state, action) {
            state.gifList = action.payload;
        }
    }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function gifUpload(formData, onUploadProgress) {
    return async () => {
        try {
            const response = await axios.post(`v1/gif`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress
            });
            dispatch(slice.actions.gifUploadSuccess(response.data));
            return response;
        } catch (error) {
            dispatch(slice.actions.hasError(error));
            return error;
        }
    };
}

export function getGifFileList(id) {
    return async () => {
        try {
            const response = await axios.get(`v1/gif/${id}`);
            dispatch(slice.actions.getGifListSuccess(response?.data?.data?.fileList));
            return response?.data?.data?.fileList;
        } catch (error) {
            dispatch(slice.actions.hasError(error));
            return error;
        }
    };
}

export function downloadFile() {
    return async () => {
        try {
            const response = await axios.get(`v1/gif/download/166fe3d3-52cc-4e95-b28a-1c9a765cce6d_Visitha.gif`, {
                responseType: 'blob'
            });
            fileDownload(response.data, 'a.gif');
            // dispatch(slice.actions.getGifListSuccess(response?.data?.data?.fileList));
            // return response?.data?.data?.fileList;
        } catch (error) {
            // dispatch(slice.actions.hasError(error));
            // return error;
        }
    };
}

export function gifUpdate(data) {
    return async () => {
        try {
            const response = await axios.put(`v1/gif`, data);
            dispatch(slice.actions.gifUploadSuccess(response.data));
            return response;
        } catch (error) {
            dispatch(slice.actions.hasError(error));
            return error;
        }
    };
}
