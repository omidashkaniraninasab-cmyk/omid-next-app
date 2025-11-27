'use client';

import { useState, useEffect } from 'react';
import { registerAction, loginAction } from './actions';

export default function AuthComponents() {
  const [activeTab, setActiveTab] = useState('login');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  async function handleRegister(formData) {
    setIsLoading(true);
    setMessage('');
    
    try {
      const result = await registerAction(formData);
      setMessage(result.error || result.message);
      setIsError(!result.success);
      
      if (result.success && result.user) {
        setCurrentUser(result.user);
        setMessage(`ثبت نام موفق! خوش آمدید ${result.user.display_name} 👋`);
        setIsError(false);
      }
    } catch (error) {
      setMessage('خطا در ارتباط با سرور');
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleLogin(formData) {
    setIsLoading(true);
    setMessage('');
    
    try {
      const result = await loginAction(formData);
      setMessage(result.error || result.message);
      setIsError(!result.success);
      
      if (result.success && result.user) {
        setCurrentUser(result.user);
        setMessage(`خوش آمدید ${result.user.display_name}! 👋`);
        setIsError(false);
      }
    } catch (error) {
      setMessage('خطا در ارتباط با سرور');
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }

  function handleLogout() {
    setCurrentUser(null);
    setMessage('با موفقیت خارج شدید 👋');
    setIsError(false);
    setActiveTab('login');
  }

  function switchToRegister() {
    setActiveTab('register');
    setMessage('');
  }

  function switchToLogin() {
    setActiveTab('login');
    setMessage('');
  }

  // پنل کاربر
  if (currentUser) {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8">
          {/* هدر پروفایل */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-3xl font-bold text-white">
                {currentUser.display_name?.charAt(0) || 'U'}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{currentUser.display_name}</h2>
            <p className="text-gray-600">@{currentUser.username}</p>
          </div>

          {/* اطلاعات کاربر */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-6 border border-blue-100">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-white/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600">📧</span>
                  </div>
                  <span className="text-gray-600">ایمیل</span>
                </div>
                <span className="font-medium text-gray-800">{currentUser.email}</span>
              </div>
              
              {currentUser.phone_number && (
                <div className="flex items-center justify-between p-3 bg-white/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-green-600">📱</span>
                    </div>
                    <span className="text-gray-600">تلفن</span>
                  </div>
                  <span className="font-medium text-gray-800">{currentUser.phone_number}</span>
                </div>
              )}
              
              <div className="flex items-center justify-between p-3 bg-white/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-purple-600">🔄</span>
                  </div>
                  <span className="text-gray-600">وضعیت</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  currentUser.email_verified 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {currentUser.email_verified ? 'تایید شده' : 'در انتظار'}
                </span>
              </div>
            </div>
          </div>

          {/* دکمه‌های اقدام */}
          <div className="space-y-3">
            <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-4 px-6 rounded-2xl font-medium transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl flex items-center justify-center gap-3">
              <span>👤</span>
              پروفایل کامل
            </button>
            
            <button className="w-full bg-white border-2 border-gray-200 hover:border-blue-300 text-gray-700 hover:text-blue-600 py-4 px-6 rounded-2xl font-medium transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md flex items-center justify-center gap-3">
              <span>⚙️</span>
              تنظیمات
            </button>

            <button
              onClick={handleLogout}
              className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white py-4 px-6 rounded-2xl font-medium transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
            >
              <span>🚪</span>
              خروج
            </button>
          </div>
        </div>
      </div>
    );
  }

  // فرم‌های ثبت نام و ورود
  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
        {/* هدر */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-3">
            {activeTab === 'login' ? 'خوش آمدید' : 'ثبت نام'}
          </h2>
          <p className="text-blue-100 text-lg">
            {activeTab === 'login' 
              ? 'وارد حساب کاربری خود شوید' 
              : 'حساب کاربری جدید ایجاد کنید'
            }
          </p>
        </div>

        {/* تب‌ها */}
        <div className="flex bg-gray-50/80 p-2 m-6 rounded-2xl">
          <button
            className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === 'login' 
                ? 'bg-white shadow-lg text-blue-600' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
            }`}
            onClick={switchToLogin}
          >
            <div className="flex items-center justify-center gap-2">
              <span className="text-lg">🔑</span>
              ورود
            </div>
          </button>
          <button
            className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === 'register' 
                ? 'bg-white shadow-lg text-purple-600' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
            }`}
            onClick={switchToRegister}
          >
            <div className="flex items-center justify-center gap-2">
              <span className="text-lg">📝</span>
              ثبت نام
            </div>
          </button>
        </div>

        {/* پیام */}
        {message && (
          <div className={`mx-6 p-4 rounded-2xl transition-all duration-300 ${
            isError 
              ? 'bg-red-50 border border-red-200 text-red-700' 
              : 'bg-green-50 border border-green-200 text-green-700'
          }`}>
            <div className="flex items-center gap-3">
              <span className="text-xl">{isError ? '❌' : '✅'}</span>
              <span className="font-medium">{message}</span>
            </div>
          </div>
        )}

        {/* محتوای فرم */}
        <div className="p-6">
          {/* فرم ورود */}
          {activeTab === 'login' && (
            <form action={handleLogin} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3 text-right">
                    آدرس ایمیل
                  </label>
                  <div className="relative">
                    <input
                      name="email"
                      type="email"
                      placeholder="example@email.com"
                      required
                      disabled={isLoading}
                      autoComplete="email"
                      className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all duration-300 disabled:bg-gray-100 disabled:cursor-not-allowed text-right pr-12"
                    />
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">📧</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3 text-right">
                    رمز عبور
                  </label>
                  <div className="relative">
                    <input
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      required
                      disabled={isLoading}
                      autoComplete="current-password"
                      className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all duration-300 disabled:bg-gray-100 disabled:cursor-not-allowed text-right pr-12"
                    />
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">🔒</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-4 px-6 rounded-2xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>در حال ورود...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-lg">🚀</span>
                    <span>ورود به حساب</span>
                  </div>
                )}
              </button>
              
              <div className="text-center text-gray-600 pt-4">
                <span>حساب ندارید؟ </span>
                <button
                  type="button"
                  onClick={switchToRegister}
                  className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200"
                >
                  ایجاد حساب جدید
                </button>
              </div>
            </form>
          )}

          {/* فرم ثبت نام */}
          {activeTab === 'register' && (
            <form action={handleRegister} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3 text-right">
                    نام کاربری
                  </label>
                  <div className="relative">
                    <input
                      name="username"
                      type="text"
                      placeholder="username"
                      required
                      disabled={isLoading}
                      autoComplete="username"
                      className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all duration-300 disabled:bg-gray-100 disabled:cursor-not-allowed text-right pr-12"
                    />
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">👤</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3 text-right">
                    نام نمایشی
                  </label>
                  <div className="relative">
                    <input
                      name="display_name"
                      type="text"
                      placeholder="نام شما"
                      required
                      disabled={isLoading}
                      autoComplete="name"
                      className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all duration-300 disabled:bg-gray-100 disabled:cursor-not-allowed text-right pr-12"
                    />
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">🏷️</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 text-right">
                  آدرس ایمیل
                </label>
                <div className="relative">
                  <input
                    name="email"
                    type="email"
                    placeholder="example@email.com"
                    required
                    disabled={isLoading}
                    autoComplete="email"
                    className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all duration-300 disabled:bg-gray-100 disabled:cursor-not-allowed text-right pr-12"
                  />
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">📧</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 text-right">
                  رمز عبور
                </label>
                <div className="relative">
                  <input
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    disabled={isLoading}
                    autoComplete="new-password"
                    className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all duration-300 disabled:bg-gray-100 disabled:cursor-not-allowed text-right pr-12"
                  />
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">🔒</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3 text-right">
                    نام
                  </label>
                  <input
                    name="first_name"
                    type="text"
                    placeholder="نام"
                    disabled={isLoading}
                    autoComplete="given-name"
                    className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all duration-300 disabled:bg-gray-100 disabled:cursor-not-allowed text-right"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3 text-right">
                    نام خانوادگی
                  </label>
                  <input
                    name="last_name"
                    type="text"
                    placeholder="نام خانوادگی"
                    disabled={isLoading}
                    autoComplete="family-name"
                    className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all duration-300 disabled:bg-gray-100 disabled:cursor-not-allowed text-right"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3 text-right">
                  شماره تماس
                </label>
                <div className="relative">
                  <input
                    name="phone_number"
                    type="tel"
                    placeholder="09123456789"
                    disabled={isLoading}
                    autoComplete="tel"
                    className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all duration-300 disabled:bg-gray-100 disabled:cursor-not-allowed text-right pr-12"
                  />
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">📱</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white py-4 px-6 rounded-2xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>در حال ثبت نام...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-lg">🎉</span>
                    <span>ایجاد حساب کاربری</span>
                  </div>
                )}
              </button>
              
              <div className="text-center text-gray-600 pt-4">
                <span>قبلاً حساب دارید؟ </span>
                <button
                  type="button"
                  onClick={switchToLogin}
                  className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200"
                >
                  ورود به حساب
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}