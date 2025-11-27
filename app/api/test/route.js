import { db } from '@/app/auth/lib';

export async function GET() {
  try {
    const result = await db.query('SELECT NOW()');
    return Response.json({ 
      success: true, 
      message: 'Database connected',
      time: result.rows[0].now 
    });
  } catch (error) {
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}