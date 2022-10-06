/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect } from 'react';
import { useDispatch } from 'store';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, FormControl, FormHelperText, Grid, Typography } from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import useAuth from 'hooks/useAuth';
import useScriptRef from 'hooks/useScriptRef';
import { strengthColor, strengthIndicatorNumFunc } from 'utils/password-strength';
import { openSnackbar } from 'store/slices/snackbar';
import { addUser, resetAuthUser } from 'store/slices/auth';
import { connect } from 'react-redux';
import _ from 'lodash';

// ===========================|| FIREBASE - REGISTER ||=========================== //

const AWSCognitoRegister = ({ auth, ...others }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const scriptedRef = useScriptRef();
    const dispatch = useDispatch();
    const { isLoggedIn } = useAuth();

    const [strength, setStrength] = React.useState(0);
    const [level, setLevel] = React.useState();
    const { register } = useAuth();

    const changePassword = (value) => {
        const temp = strengthIndicatorNumFunc(value);
        setStrength(temp);
        setLevel(strengthColor(temp));
    };

    useEffect(() => {
        changePassword('123456');
    }, []);

    return (
        <div className="container my-8 mx-auto flex justify-center">
            <div className="w-full xl:w-1/2 py-4 px-8 border-2 border-slate-200 rounded-md">
                <h1 className="text-xl font-medium text-center">Create A New Account</h1>
                <Formik
                    initialValues={{
                        email: '',
                        password: '',
                        name: '',
                        submit: null
                    }}
                    validationSchema={Yup.object().shape({
                        email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
                        password: Yup.string().max(255).required('Password is required')
                    })}
                    onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                        try {
                            if (!_.isEmpty(auth)) {
                                dispatch(resetAuthUser());
                            }
                            dispatch(addUser(values.name, values.email)).then(async (response) => {
                                if (response && response.userId) {
                                    await register(values.email, values.password, values.name, response.userId);
                                    if (scriptedRef.current) {
                                        setStatus({ success: true });
                                        setSubmitting(false);
                                        dispatch(
                                            openSnackbar({
                                                open: true,
                                                message: 'Your registration has been successfully completed.',
                                                variant: 'alert',
                                                alert: {
                                                    color: 'success'
                                                },
                                                close: false
                                            })
                                        );

                                        setTimeout(() => {
                                            navigate('/login', { replace: true });
                                        }, 1500);
                                    }
                                } else {
                                    setStatus({ success: false });
                                    setSubmitting(false);
                                    dispatch(
                                        openSnackbar({
                                            open: true,
                                            message: 'Something went wrong please try again',
                                            variant: 'alert',
                                            alert: {
                                                color: 'danger'
                                            },
                                            close: false
                                        })
                                    );
                                }
                            });
                        } catch (err) {
                            console.error(err);
                            if (scriptedRef.current) {
                                setStatus({ success: false });
                                setErrors({ submit: err.message });
                                setSubmitting(false);
                            }
                        }
                    }}
                >
                    {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                        <form className="mt-4 flex flex-col gap-4" noValidate onSubmit={handleSubmit} {...others}>
                            <div className="flex flex-col gap-1">
                                <label htmlFor="name" className="text-lg font-medium">
                                    Enter Name
                                </label>
                                <input
                                    id="name"
                                    className="w-full outline-none border-slate-100 border p-2 rounded-md focus:border-slate-800 focus:border-2"
                                    placeholder="John Doe"
                                    name="name"
                                    type="text"
                                    value={values.name}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <FormControl
                                    fullWidth
                                    error={Boolean(touched.email && errors.email)}
                                    sx={{ ...theme.typography.customInput }}
                                >
                                    <label htmlFor="email" className="text-lg font-medium">
                                        Enter Email
                                    </label>
                                    <input
                                        className="w-full outline-none border-slate-100 border p-2 rounded-md focus:border-slate-800 focus:border-2"
                                        type="email"
                                        id="email"
                                        placeholder="john@example.com"
                                        value={values.email}
                                        name="email"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                    />
                                    {touched.email && errors.email && (
                                        <FormHelperText error id="standard-weight-helper-text--register">
                                            {errors.email}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </div>
                            <div className="flex flex-col gap-1">
                                <FormControl
                                    fullWidth
                                    error={Boolean(touched.password && errors.password)}
                                    sx={{ ...theme.typography.customInput }}
                                >
                                    <label htmlFor="password" className="text-lg font-medium">
                                        Enter Password
                                    </label>
                                    <input
                                        className="w-full outline-none border-slate-100 border p-2 rounded-md focus:border-slate-800 focus:border-2"
                                        type="password"
                                        id="password"
                                        placeholder="**************"
                                        value={values.password}
                                        name="password"
                                        onBlur={handleBlur}
                                        onChange={(e) => {
                                            handleChange(e);
                                            changePassword(e.target.value);
                                        }}
                                    />
                                    {touched.password && errors.password && (
                                        <FormHelperText error id="standard-weight-helper-text-password-register">
                                            {errors.password}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </div>

                            {strength !== 0 && (
                                <FormControl fullWidth>
                                    <Box sx={{ mb: 2 }}>
                                        <Grid container spacing={2} alignItems="center">
                                            <Grid item>
                                                <Box
                                                    style={{ backgroundColor: level?.color }}
                                                    sx={{ width: 85, height: 8, borderRadius: '7px' }}
                                                />
                                            </Grid>
                                            <Grid item>
                                                <Typography variant="subtitle1" fontSize="0.75rem">
                                                    {level?.label}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </FormControl>
                            )}

                            {errors.submit && (
                                <Box sx={{ mt: 3 }}>
                                    <FormHelperText error>{errors.submit}</FormHelperText>
                                </Box>
                            )}

                            <div>
                                <input
                                    type="submit"
                                    value="Register"
                                    className="py-1 px-8 bg-slate-800 text-white rounded-md text-lg cursor-pointer"
                                    disabled={isSubmitting}
                                />
                            </div>
                        </form>
                    )}
                </Formik>
                <div className="flex mt-8 justify-center">
                    <h2 className="text-lg">
                        Already have an account?
                        <Typography
                            component={Link}
                            to={isLoggedIn ? '/pages/login/login3' : '/login'}
                            variant="subtitle1"
                            sx={{ textDecoration: 'underline' }}
                        >
                            Click Here to Login
                        </Typography>
                    </h2>
                </div>
            </div>
        </div>
    );
};

function mapStateToProps(state) {
    return {
        auth: state.user.auth
    };
}

AWSCognitoRegister.propTypes = {
    auth: PropTypes.object
};

export default connect(mapStateToProps)(AWSCognitoRegister);
