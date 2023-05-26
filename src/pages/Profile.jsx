import "./Profile.css";
import { Navigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { load_user, logout } from "../actions/auth";
import { useNavigate,useParams } from "react-router-dom";
import KhaltiCheckout from "khalti-checkout-web";
import { GoVerified } from "react-icons/Go";
import axios from "axios";
import { CgProfile } from "react-icons/Cg";


export default function Profile({}) {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [allContributors, setAllContributors] = useState([])


  const [showModal, setShowModal] = useState(false);
  const [isSubscribed,setIsSubscribed]=useState(true);
  const [bookings, setBookings] = useState([])
  const user = useSelector((state) => state.auth.user);
  useEffect(() => {
    dispatch(load_user());
    // bookingList();

    // console.log(bookings);
  }, []);

    useEffect(()=>{
    axios.get("http://127.0.0.1:8000/api/place/my-contributions/", {
            headers: {
          "Content-Type": "application/form-data",
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjg0ODA5NTkwLCJpYXQiOjE2ODQ3MjMxOTAsImp0aSI6IjBhZTI0MTZjNjY3NTRlNTZhNWFjNDgwY2E1ZmQ0ODcyIiwidXNlcl9pZCI6MX0.RcGjvPIp0iSl7xOOW63O32E_1zIcXukSDXoenyxrrp8`,
        },
    }).then((obtained) => {
      setAllContributors(obtained.data)
    })
  },[])
  console.log(allContributors)

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleEdit = () => {
    navigate("/profile/editprofile");
  };

  const handleCloseModal = () => {
    const email = user?.email;
    const formData = new FormData();
    formData.append("email", email);
  
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("access")}`,
      },
    };
  
    axios
      .post(`${process.env.REACT_APP_API_URL}/api/hotel/sub/`, formData, config)
      .then((res) => {
        console.log(res);
        setIsSubscribed(true);
      })
      .catch((e) => {
        console.error(e);
        alert("Error calling API");
      });
  
    setShowModal(false);
  };

  const bookingList = async () => {
  
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access")}`,
      },
    };
  
    try{
      const response = await axios.get(`http://127.0.0.1:8000/api/book/my-bookings/`,config)
      const data = await response.data

      setBookings(data)
    }catch(err){
      console.log(err);
      alert('Bookings fetch failed')
    }
  
    setShowModal(false);
  };
  
  const handleSubscribe = async () => {
    try {
      let config = {
        publicKey: "test_public_key_1bc1b5b65fb14323bd5b06c4938e7e90",
        productIdentity: "user ko id",
        productName: "Tripza",
        productUrl: "https://localhost:8000/subscribe",
        eventHandler: {
          onSuccess(payload) {
            axios.post(`${process.env.REACT_APP_API_URL}/api/hotel/subscribe`, {
              amount: payload.amount,
              token: payload.token,
            })
            .then(() => {
              setShowModal(true);
              setIsSubscribed(true); 
            })
            .catch((error) => {
              console.error(error);
            });
          }
        }
      };
      
      const checkout = new KhaltiCheckout(config);
      checkout.show({ amount: 200 * 100 });
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    bookingList();
    console.log(bookings);
    console.log('subscriber:',isSubscribed);
  }, [])
  
  const Popup = () => (
    <>
      <div className="reward-wrapper"></div>
      <div className="reward-container">
        <p className="reward--text1">Congratulations!</p>
        <p className="reward--text2">You are now a subscribed user</p>
        <button onClick={handleCloseModal}>okay</button>
      </div>
    </>
  );


  if (isAuthenticated)
    return (
      <div className="profile--container">
        <div className="profile--leftpart">
          <div className="profile--pic">
            <div className="profile-profile"><CgProfile/></div>
          </div>
          <div className="profile--content">
            <h4 className="profile--name">
              {user?.fname + " " + user?.lname}{" "}
            </h4>

            <p className="profile--role">{!isSubscribed?'': <span><GoVerified/>Subscribed</span>}</p>
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
         {showModal && <Popup/>}
            <button onClick={() => dispatch(logout())} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
        <div className="profile--middlepart">
          <div className="your-hotel">Subscribe to add a service</div>
          <div className="profile--booking--list">
            <div className="booking--lists"> 
             <span className="booking--lists--list"> Booking List</span>
              <div className="booking-container">
                {
                bookings.map(booking => {
                  return (
                    <div key={booking.id}>
                      <h2 className="profile--checkin-nameee">{booking.h_name}</h2>
                      <h2 className="profile--checkin">{booking.check_in_date}</h2>
                      <h2 className="profile--checkout">{booking.check_out_date}</h2>
                    </div>
                  )
                })                  
                }
              </div>
            </div>
          </div>
        </div>
        <div className="profile--rightpart">
          <div className="profile--contribution">
            <h5 className="recent-text">Recent Contributions</h5>
            <div className="profile--contribution--list">
              <ul >
                {allContributors?.length &&
                  allContributors?.map((c) => {
                    return (
                      <li>
                        <p className="cont--name">{c.name || "Title here"}</p>
                        <br />
                        <p className="cont--add">{c.location || "Address here"}</p>
                      </li>
                    );
                  })}
              </ul>
            </div>
          </div>
          {/* <div className="profile--saved">
            <h5 className="profile--savedtext">Saved</h5>
      
          </div> */}
        </div>
      </div>
    );
  else return <Navigate to="/login" />;
}
