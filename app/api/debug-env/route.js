export async function GET() {
  return Response.json({
    neonDatabaseUrl: process.env.NEON_DATABASE_URL ? 'SET' : 'NOT SET',
    postgresUrl: process.env.POSTGRES_URL ? 'SET' : 'NOT SET',
    databaseUrl: process.env.DATABASE_URL ? 'SET' : 'NOT SET',
    nodeEnv: process.env.NODE_ENV
  });
}