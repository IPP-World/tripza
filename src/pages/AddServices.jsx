import { GrAdd, GrClose } from "react-icons/Gr";
import { AiOutlineClose } from "react-icons/Ai";
import React, { useState, useEffect } from "react";
import RatingStars from "../components/ratings";
import MapSection from "../components/maps";
import exifr from "exifr";
import axios from "axios";
import "./Addservices.css";

export default function AddServices() {
  const [showModal, setShowModal] = useState(false);
  const [legitChecked, setLegitChecked] = useState(false);
  const [images, setImages] = useState([]);
  const [positionMarked, setPositionMarked] = useState(false);
  // const [photolat, setPhotolat] = useState(0);
  // const [photolon, setPhotolon] = useState(0);
  const [maplat, setMaplat] = useState(null);
  const [maplon, setMaplon] = useState(null);
  // const[offerlist,setOfferList]= useState({})
  // const [offers, setOffers] = useState({});
  const [ratingValue, setRatingValue] = useState(null);

  // const handleOfferChange = (value) => {
  //   const {offers} = value.target;
  //   const stringOffers = value.split('\n')
  //   set
  // };
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/hotel/my-hotels/",
          {
            headers: {
              "Content-Type": "application/form-data",
              Authorization: `Bearer ${localStorage.getItem("access")}`,
            },
          }
        );
        const Mydata = response.data;
        console.log("mydata:", Mydata);
        const myslug = Mydata.map((item) => item.slug);
        console.log("myslug", myslug);
        let flag = false;
        for (let i = 0; i < myslug.length; i++) {
          if (myslug[i] === slug) {
            flag = true;
            break;
          }
        }
        console.log(flag);
        setContributorFlag(flag);
        console.log("contributorflag:", contributorflag);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData().catch((error) => console.error(error));
  }, []);


  const handleInputChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setIsDropdownOpen(false);
  };

  const options = [
    "Room",
    "Restaurant",
    "Camping",
    "View Tower",
    "Boating",
    "Swimming Pool",
    "Bungee",
    "Rafting",
    "Travel Agency",
    "Tour Operators",
  ];

  const [servicedesc, setServicedesc] = useState({
    placeName: "",
    placeDescription: "",
    location: "",
    price:"",
    review:""
  });
  const handleChange = (e) => {
    setServicedesc({ ...servicedesc, [e.target.name]: e.target.value });
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleImageUpload = async (event) => {
    const files = event.target.files;
     for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
          const imageData = reader.result;

        try {
          const exifData = await exifr.gps(imageData);
          if (exifData && exifData.latitude && exifData.longitude) {
            setPhotolat(exifData.latitude);
            setPhotolon(exifData.longitude);
          }

          setImages([...images, {file, imageData}]);
        } catch (error) {
          console.error("Error extracting metadata:", error);
        }
      };
      setImageAdded(true);
    }
  }

  const handleImageDelete = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    console.log(index);
    if (index == 0) {
      setImageAdded(false);
    } else {
      setImageAdded(true);
    }
  };

  const handleLocationSelect = (location) => {
    console.log("Selected Location:", location);
    setMaplat(location.latitude);
    setMaplon(location.longitude);
    setPositionMarked(true);
  };
  const handleRating = (rating) => {
    console.log("rating:", rating);
    setRatingValue(rating);
  };

  // const handleOffersSelected = (selectedOffers) => {
  //   console.log("offers:", selectedOffers);
  //   setOfferList(selectedOffers);
  // };

  const submitHandler = (e) => {
    e.preventDefault();

    // if (!position) {
    //   alert("Please select a location in the map");
    //   return;
    // }
    if (!selectedOption) {
      alert("Please select a category");
      return;
    }

    if (!legitChecked) {
      alert("Please confirm that the information you submitted is legit");
      return;
    }
    if (!images) {
      alert("Please select one or more images");
    }
    if (!ratingValue) {
      alert("Please give your ratings");
      return;
    }
    if (!positionMarked) {
      alert("Please point location in the map");
      return;
    }
    // setShowModal(true);

    // console.log("selectedcategory:", selectedCategory);
    // console.log("description:", placedesc);
    // handleOffersSelected;

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("access")}`,
      },
    };

    // const body = JSON.stringify({
    //   name: servicedesc.placeName,
    //   location: servicedesc.location,
    //   description: servicedesc.placeDescription,
    //   review: servicedesc.review,
    //   price:servicedesc.price,
    //   latitude: maplat,
    //   longitude: maplon,
    //   category: selectedOption,
    //   rating: ratingValue

    //   // metalongitude: photolon,
    //   // metalatitude: photolat,
    //   // rating: ratingValue
    // });
    const formData = new FormData();
    formData.append("name", servicedesc.placeName);
    formData.append("location", servicedesc.location);
    formData.append("description", servicedesc.placeDescription);
    formData.append("latitude", maplat);
    formData.append("longitude", maplon);
    formData.append("rating", ratingValue);
    formData.append("review",servicedesc.review);
    formData.append("price",servicedesc.price);
    formData.append("category",selectedOption);


    images.forEach(image=>{
      formData.append('images', image.file)
    })


    axios
      .post(`${process.env.REACT_APP_API_URL}/api/hotel/`, formData, config)
      .then((res) => {
        console.log(res);
        setShowModal(true);
      })
      .catch((e) => {
        console.error(e);
        alert("Error sending details");
      });
  };
  
  const Popup = () => {
    return (
      <>
        <div className="reward-wrapper" onClick={handleCloseModal}></div>
        <div className="reward-container">
          <div
            className="reward--close-btnn"
            onClick={() => setShowModal(false)}
          >
            <AiOutlineClose />
          </div>
          <p className="reward--text1">Congratulations</p>
          <p className="reward--text2">You successfully added a service</p>
        </div>
      </>
    );
  };

  return (
    <div className="contribute-container">
      <div className="left-part">
        <div className="contribute-text">
          <h4>Add a service</h4>
        </div>
        <div className="contribute--add">
          <p>Add images</p>
        </div>
        <div className="services--image-container">
          <div className="services--places-container">
            <ul>
              {images.map((imageWithMetadata, index) => (
                <li key={index} className="services--imageContainer">
                  <img
                    src={images[index].imageData}
                    alt={`image-${index}`}
                  />
                  <button
                    className="services--delete-button"
                    onClick={() => handleImageDelete(index)}
                  >
                    <GrClose />
                  </button>
                </li>
              ))}
              <li>
                <label htmlFor="image-upload" className="services--add-box">
                  <GrAdd className="image-add" />
                </label>
                <input
                  id="image-upload"
                  type="file"
                  multiple
                  onChange={handleImageUpload}
                  style={{ display: "none" }}
                />
              </li>
            </ul>
          </div>
        </div>

        <div className="maps-container">
          <p className="contribute--addmap">Add place on map</p>
          <MapSection onLocationSelect={handleLocationSelect} />
        </div>
      </div>
      <div className="right-part">
        <div className="services--place-info">
          <form onSubmit={submitHandler}>
            <input
              className="services--place-name1"
              type="text"
              name="placeName"
              placeholder="Name of the place"
              value={servicedesc.placeName}
              onChange={handleChange}
            />
            <input
              className="services--place-name2"
              type="text"
              name="location"
              placeholder="Location"
              value={servicedesc.location}
              onChange={handleChange}
            />
            <input
              className="services--place-name2"
              type="text"
              name="placeDescription"
              placeholder="Description of the place"
              value={servicedesc.placeDescription}
              onChange={handleChange}
            />
            {/* <div className="services--place-offers-text"><h3>Services provided</h3></div> */}
            {/* <div className="reviews">
              <PlaceOffers onOffersSelected={handleOffersSelected} />
            </div> */}

            <div className="dropdown-container">
              <h3 className="services--selectcategory">Select Category</h3>
              <input
                className="services--input"
                type="text"
                value={selectedOption}
                placeholder="Hover to select a category"
                onChange={handleInputChange}
                onMouseEnter={() => setIsDropdownOpen(true)}
                readOnly
              />
              {isDropdownOpen && (
                <ul
                  className="dropdown-list"
                  onMouseLeave={() => setIsDropdownOpen(false)}
                >
                  {options.map((option) => (
                    <li key={option} onClick={() => handleOptionSelect(option)}>
                      {option}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="pricing-container">
              <h3>Pricing</h3>
              <div className="offer-row">
                <input
                  type="number"
                  placeholder="Rate (NRS)"
                  name="price"
                  value={servicedesc.price}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="review-text">Your review of the service</div>
              <div className="review">
                <RatingStars sendRating={handleRating} />
              </div>
              <div className="review-box">
                <input
                  type="text"
                  name="review"
                  placeholder="Review Here"
                  onChange={handleChange}
                  value={servicedesc.review}
                />
              </div>

            <div className="services--checkbox">
              <label required>
                <input
                  type="checkbox"
                  checked={legitChecked}
                  onChange={() => setLegitChecked(!legitChecked)}
                />
                The information I submitted here is legit.
              </label>
            </div>
            <br />
            <button className="services--submit" type="submit">
              Submit
            </button>
            {showModal && <Popup />}
          </form>
        </div>
      </div>
    </div>
  );
}
