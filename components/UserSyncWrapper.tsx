import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import React, { useCallback, useEffect, useState } from "react";
import LoadingSpinner from "./LoadingSpinner";
import streamClient from "@/lib/stream";
import { createToken } from "@/actions/createToken";

/**
 * 同步用户数据到 Convex 和 Stream，并在同步期间显示加载状态
 */
const UserSyncWrapper = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoaded: isUserLoaded } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const createOrUpdateUser = useMutation(api.users.upsertUser);

  // 同步用户：1) 更新 Convex 用户记录 2) 连接 Stream 聊天
  const syncUser = useCallback(async () => {
    if (!user?.id) return;
    try {
      setIsLoading(true);
      setError(null);

      // Stream 需要异步 token provider，token 在服务端生成
      const tokenProvider = async () => {
        if (!user?.id) {
          throw new Error("User ID is required");
        }
        const token = await createToken(user.id);
        return token;
      };

      await createOrUpdateUser({
        userId: user.id,
        name:
          user.fullName ||
          user.firstName ||
          user.emailAddresses[0].emailAddress ||
          "Unknown User",
        email: user.emailAddresses[0]?.emailAddress || "",
        imageUrl: user.imageUrl || "",
      });

      await streamClient.connectUser(
        {
          id: user.id,
          name: user.fullName || user.firstName || "Unknown User",
          image: user.imageUrl || "",
        },
        tokenProvider
      );
    } catch (error) {
      console.error("Failed to sync user:", error);
      setError(error instanceof Error ? error.message : "Failed to sync user");
    } finally {
      setIsLoading(false);
    }
  }, [createOrUpdateUser, user]);

  // 断开 Stream 连接（退出登录或组件卸载时调用）
  const disconnectUser = useCallback(async () => {
    try {
      await streamClient.disconnectUser();
    } catch (error) {
      console.error("Failed to disconnect user:", error);
    }
  }, []);

  useEffect(() => {
    if (!isUserLoaded) return;

    if (user) {
      syncUser();
    } else {
      disconnectUser();
      setIsLoading(false);
    }

    return () => {
      disconnectUser();
    };
  }, [isUserLoaded, user, syncUser, disconnectUser]);

  if (!isUserLoaded || isLoading) {
    return (
      <LoadingSpinner
        size="lg"
        message={!isUserLoaded ? "Loading..." : "Syncing user data..."}
        className="min-h-screen"
      />
    );
  }

  if (error) {
    return (
      <div className="flex-1 items-center justify-center bg-white px-6">
        <p className="text-red-600 text-lg font-semibold mb-2">{error}</p>
        <p className="text-gray-500 text-sm text-center">
          Please try restarting the app or contact support if the problem
          persists.
        </p>
      </div>
    );
  }

  return <div>{children}</div>;
};

export default UserSyncWrapper;
