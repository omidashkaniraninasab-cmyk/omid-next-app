export async function GET() {
  const dbUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL;
  
  return Response.json({
    postgresUrl: process.env.POSTGRES_URL ? 'SET' : 'NOT SET',
    databaseUrl: process.env.DATABASE_URL ? 'SET' : 'NOT SET',
    activeConnection: dbUrl ? 'SET' : 'NOT SET',
    databaseHost: dbUrl ? new URL(dbUrl).hostname : 'NO URL',
    nodeEnv: process.env.NODE_ENV
  });
}