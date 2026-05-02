import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  affordmed: {
    authBaseUrl: process.env.AFFORDMED_AUTH_BASE_URL || 'http://20.244.56.144',
    notificationBaseUrl: process.env.AFFORDMED_NOTIFICATION_BASE_URL || 'http://20.207.122.201',
    email: process.env.EMAIL || 'td3651@srmist.edu.in',
    name: process.env.NAME || 'dumpala teja',
    rollNo: process.env.ROLL_NO || 'RA2311026050090',
    accessCode: process.env.ACCESS_CODE || 'QkbpxH',
    clientID: process.env.CLIENT_ID || '71a48b50-a926-414f-8572-f46b2d2c8227',
    clientSecret: process.env.CLIENT_SECRET || 'YxqzuxYrjhRGAzNn',
  },
};
