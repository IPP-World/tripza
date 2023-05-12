import { CgProfile } from "react-icons/Cg";
import "./Profile.css"
import { Navigate } from "react-router";
import { useSelector } from "react-redux";
export default function Profile({}) {
  const isAuthenticated = useSelector(state=>state.auth.isAuthenticated)
  const user = useSelector(state => state.auth.user)

  if(isAuthenticated)
    return (
      <div className="profile-container">
        <div className="profile-leftpart">
          <div className="profile-pic">
            <CgProfile /><br/>
            <label className="name">{user.fname + ' ' + user.lname}</label>
            <br />
            <label className="role">Hya role hala</label>
          </div>
          <button className="edit-btn">Edit</button>
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
              <li>
                <p>Owl Bamboo House</p>
                <br />
                <p>Sidemen,Bali,Indonesia</p>
              </li>
              <li>
                <p>Owl Bamboo House</p>
                <br />
                <p>Sidemen,Bali,Indonesia</p>
              </li>
            </ul>
          </div>
          <button className="more-btn">More</button>
        </div>
      </div>
    );
    else
      return <Navigate to='/signup'/>
}
