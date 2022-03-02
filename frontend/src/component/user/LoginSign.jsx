import React, { useState ,useEffect} from 'react';
import './LoginSign.css'
import  Loader  from '../layout/Loader'
import { useRef } from 'react';
import { Link } from 'react-router-dom'
import MailOutlineIcon from '@material-ui/icons/MailOutline'
import FaceIcon from '@material-ui/icons/Face'
import LockOpenIcon from '@material-ui/icons/LockOpen';
import {useAlert} from 'react-alert'

import {useDispatch,useSelector} from 'react-redux';
import {clearErrors,login,register} from '../../actions/userAction'

export const LoginSign = ({history,location}) => {

    const {error,loading,isAuthenticated}= useSelector(state=>state.user)

    const alert = useAlert();

    const dispatch=useDispatch();

    const loginTab = useRef(null);
    const registerTab = useRef(null);
    const switcherTab = useRef(null);

    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");

    const [user,setUser]=useState({
        name:"",
        email:"",
        password:"",
    });

    const {name,email,password}=user;

    const [avatar,setAvatar]=useState("/profile2.jpg");
    const[avatarPreview,setAvatarPreview]=useState("/profile2.jpg");

    const loginSubmit = (e) => {
        e.preventDefault();
        dispatch(login(loginEmail,loginPassword))
    }

    const registerSubmit = (e) => {
        e.preventDefault();
        const myForm = new FormData();
        myForm.set("name", name);
        myForm.set("email", email);
        myForm.set("password", password);
        myForm.set("avatar", avatar);

        dispatch(register(myForm))
    }

    const registerDataChange =(e)=>{
        if(e.target.name==="avatar"){
            const reader=new FileReader();
            reader.onload=()=>{
                if(reader.readyState===2){
                    setAvatarPreview(reader.result);
                    setAvatar(reader.result);
                }
            }
            reader.readAsDataURL(e.target.files[0])
        } else {
            setUser({...user,[e.target.name]:e.target.value})
        }
    }

    const redirect=location.search?location.search.split("=")[1]:"/account";

    useEffect(() => {
        if(error){
            alert.error(error);
            dispatch(clearErrors());
        }
        if(isAuthenticated){
            history.push(redirect);
        }
    }, [dispatch,alert,error,history,isAuthenticated,redirect]);
    

    const switchTabs = (e, tab) => {
        if (tab === "login") {
            switcherTab.current.classList.add("shiftToNeutral");
            switcherTab.current.classList.remove("shiftToRight");

            registerTab.current.classList.remove("shiftToNeutralForm");
            loginTab.current.classList.remove("shiftToLeft");
        }

        if (tab === "register") {
            switcherTab.current.classList.add("shiftToRight");
            switcherTab.current.classList.remove("shiftToNeutral");

            registerTab.current.classList.add("shiftToNeutralForm");
            loginTab.current.classList.add("shiftToLeft");
        }
    };



    return <>
    {loading?<Loader/>:<>
        <div className="loginSignUp">
            <div className="loginSignupBox">
                <div>
                    <div className="login_sign_toggle">
                        <p onClick={(e) => switchTabs(e, "login")}>LOGIN</p>
                        <p onClick={(e) => switchTabs(e, "register")}>REGISTER</p>
                    </div>
                    <button ref={switcherTab}></button>
                </div>

                <form className="loginForm" ref={loginTab} onSubmit={loginSubmit}>
                    <div className="loginEmail">
                        <MailOutlineIcon />
                        <input type="email"
                            placeholder='Email'
                            name="email"
                            required
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                        />
                    </div>
                    <div className="loginPasswordl">
                        <LockOpenIcon />
                        <input type="password"
                            placeholder='password'
                            name="password"
                            required
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                        />
                    </div>
                    <Link to="/password/forgot">Forgot Your Password?</Link>
                    <input type="submit" value="Login" className='loginbtn' />
                </form>

                <form className='SignUpForm'
                    ref={registerTab}
                    encType='multipart/form-data'
                    autoComplete='off'
                    onSubmit={registerSubmit}
                >

                    <div className="signUpName">
                        <FaceIcon />
                        <input type="text"
                            placeholder='Name'
                            required
                            name="name"
                            value={name}
                            onChange={registerDataChange}
                        />
                    </div>


                    <div className="signUpEmail">
                        <MailOutlineIcon />
                        <input type="email"
                            name='email'
                            placeholder='Email'
                            required
                            value={email}
                            onChange={registerDataChange}
                        />
                    </div>

                    <div className="signUpPassword">
                        <MailOutlineIcon />
                        <input type="password"
                            placeholder='Password'
                            name='password'
                            required
                            value={password}
                            onChange={registerDataChange}
                        />
                    </div>

                    <div id="registerImage">
                        <img src={avatarPreview} alt="Avatar" />
                        <input type="file"
                            name='avatar'
                            accept='image/*'
                            onChange={registerDataChange}
                        />
                    </div>
                    <input type="submit" value="Register" className='signupbtn' />
                </form>


            </div>
        </div>
    </>}
    
    </>
};
