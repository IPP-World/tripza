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
  if(isAuthenticated)
    return (
      <div className="flex flex-col">
      <div className="profile-container">
        <div className="profile-leftpart">
          <div className="profile-pic">
            <CgProfile /><br/>
            <label className="name">{user?.fname + ' ' + user?.lname}</label>
            <br />
            <label className="role">Hya role hala</label>
          </div>
          <button className="edit-btn" onClick={handleEdit}>Edit</button>
          <div className="level">
            <div className="level-bar"></div>
            <label>Level 1</label>
            <br />
            <label>69/100</label>
          </div>
        </div>
        <div className="profile-rightpart">
          <p>Recent Contributions</p>
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
        <button onClick={() => dispatch(logout())} className="logout-btn">Logout</button>
      </div>
      </div>
    );
    else
      return <Navigate to='/signup'/>
}
