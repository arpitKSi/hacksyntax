import React from "react";

// Minimal client-side shim for @clerk/nextjs used in this project.
// Exports the symbols the app imports so code runs during local dev.

export const ClerkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

export const SignIn: React.FC<any> = () => {
  return <div style={{ padding: 16 }}>SignIn (shim) — not enabled in local dev</div>;
};

export const SignUp: React.FC<any> = () => {
  return <div style={{ padding: 16 }}>SignUp (shim) — not enabled in local dev</div>;
};

export const UserButton: React.FC = () => {
  const handleSignOut = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('demo_signed_out', 'true');
      window.location.reload();
    }
  };

  return (
    <div 
      onClick={handleSignOut}
      style={{ 
        width: 32, 
        height: 32, 
        borderRadius: '50%', 
        backgroundColor: '#FDAB04',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
        cursor: 'pointer',
        position: 'relative'
      }}
      title="Click to sign out (demo)"
    >
      DU
    </div>
  );
};

export const useAuth = () => {
  const [isSignedOut, setIsSignedOut] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const signedOut = localStorage.getItem('demo_signed_out') === 'true';
      setIsSignedOut(signedOut);
    }
  }, []);

  return { 
    userId: isSignedOut ? null : "user_demo_123", 
    isSignedIn: !isSignedOut 
  };
};

export const clerkClient = {
  // minimal methods used in codebase (no-op)
  users: {
    getUser: async () => null,
  },
};

export default ClerkProvider;
