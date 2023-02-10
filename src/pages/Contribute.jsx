import {GrAdd} from 'react-icons/Gr';
import {AiFillStar} from 'react-icons/Ai';
import {AiOutlineStar} from 'react-icons/Ai';
import contributionPoints from './contributionPoints';
export default function Contribute(){
    return (<div className="contribute-container">
        <div className="left-part"> 
            <p className="contribute-text">Contribute a Place</p>
            <div className="places-container">
                <ul className="images">
                    <li><img src="/vite.svg"></img></li>
                    <li><span><GrAdd/></span></li>
                </ul>
                </div>
                <div className='maps-container'></div>
          </div>
          <div className='right-part'>
            <div className='place-info'>
                <form method='#'>
                    <input type="text" placeholder='Name of the place'/>
                    <input type="text" placeholder='Description of the place'/>
                    <p>What this place offers</p>
                    <div className='place-offers'>
                        
                    </div>
                    <p>Your review of the place</p>
                    <div className='review'>
                        <span><AiFillStar/></span>
                        <span><AiFillStar/></span>
                        <span><AiFillStar/></span>
                        <span><AiOutlineStar/></span>
                        <span><AiOutlineStar/></span>
                            <form method='#'>
                            <input type="text" placeholder='Review Here'/>
                            <label>
                                <input type="checkbox"/>
                                The information I submitted here is legit.</label><br/>
                        </form>
                    </div>
                    <button type='submit' className='submit' onClick={contributionPoints}>Submit</button>
                </form>
            </div>
          </div>
    </div>);
}