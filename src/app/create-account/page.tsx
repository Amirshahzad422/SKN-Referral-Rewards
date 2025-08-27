'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateAccount() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState('');

  // Tree status
  const [treeStatus, setTreeStatus] = useState({
    leftCount: 0,
    rightCount: 0,
    canAddLeft: true,
    canAddRight: true,
    canAddAny: true,
    status: 'paymentpending'
  });

  // Form data
  const [formData, setFormData] = useState({
    pinToken: '',
    username: '',
    email: '',
    phone: '',
    accountNumber: '',
    paymentMethod: '',
    accountTitle: '',
    underUserId: '',
    leg: 'right' as 'left' | 'right',
    password: ''
  });

  const validatePassword = (value: string) => {
    if (value.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/[A-Z]/.test(value)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/[a-z]/.test(value)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/[0-9]/.test(value)) {
      return 'Password must contain at least one number';
    }
    return '';
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setFormData(prev => ({ ...prev, password: value }));
    setPasswordError(validatePassword(value));
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear field error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Fetch tree status on component mount
  const fetchTreeStatus = async () => {
    try {
      const response = await fetch('/api/user/tree-status');
      const data = await response.json();
      
      if (data.success) {
        setTreeStatus(data.data);
        // Set default leg based on availability
        if (data.data.canAddLeft && !data.data.canAddRight) {
          setFormData(prev => ({ ...prev, leg: 'left' }));
        } else if (!data.data.canAddLeft && data.data.canAddRight) {
          setFormData(prev => ({ ...prev, leg: 'right' }));
        }
      } else {
        setServerError('Failed to load tree status');
      }
    } catch (error) {
      setServerError('Network error loading tree status');
    } finally {
      setIsLoading(false);
    }
  };

  // Load tree status on mount
  useEffect(() => {
    fetchTreeStatus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setServerError('');
    setFormErrors({});

    try {
      const response = await fetch('/api/account/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          setFormErrors(data.errors);
        } else {
          setServerError(data.error || 'Failed to create account');
        }
        return;
      }

      // Success - redirect to dashboard
      alert('Account created successfully!');
      router.push('/');
    } catch (error) {
      setServerError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

      if (isLoading) {
      return (
        <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-deep-indigo mx-auto mb-4"></div>
            <p className="text-gray-600">Loading tree status...</p>
          </div>
        </div>
      );
    }

    // Helper function to get status alert content
    const getStatusAlert = () => {
      switch (treeStatus.status) {
        case 'paymentpending':
          return {
            title: 'Payment Pending',
            message: 'Your account payment is pending. Please complete the payment to access account creation.',
            icon: '💰',
            color: 'red',
            action: {
              text: 'Buy Pin Code',
              href: '/buy-pin-code'
            }
          };
        case 'verificationpending':
          return {
            title: 'Verification Pending',
            message: 'Your account is under verification. Please wait for admin approval.',
            icon: '🔍',
            color: 'blue',
            action: null
          };
        case 'rejected':
          return {
            title: 'Account Rejected',
            message: 'Your account has been rejected. Please contact support for assistance.',
            icon: '❌',
            color: 'red',
            action: null
          };
        default:
          return null;
      }
    };

    const statusAlert = getStatusAlert();
    const isStatusBlocking = treeStatus.status !== 'verified';

    return (
      <div className={`min-h-screen bg-gray-50 p-6 ${!treeStatus.canAddAny ? 'opacity-50 pointer-events-none' : ''}`}>
        {/* Header */}
        <div className="mb-8">
          <div className="text-sm text-gray-600 mb-2">Home / Create Account</div>
          <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
        </div>

        {/* Status Alert */}
        {statusAlert && (
          <div className="max-w-2xl mx-auto mb-6">
            <div className={`bg-${statusAlert.color}-50 border border-${statusAlert.color}-200 rounded-lg p-6 shadow-sm`}>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <span className={`text-${statusAlert.color}-400 text-2xl`}>{statusAlert.icon}</span>
                </div>
                <div className="ml-4 flex-1">
                  <h3 className={`text-lg font-semibold text-${statusAlert.color}-800 mb-2`}>
                    {statusAlert.title}
                  </h3>
                  <p className={`text-sm text-${statusAlert.color}-700 mb-4 leading-relaxed`}>
                    {statusAlert.message}
                  </p>
                  {statusAlert.action && (
                    <button
                      onClick={() => router.push(statusAlert.action.href)}
                      className={`bg-deep-indigo text-white px-6 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-colors`}
                    >
                      {statusAlert.action.text}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tree Status Alert */}
        {!treeStatus.canAddAny && (
          <div className="max-w-2xl mx-auto mb-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <span className="text-red-400 text-lg">⚠️</span>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    No Available Positions
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>You cannot add any more children to your tree.</p>
                    <p className="mt-1">Left Count: {treeStatus.leftCount} | Right Count: {treeStatus.rightCount}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className={`max-w-2xl mx-auto ${isStatusBlocking ? 'opacity-50 pointer-events-none' : ''}`}>
          <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">Create Account</h2>
          <p className="text-center text-gray-600 mb-8 leading-relaxed">
            تمام ڈیٹا تسلی سے لکھ کر چیک کریں اور پھر <span className="font-bold text-lg underline text-deep-indigo">کریئیٹ اکاؤنٹ</span> پر کلک کریں۔
            <br /> اکاؤنٹ بننے کے بعد ڈیٹا تبدیل نہیں ہوتا!
          </p>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Referral Person Details Section */}
            <div className="space-y-4 p-6 border border-gray-200 rounded-lg shadow-sm bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Referral Person Details</h3>
              
              {/* Pin / Token */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pin/Token</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400 text-lg">🔑</span>
                  </div>
                  <input
                    type="text"
                    value={formData.pinToken}
                    onChange={(e) => handleInputChange('pinToken', e.target.value)}
                    placeholder="یہاں نئے صارف کا پن کوڈ لکھیں"
                    className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-deep-indigo focus:border-deep-indigo placeholder:text-gray-500 placeholder:opacity-100 ${
                      formErrors.pinToken ? 'border-red-400' : 'border-gray-300'
                    }`}
                  />
                </div>
                {formErrors.pinToken && (
                  <p className="text-xs text-red-600 mt-1">{formErrors.pinToken}</p>
                )}
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
                    value={formData.underUserId}
                    onChange={(e) => handleInputChange('underUserId', e.target.value)}
                    placeholder="جس کے نیچے اکاؤنٹ لگانا ہے، اس کی جی میل لکھیں"
                    className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-deep-indigo focus:border-deep-indigo placeholder:text-gray-500 placeholder:opacity-100 ${
                      formErrors.underUserId ? 'border-red-400' : 'border-gray-300'
                    }`}
                  />
                </div>
                {formErrors.underUserId && (
                  <p className="text-xs text-red-600 mt-1">{formErrors.underUserId}</p>
                )}
              </div>

              {/* Left / Right selection */}
              <div className="space-y-3">
                <div className="flex items-center gap-8">
                  <div className="flex items-center gap-2">
                    <input 
                      id="leg-left" 
                      name="leg" 
                      type="radio" 
                      checked={formData.leg === 'left'}
                      onChange={() => handleInputChange('leg', 'left')}
                      disabled={!treeStatus.canAddLeft}
                      className={`h-4 w-4 focus:ring-deep-indigo ${
                        treeStatus.canAddLeft 
                          ? 'text-deep-indigo' 
                          : 'text-gray-300 cursor-not-allowed'
                      }`}
                    />
                    <label 
                      htmlFor="leg-left" 
                      className={`${
                        treeStatus.canAddLeft 
                          ? 'text-gray-700' 
                          : 'text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      Left
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input 
                      id="leg-right" 
                      name="leg" 
                      type="radio" 
                      checked={formData.leg === 'right'}
                      onChange={() => handleInputChange('leg', 'right')}
                      disabled={!treeStatus.canAddRight}
                      className={`h-4 w-4 focus:ring-deep-indigo ${
                        treeStatus.canAddRight 
                          ? 'text-deep-indigo' 
                          : 'text-gray-300 cursor-not-allowed'
                      }`}
                    />
                    <label 
                      htmlFor="leg-right" 
                      className={`${
                        treeStatus.canAddRight 
                          ? 'text-gray-700' 
                          : 'text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      Right
                    </label>
                  </div>
                </div>
                
                {/* Tree Status Display */}
                {(treeStatus.leftCount > 0 || treeStatus.rightCount > 0) && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="text-sm text-blue-800">
                      <span className="font-medium">Tree Status:</span>
                      {treeStatus.leftCount > 0 && (
                        <span className="ml-2 text-red-600">Left Count: {treeStatus.leftCount} (Disabled)</span>
                      )}
                      {treeStatus.leftCount > 0 && treeStatus.rightCount > 0 && (
                        <span className="mx-2 text-gray-500">|</span>
                      )}
                      {treeStatus.rightCount > 0 && (
                        <span className="ml-2 text-red-600">Right Count: {treeStatus.rightCount} (Disabled)</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
              {formErrors.leg && (
                <p className="text-xs text-red-600 mt-1">{formErrors.leg}</p>
              )}
            </div>

            {/* Payment Details Section */}
            <div className="space-y-4 p-6 border border-gray-200 rounded-lg shadow-sm bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Payment Details</h3>
              
              {/* Account Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Account Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400 text-lg">🏦</span>
                  </div>
                  <input
                    type="text"
                    value={formData.accountNumber}
                    onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                    placeholder="نئے صارف کا اکاؤنٹ نمبر لکھیں"
                    className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-deep-indigo focus:border-deep-indigo placeholder:text-gray-500 placeholder:opacity-100 ${
                      formErrors.accountNumber ? 'border-red-400' : 'border-gray-300'
                    }`}
                  />
                </div>
                {formErrors.accountNumber && (
                  <p className="text-xs text-red-600 mt-1">{formErrors.accountNumber}</p>
                )}
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                <select 
                  value={formData.paymentMethod}
                  onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                  className={`block w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-deep-indigo focus:border-deep-indigo bg-white text-gray-700 ${
                    formErrors.paymentMethod ? 'border-red-400' : 'border-gray-300'
                  }`}
                >
                  <option value="" className="text-gray-500">ادائیگی کا طریقہ منتخب کریں</option>
                  <option value="easypaisa">Easypaisa</option>
                  <option value="jazzcash">JazzCash</option>
                </select>
                {formErrors.paymentMethod && (
                  <p className="text-xs text-red-600 mt-1">{formErrors.paymentMethod}</p>
                )}
              </div>

              {/* Account Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Account Title
                  <span className="text-xs text-gray-500">(for verification)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400 text-lg">🏷️</span>
                  </div>
                  <input
                    type="text"
                    value={formData.accountTitle}
                    onChange={(e) => handleInputChange('accountTitle', e.target.value)}
                    placeholder="یہاں اپنے اکاؤنٹ کا نام لکھیں"
                    className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-deep-indigo focus:border-deep-indigo placeholder:text-gray-500 placeholder:opacity-100 ${
                      formErrors.accountTitle ? 'border-red-400' : 'border-gray-300'
                    }`}
                  />
                </div>
                {formErrors.accountTitle && (
                  <p className="text-xs text-red-600 mt-1">{formErrors.accountTitle}</p>
                )}
              </div>
            </div>

            {/* New User Details Section */}
            <div className="space-y-4 p-6 border border-gray-200 rounded-lg shadow-sm bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">New User Details</h3>
              
              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400 text-lg">👤</span>
                  </div>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    placeholder="یہاں نام لکھیں"
                    className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-deep-indigo focus:border-deep-indigo placeholder:text-gray-500 placeholder:opacity-100 ${
                      formErrors.username ? 'border-red-400' : 'border-gray-300'
                    }`}
                  />
                </div>
                {formErrors.username && (
                  <p className="text-xs text-red-600 mt-1">{formErrors.username}</p>
                )}
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
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="یہاں نئے صارف کی میل لکھیں"
                    className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-deep-indigo focus:border-deep-indigo placeholder:text-gray-500 placeholder:opacity-100 ${
                      formErrors.email ? 'border-red-400' : 'border-gray-300'
                    }`}
                  />
                </div>
                {formErrors.email && (
                  <p className="text-xs text-red-600 mt-1">{formErrors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400 text-lg">📞</span>
                  </div>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="یہاں فون نمبر لکھیں"
                    className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-deep-indigo focus:border-deep-indigo placeholder:text-gray-500 placeholder:opacity-100 ${
                      formErrors.phone ? 'border-red-400' : 'border-gray-300'
                    }`}
                  />
                </div>
                {formErrors.phone && (
                  <p className="text-xs text-red-600 mt-1">{formErrors.phone}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400 text-lg">🔒</span>
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder="یہاں پاس ورڈ لکھیں"
                    className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-deep-indigo focus:border-deep-indigo placeholder:text-gray-500 placeholder:opacity-100 ${
                      passwordError ? 'border-red-400' : 'border-gray-300'
                    }`}
                  />
                </div>
                {passwordError && (
                  <p className="text-xs text-red-600 mt-1">{passwordError}</p>
                )}
              </div>
            </div>

            {/* Server Error */}
            {serverError && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                {serverError}
              </div>
            )}

            {/* Terms */}
            <div className="flex items-start gap-3">
              <input 
                id="terms" 
                type="checkbox" 
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-deep-indigo focus:ring-deep-indigo" 
              />
              <label htmlFor="terms" className="text-sm text-gray-700">I accept the Terms and Conditions</label>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button 
                type="submit" 
                disabled={!termsAccepted || !!passwordError || isSubmitting || !treeStatus.canAddAny || isStatusBlocking}
                className={`w-full font-semibold py-3 px-6 rounded-lg transition-colors ${
                  termsAccepted && !passwordError && !isSubmitting && treeStatus.canAddAny && !isStatusBlocking
                    ? 'bg-deep-indigo text-white hover:opacity-90' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? 'Creating Account...' : 
                 !treeStatus.canAddAny ? 'No Available Positions' :
                 isStatusBlocking ? 'Account Not Verified' : 'Create Account'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 