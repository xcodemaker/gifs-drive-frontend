/* eslint-disable react/jsx-curly-brace-presence */
/* eslint-disable jsx-a11y/label-has-associated-control */
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, FormControl, FormHelperText, Typography } from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import useAuth from 'hooks/useAuth';
import useScriptRef from 'hooks/useScriptRef';

// ===============================|| JWT LOGIN ||=============================== //

const AwsCognitoLogin = ({ ...others }) => {
    const theme = useTheme();
    const { isLoggedIn } = useAuth();

    const { login } = useAuth();
    const scriptedRef = useScriptRef();

    return (
        <div className="container my-8 mx-auto flex justify-center">
            <div className="w-full xl:w-1/2 py-4 px-8 border-2 border-slate-200 rounded-md">
                <h1 className="text-xl font-medium text-center">Login To Your Account</h1>
                <Formik
                    initialValues={{
                        email: 'info@codedthemes.com',
                        password: '123456',
                        submit: null
                    }}
                    validationSchema={Yup.object().shape({
                        email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
                        password: Yup.string().max(255).required('Password is required')
                    })}
                    onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                        try {
                            await login(values.email, values.password);

                            if (scriptedRef.current) {
                                setStatus({ success: true });
                                setSubmitting(false);
                            }
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
                                        <FormHelperText error id="standard-weight-helper-text-email-login">
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
                                        onChange={handleChange}
                                    />
                                    {touched.password && errors.password && (
                                        <FormHelperText error id="standard-weight-helper-text-password-login">
                                            {errors.password}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </div>

                            {errors.submit && (
                                <Box sx={{ mt: 3 }}>
                                    <FormHelperText error>{errors.submit}</FormHelperText>
                                </Box>
                            )}
                            <div>
                                <input
                                    type="submit"
                                    value="Login"
                                    className="py-1 px-8 bg-slate-800 text-white rounded-md text-lg cursor-pointer"
                                    disabled={isSubmitting}
                                />
                            </div>
                        </form>
                    )}
                </Formik>
                <div className="flex mt-8 justify-center">
                    <h2 className="text-lg">
                        {"Don't have an account?"}
                        <Typography
                            component={Link}
                            to={isLoggedIn ? '/pages/register/register3' : '/register'}
                            variant="subtitle1"
                            sx={{ textDecoration: 'underline' }}
                        >
                            Create A New Account
                        </Typography>
                    </h2>
                </div>
            </div>
        </div>
    );
};

AwsCognitoLogin.propTypes = {
    loginProp: PropTypes.number
};

export default AwsCognitoLogin;
