import React from 'react';

const MainContent: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          With us, appointment scheduling is easy
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Effortless scheduling for business and individuals, powerful solutions for fast-growing modern companies.
        </p>
        <button className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-700">
          Get started <span className="ml-2">▶</span>
        </button>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
        {/* Card 1 */}
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <div className="text-2xl font-bold mb-2">01</div>
          <h3 className="text-xl font-semibold mb-2">Connect your calendar</h3>
          <p className="text-gray-600">
            We'll handle all the cross-referencing, so you don't have to worry about double bookings.
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <div className="text-2xl font-bold mb-2">02</div>
          <h3 className="text-xl font-semibold mb-2">Set your availability</h3>
          <p className="text-gray-600">
            Want to block off weekends? Set up any buffers? We make that easy.
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <div className="text-2xl font-bold mb-2">03</div>
          <h3 className="text-xl font-semibold mb-2">Choose how to meet</h3>
          <p className="text-gray-600">
            It could be a video chat, phone call, or a walk in the park!
          </p>
        </div>
      </div>
    </div>
  );
};

export default MainContent;
