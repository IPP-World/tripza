import './Booking.css'
const Booking = () => {


    return(
        <div className="booking--body">
            <form className="booking-form">
            <label htmlFor="CheckinDate"> Number of Guests</label>
                <input
                type="number"
                name="guest_no"
                placeholder="Default 1"
                />
        
          
            <label htmlFor="CheckinDate"> Check-in Date*</label>
            <input
              className="booking--inputbox"
              type="date"
              placeholder=""
              name="check_in_date"
            />
           
              <label htmlFor="CheckoutDate"> Check-out Date*</label>
            <input
              className="booking--inputbox"
              type="date"
              placeholder=""
              name="check_out_date"
            />

            <div className="signup--general">
        <button className="book-btn" type="submit">
          Submit
        </button>
      </div>
            </form>
        </div>
    )
}
export default Booking;