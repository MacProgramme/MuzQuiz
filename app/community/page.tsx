// app/community/page.tsx — redirige vers /forum?tab=packs
"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CommunityRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/forum?tab=packs');
  }, [router]);
  return null;
}
