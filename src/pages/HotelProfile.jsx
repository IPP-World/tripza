import Profile from "./components/Profile.jsx";

export default function HotelProfile() {
  const contributions = [
    { name: "Hotel Contribution 1", location: "Hotel Location 1" },
    { name: "Hotel Contribution 2", location: "Hotel Location 2" },
  ];

  return (
    <div>
      <h1>Hotel Profile Page</h1>
      <Profile name="Hotel Name" role="Hotel Owner" contributions={contributions} />
    </div>
  );
  }