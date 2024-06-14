/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { Camera, LoaderIcon, X } from "lucide-react";
import { RootState } from "../store.js";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { CLEAR_ERRORS, NEW_PING_RESET } from "../constants/index.js";
import { useSelector } from "react-redux";
import { newPing } from "../actions/index.js";
import { Hospital } from "../types/index.js";
import PingChatRoom from "./PingChatRoom.js";

function PingForm({
  selectedHospital,
  onClose,
}: {
  selectedHospital: Hospital|null;
  onClose: () => void;
}) {
  const [fullName, setFullName] = useState<string>("");
  const [complaints, setComplaints] = useState<string>("");
  const [image, setImage] = useState<string | undefined>("");
  const [showChat, setShowChat] = useState(false);

  const { message, error, loading } = useSelector(
    (state: RootState) => state.ping
  );
  const dispatch = useDispatch();
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch({ type: CLEAR_ERRORS });
    }

    if (message) {
      toast.success(message);
      dispatch({ type: NEW_PING_RESET });
      onClose();
    }
  }, [dispatch, error, message]);

  const handleFullNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFullName(e.target.value);
  };

  const handleComplaintsChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setComplaints(e.target.value);
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setImage(reader.result as string);
      }
    };

    e.target.files && reader.readAsDataURL(e.target.files[0]);
  };

  const handleRemoveImage = () => {
    setImage("");
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch<any>(
      newPing("token", {
        fullname: fullName,
        complaints,
        image,
        hospitalId: selectedHospital?.$id,
      })
    );
    onClose();
    setShowChat(true);
  };

  return (
    <div className="fixed p-2 top-0 left-0 w-full h-full flex justify-center items-center bg-opacity-50 bg-gray-800 bg-blur">
      <div className="max-w-md w-full px-4 py-8 bg-white shadow-md rounded-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 focus:outline-none"
        >
          <X size={20} />
        </button>
        <h2 className="text-xl font-semibold mb-6 text-center">
          Ping-- {selectedHospital?.hospitalName}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="fullName" className="block mb-1 font-medium">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={handleFullNameChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
              placeholder="Enter your full name"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="complaints" className="block mb-1 font-medium">
              Complaints
            </label>
            <textarea
              id="complaints"
              value={complaints}
              onChange={handleComplaintsChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
              rows={4}
              placeholder="Enter your complaints"
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label htmlFor="image" className="block mb-1 font-medium">
              Upload Image
            </label>
            <input
              type="file"
              id="image"
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
            {image ? (
              <div className="flex items-center justify-between border border-gray-300 rounded-md p-2">
                <img
                  src={image}
                  alt="Uploaded"
                  className="w-12 h-12 mr-2 object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="text-red-500 hover:text-red-600 focus:outline-none"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <label
                htmlFor="image"
                className="flex items-center cursor-pointer text-indigo-500 hover:text-indigo-600"
              >
                <Camera className="mr-2" size={20} />
                Upload Image
              </label>
            )}
          </div>
          <div className="text-center">
            <button
              disabled={loading}
              type="submit"
              className={`w-full px-4 py-2 flex align-middle justify-center gap-5 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                loading
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {loading && <LoaderIcon size={20} className="animate-spin" />}
              {!loading && "Submit"}
            </button>
          </div>
        </form>
      </div>
      {showChat && (
        <PingChatRoom
          pingDetails={{ image, complaints, fullname: fullName }}
          selectedHospital={selectedHospital}
        />
      )}
    </div>
  );
}

export default PingForm;
