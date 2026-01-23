export default {
  providers: [
    {
      domain: "https://clerk.dev",
      applicationID: "convex",
    },
  ],
  credentials: {
    clerk: {
      secretKey: process.env.CLERK_SECRET_KEY,
    },
  },
};
