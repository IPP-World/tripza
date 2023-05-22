import {AiOutlineClose} from 'react-icons/Ai'
import "./Book.css"
import Booking from './Booking';
function Book({closeModal}) {
      return(<>
         <div className="book-wrapper" onClick={closeModal}></div>
         <div className="book-container">
         <button className="bookclose--btn" onClick={closeModal}><AiOutlineClose/></button>
         <span className='book-title'>Book service</span>
         <Booking/></div>
       </>);
       };


export default Book