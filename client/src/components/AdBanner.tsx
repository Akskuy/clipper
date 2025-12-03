import { useState } from "react";
import { X } from "lucide-react";

interface AdBannerProps {
  tier: "lite" | "pro";
  position?: "top" | "bottom";
}

export function AdBanner({ tier, position = "top" }: AdBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  // Lite users cannot dismiss ads, Pro users can
  if (dismissed && tier === "pro") {
    return null;
  }

  // Don't show ads to Pro users
  if (tier === "pro") {
    return null;
  }

  return (
    <div
      className={`bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 px-4 ${
        position === "top" ? "sticky top-0 z-40" : ""
      }`}
    >
      <div className="container flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium">
            ✨ Upgrade to Pro for unlimited clips and no ads
          </p>
        </div>
        {false && (
          <button
            onClick={() => setDismissed(true)}
            className="ml-4 text-white hover:text-blue-100 transition"
            aria-label="Dismiss ad"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
