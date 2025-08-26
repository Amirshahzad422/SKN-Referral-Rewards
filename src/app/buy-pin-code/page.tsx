export default function BuyPinCode() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="text-sm text-gray-600 mb-2">
          Home / Buy Pin-Code
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Buy Pin-Code</h1>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Payment Instructions Card */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Request a PIN for Your Account</h2>
          
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
            <p className="text-blue-800 text-lg font-medium mb-2">
              اپنی پن خریدنے کی ادائیگی یہاں اس نمبر پر بھیجنی ہے۔
            </p>
            <p className="text-blue-700 text-sm">
              Payment for buying your PIN should be sent to this number.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
                <span className="text-green-600 text-lg">👤</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Account Title</p>
                <p className="font-semibold text-gray-900">Ambreen Khatoon</p>
              </div>
            </div>

            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <span className="text-blue-600 text-lg">🏦</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Bank</p>
                <p className="font-semibold text-gray-900">Easypaisa</p>
              </div>
            </div>

            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                <span className="text-purple-600 text-lg">🔢</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Account Number</p>
                <p className="font-semibold text-gray-900">03485672083</p>
              </div>
            </div>
          </div>
        </div>

        {/* PIN Request Form Card */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">PIN Request</h2>
          
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <p className="text-red-800 text-sm leading-relaxed">
              یاد رکھیں جعلی ٹرانزیکشن آئ ڈی یا جعلی پن ریکوسٹ لگانے سے آپکی سروس معطل ہو جائے گے تسلی سے درست معلومات درج کریں تاکہ دشواری کا سامنا نہ کرنا پڑے
            </p>
            <p className="text-red-700 text-sm mt-2">
              Remember, submitting a fake transaction ID or a fake PIN request will suspend your service. Please enter correct information carefully to avoid any inconvenience.
            </p>
          </div>

          <form className="space-y-6">
            {/* Account Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400 text-lg">👤</span>
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-deep-indigo focus:border-deep-indigo transition-colors"
                  placeholder="Enter your account number"
                />
              </div>
            </div>

            {/* Transaction ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trx ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400 text-lg">📄</span>
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-deep-indigo focus:border-deep-indigo transition-colors"
                  placeholder="Enter transaction ID"
                />
              </div>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400 text-lg">💰</span>
                </div>
                <input
                  type="number"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-deep-indigo focus:border-deep-indigo transition-colors"
                  placeholder="Enter amount"
                />
              </div>
            </div>

            {/* Payment Screenshot */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Screenshot
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400 text-lg">📷</span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-deep-indigo focus:border-deep-indigo transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-deep-indigo file:text-white hover:file:bg-opacity-80"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                REQUEST PIN
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 