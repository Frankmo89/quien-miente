import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users } from "../drizzle/schema";
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

// Game-related queries
export async function getActivePacks() {
  const db = await getDb();
  if (!db) return [];
  
  const { questionPacks } = await import("../drizzle/schema");
  const { eq } = await import("drizzle-orm");
  
  return db.select().from(questionPacks).where(eq(questionPacks.isActive, 1));
}

export async function getPackById(packId: string) {
  const db = await getDb();
  if (!db) return null;
  
  const { questionPacks } = await import("../drizzle/schema");
  const { eq } = await import("drizzle-orm");
  
  const result = await db.select().from(questionPacks).where(eq(questionPacks.packId, packId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getQuestionsByPackAndMode(packIds: string[], mode: "familiar" | "adultos") {
  const db = await getDb();
  if (!db) return [];
  
  const { questions } = await import("../drizzle/schema");
  const { inArray, eq, and } = await import("drizzle-orm");
  
  return db.select().from(questions).where(
    and(
      inArray(questions.packId, packIds),
      eq(questions.mode, mode)
    )
  );
}

export async function getChallengesByMode(mode: "familiar" | "adultos") {
  const db = await getDb();
  if (!db) return [];
  
  const { miniChallenges } = await import("../drizzle/schema");
  const { eq, or } = await import("drizzle-orm");
  
  return db.select().from(miniChallenges).where(
    or(
      eq(miniChallenges.mode, mode),
      eq(miniChallenges.mode, "both")
    )
  );
}
