import "./Profile.css";
import { Navigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { load_user, logout } from "../actions/auth";
import { useNavigate } from "react-router-dom";
import KhaltiCheckout from "khalti-checkout-web";
import { GoVerified } from "react-icons/Go";
import axios from "axios";

export default function Profile({}) {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [allContributors, setAllContributors] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState();
  const [bookings, setBookings] = useState([]);
  const [myservices,setMyServices]=useState([]);
  const [showBookModal, setShowBookModal] = useState(false);


  const user = useSelector((state) => state.auth.user);
  useEffect(() => {
    dispatch(load_user());
  }, []);

 
useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/user/profile", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch profile data");
      }

      const data = await response.json();
      setIsSubscribed(data.is_subscribed);
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  fetchData();
}, []);


  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/place/my-contributions/", {
        headers: {
          "Content-Type": "application/form-data",
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        }
      })
      .then((obtained) => {
        setAllContributors(obtained.data);
      });
  }, []);
  console.log("contributions:", allContributors);
  console.log('user:',user);

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
        // setIsSubscribed(true);
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

    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/book/my-bookings/`,
        config
      );
      const data = await response.data;
      console.log("booking data:", data);
      setBookings(data);
    } catch (err) {
      console.log(err);
      alert("Bookings fetch failed");
    }

    setShowModal(false);
  };

  const ServiceList = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access")}`,
      },
    };

    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/hotel/my-hotels/`,
        config
      );
      const data = await response.data;
      console.log("my services:", data);
      setMyServices(data);
    } catch (error) {
      console.log(error);
      alert('error loading services');
    }
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
            axios
              .post(`${process.env.REACT_APP_API_URL}/api/hotel/subscribe`, {
                amount: payload.amount,
                token: payload.token,
              })
              .then(() => {
                setShowModal(true);
              })
              .catch((error) => {
                console.error(error);
              });
          },
        },
      };

      const checkout = new KhaltiCheckout(config);
      checkout.show({ amount: 200 * 100 });
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    bookingList();
    ServiceList();
    console.log(bookings);
    console.log("subscriber:", isSubscribed);
  }, []);

  const handleRecentClick = (slug) => {
    console.log('loading');
    navigateToPlace(slug);
  };

  const handleBookingClick = (slug) => {
    navigateToService(slug);
  };

  const navigateToPlace = (slug) => {
    window.location.href = `/placeinfo/${slug}`;
  };

  const navigateToService = (slug) => {
    window.location.href = `/hotels/serviceinfo/${slug}`;
  };

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
  const BookPopup = () => (
    <>
      <div className="reward-wrapper"></div>
      <div className="reward-container">
        <p className="reward--text1">Congratulations!</p>
        <p className="reward--text2">You are now a subscribed user</p>
        <button onClick={handleBookCloseModal}>close</button>
      </div>
    </>
  );
  const handleBookCloseModal=()=>{
    setShowBookModal(false);
  } 

  if (isAuthenticated)
    return (
      <div className="profile--container">
        <div className="profile--leftpart">
          <div className="profile--pic">
            <div className="profile-profile">
            <img src={`http://localhost:8000${user?.photo}`} alt="User Profile" className="user-photo"/>
            </div>
          </div>
          <div className="profile--content">
            <h4 className="profile--name">
              {user?.fname + " " + user?.lname}{" "}
            </h4>

            <p className="profile--role">
              {!isSubscribed==1 ? (
                ""
              ) : (
                <span>
                  <GoVerified />
                  Subscribed
                </span>
              )}
            </p>
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
            {showModal && <Popup />}
            <button onClick={() => dispatch(logout())} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
        <div className="profile--middlepart">
          <div className="your-hotel">Your Services</div>
          <div className="your-container">
                {myservices.map((service) => {
                  return (
                    <div
                      key={service.id}
                    >
                      <span className="your-image-span"
                       onClick={() => handleBookingClick(service.slug)}>
                        {/* {service.images &&
                          service.images.map((img, index) => (
                            <img
                              key={index}
                              src={`http://localhost:8000${img.image}`}
                              alt="hotel"
                              className="your--hotels--image"
                            />
                          ))} */}
                           {service.images &&
                            <img
                              src={`http://localhost:8000${service.images[0].image}`}
                              alt="hotel"
                              className="your--hotels--image"
                            />
                           }
                      </span>
                      <h5 className="your-nameee">
                        {service.name}
                      </h5>
                      <p className="your--checkin">
                        {service.location}
                      </p>
                     <span className="booking--req--span">Booking Requests: </span>
                    </div>
                  );
                })}
              </div>
              </div>
              <div className="profile--thirdpart">
          <h5 className="recent-text-booking">Booking List</h5>
          <div className="profile-book--glass"></div>
          <div className="profile--booking--list">
         
            <div className="booking--lists">
            
              <div className="booking-container">
                {bookings.map((booking) => {
                  return (
                    <div
                      key={booking.id}
                      onClick={() => handleBookingClick(booking.slug)}
                    >
                      <h2 className="profile--checkin-nameee">
                        {booking.h_name}
                      </h2>
                      <h2 className="profile--checkin">
                        {booking.check_in_date}
                      </h2>
                      <h2 className="profile--checkout">
                        {booking.check_out_date}
                      </h2>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <div className="profile--rightpart">
          <div className="profile--contribution">
          <div className="profile-contr--glass"></div>
            <h5 className="recent-text">Recent Contributions</h5>
            <div className="profile--contribution--list">
              <ul>
                {allContributors?.length &&
                  allContributors?.map((c) => (
                    <li key={c.id} onClick={() => handleRecentClick(c.slug)}>
                      <div className="image-span">
                        {/* {c.images &&
                          c.images.map((img, index) => (
                            <img
                              key={index}
                              src={`http://localhost:8000${img.image}`}
                              alt="hotel"
                              className="hotels--image"
                            />
                          ))} */}
                           {c.images &&
                            <img
                              src={`http://localhost:8000${c.images[0].image}`}
                              alt="hotel"
                              className="hotels--image"
                            />} 
                      </div>
                      
                      <div className="content-span">
                        <p className="cont--name">{c.name || "Title here"}</p>
                        <br />
                        <p className="cont--add">
                          {c.location || "Address here"}
                        </p>
                      </div>
                    </li>
                  ))}
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
