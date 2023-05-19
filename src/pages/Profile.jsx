import { CgProfile } from "react-icons/Cg";
import "./Profile.css"
import { Navigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { load_user, logout } from "../actions/auth";
import { useNavigate } from 'react-router-dom';
import KhaltiCheckout from "khalti-checkout-web"
import axios from "axios";

export default function Profile({}) {
  const isAuthenticated = useSelector(state=>state.auth.isAuthenticated)
  const contributions = useSelector(state=>state.auth.contributions)

  const user = useSelector(state => state.auth.user)
  useEffect(()=>{
    dispatch(load_user())
  }, [])

  const dispatch = useDispatch()

  const navigate=useNavigate();
  const handleEdit=()=>{
    navigate('/profile/editprofile');
  }
  const handleSubscribe = () => {
    let config = {
      publicKey: "test_public_key_1bc1b5b65fb14323bd5b06c4938e7e90",
      productIdentity: "User ko id, jun chai transaction kasle garyo vanne thapauna ko lagi",
      productName: "Tripza",
      productUrl: "https://localhost:8000/subscribe",
      eventHandler: {
        onSuccess(payload) {
          axios.post(`${process.env.REACT_APP_API_URL}/api/hotel/subscribe`, {amount: payload.amount, token: payload.token})
        }
      }
    }
    const checkout = new KhaltiCheckout(config)
    checkout.show({amount: 200 * 100})
  }
  if(isAuthenticated)
    return (
 
      <div className="profile--container">
        <div className="profile--leftpart">
          <div className="profile--content">
            <div className="profile--pic"></div>
            <label className="profile--name">{user?.fname + ' ' + user?.lname}
            <span className="profile--role">service owner</span>
            </label>
            <br />
          </div>
          <div className="profile--userinfo">
        <div><h5 className="p-userinfo--email">{user?.email}</h5></div>
        <div><h5 className="p-userinfo--email">{user?.number}</h5></div>
      </div>
      <div className="profile--buttons">
      <button className="profile--edit-btn" onClick={handleEdit}>Edit Profile</button>
      <button className="profile--subscribe-btn" onClick={handleSubscribe}>Subscribe</button>
      <button onClick={() => dispatch(logout())} className="logout-btn">Logout</button>
       </div>
        </div>
        <div className="profile--rightpart">
          <div className="profile--booking--list">
            <div><p>Booking List</p>
            
            </div>
            <button className="more-btn">More</button>
          </div>
          <div className="profile--contribution">
            <p>Recent Contributions</p>
            <div className="profile--contribution--list">
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
            
            </div>
          
          
          <button className="cont--more--btn">More</button>
        </div>
        <div className="profile--saved">
          <h5>Saved</h5>
          //yeta saved map garne
        </div>
        <div className="Your hotel">
          //Your hotel here
        </div>
      </div>
      
    
    );
    else
      return <Navigate to='/login'/>
}

