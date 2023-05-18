import { GrAdd, GrClose } from "react-icons/Gr";
import { AiOutlineClose } from "react-icons/Ai";
import React, { useState, useEffect } from "react";
import RatingStars from "../components/ratings";
import PlaceOffers from "../components/offers";
import MapSection from "../components/maps";
import exifr from "exifr";
import "./Contribute.css";

export default function Contribute() {
  const [showModal, setShowModal] = useState(false);
  const [legitChecked, setLegitChecked] = useState(false);
  const [images, setImages] = useState([]);

  const [placedesc, setPlacedesc] = useState({
    placeName: "",
    placeDescription: "",
    review: "",
  });
  const handleChange = (e) => {
    setPlacedesc({ ...placedesc, [e.target.name]: e.target.value });
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };
  
  const handleImageUpload = async (event) => {
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
  
      reader.onload = async () => {
        const imageData = reader.result;
  
        try {
          const exifData = await exifr.gps(imageData);
          let latitude,longitude;
          if (exifData && exifData.latitude && exifData.longitude) {
            latitude = exifData.latitude;
            longitude = exifData.longitude;
          }
          const metadata = {
            location: { latitude, longitude },
          };
           console.log([latitude,longitude]);
          const objectURL = URL.createObjectURL(file);
          const imageWithMetadata = { objectURL, metadata };
          setImages([...images, imageWithMetadata]);
        } catch (error) {
          console.error('Error extracting metadata:', error);
        }
      };
  
      reader.readAsDataURL(file);
    }
  };


  const handleImageDelete = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const Popup = () => {
    const [level, setLevel] = useState(0);
    const handleIncreaseLevel = () => {
      setLevel((prevLevel) => prevLevel + 1);
    };
    useEffect(() => {
      handleIncreaseLevel();
    }, []);
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
          <p className="reward--text2">You contributed a place</p>
          <div className="reward-points">Reward points</div>
          <div className="level">
            <div
              style={{
                width: "400px",
                backgroundColor: "grey",
                height: "20px",
                borderRadius: "10px",
              }}
            >
              <div
                style={{
                  width: `${level * 10}%`,
                  backgroundColor: "#0F4C5C",
                  height: "20px",
                  borderRadius: "10px",
                  display: "inline-flex",
                  maxWidth: "100%",
                  minWidth: "6%",
                }}
              ></div>
            </div>
          </div>
          <div style={{ marginLeft: "17rem", marginTop: "1rem" }}>
            Level {level}
          </div>
        </div>
      </>
    );
  };
  const handleLocationSelect = (location) => {
    console.log("Selected Location:", location);
  };

  const handleOffersSelected = (selectedOffers) => {
    console.log("offers:", selectedOffers);
  };
  const handleRating = (rating) => {
    console.log("rating:", rating);
  };
  const submitHandler = (e) => {
    e.preventDefault();

    if (!location) {
      alert("Please select a location in the map");
      return;
    }
    if (!legitChecked) {
      alert("Please confirm that the information you submitted is legit");
      return;
    }
    if (!images) {
      alert("Please select one or more images");
    }
    setShowModal(true);

    // console.log('Map Markers:', position);
    console.log("description:", placedesc);
    handleOffersSelected;
    handleRating;

    //const latitude = position.lat;
    //const longitude = position.lng;
    const form = e.target;
    const formData = new FormData(form);
    // formData.append('latitude', latitude);
    //formData.append('longitude', longitude);
    //formData.append('image',imageFile);
    //formData.append('rating',rating);
    fetch("/api/contribute/", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          console.log("Form data sent successfully");
        } else {
          console.error("Error sending form data");
        }
      })
      .catch((error) => console.error(error));
  };

  return (
    <div className="contribute-container">
      <div className="left-part">
        <div className="contribute-text">Contribute a place</div>
        <div className="places-container">
    <ul>
      {images.map((imageWithMetadata, index) => (
        <li key={index} className="imageContainer">
          <img src={imageWithMetadata.objectURL} alt={`image-${index}`} />
          <button className="delete-button" onClick={() => handleImageDelete(index)}>
            <GrClose />
          </button>
        </li>
      ))}
      <li>
        <label htmlFor="image-upload" className="add-box">
          <GrAdd className="image-add" />
        </label>
        <input
          id="image-upload"
          type="file"
          multiple
          onChange={handleImageUpload}
          style={{ display: 'none' }}
        />
      </li>
    </ul>
  </div>

        <div className="maps-container">
          <MapSection onLocationSelect={handleLocationSelect} />
        </div>
      </div>
      <div className="right-part">
        <div className="place-info">
          <form onSubmit={submitHandler}>
            <input
              className="place-name1"
              type="text"
              name="placeName"
              placeholder="Name of the place"
              value={placedesc.placeName}
              onChange={handleChange}
            />
            <input
              className="place-name2"
              type="text"
              name="placeDescription"
              placeholder="Description of the place"
              value={placedesc.placeDescription}
              onChange={handleChange}
            />
            <div className="place-offers-text">What this place offers</div>
            <div className="reviews">
              <PlaceOffers onOffersSelected={handleOffersSelected} />
            </div>

            <div className="review-text">Your review of the place</div>

            <div className="review">
              <RatingStars sendRating={handleRating} />
            </div>

            <div className="review-box">
              <input
                type="text"
                name="review"
                placeholder="Review Here"
                onChange={handleChange}
                value={placedesc.review}
              />
            </div>
            <div className="checkbox">
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
            <button className="submit" type="submit">
              Submit
            </button>
            {showModal && <Popup />}
          </form>
        </div>
      </div>
    </div>
  );
        }

