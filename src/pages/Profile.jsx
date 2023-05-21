import "./Profile.css";
import { Navigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { load_user, logout } from "../actions/auth";
import { useNavigate,useParams } from "react-router-dom";
import KhaltiCheckout from "khalti-checkout-web";
import axios from "axios";

export default function Profile({}) {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const contributions = useSelector((state) => state.auth.contributions);
  console.log(isAuthenticated);
  const user = useSelector((state) => state.auth.user);
  useEffect(() => {
    dispatch(load_user());
  }, []);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleEdit = () => {
    navigate("/profile/editprofile");
  };
  const handleSubscribe = () => {
    console.log(user?.email)
    // const mail=user?.email;
    let config = {
      publicKey: "test_public_key_1bc1b5b65fb14323bd5b06c4938e7e90",
      productIdentity: "jhyau lagne",
      productName: "Tripza",
      productUrl: "https://localhost:8000/subscribe",
      eventHandler: {
        onSuccess(payload) {
          axios.post(`${process.env.REACT_APP_API_URL}/api/hotel/subscribe`, {
            amount: payload.amount,
            token: payload.token,
          });
        },
      },
    };
    const checkout = new KhaltiCheckout(config);
    checkout.show({ amount: 200 * 100 });

    axios
    .post(`${process.env.REACT_APP_API_URL}/api/`,)
    .then((res)=>{
      console.log(res);
    })
    .catch((e) => {
      console.error(e);
      alert("Error calling api");
    });
  };
  if (isAuthenticated)
    return (
      <div className="profile--container">
        <div className="profile--leftpart">
          <div className="profile--pic"></div>
          <div className="profile--content">
            <h4 className="profile--name">
              {user?.fname + " " + user?.lname}{" "}
            </h4>

            <p className="profile--role">General User</p>
          </div>
          <div className="profile--userinfo">
            <div>
              <h5 className="p-userinfo--email">{user?.email}</h5>
            </div>
            <div>
              <h5 className="p-userinfo--email">Phone: {user?.number}</h5>
            </div>
          </div>
          <div className="profile--buttons">
            <button className="profile--edit-btn" onClick={handleEdit}>
              Edit Profile
            </button>
            <button
              className="profile--subscribe-btn"
              onClick={handleSubscribe}
            >
              Subscribe
            </button>
            <button onClick={() => dispatch(logout())} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
        <div className="profile--middlepart">
          <div className="your-hotel">Subscribe to add a service</div>
          <div className="profile--booking--list">
            <div className="booking--lists"> 
              Booking List
            </div>
          </div>
        </div>
        <div className="profile--rightpart">
          <div className="profile--contribution">
            <h5 className="recent-text">Recent Contributions</h5>
            <div className="profile--contribution--list">
              <ul>
                {contributions?.length &&
                  contributions?.map((c) => {
                    return (
                      <li>
                        <p>{c.title || "Title here"}</p>
                        <br />
                        <p>{c.address || "Address here"}</p>
                      </li>
                    );
                  })}
              </ul>
            </div>
          </div>
          <div className="profile--saved">
            <h5 className="profile--savedtext">Saved</h5>
      
          </div>
        </div>
      </div>
    );
  else return <Navigate to="/login" />;
}
