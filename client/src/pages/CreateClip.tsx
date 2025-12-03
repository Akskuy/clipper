import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AdBanner } from "@/components/AdBanner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Upload, AlertCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function CreateClip() {
  const { user, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [videoUrl, setVideoUrl] = useState("");
  const [videoSource, setVideoSource] = useState<"youtube" | "upload">("youtube");
  const [artistName, setArtistName] = useState("");
  const [sceneTheme, setSceneTheme] = useState("");
  const [keywords, setKeywords] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: tier } = trpc.clipper.getTier.useQuery(undefined, {
    enabled: !!user,
  });

  const { data: usage } = trpc.clipper.getDailyUsage.useQuery(undefined, {
    enabled: !!user && tier?.tier === "lite",
  });

  const generateMutation = trpc.clipper.generateClip.useMutation({
    onSuccess: (result) => {
      setIsGenerating(false);
      toast.success("Clip generated successfully!");
      setLocation("/app/preview");
    },
    onError: (error) => {
      setIsGenerating(false);
      toast.error(error.message || "Failed to generate clip");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!videoUrl || !artistName || !sceneTheme) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Check Lite tier limit
    if (tier?.tier === "lite" && usage && usage.clipsGenerated >= usage.dailyLimit) {
      toast.error(`Lite users can only generate ${usage.dailyLimit} clips per day`);
      return;
    }

    setIsGenerating(true);
    await generateMutation.mutateAsync({
      videoUrl,
      videoSource,
      artistName,
      sceneTheme,
      keywords: keywords || undefined,
    });
  };

  if (authLoading) {
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
          <p className="text-slate-600 mb-6">Please sign in to create clips</p>
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
        <div className="container py-4">
          <h1 className="text-2xl font-bold text-slate-900">Create New Clip</h1>
          <p className="text-slate-600">Transform your video into a viral clip</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-12">
        <div className="max-w-2xl mx-auto">
          {/* Tier Info */}
          {tier?.tier === "lite" && usage && (
            <Card className="p-4 mb-6 bg-blue-50 border-blue-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-900">
                    Lite Plan: {usage.remaining} clips remaining today
                  </p>
                  <p className="text-sm text-blue-700">
                    Upgrade to Pro for unlimited clips
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Form */}
          <Card className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Video Source */}
              <div>
                <Label className="text-base font-semibold mb-3 block">Video Source</Label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="videoSource"
                      value="youtube"
                      checked={videoSource === "youtube"}
                      onChange={(e) => setVideoSource(e.target.value as "youtube")}
                      className="w-4 h-4"
                    />
                    <span className="text-slate-700">YouTube Link</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="videoSource"
                      value="upload"
                      checked={videoSource === "upload"}
                      onChange={(e) => setVideoSource(e.target.value as "upload")}
                      className="w-4 h-4"
                    />
                    <span className="text-slate-700">Upload File</span>
                  </label>
                </div>
              </div>

              {/* Video URL */}
              <div>
                <Label htmlFor="videoUrl" className="text-base font-semibold">
                  {videoSource === "youtube" ? "YouTube URL" : "Upload Video"}
                </Label>
                <Input
                  id="videoUrl"
                  type={videoSource === "youtube" ? "url" : "text"}
                  placeholder={
                    videoSource === "youtube"
                      ? "https://www.youtube.com/watch?v=..."
                      : "Select a video file"
                  }
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="mt-2"
                  required
                />
              </div>

              {/* Artist Name */}
              <div>
                <Label htmlFor="artistName" className="text-base font-semibold">
                  Artist Name *
                </Label>
                <Input
                  id="artistName"
                  placeholder="e.g., Taylor Swift, BTS, etc."
                  value={artistName}
                  onChange={(e) => setArtistName(e.target.value)}
                  className="mt-2"
                  required
                />
              </div>

              {/* Scene Theme */}
              <div>
                <Label htmlFor="sceneTheme" className="text-base font-semibold">
                  Scene Theme *
                </Label>
                <select
                  id="sceneTheme"
                  value={sceneTheme}
                  onChange={(e) => setSceneTheme(e.target.value)}
                  className="w-full mt-2 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a theme...</option>
                  <option value="cute">Cute Moment</option>
                  <option value="funny">Funny/Laugh</option>
                  <option value="marah">Angry/Intense</option>
                  <option value="sedih">Sad/Emotional</option>
                  <option value="hype">Hype/Excited</option>
                  <option value="surprise">Surprise/Shock</option>
                  <option value="dance">Dance/Performance</option>
                  <option value="interaction">Fan Interaction</option>
                </select>
              </div>

              {/* Keywords */}
              <div>
                <Label htmlFor="keywords" className="text-base font-semibold">
                  Keywords (Optional)
                </Label>
                <Input
                  id="keywords"
                  placeholder="e.g., funny moment, viral, trending"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  className="mt-2"
                />
                <p className="text-sm text-slate-600 mt-1">
                  Add keywords to help AI generate better titles
                </p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isGenerating}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                    Generating Clip...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 w-5 h-5" />
                    Generate Viral Clip
                  </>
                )}
              </Button>
            </form>
          </Card>

          {/* Info Box */}
          <Card className="p-6 mt-6 bg-slate-50">
            <h3 className="font-semibold text-slate-900 mb-3">How it works</h3>
            <ol className="space-y-2 text-sm text-slate-700">
              <li>
                <strong>1. Upload Video:</strong> Provide a YouTube link or upload a video file
              </li>
              <li>
                <strong>2. AI Analysis:</strong> Our AI analyzes the artist's persona, scene theme, and market trends
              </li>
              <li>
                <strong>3. Clip Selection:</strong> AI selects the best moment for maximum viral potential
              </li>
              <li>
                <strong>4. Auto-Generation:</strong> Titles, descriptions, and subtitles (Pro) are generated automatically
              </li>
              <li>
                <strong>5. Download:</strong> Preview and download your viral clip
              </li>
            </ol>
          </Card>
        </div>
      </div>
    </div>
  );
}
