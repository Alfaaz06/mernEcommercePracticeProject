import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Loader from '../layout/Loader';
import { MetaData } from '../MetaData';
import './Profile.css'

export const Profile = ({history}) => {
    const {user,loading,isAuthenticated} = useSelector((state)=>state.user);
    useEffect(() => {
        if(!isAuthenticated){
            history.push("/login");
        }
    }, [history,isAuthenticated]);
    
  return <>
  {loading?(<Loader/>):(
      <>
      <MetaData title={`${user.name}'s Profile`}/>
      <div className="profileBox">
          <div className="first">
              <h1>My Profile</h1>
              <img src={user.avatar.url} alt={user.name} />
               <Link to="/me/update">Update Profile</Link>
          </div>
          <div className="last">
              <div>
                  <h4>Full Name</h4>
                  <p>{user.name}</p>
              </div>
              <div>
                  <h4>Email</h4>
                  <p>{user.email}</p>
              </div>
              <div>
                  <h4>Joined on</h4>
                  <p>{user.createdAt.toString().substr(0,10)}</p>
              </div>
              <div>
                  <Link to="/orders">My Orders</Link>
                  <Link to="/password/update">Change Password</Link>
              </div>
          </div>
      </div>
      </>
  )}
  </>
};

