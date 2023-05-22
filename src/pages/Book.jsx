import {AiOutlineClose} from 'react-icons/Ai'
import "./Book.css"
function Book({slug,closeModal}) {
      return(<>
         <div className="book-wrapper" onClick={closeModal}></div>
         <div className="book-container">
         <button className="bookclose--btn" onClick={closeModal}><AiOutlineClose/></button>
         <span className='book-title'>Book service</span>
         </div>
       </>);
       };


export default Book