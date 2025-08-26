export default function CreateAccount() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="text-sm text-gray-600 mb-2">Home / Create Account</div>
        <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
      </div>

      <div className="max-w-2xl mx-auto">{/* reduced from max-w-3xl */}
        <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">Create Account</h2>
          <p className="text-center text-gray-600 mb-8 leading-relaxed">
            تمام ڈیٹا تسلی سے لکھ کر چیک کریں اور پھر <span className="font-semibold">کریئیٹ اکاؤنٹ</span> پر کلک کریں۔
            <br /> اکاؤنٹ بننے کے بعد ڈیٹا تبدیل نہیں ہوتا!
          </p>

          <form className="space-y-6">
            {/* Pin / Token */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pin/Token</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400 text-lg">🔑</span>
                </div>
                <input
                  type="text"
                  placeholder="یہاں نئے صارف کا پن کوڈ لکھیں"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-deep-indigo focus:border-deep-indigo placeholder:text-gray-500 placeholder:opacity-100"
                />
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400 text-lg">👤</span>
                </div>
                <input
                  type="text"
                  placeholder="یہاں نام لکھیں"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-deep-indigo focus:border-deep-indigo placeholder:text-gray-500 placeholder:opacity-100"
                />
              </div>
            </div>

            {/* New user Gmail */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New user Gmail</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400 text-lg">✉️</span>
                </div>
                <input
                  type="email"
                  placeholder="یہاں نئے صارف کی میل لکھیں"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-deep-indigo focus:border-deep-indigo placeholder:text-gray-500 placeholder:opacity-100"
                />
              </div>
            </div>

            {/* Account Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Account Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400 text-lg">🏦</span>
                </div>
                <input
                  type="text"
                  placeholder="نئے صارف کا اکاؤنٹ نمبر لکھیں"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-deep-indigo focus:border-deep-indigo placeholder:text-gray-500 placeholder:opacity-100"
                />
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
              <select className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-deep-indigo focus:border-deep-indigo bg-white text-gray-700">
                <option value="" className="text-gray-500">Choose payment method</option>
                <option value="easypaisa">Easypaisa</option>
                <option value="jazzcash">JazzCash</option>
                <option value="bank">Bank Transfer</option>
              </select>
            </div>

            {/* Account Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Account Title</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400 text-lg">🏷️</span>
                </div>
                <input
                  type="text"
                  placeholder="یہاں اپنے اکاؤنٹ کا نام لکھیں"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-deep-indigo focus:border-deep-indigo placeholder:text-gray-500 placeholder:opacity-100"
                />
              </div>
            </div>

            {/* Under User ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Under User ID</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400 text-lg">👤</span>
                </div>
                <input
                  type="text"
                  placeholder="جس کے نیچے اکاؤنٹ لگانا ہے، اس کی جی میل لکھیں"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-deep-indigo focus:border-deep-indigo placeholder:text-gray-500 placeholder:opacity-100"
                />
              </div>
            </div>

            {/* Left / Right selection */}
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <input id="leg-left" name="leg" type="radio" className="h-4 w-4 text-deep-indigo focus:ring-deep-indigo" />
                <label htmlFor="leg-left" className="text-gray-700">Left</label>
              </div>
              <div className="flex items-center gap-2">
                <input id="leg-right" name="leg" type="radio" className="h-4 w-4 text-deep-indigo focus:ring-deep-indigo" defaultChecked />
                <label htmlFor="leg-right" className="text-gray-700">Right</label>
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3">
              <input id="terms" type="checkbox" className="mt-1 h-4 w-4 rounded border-gray-300 text-deep-indigo focus:ring-deep-indigo" />
              <label htmlFor="terms" className="text-sm text-gray-700">I accept the Terms and Conditions</label>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button type="submit" className="w-full bg-deep-indigo text-white font-semibold py-3 px-6 rounded-lg hover:opacity-90 transition-colors">
                Create Account
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 