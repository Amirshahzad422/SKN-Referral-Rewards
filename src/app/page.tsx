import Image from "next/image";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="text-sm text-gray-600 mb-2">
          Home / Dashboard
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      </div>

      {/* Welcome Message and User Status */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Welcome zohaib</h2>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-2">
            <span className="text-white font-bold">Z</span>
          </div>
          <span className="text-sm text-green-600 font-medium">Active</span>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Balance */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-gray-600 text-sm font-medium">Total Balance</h3>
              <p className="text-3xl font-bold text-gray-900">$0.00</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-green-600 text-xl">↗️</span>
            </div>
          </div>
        </div>

        {/* Total Withdraw */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-gray-600 text-sm font-medium">Total Withdraw</h3>
              <p className="text-3xl font-bold text-gray-900">$0.00</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <span className="text-red-600 text-xl">↘️</span>
            </div>
          </div>
        </div>

        {/* Total Direct */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-gray-600 text-sm font-medium">Total Direct</h3>
              <p className="text-3xl font-bold text-gray-900">0</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 text-xl">👤</span>
            </div>
          </div>
        </div>

        {/* Total Team */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-gray-600 text-sm font-medium">Total Team</h3>
              <p className="text-3xl font-bold text-gray-900">0</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <span className="text-orange-600 text-xl">👥</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200">
          PRIVACY POLICY
        </button>
        <button className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200">
          CONTACT US
        </button>
      </div>
    </div>
  );
}
