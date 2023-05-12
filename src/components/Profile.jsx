import { CgProfile } from "react-icons/Cg";
import "./Profile.css";
import { useSelector } from "react-redux";
import { Navigate } from "react-router";

export default function Profile({ name, role, contributions }) {
  const isAuthenticated = useSelector(state=>state.auth)
  if(!isAuthenticated)
    <Navigate to='/login'/>
  return (
    <div className="profile-container">
      <div className="profile-leftpart">
        <div className="profile-pic">
          <CgProfile />
          <br />
          <label className="name">{name}</label>
          <br />
          <label className="role">{role}</label>
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
            {contributions.map((contribution, index) => (
              <li key={index}>
                <p>{contribution.name}</p>
                <br />
                <p>{contribution.location}</p>
              </li>
            ))}
          </ul>
        </div>
        <button className="more-btn">More</button>
      </div>
    </div>
  );
}
