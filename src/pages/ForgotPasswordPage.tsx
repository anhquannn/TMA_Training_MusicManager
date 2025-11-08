import React from 'react';
import ForgotPasswordForm from '../components/auth/ForgotPasswordForm';

const ForgotPasswordPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-20 w-20 bg-purple-600 rounded-full flex items-center justify-center">
            <svg className="h-10 w-10 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 8A6 6 0 006 8v1H3a1 1 0 00-1 1v8a1 1 0 001 1h14a1 1 0 001-1v-8a1 1 0 00-1-1h-3V8zM8 8a4 4 0 118 0v1H8V8z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="mt-6 text-4xl font-extrabold text-gray-900">
            Music Manager
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Khôi phục mật khẩu của bạn
          </p>
        </div>
        
        <ForgotPasswordForm />
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
