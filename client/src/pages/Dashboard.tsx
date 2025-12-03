import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AdBanner } from "@/components/AdBanner";
import { Loader2, Zap, Play, Download, RefreshCw } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { useLocation } from "wouter";

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [selectedClip, setSelectedClip] = useState<number | null>(null);

  const { data: tier, isLoading: tierLoading } = trpc.clipper.getTier.useQuery(undefined, {
    enabled: !!user,
  });

  const { data: clips, isLoading: clipsLoading } = trpc.clipper.getClips.useQuery(undefined, {
    enabled: !!user,
  });

  const { data: usage } = trpc.clipper.getDailyUsage.useQuery(undefined, {
    enabled: !!user && tier?.tier === "lite",
  });

  if (authLoading || tierLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">Sign in Required</h2>
          <p className="text-slate-600 mb-6">Please sign in to access your dashboard</p>
          <Button onClick={() => setLocation("/")} className="bg-blue-600 hover:bg-blue-700">
            Go to Home
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Ad Banner */}
      {tier && <AdBanner tier={tier.tier as "lite" | "pro"} position="top" />}

      {/* Header */}
      <div className="border-b border-slate-200 bg-white sticky top-0 z-40">
        <div className="container py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-slate-600">Welcome back, {user.name}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm font-medium text-slate-600">Current Plan</div>
              <div className="text-lg font-bold text-blue-600 uppercase">{tier?.tier}</div>
            </div>
            {tier?.tier === "lite" && usage && (
              <div className="text-right pl-4 border-l border-slate-200">
                <div className="text-sm font-medium text-slate-600">Daily Clips</div>
                <div className="text-lg font-bold text-slate-900">
                  {usage.clipsGenerated}/{usage.dailyLimit}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-12">
        {/* Create New Clip Button */}
        <div className="mb-8">
          <Button
            onClick={() => setLocation("/app/create")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-lg"
          >
            <Zap className="mr-2 w-5 h-5" />
            Create New Clip
          </Button>
        </div>

        {/* Clips Grid */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Your Generated Clips</h2>

          {clipsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : clips && clips.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {clips.map((clip) => (
                <Card
                  key={clip.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setSelectedClip(clip.id)}
                >
                  {/* Clip Preview */}
                  <div className="bg-gradient-to-br from-slate-900 to-slate-800 h-40 flex items-center justify-center relative group">
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition" />
                    <Play className="w-12 h-12 text-white relative z-10" />
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {clip.duration}s
                    </div>
                  </div>

                  {/* Clip Info */}
                  <div className="p-4">
                    <h3 className="font-bold text-slate-900 mb-2 line-clamp-2">{clip.clipTitle}</h3>
                    <p className="text-sm text-slate-600 mb-3 line-clamp-2">{clip.clipDescription}</p>

                    {/* Metadata */}
                    <div className="space-y-2 mb-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Artist:</span>
                        <span className="font-medium text-slate-900">{clip.artistName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Theme:</span>
                        <span className="font-medium text-slate-900">{clip.sceneTheme}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Viral Score:</span>
                        <span className="font-bold text-blue-600">{clip.viralScore}/100</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Play className="w-4 h-4 mr-1" />
                        Preview
                      </Button>
                      <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <div className="text-slate-600 mb-4">
                <Zap className="w-12 h-12 mx-auto opacity-50 mb-4" />
                <p className="text-lg">No clips yet</p>
                <p className="text-sm">Create your first viral clip to get started</p>
              </div>
              <Button
                onClick={() => setLocation("/app/create")}
                className="bg-blue-600 hover:bg-blue-700 text-white mt-4"
              >
                Create Your First Clip
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
