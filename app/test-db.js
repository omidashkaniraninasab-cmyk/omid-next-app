import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function testDB() {
  try {
    console.log('🔍 تست اتصال به دیتابیس...');
    const result = await pool.query('SELECT NOW()');
    console.log('✅ اتصال موفق:', result.rows[0]);
    
    // تست وجود جدول users
    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log('📊 جدول‌های موجود:', tables.rows);
    
  } catch (error) {
    console.log('❌ خطای اتصال:', error.message);
  } finally {
    await pool.end();
  }
}

testDB();