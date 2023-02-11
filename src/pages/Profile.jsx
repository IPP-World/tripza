import { CgProfile } from "react-icons/Cg";
export default function Profile({}) {
  return (
    <div className="profile-container">
      <div className="profile-leftpart">
        <div className="profile-pic">
          <CgProfile /><br/>
          <label className="name">John Doe</label>
          <br />
          <label className="role">General user</label>
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
}
