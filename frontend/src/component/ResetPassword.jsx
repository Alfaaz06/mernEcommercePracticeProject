import React, { useEffect } from 'react';
import './ResetPassword.css'
import { useAlert } from 'react-alert';
import { useDispatch, useSelector } from 'react-redux';
import { clearErrors, resetPassword } from "../actions/userAction"
import Loader from './layout/Loader';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import LockIcon from '@material-ui/icons/Lock'
import { MetaData } from './MetaData';
import { useState } from 'react';

export const ResetPassword = ({history,match}) => {

    const alert = useAlert();
    const dispatch = useDispatch();

    const { error,success,loading } = useSelector((state) => state.forgotPassword)

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const resetPasswordSubmit = (e) => {

        e.preventDefault();

        const myForm = new FormData();
        myForm.set("password", password);
        myForm.set("confirmPassword", confirmPassword);

        dispatch(resetPassword(match.params.token,myForm))
    }


    useEffect(() => {

        if (error) {
            alert.error(error)
            dispatch(clearErrors());
        }

        if (success) {
            alert.success("Password updated successfully");
            history.push("/login");
        }
    }, [dispatch, error, alert,history,success])


  return <>
  {loading ? (<Loader />) : (<>
  <MetaData title="Reset Password"/>
      <div className="resetPassword">
          <div className="resetPasswordBox">
              <h2>Reset Password</h2>

              <form className='resetPasswordForm'
                  encType='multipart/form-data'
                  autoComplete='off'
                  onSubmit={resetPasswordSubmit}
              >

                  <div>
                      <LockOpenIcon />
                      <input type="password"
                          placeholder='New Password'
                          name="password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                      />
                  </div>

                  <div >
                      <LockIcon />
                      <input type="password"
                          placeholder='Confirm Password'
                          name="password"
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                  </div>


                  <input type="submit" value="Reset Password" className='resetPasswordbtn' />
              </form>
          </div>
      </div>
  </>)}
</>
};
