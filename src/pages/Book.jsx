import {AiOutlineClose} from 'react-icons/Ai'
import "./Book.css"
import Booking from './Booking';
function Book({closeModal, slug}) {
      return(<>
         <div className="book-wrapper" onClick={closeModal}></div>
         <div className="book-container">
         <button className="bookclose--btn" onClick={closeModal}><AiOutlineClose/></button>
         <Booking slug={slug}/></div>
       </>);
       };


export default Book