import { db } from '../../auth/lib';

export async function GET() {
  try {
    console.log('🔍 Testing database connection...');
    const result = await db.query('SELECT NOW() as current_time');
    
    console.log('✅ Database connected successfully');
    return Response.json({ 
      success: true, 
      message: 'Database connected successfully',
      currentTime: result.rows[0].current_time,
      environment: process.env.NODE_ENV
    });
    
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return Response.json({ 
      success: false, 
      error: error.message,
      databaseUrl: process.env.DATABASE_URL ? 'Set' : 'Not set'
    }, { status: 500 });
  }
}