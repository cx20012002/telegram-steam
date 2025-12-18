"use client";

import React, { useEffect, useMemo, useCallback, useState } from "react";
import {
  StreamCall,
  StreamTheme,
  StreamVideo,
  Call,
  StreamVideoClient,
  CallingState,
} from "@stream-io/video-react-sdk";
import { useUser } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import { createToken } from "@/actions/createToken";
import StatusCard from "@/components/StatusCard";
import { AlertTriangle, Video } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import "@stream-io/video-react-sdk/dist/css/styles.css";

if (!process.env.NEXT_PUBLIC_STREAM_API_KEY) {
  throw new Error("NEXT_PUBLIC_STREAM_API_KEY is not set");
}

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();
  const { id } = useParams();

  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const [call, setCall] = useState<Call | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 只做“数据转换”，不做副作用
  const streamUser = useMemo(() => {
    if (!user) return null;
    return {
      id: user.id,
      name:
        user.fullName ||
        user.emailAddresses[0]?.emailAddress ||
        "Unknown User",
      image: user.imageUrl || "",
    };
  }, [user]);

  // token provider（纯函数，没副作用）
  const tokenProvider = useCallback(async () => {
    if (!user?.id) throw new Error("User ID is required");
    return createToken(user.id);
  }, [user]);

  /**
   * ✅ 初始化 StreamVideoClient（必须在 useEffect）
   */
  useEffect(() => {
    if (!streamUser) return;

    const c = new StreamVideoClient({
      apiKey: process.env.NEXT_PUBLIC_STREAM_API_KEY as string,
      user: streamUser,
      tokenProvider,
    });

    setClient(c);

    return () => {
      c.disconnectUser().catch(console.error);
    };
  }, [streamUser, tokenProvider]);

  /**
   * ✅ 创建 & 加入 Call
   */
  useEffect(() => {
    if (!client || !id) return;

    const streamCall = client.call("default", id as string);

    const join = async () => {
      try {
        setError(null);
        await streamCall.join({ create: true });
        setCall(streamCall);
      } catch (err) {
        console.error("Failed to join call:", err);
        setError(
          err instanceof Error ? err.message : "Failed to join call"
        );
      }
    };

    join();

    return () => {
      if (streamCall.state.callingState === CallingState.JOINED) {
        streamCall.leave().catch(console.error);
      }
    };
  }, [client, id]);

  /* ---------- UI 状态 ---------- */

  if (error) {
    return (
      <StatusCard
        title="Call Error"
        description={error}
        className="min-h-screen bg-red-50"
        action={
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-red-500 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg"
          >
            Retry
          </button>
        }
      >
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>
      </StatusCard>
    );
  }

  if (!client) {
    return (
      <StatusCard
        title="Initializing client..."
        description="Setting up video call connection..."
        className="min-h-screen bg-blue-50"
      >
        <LoadingSpinner size="lg" />
      </StatusCard>
    );
  }

  if (!call) {
    return (
      <StatusCard title="Joining call..." className="min-h-screen bg-green-50">
        <div className="animate-bounce h-16 w-16 mx-auto">
          <div className="w-16 h-16 bg-green-200 rounded-full flex items-center justify-center">
            <Video className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="text-green-600 font-mono text-sm bg-green-100 px-3 py-1 rounded-full inline-block">
          Call ID: {id}
        </div>
      </StatusCard>
    );
  }

  return (
    <StreamVideo client={client}>
      <StreamTheme className="text-white">
        <StreamCall call={call}>{children}</StreamCall>
      </StreamTheme>
    </StreamVideo>
  );
};

export default Layout;
