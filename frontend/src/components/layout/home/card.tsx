import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import image1 from '../../../../src/assets/images/calender.jpg'; 
import image2 from '../../../../src/assets/images/calender1.jpg'; 

const CardComponent: React.FC = () => {
  const [currentImage, setCurrentImage] = useState(image1);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage === image1 ? image2 : image1));
    }, 5000); 

    return () => clearInterval(interval); 
  }, []);

  const navigate = useNavigate();

  const handleEmailSignup = () => {
    navigate('/emailSignup')
  }

  const handleGoogleSignup = () => {
    navigate('/emailLogin')
  }

  return (
    <div className="flex justify-center items-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full mx-8 flex flex-col md:flex-row">
        {/* Left Section */}
        <div className="md:w-1/2 p-4">
          <span className="inline-block bg-gray-200 text-gray-700 text-sm px-2 py-1 rounded-full mb-4">
            SchduleHQ launches v6.7
          </span>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            The better way to schedule your meetings
          </h1>
          <p className="text-gray-600 mb-6">
            A fully customizable scheduling software for individuals, businesses taking calls and developers building scheduling platforms where users meet users.
          </p>
          <div className="flex flex-col space-y-4">
            <button className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 w-full md:w-auto"
              onClick={handleGoogleSignup}>
              Sign up with Google
            </button>
            <button className="bg-white text-black px-6 py-2 border border-gray-300 rounded-full hover:bg-gray-50 w-full md:w-auto"
            onClick={handleEmailSignup}>
              Sign up with email
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-2">No credit card required</p>
        </div>

        {/* Right Section */}
        <div className="md:w-2/3 p-7 flex flex-col items-center">
          <img src={currentImage} alt="Dynamic Image" className="w-full h-60 object-cover rounded-lg mb-4" />
         
             <div className="mt-20">
              <span className="text-green-500">★★★★★</span>
              <span className="text-gray-500 ml-2">Trustpilot</span>
            </div>
            <div className="mt-2">
              <span className="text-yellow-500">★★★★☆</span>
              <span className="text-gray-500 ml-2">Product Hunt</span>
            </div>
            <div className="mt-2">
              <span className="text-red-500">★★★★★</span>
              <span className="text-gray-500 ml-2">G2</span>
            </div>
         
          </div>
        </div>
    </div>
  );
};

export default CardComponent;


