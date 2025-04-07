'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '../_store/useAuthStore';
// import { useAuth } from '@/hooks/useAuth'; // Assume this hook exists or need to be created

export default function ProtectedLayout({ children }) {
  const router = useRouter();
  const { user, isLoading } = useAuthStore();

  useEffect(() => {
    // If authentication check is complete and no user is found
    if (!isLoading && !user) {
      router.push('/auth'); // Redirect to login page
    }
  }, [user, isLoading, router]);

  // Don't render anything while checking authentication
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  // Don't render children if not authenticated
  if (!user) {
    return null; // Will redirect in the useEffect
  }

  // User is authenticated, render the children
  return <>{children}</>;
}
