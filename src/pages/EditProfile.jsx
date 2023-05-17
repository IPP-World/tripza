import React, { useState } from 'react';
import AvatarEdit from 'react-avatar-edit';

const EditProfile = () => {
  const [preview, setPreview] = useState(null);

  const handleImageChange = (data) => {
    if (data) {
      setPreview(data);
    }
  };

  const handleCrop = (preview) => {
    setPreview(preview);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Perform form submission with name and preview image
    console.log('Preview Image:', preview);
    // Reset form fields and preview image state
    setPreview(null);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <br />
        <label>
          Picture:
          <AvatarEdit
            width={200}
            height={200}
            onCrop={handleCrop}
            onClose={() => setPreview(null)}
            onFileLoad={handleImageChange}
          />
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
      {preview && (
        <div>
          <h2>Preview:</h2>
          <img src={preview} alt="Preview" />
        </div>
      )}
    </div>
  );
};

export default EditProfile;
