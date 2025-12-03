import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { createUserTier, getDailyUsage, getUserClips, getUserTier, incrementDailyUsage, saveClip, upsertUserPreferences } from "../db";
import { invokeLLM } from "../_core/llm";
import { TRPCError } from "@trpc/server";

const LITE_DAILY_LIMIT = 15;

/**
 * AI Analysis Module - Simulates AI persona analysis
 */
async function analyzeArtistPersona(artistName: string, sceneTheme: string) {
  const response = await invokeLLM({
    messages: [
      {
        role: "system",
        content:
          "You are an expert in analyzing artist personas and their fan engagement patterns. Provide concise analysis in JSON format.",
      },
      {
        role: "user",
        content: `Analyze the persona of artist "${artistName}" for scene theme "${sceneTheme}". Return JSON with: { "personaType": string, "fanPreferences": string[], "bestMomentTypes": string[], "recommendedStyle": string }`,
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "persona_analysis",
        strict: true,
        schema: {
          type: "object",
          properties: {
            personaType: { type: "string" },
            fanPreferences: { type: "array", items: { type: "string" } },
            bestMomentTypes: { type: "array", items: { type: "string" } },
            recommendedStyle: { type: "string" },
          },
          required: ["personaType", "fanPreferences", "bestMomentTypes", "recommendedStyle"],
          additionalProperties: false,
        },
      },
    },
  });

  try {
    const content = response.choices[0]?.message.content;
    if (typeof content === "string") {
      return JSON.parse(content);
    }
  } catch {
    return {
      personaType: "Popular Creator",
      fanPreferences: ["emotional moments", "authentic reactions"],
      bestMomentTypes: ["laugh", "surprise", "emotion"],
      recommendedStyle: "energetic and engaging",
    };
  }
}

/**
 * Theme Scene Detector - Simulates AI scene detection
 */
async function detectSceneTheme(sceneTheme: string, artistName: string) {
  const response = await invokeLLM({
    messages: [
      {
        role: "system",
        content:
          "You are an expert in video content analysis. Provide scene detection recommendations in JSON format.",
      },
      {
        role: "user",
        content: `For artist "${artistName}" with theme "${sceneTheme}", suggest optimal clip timing and characteristics. Return JSON with: { "optimalDuration": number, "keywordsTriggers": string[], "emotionalIntensity": string, "engagementFactors": string[] }`,
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "scene_detection",
        strict: true,
        schema: {
          type: "object",
          properties: {
            optimalDuration: { type: "number" },
            keywordsTriggers: { type: "array", items: { type: "string" } },
            emotionalIntensity: { type: "string" },
            engagementFactors: { type: "array", items: { type: "string" } },
          },
          required: ["optimalDuration", "keywordsTriggers", "emotionalIntensity", "engagementFactors"],
          additionalProperties: false,
        },
      },
    },
  });

  try {
    const content = response.choices[0]?.message.content;
    if (typeof content === "string") {
      return JSON.parse(content);
    }
  } catch {
    return {
      optimalDuration: 15,
      keywordsTriggers: ["laugh", "reaction", "moment"],
      emotionalIntensity: "high",
      engagementFactors: ["authenticity", "emotion", "surprise"],
    };
  }
}

/**
 * Market Sentiment Analyzer - Simulates AI sentiment analysis
 */
async function analyzeMarketSentiment(artistName: string, sceneTheme: string) {
  const response = await invokeLLM({
    messages: [
      {
        role: "system",
        content:
          "You are an expert in social media trends and viral content analysis. Provide sentiment analysis in JSON format.",
      },
      {
        role: "user",
        content: `Analyze current market sentiment for artist "${artistName}" with theme "${sceneTheme}". Return JSON with: { "trendingTopics": string[], "viralPotential": number, "recommendedHashtags": string[], "contentTiming": string }`,
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "sentiment_analysis",
        strict: true,
        schema: {
          type: "object",
          properties: {
            trendingTopics: { type: "array", items: { type: "string" } },
            viralPotential: { type: "number" },
            recommendedHashtags: { type: "array", items: { type: "string" } },
            contentTiming: { type: "string" },
          },
          required: ["trendingTopics", "viralPotential", "recommendedHashtags", "contentTiming"],
          additionalProperties: false,
        },
      },
    },
  });

  try {
    const content = response.choices[0]?.message.content;
    if (typeof content === "string") {
      return JSON.parse(content);
    }
  } catch {
    return {
      trendingTopics: ["viral moments", "authentic reactions"],
      viralPotential: 75,
      recommendedHashtags: ["#viral", "#trending", "#moment"],
      contentTiming: "evening peak hours",
    };
  }
}

/**
 * Generate viral title using AI
 */
async function generateViralTitle(artistName: string, sceneTheme: string, keywords: string) {
  const response = await invokeLLM({
    messages: [
      {
        role: "system",
        content:
          "You are an expert in creating viral social media titles. Generate catchy, engaging titles that drive clicks and engagement.",
      },
      {
        role: "user",
        content: `Create 3 viral titles for a ${sceneTheme} clip of artist "${artistName}". Keywords: ${keywords}. Return as JSON: { "titles": string[] }`,
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "viral_titles",
        strict: true,
        schema: {
          type: "object",
          properties: {
            titles: { type: "array", items: { type: "string" } },
          },
          required: ["titles"],
          additionalProperties: false,
        },
      },
    },
  });

  try {
    const content = response.choices[0]?.message.content;
    if (typeof content === "string") {
      const parsed = JSON.parse(content);
      return parsed.titles[0] || "Amazing Moment You Won't Believe!";
    }
  } catch {
    return `${artistName} ${sceneTheme} Moment - You Won't Believe What Happens!`;
  }
}

/**
 * Generate viral description using AI
 */
async function generateViralDescription(artistName: string, sceneTheme: string, title: string) {
  const response = await invokeLLM({
    messages: [
      {
        role: "system",
        content:
          "You are an expert in writing engaging social media descriptions that drive engagement and shares.",
      },
      {
        role: "user",
        content: `Write a viral description for a clip titled "${title}" featuring ${artistName} in a ${sceneTheme} moment. Keep it under 150 characters. Return as JSON: { "description": string }`,
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "viral_description",
        strict: true,
        schema: {
          type: "object",
          properties: {
            description: { type: "string" },
          },
          required: ["description"],
          additionalProperties: false,
        },
      },
    },
  });

  try {
    const content = response.choices[0]?.message.content;
    if (typeof content === "string") {
      const parsed = JSON.parse(content);
      return parsed.description || `Watch ${artistName}'s incredible ${sceneTheme} moment! 🎬✨`;
    }
  } catch {
    return `Watch ${artistName}'s incredible ${sceneTheme} moment! 🎬✨`;
  }
}

export const clipperRouter = router({
  /**
   * Generate viral clip with AI analysis
   */
  generateClip: protectedProcedure
    .input(
      z.object({
        videoUrl: z.string().url(),
        videoSource: z.enum(["youtube", "upload"]),
        artistName: z.string().min(1),
        sceneTheme: z.string().min(1),
        keywords: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      // Check tier and daily limit
      const userTier = await getUserTier(userId);
      if (!userTier) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "User tier not found",
        });
      }

      if (userTier.tier === "lite") {
        const today = new Date().toISOString().split("T")[0];
        const usage = await getDailyUsage(userId, today);

        if (usage && usage.clipsGenerated >= LITE_DAILY_LIMIT) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: `Lite users can only generate ${LITE_DAILY_LIMIT} clips per day`,
          });
        }

        // Increment usage
        await incrementDailyUsage(userId, today);
      }

      // Run AI analysis modules in parallel
      const [personaAnalysis, themeAnalysis, sentimentAnalysis] = await Promise.all([
        analyzeArtistPersona(input.artistName, input.sceneTheme),
        detectSceneTheme(input.sceneTheme, input.artistName),
        analyzeMarketSentiment(input.artistName, input.sceneTheme),
      ]);

      // Generate viral title and description
      const viralTitle = await generateViralTitle(
        input.artistName,
        input.sceneTheme,
        input.keywords || ""
      );
      const viralDescription = await generateViralDescription(
        input.artistName,
        input.sceneTheme,
        viralTitle
      );

      // Simulate clip generation with random timing
      const startTime = Math.floor(Math.random() * 60);
      const duration = themeAnalysis.optimalDuration || 15;
      const endTime = startTime + duration;

      // Calculate viral score based on sentiment analysis
      const viralScore = Math.min(100, Math.floor(sentimentAnalysis.viralPotential * 1.2));

      // Save clip to database
      const clip = {
        userId,
        videoUrl: input.videoUrl,
        videoSource: input.videoSource,
        artistName: input.artistName,
        sceneTheme: input.sceneTheme,
        keywords: input.keywords,
        clipTitle: viralTitle,
        clipDescription: viralDescription,
        startTime,
        endTime,
        duration,
        hasSubtitles: 0,
        viralScore,
        personaAnalysis: JSON.stringify(personaAnalysis),
        themeAnalysis: JSON.stringify(themeAnalysis),
        sentimentAnalysis: JSON.stringify(sentimentAnalysis),
      };

      await saveClip(clip);

      return {
        success: true,
        clip: {
          ...clip,
          personaAnalysis,
          themeAnalysis,
          sentimentAnalysis,
        },
      };
    }),

  /**
   * Get user's generated clips
   */
  getClips: protectedProcedure.query(async ({ ctx }) => {
    const clips = await getUserClips(ctx.user.id);
    return clips || [];
  }),

  /**
   * Get user's tier information
   */
  getTier: protectedProcedure.query(async ({ ctx }) => {
    const tier = await getUserTier(ctx.user.id);
    return tier || { tier: "lite" };
  }),

  /**
   * Get daily usage for Lite users
   */
  getDailyUsage: protectedProcedure.query(async ({ ctx }) => {
    const today = new Date().toISOString().split("T")[0];
    const usage = await getDailyUsage(ctx.user.id, today);
    return {
      clipsGenerated: usage?.clipsGenerated || 0,
      dailyLimit: LITE_DAILY_LIMIT,
      remaining: Math.max(0, LITE_DAILY_LIMIT - (usage?.clipsGenerated || 0)),
    };
  }),

  /**
   * Update user preferences
   */
  updatePreferences: protectedProcedure
    .input(
      z.object({
        defaultArtistName: z.string().optional(),
        defaultTheme: z.string().optional(),
        subtitlesEnabled: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const prefs = await upsertUserPreferences(ctx.user.id, {
        defaultArtistName: input.defaultArtistName,
        defaultTheme: input.defaultTheme,
        subtitlesEnabled: input.subtitlesEnabled ? 1 : 0,
      });
      return prefs;
    }),
});
