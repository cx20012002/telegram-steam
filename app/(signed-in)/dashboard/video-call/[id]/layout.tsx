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

if (!process.env.NEXT_PUBLIC_STREAM_API_KEY) {
  throw new Error("NEXT_PUBLIC_STREAM_API_KEY is not set");
}

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();
  const { id } = useParams();

  const [call, setCall] = useState<Call | null>(null);
  const [error, setError] = useState<string | null>(null);

  const streamUser = useMemo(() => {
    if (!user) return null;
    return {
      id: user.id,
      name:
        user.fullName ||
        user.username ||
        user.emailAddresses?.[0]?.emailAddress ||
        "Unknown User",
      image: user.imageUrl || "",
      type: "authenticated" as const,
    };
  }, [user]);

  const tokenProvider = useCallback(async () => {
    if (!user) throw new Error("User ID is required");
    return await createToken(user.id);
  }, [user]);

  const client = useMemo(() => {
    if (!streamUser) return null;

    return new StreamVideoClient({
      apiKey: process.env.NEXT_PUBLIC_STREAM_API_KEY as string,
      user: streamUser,
      tokenProvider,
    });
  }, [streamUser, tokenProvider]);

  useEffect(() => {
    return () => {
      client?.disconnectUser().catch(console.error);
    };
  }, [client]);

  // （可选）如果你后面会根据 id 创建 call，可以放这里
  useEffect(() => {
    if (!client || !id) return;
    const streamCall = client.call("default", id as string);
    const joinCall = async () => {
      try {
        await streamCall.join({ create: true });
        setCall(streamCall);
      } catch (error) {
        console.error("Failed to join call:", error);
        setError(
          error instanceof Error ? error.message : "Failed to join call"
        );
      }
    };
    joinCall();

    return () => {
      if (streamCall && streamCall.state.callingState === CallingState.JOINED) {
        streamCall.leave().catch(console.error);
      }
    };
  }, [client, id]);

  if (!client) {
    return <div>...client</div>;
  }

  if (!call) {
    return <div>...call</div>;
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
