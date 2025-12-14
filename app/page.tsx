import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import FeatureCard from "@/components/FeatureCard";
import { MessageCircle, Video, Zap, Users, Shield } from "lucide-react";

export default function Home() {
  return (
    <div>
      <Header />
      <main className="flex-1 flex flex-col items-center px-4 py-16 sm:px-6 text-center gap-20">
        <div className="max-w-4xl space-y-8 relative">
          {/* Background gradient */}
          <div className="absolute inset-0 -z-10 bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/20 dark:via-indigo-20 dark:to-purple-950/20 rounded-3xl blur-3xl scale-150 opacity-60"></div>

          <div className="max-w-4xl space-y-8">
            <h1 className="text-5xl sm:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-400 dark:via-purple-400 dark:to-indigo-400">
              Connect instantly.
              <br />
              <span className="bg-clip-text text-transparent bg-linear-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">
                Chat smarter
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              The modern messaging platform that combines lightning-fast chat
              and crystal-clear video calls in one seamless experience.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-6">
            <SignedOut>
              <SignInButton
                mode="modal"
                forceRedirectUrl={"/dashboard"}
                signUpForceRedirectUrl={"/dashboard"}
              >
                <Button size={"lg"} className="text-lg px-8 py-6 h-auto">
                  Start Chatting Free
                </Button>
              </SignInButton>
            </SignedOut>
          </div>

          {/* Social proof */}
          <div className="pt-8">
            <p className="text-sm text-muted-foreground mb-4">
              Trusted by thousands of users worldwide
            </p>
            <div className="flex justify-center items-center gap-8 text-muted-foreground">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">50K+</div>
                <div className="text-sm">Active Users</div>
              </div>
              <div className="w-px h-8 bg-border"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">1M+</div>
                <div className="text-sm">Messages Sent</div>
              </div>
              <div className="w-px h-8 bg-border"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">99.9%</div>
                <div className="text-sm">Uptime</div>
              </div>
            </div>
          </div>

          {/* Enhanced features section */}
          <div className="w-full max-w-6xl">
            {/* Section divider */}
            <div className="w-full flex items-center justify-center mb-16">
              <div className="flex-1 h-px bg-linear-to-r from-transparent via-border to-transparent"></div>
              <div className="px-6">
                <div className="w-2 h-2 rounded-full bg-primary/60"></div>
              </div>
              <div className="flex-1 h-px bg-linear-to-r from-transparent via-border to-transparent"></div>
            </div>

            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Everything you need to stay connected
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Powerful features designed for seamless communication, whether
                you&apos;re chatting with friends or collaborating with teams.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
              <FeatureCard
                icon={MessageCircle}
                title="Instant Messaging"
                description="Send messages in real-time with lightning-fast delivery and read receipts."
              />
              <FeatureCard
                icon={Video}
                title="HD Video Calls"
                description="Crystal-clear video calls with friends and teams, no matter where you are."
              />
              <FeatureCard
                icon={Zap}
                title="Lightning Fast"
                description="Experience blazing-fast performance with minimal latency and instant sync."
              />
              <FeatureCard
                icon={Users}
                title="Group Chats"
                description="Connect with multiple people in group conversations with advanced moderation tools."
              />
              <FeatureCard
                icon={Shield}
                title="End-to-End Encryption"
                description="Your conversations are protected with industry-leading encryption technology."
              />
            </div>
          </div>

          {/* Enhanced CTA section */}
          <div className="w-full max-w-4xl">
            <div className="rounded-2xl border bg-linear-to-br from-primary/5 to-primary/10 p-12 text-center">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Ready to transform your conversations?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of users who&apos;ve already discovered a better way to communicate. Start your journey with Beam today - it&apos;s completely free.
              </p>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                <SignedOut>
                  <SignUpButton mode="modal">
                    <Button size="lg" className="text-lg px-8 py-6 h-auto">
                      Get Started Free
                    </Button>
                  </SignUpButton>
                </SignedOut>
              </div>
              <div className="flex justify-center flex-col sm:flex-row items-center gap-6 mt-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  No credit card required
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  Free forever plan
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  Setup in 30 seconds
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}
