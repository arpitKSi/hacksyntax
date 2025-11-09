// Minimal server-side shim for @clerk/nextjs/server used in this project.
// Returns empty values so pages render without auth checks

export const auth = () => {
  // Return empty auth - actual auth happens via API middleware
  return { userId: null, sessionId: null };
};

export const currentUser = async () => {
  // Return null - pages should check auth client-side
  return null;
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
    getUser: async (userId: string) => null,
  },
};

export default {
  auth,
  currentUser,
  clerkMiddleware,
  clerkClient,
};
