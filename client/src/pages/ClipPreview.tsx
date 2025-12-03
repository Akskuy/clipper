import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AdBanner } from "@/components/AdBanner";
import { Loader2, Download, RefreshCw, Copy, Share2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function ClipPreview() {
  const { user, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();

  const { data: tier } = trpc.clipper.getTier.useQuery(undefined, {
    enabled: !!user,
  });

  const { data: clips, isLoading: clipsLoading } = trpc.clipper.getClips.useQuery(undefined, {
    enabled: !!user,
  });

  if (authLoading || clipsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user || !clips || clips.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">No Clips Found</h2>
          <p className="text-slate-600 mb-6">Create a clip first to preview it</p>
          <Button onClick={() => setLocation("/app/create")} className="bg-blue-600 hover:bg-blue-700">
            Create New Clip
          </Button>
        </Card>
      </div>
    );
  }

  const latestClip = clips[0];

  const handleCopyTitle = () => {
    navigator.clipboard.writeText(latestClip.clipTitle);
    toast.success("Title copied to clipboard!");
  };

  const handleCopyDescription = () => {
    navigator.clipboard.writeText(latestClip.clipDescription);
    toast.success("Description copied to clipboard!");
  };

  const handleDownload = () => {
    toast.info("Download feature coming soon!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Ad Banner */}
      {tier && <AdBanner tier={tier.tier as "lite" | "pro"} position="top" />}

      {/* Header */}
      <div className="border-b border-slate-200 bg-white sticky top-0 z-40">
        <div className="container py-4">
          <h1 className="text-2xl font-bold text-slate-900">Clip Preview</h1>
          <p className="text-slate-600">Review and download your viral clip</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          {/* Video Preview */}
          <Card className="mb-8 overflow-hidden">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 aspect-video flex items-center justify-center relative">
              <div className="absolute inset-0 bg-black/40" />
              <div className="relative z-10 text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-0 h-0 border-l-8 border-l-transparent border-r-0 border-t-5 border-t-transparent border-b-5 border-b-transparent ml-1" />
                </div>
                <p className="text-white text-sm">Click to play video preview</p>
              </div>
              <div className="absolute bottom-4 right-4 bg-black/70 text-white text-sm px-3 py-1 rounded">
                {latestClip.duration}s
              </div>
            </div>
          </Card>

          {/* Clip Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title */}
              <Card className="p-6">
                <h3 className="text-sm font-semibold text-slate-600 mb-3">Viral Title</h3>
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <p className="text-lg font-bold text-slate-900 mb-2">{latestClip.clipTitle}</p>
                    <p className="text-sm text-slate-600">
                      This title is optimized for maximum engagement and viral potential
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCopyTitle}
                    className="flex-shrink-0"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </Card>

              {/* Description */}
              <Card className="p-6">
                <h3 className="text-sm font-semibold text-slate-600 mb-3">Viral Description</h3>
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <p className="text-slate-900 mb-2">{latestClip.clipDescription}</p>
                    <p className="text-sm text-slate-600">
                      Use this description on TikTok, Instagram Reels, and YouTube Shorts
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCopyDescription}
                    className="flex-shrink-0"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </Card>

              {/* Metadata */}
              <Card className="p-6">
                <h3 className="text-sm font-semibold text-slate-600 mb-4">Clip Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-600">Artist</p>
                    <p className="font-medium text-slate-900">{latestClip.artistName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Theme</p>
                    <p className="font-medium text-slate-900">{latestClip.sceneTheme}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Duration</p>
                    <p className="font-medium text-slate-900">{latestClip.duration} seconds</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Timing</p>
                    <p className="font-medium text-slate-900">
                      {latestClip.startTime}s - {latestClip.endTime}s
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Viral Score */}
              <Card className="p-6 text-center">
                <p className="text-sm text-slate-600 mb-2">Viral Score</p>
                <div className="text-4xl font-bold text-blue-600 mb-2">{latestClip.viralScore}</div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                    style={{ width: `${latestClip.viralScore}%` }}
                  />
                </div>
                <p className="text-xs text-slate-600 mt-2">
                  {latestClip.viralScore >= 80
                    ? "Extremely viral potential!"
                    : latestClip.viralScore >= 60
                      ? "High viral potential"
                      : "Good viral potential"}
                </p>
              </Card>

              {/* Actions */}
              <Button
                onClick={handleDownload}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
              >
                <Download className="mr-2 w-4 h-4" />
                Download Clip
              </Button>

              <Button variant="outline" className="w-full">
                <Share2 className="mr-2 w-4 h-4" />
                Share Clip
              </Button>

              <Button variant="outline" className="w-full">
                <RefreshCw className="mr-2 w-4 h-4" />
                Regenerate
              </Button>

              {/* Info Box */}
              <Card className="p-4 bg-blue-50 border-blue-200">
                <p className="text-sm text-blue-900">
                  <strong>Pro Tip:</strong> Copy the title and description to use on your social media
                  platforms for maximum engagement.
                </p>
              </Card>
            </div>
          </div>

          {/* Back Button */}
          <Button
            variant="outline"
            onClick={() => setLocation("/app/dashboard")}
            className="w-full"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
