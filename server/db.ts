import { and, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertClip, InsertDailyUsage, InsertUserPreferences, InsertUserTier, clips, dailyUsage, userPreferences, userTiers, InsertUser, users } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/**
 * Get or create user tier
 */
export async function getUserTier(userId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(userTiers).where(eq(userTiers.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

/**
 * Create user tier (called when user signs up)
 */
export async function createUserTier(userId: number, tier: "lite" | "pro" = "lite") {
  const db = await getDb();
  if (!db) return null;

  await db.insert(userTiers).values({
    userId,
    tier,
  });

  return getUserTier(userId);
}

/**
 * Update user tier
 */
export async function updateUserTier(userId: number, tier: "lite" | "pro") {
  const db = await getDb();
  if (!db) return null;

  await db.update(userTiers).set({ tier }).where(eq(userTiers.userId, userId));
  return getUserTier(userId);
}

/**
 * Save generated clip
 */
export async function saveClip(clip: InsertClip) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.insert(clips).values(clip);
  return result;
}

/**
 * Get user's clips
 */
export async function getUserClips(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(clips).where(eq(clips.userId, userId)).orderBy(desc(clips.createdAt));
}

/**
 * Get daily usage for user
 */
export async function getDailyUsage(userId: number, date: string) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(dailyUsage)
    .where(and(eq(dailyUsage.userId, userId), eq(dailyUsage.date, date)))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

/**
 * Increment daily usage
 */
export async function incrementDailyUsage(userId: number, date: string) {
  const db = await getDb();
  if (!db) return null;

  const existing = await getDailyUsage(userId, date);

  if (existing) {
    await db
      .update(dailyUsage)
      .set({ clipsGenerated: existing.clipsGenerated + 1 })
      .where(and(eq(dailyUsage.userId, userId), eq(dailyUsage.date, date)));
  } else {
    await db.insert(dailyUsage).values({
      userId,
      date,
      clipsGenerated: 1,
    });
  }

  return getDailyUsage(userId, date);
}

/**
 * Get user preferences
 */
export async function getUserPreferences(userId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(userPreferences).where(eq(userPreferences.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

/**
 * Create or update user preferences
 */
export async function upsertUserPreferences(userId: number, prefs: Partial<InsertUserPreferences>) {
  const db = await getDb();
  if (!db) return null;

  const existing = await getUserPreferences(userId);

  if (existing) {
    await db.update(userPreferences).set(prefs).where(eq(userPreferences.userId, userId));
  } else {
    await db.insert(userPreferences).values({
      userId,
      ...prefs,
    });
  }

  return getUserPreferences(userId);
}
