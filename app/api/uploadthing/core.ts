import { cookies } from "next/headers";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

import { verifyAccessToken } from "@/lib/auth";
import { db } from "@/lib/db";

function hydrateUploadthingFromToken() {
  const token = process.env.UPLOADTHING_TOKEN;

  if (!token) return;

  try {
    const decoded = JSON.parse(Buffer.from(token, "base64").toString("utf8"));
    const { apiKey, appId } = decoded ?? {};

    if (apiKey && !process.env.UPLOADTHING_SECRET) {
      process.env.UPLOADTHING_SECRET = apiKey;
    }

    if (appId) {
      if (!process.env.UPLOADTHING_APP_ID) {
        process.env.UPLOADTHING_APP_ID = appId;
      }
      if (!process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID) {
        process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID = appId;
      }
    }
  } catch (error) {
    console.warn("Failed to parse UPLOADTHING_TOKEN. Provide UPLOADTHING_SECRET/UPLOADTHING_APP_ID explicitly.", error);
  }
}

hydrateUploadthingFromToken();

const f = createUploadthing();

const handleAuth = async () => {
  const accessToken = cookies().get("accessToken")?.value;

  if (!accessToken) {
    throw new UploadThingError("UNAUTHORIZED");
  }

  const payload = verifyAccessToken(accessToken);

  if (!payload) {
    throw new UploadThingError("UNAUTHORIZED");
  }

  const user = await db.user.findUnique({
    where: { id: payload.userId },
    select: { id: true, role: true },
  });

  if (!user) {
    throw new UploadThingError("UNAUTHORIZED");
  }

  return { userId: user.id, role: user.role };
};

const ensureUploadthingEnv = () => {
  const missingVars = [
    !process.env.UPLOADTHING_SECRET && "UPLOADTHING_SECRET",
    !process.env.UPLOADTHING_APP_ID && "UPLOADTHING_APP_ID",
  ].filter(Boolean) as string[];

  if (missingVars.length > 0) {
    console.warn(
      `UploadThing configuration missing: ${missingVars.join(", ")}. File uploads will fail until these environment variables are provided.`
    );
  }
};

ensureUploadthingEnv();

export const ourFileRouter = {
  courseBanner: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(handleAuth)
    .onUploadComplete(() => {}),
  sectionVideo: f({ video: { maxFileSize: "512GB", maxFileCount: 1 } })
    .middleware(handleAuth)
    .onUploadComplete(() => {}),
  sectionResource: f(["text", "image", "video", "audio", "pdf"])
    .middleware(handleAuth)
    .onUploadComplete(() => {}),
  educatorMaterial: f(["pdf", "image", "video", "audio"])
    .middleware(handleAuth)
    .onUploadComplete(() => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
