'use server';

import { registerUser, loginUser } from './lib';

export async function registerAction(formData) {
  // لاگ برای سرور
  console.log('🚀 Register action called on server');
  
  const userData = {
    username: formData.get('username'),
    display_name: formData.get('display_name'),
    email: formData.get('email'),
    password: formData.get('password'),
    first_name: formData.get('first_name') || null,
    last_name: formData.get('last_name') || null,
    phone_number: formData.get('phone_number') || null,
  };

  try {
    const result = await registerUser(userData);
    console.log('📊 Register result:', result);
    return result;
  } catch (error) {
    console.error('❌ Register error:', error);
    return { success: false, error: 'خطا در ثبت نام' };
  }
}

export async function loginAction(formData) {
  const email = formData.get('email');
  const password = formData.get('password');

  const result = await loginUser(email, password);
  return result;
}