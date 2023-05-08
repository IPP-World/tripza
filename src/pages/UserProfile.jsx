import Profile from "./components/Profile.jsx";

export default function UserProfile() {
  const contributions = [
    { name: "Owl Bamboo House", location: "Sidemen,Bali,Indonesia" },
    { name: "Another Contribution", location: "Somewhere else" }
  ];

  return (
    <div>
      <h1>User Profile Page</h1>
      <Profile name="John Doe" role="General User" contributions={contributions} />
    </div>
  );
  }
