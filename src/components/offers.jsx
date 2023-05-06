import { useState } from 'react';
import { GrAdd } from 'react-icons/Gr';
import './offers.css';

const PlaceOffers = ({ onOffersSelected }) => {
  const [offerList, setOfferList] = useState([
    { text: 'Mountain View', isSelected: false },
    { text: 'Wifi', isSelected: false },
    { text: 'Pets allowed', isSelected: false },
    { text: 'Tiger statue', isSelected: false },
    { text: 'Tiktok zone', isSelected: false },
  ]);

  const [selectedOfferIndexes, setSelectedOfferIndexes] = useState([]);
  const [showAddOfferInput, setShowAddOfferInput] = useState(false);
  const [newOfferText, setNewOfferText] = useState('');

  const handleSelectOffer = (index) => {
    const updatedOfferList = [...offerList];
    updatedOfferList[index].isSelected = !updatedOfferList[index].isSelected;
    setOfferList(updatedOfferList);

    const selectedOfferIndex = selectedOfferIndexes.indexOf(index);
    if (selectedOfferIndex >= 0) {
      setSelectedOfferIndexes(selectedOfferIndexes.filter((i) => i !== index));
    } else {
      setSelectedOfferIndexes([...selectedOfferIndexes, index]);
    }
  };

  const handleAddOffer = () => {
    setShowAddOfferInput(true);
  };

  const handleNewOfferTextChange = (event) => {
    setNewOfferText(event.target.value);
  };

  const handleNewOfferKeyPress = (event) => {
    if (event.key === 'Enter' && newOfferText.trim() !== '') {
      const newOffer = { text: newOfferText.trim(), isSelected: false };
      setOfferList([...offerList, newOffer]);
      setNewOfferText('');
      setShowAddOfferInput(false);
    }
  };

  const handleBlur = () => {
    setShowAddOfferInput(false);
  };

    const selectedOffers = selectedOfferIndexes.map((index) => offerList[index].text);
    onOffersSelected(selectedOffers);


  return (
    <div className="place-offers">
      <div className="place--offerlistbox">
        <span
          className={`place--offerlist ${selectedOfferIndexes.length === offerList.length ? 'selected' : ''}`}
          onClick={() => {
            if (selectedOfferIndexes.length === offerList.length) {
              setSelectedOfferIndexes([]);
              setOfferList(offerList.map((offer) => ({ ...offer, isSelected: false })));
            } else {
              setSelectedOfferIndexes(offerList.map((offer, index) => index));
              setOfferList(offerList.map((offer) => ({ ...offer, isSelected: true })));
            }
          }}
        >
          All
        </span>

        {offerList.map((offer, index) => (
          <span
            key={index}
            className={`place--offerlist ${offer.isSelected ? 'selected' : ''}`}
            onClick={() => handleSelectOffer(index)}
          >
            {offer.text}
          </span>
        ))}

        {showAddOfferInput ? (
          <span className="place--offerlist-add">
            <input
              type="text"
              value={newOfferText}
              onKeyDown={handleNewOfferKeyPress}
              onChange={handleNewOfferTextChange}
              onBlur={handleBlur}
              placeholder="New Offer"
            />
          </span>
         ):  <GrAdd className="place--offerlist" onClick={handleAddOffer}/>
         }
          </div> 
         </div>
        );
        }
     export default PlaceOffers;      
 