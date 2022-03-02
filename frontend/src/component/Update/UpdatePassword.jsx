import React, { useState, useEffect } from 'react';
import './UpdatePassword.css'
import { useAlert } from 'react-alert';
import { useDispatch, useSelector } from 'react-redux';
import { clearErrors, loadUser, updatePassword } from "../../actions/userAction"
import { UPDATE_PASSWORD_RESET } from '../../constants/userConstants';
import Loader from '../layout/Loader';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import LockIcon from '@material-ui/icons/Lock'
import VpnKeyIcon from '@material-ui/icons/VpnKey'
import { MetaData } from '../MetaData';

export const UpdatePassword = ({ history }) => {
    // const { user } = useSelector(state => state.user)
    const alert = useAlert();
    const dispatch = useDispatch();

    const { isUpdated, loading, error } = useSelector((state) => state.profile)

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const updatePasswordSubmit = (e) => {

        e.preventDefault();

        const myForm = new FormData();
        myForm.set("oldPassword", oldPassword);
        myForm.set("newPassword", newPassword);
        myForm.set("confirmPassword", confirmPassword);

        dispatch(updatePassword(myForm))
    }


    useEffect(() => {

        if (error) {
            alert.error(error)
            dispatch(clearErrors());
        }

        if (isUpdated) {
            alert.success("Profile Update Successfully");
            dispatch(loadUser());
            history.push("/account");
            dispatch({
                type: UPDATE_PASSWORD_RESET
            })
        }
    }, [dispatch, error, alert,history,isUpdated])
    return <>
        {loading ? (<Loader />) : (<>
        <MetaData title="Change Password"/>
            <div className="updatePassword">
                <div className="updatePasswordBox">
                    <h2>Update Password</h2>

                    <form className='updatePasswordForm'
                        encType='multipart/form-data'
                        autoComplete='off'
                        onSubmit={updatePasswordSubmit}
                    >

                        <div className="loginPassword">
                            <VpnKeyIcon />
                            <input type="password"
                                placeholder='Old Password'
                                name="password"
                                required
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                            />
                        </div>

                        <div className="loginPassword">
                            <LockOpenIcon />
                            <input type="password"
                                placeholder='New Password'
                                name="password"
                                required
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>

                        <div className="loginPasswordl">
                            <LockIcon />
                            <input type="password"
                                placeholder='Confirm Password'
                                name="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>


                        <input type="submit" value="Change Password" className='updatePasswordbtn' />
                    </form>
                </div>
            </div>
        </>)}
    </>
};
