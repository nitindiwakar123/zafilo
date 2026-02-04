export const config = {
    PORT: process.env.PORT,
    dbUrl: process.env.DB_URL,
    redisPassword: process.env.REDIS_PASSWORD,
    sessionSecret: process.env.SESSION_SECRET,
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    clientUrl: process.env.CLIENT_URL,
    resendApiKey: process.env.RESEND_API_KEY
}
