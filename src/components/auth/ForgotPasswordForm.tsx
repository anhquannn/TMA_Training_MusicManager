import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Mail, Shield, Lock, ArrowLeft } from 'lucide-react';
import { api } from '../../services/apiService';
import { ForgotPasswordRequest, VerifyOtpRequest, ResetPasswordRequest, ApiResponse } from '../../interfaces/auth.interface';

type Step = 'email' | 'otp' | 'reset';

const ForgotPasswordForm: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data: ForgotPasswordRequest = { email };
      const response = await api.post<ApiResponse>('/auth/forgot-password', data);
      if (response.data.code === 200) {
        toast.success(response.data.message || 'Mã OTP đã được gửi đến email của bạn');
        setCurrentStep('otp');
      } else {
        toast.error(response.data.message || 'Gửi OTP thất bại');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Gửi OTP thất bại';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data: VerifyOtpRequest = { email, otpCode };
      const response = await api.post<ApiResponse>('/auth/verify-otp', data);
      if (response.data.code === 200) {
        toast.success(response.data.message || 'Xác thực OTP thành công');
        setCurrentStep('reset');
      } else {
        toast.error(response.data.message || 'Xác thực OTP thất bại');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Xác thực OTP thất bại';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    setIsLoading(true);

    try {
      const data: ResetPasswordRequest = {
        email,
        otpCode,
        newPassword,
        confirmPassword,
      };
      const response = await api.post<ApiResponse>('/auth/reset-password', data);
      if (response.data.code === 200) {
        toast.success(response.data.message || 'Đặt lại mật khẩu thành công! Vui lòng đăng nhập.');
        navigate('/login');
      } else {
        toast.error(response.data.message || 'Đặt lại mật khẩu thất bại');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Đặt lại mật khẩu thất bại';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const renderEmailStep = () => (
    <form onSubmit={handleEmailSubmit} className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Email
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Nhập email của bạn"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Đang gửi...' : 'Gửi mã OTP'}
      </button>
    </form>
  );

  const renderOtpStep = () => (
    <form onSubmit={handleOtpSubmit} className="space-y-6">
      <div className="text-center mb-4">
        <p className="text-sm text-gray-600">
          Mã OTP đã được gửi đến <strong>{email}</strong>
        </p>
      </div>

      <div>
        <label htmlFor="otpCode" className="block text-sm font-medium text-gray-700 mb-2">
          Mã OTP
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Shield className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="otpCode"
            name="otpCode"
            type="text"
            required
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Nhập mã OTP"
            maxLength={6}
          />
        </div>
      </div>

      <div className="flex space-x-3">
        <button
          type="button"
          onClick={() => setCurrentStep('email')}
          className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Quay lại
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Đang xác thực...' : 'Xác thực OTP'}
        </button>
      </div>
    </form>
  );

  const renderResetStep = () => (
    <form onSubmit={handleResetSubmit} className="space-y-6">
      <div>
        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
          Mật khẩu mới
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="newPassword"
            name="newPassword"
            type="password"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
          />
        </div>
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
          Xác nhận mật khẩu
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Nhập lại mật khẩu mới"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Đang đặt lại...' : 'Đặt lại mật khẩu'}
      </button>
    </form>
  );

  const getStepTitle = () => {
    switch (currentStep) {
      case 'email':
        return 'Quên mật khẩu';
      case 'otp':
        return 'Xác thực OTP';
      case 'reset':
        return 'Đặt lại mật khẩu';
      default:
        return 'Quên mật khẩu';
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 'email':
        return 'Nhập email để nhận mã OTP';
      case 'otp':
        return 'Nhập mã OTP được gửi đến email';
      case 'reset':
        return 'Tạo mật khẩu mới cho tài khoản';
      default:
        return '';
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">{getStepTitle()}</h2>
          <p className="text-gray-600 mt-2">{getStepDescription()}</p>
        </div>

        {currentStep === 'email' && renderEmailStep()}
        {currentStep === 'otp' && renderOtpStep()}
        {currentStep === 'reset' && renderResetStep()}

        <div className="text-center mt-6">
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Quay lại đăng nhập
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
