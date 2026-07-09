// src/lib/db/json-db.ts
// Vai trò: JSON database (legacy) - FIXED

import fs from "fs";
import path from "path";

const dbPath = path.join(process.cwd(), "data", "db.json");

// ✅ Đọc dữ liệu
const readDB = () => {
  try {
    if (!fs.existsSync(dbPath)) {
      return { posts: [], users: [], assignments: [] };
    }
    const data = fs.readFileSync(dbPath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading database:", error);
    return { posts: [], users: [], assignments: [] };
  }
};

// ✅ Ghi dữ liệu - CHỈ GỌI 1 LẦN
const saveDB = (data: any) => {
  try {
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error("Error saving database:", error);
    return false;
  }
};

// ✅ Toggle like - CHỈ GỌI saveDB 1 LẦN
export const toggleLike = (postId: string, userId: string) => {
  const db = readDB();
  const postIndex = db.posts.findIndex((p: any) => p.id === postId);

  if (postIndex === -1) return false;

  const post = db.posts[postIndex];
  const likeIndex = post.likes?.findIndex((id: string) => id === userId) ?? -1;

  if (likeIndex === -1) {
    post.likes = [...(post.likes || []), userId];
  } else {
    post.likes = post.likes.filter((id: string) => id !== userId);
  }

  db.posts[postIndex] = post;

  // ✅ CHỈ GỌI 1 LẦN
  return saveDB(db);
};

// Export functions
export const jsonDB = {
  read: readDB,
  save: saveDB,
  toggleLike,
};
