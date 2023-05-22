import "./App.css";
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TrendingPlaces from "./components/TrendingPlaces";
import ExplorePlaces from "./components/ExplorePlaces";
import {
  Landing,
  Signup,
  Login,
  Agencies,
  Profile,
  Hotels,
  Contribute,
  Reviews,
  Placeinfo,
  ResetPassword,
  ResetPasswordConfirm,
  EditProfile,
  AddServices,
  Serviceinfo,
  ServiceReviews,
  Booking
} from "./pages";
import Facebook from './containers/Facebook';
import Google from './containers/Google';
import Activate from './containers/Activate';
import { Provider } from 'react-redux';
import store from './store';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/agencies" element={<Agencies />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/editprofile" element={<EditProfile />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path='/facebook' element={<Facebook/>} />
          <Route path='/google' element={<Google/>} />
          <Route path='/reset-password' element={<ResetPassword/>} />
          <Route path='/api/user/reset/:uid/:token' element={<ResetPasswordConfirm/>} />
          <Route path='/activate/:uid/:token' element={<Activate/>} />
          <Route path="/contribute" element={<Contribute />} />
          <Route path="/hotels" element={<Hotels />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/placeinfo/:slug/reviews" element={<Reviews/>} />
          <Route path="/placeinfo/:slug" element={<Placeinfo />} />
          <Route path="/addservices" element={<AddServices />} />
          <Route path="hotels/serviceinfo/:slug" element={<Serviceinfo />} />
          <Route path="/serviceinfo/:slug/reviews" element={<ServiceReviews/>} />
          <Route path="/booking" element={<Booking/>} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
