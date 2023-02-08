import Contribute from "./Contribute";
import "./contributionPoints.css";
export default function contributionPoints(){
    return(<div className="">
    <Contribute/>
    <div className="reward">
        <p>Congratulations</p><br/>
        <p>You contributed a place</p><br/>
        <p>Reward Points</p>
        <div className="reward-bar">

        </div>
    </div>
    </div>);
}
