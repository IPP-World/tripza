import { CgProfile } from "react-icons/Cg";
import "./Profile.css"
import { Navigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { load_user, logout } from "../actions/auth";
import store from '../store';
import { useNavigate } from 'react-router-dom';


export default function Profile({}) {
  const isAuthenticated = useSelector(state=>state.auth.isAuthenticated)
  const contributions = useSelector(state=>state.auth.contriubtions)

  const user = useSelector(state => state.auth.user)
  const dispatch = useDispatch()

  const navigate=useNavigate();
  const handleEdit=()=>{
    navigate('/editprofile');
  }
  useEffect(()=>{
    dispatch(load_user())
  }, [])
  console.log(store.getState())
  const handleSubscribe = () => {}
  if(isAuthenticated)
    return (
 
      <div className="profile--container">
        <div className="profile--leftpart">
          <div className="profile--pic">
            <CgProfile /><br/>
            <label className="profile--name">{user?.fname + ' ' + user?.lname}</label>
            <br />
            <label className="profile--role">Hya role hala</label>
          </div>
          
          <div className="profile--level">
            <div className="profile--level-bar"></div>
            <label>Level 1</label>
            <br />
            <label>69/100</label>
          </div>
          <div className="profile--userinfo">
        <div><h5 className="p-userinfo--email">{user?.email}</h5></div>
      </div>
      <button className="profile--edit-btn" onClick={handleEdit}>Edit Profile</button>
      <button className="profile--subscribe-btn" onClick={handleSubscribe}>Subscribe</button>
      <button onClick={() => dispatch(logout())} className="logout-btn">Logout</button>

        </div>
        <div className="profile--rightpart">
          <div>
            <p>Recent Contributions</p>
            <div></div>
            </div>
          
          <div className="recent-container">
            <ul>
              {
                contributions?.length && contributions?.map(c=>{
                  return(<li>
                    <p>{c.title || "Title here"}</p>
                    <br />
                    <p>{c.address || "Address here"}</p>
                  </li>)
                })
              }
            </ul>
          </div>
          <button className="more-btn">More</button>
        </div>
      </div>
    
    );
    else
      return <Navigate to='/signup'/>
}

