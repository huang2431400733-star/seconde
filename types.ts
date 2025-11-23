export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  username: string;
  avatar: string;
  role: UserRole;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  timestamp: number;
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  title: string;
  content: string;
  image?: string;
  likes: number;
  views: number;
  collected: boolean; // For current user context simulation
  liked: boolean; // For current user context simulation
  timestamp: number;
  comments: Comment[];
}

export interface ChatMessage {
  id: string;
  senderId: string;
  content: string;
  timestamp: number;
  isSelf: boolean;
}

export interface ChatSession {
  id: string;
  partnerName: string;
  partnerAvatar: string;
  lastMessage: string;
  messages: ChatMessage[];
}