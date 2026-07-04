// src/lib/db/json-db.ts

import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// Định nghĩa các interface
export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: "ADMIN" | "TEACHER" | "STUDENT";
  image?: string;
  studentId?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Document {
  id: string;
  title: string;
  description?: string;
  url: string;
  type: string;
  size?: number;
  tags: string[];
  downloads: number;
  views: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Submission {
  id: string;
  title: string;
  url: string;
  status: "PENDING" | "GRADED" | "REJECTED";
  grade?: number;
  feedback?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  pinned: boolean;
  views: number;
  likes: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ForumComment {
  id: string;
  content: string;
  userId: string;
  postId: string;
  parentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PostLike {
  id: string;
  userId: string;
  postId: string;
  createdAt: string;
}

export interface Comment {
  id: string;
  content: string;
  userId: string;
  documentId?: string;
  parentId?: string;
  createdAt: string;
  updatedAt: string;
}

interface Database {
  users: User[];
  documents: Document[];
  submissions: Submission[];
  forumPosts: ForumPost[];
  forumComments: ForumComment[];
  postLikes: PostLike[];
  comments: Comment[];
}

class JsonDatabase {
  private dbPath: string;
  private data: Database;

  constructor() {
    this.dbPath = path.join(process.cwd(), "data", "db.json");
    this.data = this.loadData();
  }

  private loadData(): Database {
    try {
      if (fs.existsSync(this.dbPath)) {
        const raw = fs.readFileSync(this.dbPath, "utf-8");
        return JSON.parse(raw);
      }
    } catch (error) {
      console.error("Error loading database:", error);
    }
    return this.getDefaultData();
  }

  private getDefaultData(): Database {
    return {
      users: [
        {
          id: "1",
          name: "Admin",
          email: "admin@cdngk.edu.vn",
          password:
            "$2a$12$K8p9yL5Zq7XwY2rV4nB6dO8uJ7kL3mN5pQ7rS9tU1vW3xY4zA5bC6dE7fG8hI9", // password: admin123
          role: "ADMIN",
          image: "",
          studentId: "ADMIN001",
          bio: "Quản trị viên hệ thống",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "2",
          name: "Nguyễn Ngọc Thanh",
          email: "thanh.nn@cdngk.edu.vn",
          password:
            "$2a$12$K8p9yL5Zq7XwY2rV4nB6dO8uJ7kL3mN5pQ7rS9tU1vW3xY4zA5bC6dE7fG8hI9", // password: admin123
          role: "TEACHER",
          image: "",
          studentId: "GV001",
          bio: "Giảng viên chủ nhiệm lớp Quản trị Mạng 3",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "3",
          name: "Võ Nhật Hào",
          email: "hao.vn@cdngk.edu.vn",
          password:
            "$2a$12$K8p9yL5Zq7XwY2rV4nB6dO8uJ7kL3mN5pQ7rS9tU1vW3xY4zA5bC6dE7fG8hI9", // password: admin123
          role: "STUDENT",
          image: "",
          studentId: "CD220001",
          bio: "Sinh viên lớp Quản trị Mạng 3",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      documents: [],
      submissions: [],
      forumPosts: [],
      forumComments: [],
      postLikes: [],
      comments: [],
    };
  }

  private saveData(): void {
    const dir = path.dirname(this.dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(this.dbPath, JSON.stringify(this.data, null, 2));
  }

  // User methods
  async findUserByEmail(email: string): Promise<User | undefined> {
    return this.data.users.find((user) => user.email === email);
  }

  async findUserById(id: string): Promise<User | undefined> {
    return this.data.users.find((user) => user.id === id);
  }

  async createUser(
    data: Omit<User, "id" | "createdAt" | "updatedAt">,
  ): Promise<User> {
    const user: User = {
      ...data,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.data.users.push(user);
    this.saveData();
    return user;
  }

  async updateUser(id: string, data: Partial<User>): Promise<User | undefined> {
    const index = this.data.users.findIndex((user) => user.id === id);
    if (index === -1) return undefined;
    this.data.users[index] = {
      ...this.data.users[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    this.saveData();
    return this.data.users[index];
  }

  async getAllUsers(): Promise<User[]> {
    return this.data.users;
  }

  // Document methods
  async createDocument(
    data: Omit<Document, "id" | "createdAt" | "updatedAt">,
  ): Promise<Document> {
    const document: Document = {
      ...data,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.data.documents.push(document);
    this.saveData();
    return document;
  }

  async getDocuments(): Promise<Document[]> {
    return this.data.documents;
  }

  async getDocumentById(id: string): Promise<Document | undefined> {
    return this.data.documents.find((doc) => doc.id === id);
  }

  async updateDocument(
    id: string,
    data: Partial<Document>,
  ): Promise<Document | undefined> {
    const index = this.data.documents.findIndex((doc) => doc.id === id);
    if (index === -1) return undefined;
    this.data.documents[index] = {
      ...this.data.documents[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    this.saveData();
    return this.data.documents[index];
  }

  async deleteDocument(id: string): Promise<boolean> {
    const index = this.data.documents.findIndex((doc) => doc.id === id);
    if (index === -1) return false;
    this.data.documents.splice(index, 1);
    this.saveData();
    return true;
  }

  // Submission methods
  async createSubmission(
    data: Omit<Submission, "id" | "createdAt" | "updatedAt">,
  ): Promise<Submission> {
    const submission: Submission = {
      ...data,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.data.submissions.push(submission);
    this.saveData();
    return submission;
  }

  async getSubmissions(): Promise<Submission[]> {
    return this.data.submissions;
  }

  async getSubmissionsByUser(userId: string): Promise<Submission[]> {
    return this.data.submissions.filter((sub) => sub.userId === userId);
  }

  // Forum methods
  async createForumPost(
    data: Omit<ForumPost, "id" | "createdAt" | "updatedAt">,
  ): Promise<ForumPost> {
    const post: ForumPost = {
      ...data,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.data.forumPosts.push(post);
    this.saveData();
    return post;
  }

  async getForumPosts(): Promise<ForumPost[]> {
    return this.data.forumPosts;
  }

  async getForumPostById(id: string): Promise<ForumPost | undefined> {
    return this.data.forumPosts.find((post) => post.id === id);
  }

  async createForumComment(
    data: Omit<ForumComment, "id" | "createdAt" | "updatedAt">,
  ): Promise<ForumComment> {
    const comment: ForumComment = {
      ...data,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.data.forumComments.push(comment);
    this.saveData();
    return comment;
  }

  async getForumComments(postId: string): Promise<ForumComment[]> {
    return this.data.forumComments.filter(
      (comment) => comment.postId === postId,
    );
  }

  // Like methods
  async toggleLike(
    userId: string,
    postId: string,
  ): Promise<{ liked: boolean; likes: number }> {
    const existingLike = this.data.postLikes.find(
      (like) => like.userId === userId && like.postId === postId,
    );

    if (existingLike) {
      this.data.postLikes = this.data.postLikes.filter(
        (like) => like.id !== existingLike.id,
      );
      const post = await this.getForumPostById(postId);
      if (post) {
        post.likes = Math.max(0, post.likes - 1);
        this.saveData();
      }
      this.saveData();
      return { liked: false, likes: post?.likes || 0 };
    }

    const like: PostLike = {
      id: uuidv4(),
      userId,
      postId,
      createdAt: new Date().toISOString(),
    };
    this.data.postLikes.push(like);
    const post = await this.getForumPostById(postId);
    if (post) {
      post.likes = (post.likes || 0) + 1;
      this.saveData();
    }
    this.saveData();
    return { liked: true, likes: post?.likes || 0 };
  }

  // Generic methods
  async getData(): Promise<Database> {
    return this.data;
  }

  async resetData(): Promise<void> {
    this.data = this.getDefaultData();
    this.saveData();
  }
}

// Export singleton instance
const db = new JsonDatabase();
export default db;
