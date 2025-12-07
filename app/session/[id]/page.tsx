'use client';

import { useParams } from 'next/navigation';
import LiveSession from '../../components/LiveSession';

export default function SessionPage() {
  const params = useParams();
  const channelName = params.id as string;
  
  // Get your Agora App ID from environment variable
  const AGORA_APP_ID = process.env.NEXT_PUBLIC_AGORA_APP_ID || '';

  if (!AGORA_APP_ID) {
    return (
      <div className="h-screen bg-gray-900 flex items-center justify-center text-white">
        <div className="text-center">
          <div className="text-xl mb-4">⚠️ Missing Agora App ID</div>
          <div className="text-gray-400">
            Add NEXT_PUBLIC_AGORA_APP_ID to your .env.local file
          </div>
        </div>
      </div>
    );
  }

  return <LiveSession channelName={channelName} appId={AGORA_APP_ID} />;
}
