import React from 'react';

const Purpose: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Your all-purpose scheduling app
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Discover a variety of our advanced features. Unlimited and free for individuals.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl w-full">
        {/* Top Row */}
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <h3 className="text-xl font-semibold mb-2">Avoid meeting overload</h3>
          <p className="text-gray-600">
            Only get booked when you want to. Set daily, weekly or monthly limits and add buffers around your events to allow you to focus or take a break.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <h3 className="text-xl font-semibold mb-2">Stand out with a custom booking link</h3>
          <p className="text-gray-600">
            Customize your booking link so it’s short and easy to remember for your bookers. No more long, complicated links one can easily forget.
          </p>
          <p className="text-gray-600 mt-2">scheduleHQ</p>
        </div>

        {/* Bottom Row */}
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <h3 className="text-xl font-semibold mb-2">Streamline your bookers’ experience</h3>
          <p className="text-gray-600">Let your bookers overlay their calendar, receive booking confirmations via text or email, get events added to their calendar, and allow them to reschedule with ease.</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <h3 className="text-xl font-semibold mb-2">Reduce no-shows with automated meeting reminders</h3>
          <p className="text-gray-600">Easily send sms or meeting reminder emails about bookings, and send automated follow-ups to gather any relevant information before the meeting.</p>
        </div>
      </div>
    </div>
  );
};

export default Purpose;