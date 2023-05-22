import './Booking.css'
import axios from 'axios';
import {useState} from 'react'
const Booking = ({slug}) => {
    // const [numOfGuests, setNumOfGuests] = useState('')
    // const [checkInDate, setCheckInDate] = useState('')
    // const [checkOutDate, setCheckOutDate] = useState('')
    const [booking, setBooking] = useState({
        guest_no: "",
       check_in_date:"",
       check_out_date:""
      });
      const handleChange = (e) => {
        setBooking({ ...booking, [e.target.name]: e.target.value });
      };
  async function getbooking() {
        
        const config = {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("access")}`,
            },
          };
          const body = JSON.stringify({
            // guest:numOfGuests,
            // check_in_date:checkInDate,
            // check_out_date:checkOutDate
             guest_no:booking.guest_no,
             check_in_date:new Date(booking.check_in_date).toISOString().split('T')[0],
            check_out_date:new Date(booking.check_out_date).toISOString().split('T')[0]

          });
          console.log(body);
      
          

          axios
          .post(`${process.env.REACT_APP_API_URL}/api/book/${slug}/`, body, config)
          .then((res) => {
            console.log(res);
            // setIsSubscribed(true);
          })
          .catch((e) => {
            console.error(e);
            alert("Error calling API");
          });
    }
     
    const handleSubmit=(e)=>{
        // e.preventDefault()
        getbooking();
    }

    return(
        <div className="booking--body">
            <form className="booking-form" onSubmit={handleSubmit}>
            <label htmlFor="CheckinDate"> Number of Guests</label>
                <input
                type="number"
                name="guest_no"
                placeholder="Default 1"
                onChange={(e) => handleChange(e)}
                />
        
          
            <label htmlFor="CheckinDate"> Check-in Date*</label>
            <input
              className="booking--inputbox"
              type="date"
              placeholder=""
              name="check_in_date"
              onChange={(e) => handleChange(e)}
            />
           
              <label htmlFor="CheckoutDate"> Check-out Date*</label>
            <input
              className="booking--inputbox"
              type="date"
              placeholder=""
              name="check_out_date"
              onChange={(e) => handleChange(e)}
            />

            <div className="signup--general">
        <button className="book-btn" type="submit" >
          Submit
        </button>
      </div>
            </form>
        </div>
    )
}
export default Booking;