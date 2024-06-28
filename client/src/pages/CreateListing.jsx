/* eslint-disable react/jsx-key */
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useState } from "react";
import { app } from "../firebase";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function CreateListing() {
  const [error, setError] = useState("");
  const [loading, setloading] = useState(false);
  const [files, setfiles] = useState([]);
  const navigate = useNavigate();
  const [formData, setformData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 0,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [imageUploadError, setimageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  // console.log(currentUser);
  console.log(formData);
  const handleimageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      const promises = [];
      setUploading(true);

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setformData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setimageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setimageUploadError("image upload failed (2 mb max per image)");
          setUploading(false);
        });
    } else {
      setimageUploadError("You caan only upload 6 image per listing");
      setUploading(false);
    }
  };
  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name.replace(/[.,-]/g, "");
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is" + Math.round(progress) + "% done" + fileName);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handlerRemoveimage = (index) => {
    setformData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i != index),
    });
  };

  const handleChanges = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setformData({
        ...formData,
        type: e.target.id,
      });
    }
    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setformData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }
    if (
      e.target.type === "text" ||
      e.target.type === "number" ||
      e.target.type === "textarea"
    ) {
      setformData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setloading(true);
    try {
      if (formData.imageUrls.length < 1)
        return setError("you must have to select 1 image");
      if (formData.regularPrice < formData.discountPrice)
        return setError("regular price must be greater than discounted price");
      const res = await fetch("/api/listing/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, userRef: currentUser._id }),
      });
      const data = await res.json();
      setloading(false);
      if (data.success === false) {
        setError(data.message);
      }
      console.log(data._id);
      navigate(`/listing/${data._id}`);
    } catch (err) {
      setError(err.message);
      setloading(false);
    }
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create Listing
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            id="name"
            className="border p-3 rounded-lg"
            placeholder="Name"
            maxLength="62"
            minLength="10"
            onChange={handleChanges}
            value={formData.name}
            required
          />
          <textarea
            type="text"
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="description"
            onChange={handleChanges}
            value={formData.description}
            required
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg"
            id="address"
            onChange={handleChanges}
            value={formData.address}
            required
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={handleChanges}
                checked={formData.type === "sale"}
              />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleChanges}
                checked={formData.type === "rent"}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChanges}
                checked={formData.parking}
              />
              <span>Parking spot</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChanges}
                value={formData.furnished}
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChanges}
                value={formData.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className=" flex items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChanges}
                value={formData.bedrooms}
              />
              <p>Beds</p>
            </div>
            <div className=" flex items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChanges}
                value={formData.bathrooms}
              />
              <p>Baths</p>
            </div>
            <div className=" flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min="1"
                max="10000000000000"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChanges}
                value={formData.regularPrice}
              />
              <div className="flex flex-col items-center">
                <p>Regular Price</p>
                <span className="text-xs">($ / months)</span>
              </div>
            </div>
            {formData.offer && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="discountPrice"
                  min="0"
                  max="10000000000"
                  required
                  className="p-3 border border-gray-300 rounded-lg"
                  onChange={handleChanges}
                  value={formData.discountPrice}
                />
                <div className="flex flex-col items-center">
                  <p>Discounted Price</p>
                  <span className="text-xs">($ / months)</span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              onChange={(e) => setfiles(e.target.files)}
              className="p-3 border border-gray-300 rounded w-full"
              type="file"
              id="images"
              accept="image/*"
              multiple
            />
            <button
              type="button"
              onClick={handleimageSubmit}
              disabled={uploading}
              className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
            >
              {uploading ? "Uploading...." : "Upload"}
            </button>
          </div>
          <p className="text-red-700 text-sm">
            {imageUploadError && imageUploadError}
          </p>

          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div className="flex  justify-between p-3 border rounded-lg">
                <img
                  key={index}
                  src={url}
                  alt="listing image "
                  className="w-20 h-20 object-contain rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handlerRemoveimage(index)}
                  className="text-red-700 rounded-lg uppercase hover:opacity-65"
                >
                  Delete
                </button>
              </div>
            ))}

          <button
            disabled={uploading || loading}
            className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80 "
          >
            CREATE LISTING
          </button>
          <p className="text-red-700">{error ? error : ""}</p>
        </div>
      </form>
    </main>
  );
}

export default CreateListing;
