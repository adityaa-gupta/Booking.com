'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '../_store/useAuthStore';

export default function ProtectedLayout({ children }) {
  const router = useRouter();
  const { user, isLoading } = useAuthStore();

  useEffect(() => {
    // If authentication check is complete and no user is found
    if (!user) {
      // router.push('/auth'); // Redirect to login page
    }
  }, [user, router]);

  // Don't render anything while checking authentication
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  // If user is authenticated, render the children
  if (user) {
    return <>{children}</>;
  }

  // If no user is found, return null (redirect will happen in useEffect)
  return null;
}
