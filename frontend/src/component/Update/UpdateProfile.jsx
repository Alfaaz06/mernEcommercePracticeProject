import React, { useState, useEffect } from 'react';
import './UpdateProfile.css'
import { useAlert } from 'react-alert';
import { useDispatch, useSelector } from 'react-redux';
import { clearErrors, loadUser, updateProfile } from "../../actions/userAction"
import { UPDATE_PROFILE_RESET } from '../../constants/userConstants';
import Loader from '../layout/Loader';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import FaceIcon from '@material-ui/icons/Face';

export const UpdateProfile = ({ history }) => {
    const { user } = useSelector( state => state.user)
    const alert = useAlert();
    const dispatch = useDispatch();
    
    const { isUpdated, loading, error } = useSelector((state) => state.profile)

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [avatar, setAvatar] = useState("");
    const [avatarPreview, setAvatarPreview] = useState("");

    const updateProfileSubmit = (e) => {
        e.preventDefault();
        const myForm = new FormData();
        myForm.set("name", name);
        myForm.set("email", email);
        myForm.set("avatar", avatar);

        dispatch(updateProfile(myForm))
    }

    const updateProfileDataChange = (e) => {
        const reader = new FileReader();
        reader.onload = () => {
            if (reader.readyState === 2) {
                setAvatarPreview(reader.result);
                setAvatar(reader.result);
            }
        }
        reader.readAsDataURL(e.target.files[0])
    }

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
            setAvatarPreview(user.avatar.url);
        }
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }
        if (isUpdated) {
            alert.success("Profile Update Successfully");
            dispatch(loadUser());
            history.push("/account");
            dispatch({
                type: UPDATE_PROFILE_RESET
            })
        }
    }, [dispatch, alert, error, history, user, isUpdated]);
    return <>
    {loading?(<Loader/>):(<>
        <div className="updateProfile">
            <div className="updateProfileBox">
                <h2>Update Profile</h2>

                <form className='updateProfileForm'
                    encType='multipart/form-data'
                    autoComplete='off'
                    onSubmit={updateProfileSubmit}
                >

                    <div className="updateProfileName">
                        <FaceIcon />
                        <input type="text"
                            placeholder='Name'
                            required
                            name="name"
                            value={name}
                            onChange={(e)=>setName(e.target.value)}
                        />
                    </div>


                    <div className="updateProfileEmail">
                        <MailOutlineIcon />
                        <input type="email"
                            name='email'
                            placeholder='Email'
                            required
                            value={email}
                            onChange={(e)=>setEmail(e.target.value)}
                        />
                    </div>

                    <div id="updateProfileImage">
                        <img src={avatarPreview} alt="Avatar" />
                        <input type="file"
                            name='avatar'
                            accept='image/*'
                            onChange={updateProfileDataChange}
                        />
                    </div>
                    <input type="submit" value="Update Profile" className='updateProfilebtn' />
                </form>
            </div>
        </div>
    </>)}
    </>
};
