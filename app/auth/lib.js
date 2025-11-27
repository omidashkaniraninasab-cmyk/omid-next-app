import bcrypt from 'bcryptjs';
import { Pool } from 'pg';

const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;

// اتصال به دیتابیس
const pool = new Pool({
  connectionString: connectionString,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 15000,
});

console.log('🔗 Database host:', connectionString ? new URL(connectionString).hostname : 'NOT SET');

const db = {
  query: (text, params) => {
    return pool.query(text, params);
  },
};

// هش کردن رمز عبور
async function hashPassword(password) {
  return await bcrypt.hash(password, 12);
}

// بررسی رمز عبور
async function verifyPassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

// ثبت کاربر جدید
async function registerUser(userData) {
  try {
    const hashedPassword = await hashPassword(userData.password);
    
    const result = await db.query(
      `INSERT INTO users (
        username, display_name, email, password_hash, 
        first_name, last_name, phone_number
      ) VALUES ($1, $2, $3, $4, $5, $6, $7) 
      RETURNING user_id, public_id, username, email, display_name, created_at`,
      [
        userData.username,
        userData.display_name,
        userData.email,
        hashedPassword,
        userData.first_name || null,
        userData.last_name || null,
        userData.phone_number || null
      ]
    );
    
    return { success: true, user: result.rows[0] };
  } catch (error) {
    if (error.code === '23505') {
      if (error.constraint === 'users_username_key') {
        return { success: false, error: 'نام کاربری قبلاً استفاده شده است' };
      }
      if (error.constraint === 'users_email_key') {
        return { success: false, error: 'ایمیل قبلاً استفاده شده است' };
      }
    }
    return { success: false, error: 'خطا در ثبت نام' };
  }
}

// ورود کاربر
async function loginUser(email, password) {
  try {
    const result = await db.query(
      `SELECT user_id, public_id, username, email, display_name, password_hash, 
              status, email_verified
       FROM users 
       WHERE email = $1 AND status = 'active'`,
      [email]
    );
    
    if (result.rows.length === 0) {
      return { success: false, error: 'ایمیل یا رمز عبور اشتباه است' };
    }
    
    const user = result.rows[0];
    const isValidPassword = await verifyPassword(password, user.password_hash);
    
    if (!isValidPassword) {
      return { success: false, error: 'ایمیل یا رمز عبور اشتباه است' };
    }
    
    // آپدیت زمان آخرین ورود
    await db.query(
      'UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE user_id = $1',
      [user.user_id]
    );
    
    return { 
      success: true, 
      user: { 
        user_id: user.user_id,
        public_id: user.public_id,
        username: user.username,
        email: user.email,
        display_name: user.display_name,
        email_verified: user.email_verified
      } 
    };
  } catch (error) {
    return { success: false, error: 'خطا در ورود به سیستم' };
  }
}

// دریافت کاربر جاری
async function getCurrentUser(userId) {
  try {
    const result = await db.query(
      `SELECT user_id, public_id, username, email, display_name, 
              first_name, last_name, phone_number, status, 
              email_verified, last_login_at, created_at
       FROM users 
       WHERE user_id = $1 AND status = 'active'`,
      [userId]
    );
    
    return result.rows[0] || null;
  } catch (error) {
    return null;
  }
}

// Export همه توابع
export {
  db,
  hashPassword,
  verifyPassword,
  registerUser,
  loginUser,
  getCurrentUser
};