// Minimal server-side shim for @clerk/nextjs/server used in this project.

// Demo user ID for local development
const DEMO_USER_ID = "user_demo_123";

export const auth = () => {
  return { userId: DEMO_USER_ID };
};

export const currentUser = async () => {
  return {
    id: DEMO_USER_ID,
    emailAddresses: [{ emailAddress: "demo@example.com" }],
    firstName: "Demo",
    lastName: "User",
    fullName: "Demo User",
    imageUrl: "/avatar_placeholder.jpg",
  };
};

export const clerkMiddleware = () => {
  // Return a no-op middleware compatible with Next's middleware signature
  return (req: any) => {
    // Return nothing to continue to the next middleware/handler
    return undefined;
  };
};

export const getAuth = () => ({ userId: null });

export const clerkClient = {
  users: {
    getUser: async (userId: string) => ({
      id: userId,
      imageUrl: "/avatar_placeholder.jpg",
      fullName: "Demo User",
      firstName: "Demo",
      lastName: "User",
    }),
  },
};

export default {
  auth,
  currentUser,
  clerkMiddleware,
  clerkClient,
};
