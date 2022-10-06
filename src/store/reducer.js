// third-party
import { combineReducers } from 'redux';

// project imports
import snackbarReducer from './slices/snackbar';
import authReducer from './slices/auth';
import gifReducer from './slices/gif';

// ==============================|| COMBINE REDUCER ||============================== //

const reducer = combineReducers({
    snackbar: snackbarReducer,
    user: authReducer,
    file: gifReducer
});

export default reducer;
