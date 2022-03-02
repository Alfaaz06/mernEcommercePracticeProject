import React, { useState, useEffect } from 'react';
import './ForgotPassword.css'
import { useAlert } from 'react-alert';
import { useDispatch, useSelector } from 'react-redux';
import { clearErrors, forgotPassword } from "../actions/userAction"
import Loader from './layout/Loader';
import { MetaData } from './MetaData';
import MailOutlineIcon from '@material-ui/icons/MailOutline';

export const ForgotPassword = () => {

    const dispatch = useDispatch();
    const alert = useAlert();

    const { error, message, loading } = useSelector((state) => state.forgotPassword)

    const [email,setEmail] = useState("");

    const forgotPasswordSubmit=(e)=> {
        e.preventDefault();
        const myForm = new FormData();
        myForm.set("email", email);

        dispatch(forgotPassword(myForm))
    }

    useEffect(() => {

        if (error) {
            alert.error(error)
            dispatch(clearErrors());
        }

        if (message) {
            alert.success(message);
        }
    }, [dispatch, error, alert,message])

    return <>
        {loading ? (<Loader />) : (<>
            <MetaData title="Forgot Password" />
            <div className="forgotPassword">
                <div className="forgotPasswordBox">
                    <h2>Update Profile</h2>

                    <form className='forgotPasswordForm'
                        autoComplete='off'
                        onSubmit={forgotPasswordSubmit}
                    >


                        <div className="forgotPasswordEmail">
                            <MailOutlineIcon />
                            <input type="email"
                                name='email'
                                placeholder='Email'
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <input type="submit" value="Send" className='forgotPasswordbtn' />
                    </form>
                </div>
            </div>
        </>)}
    </>
};
