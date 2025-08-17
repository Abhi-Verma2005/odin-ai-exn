import { Message } from 'ai';
import crypto from 'crypto';

// Mock database interface - replace with actual database implementation
interface Chat {
  id: string;
  messages: Message[];
  externalUserId: string;
  createdAt: Date;
  updatedAt: Date;
}

// In-memory storage for development - replace with actual database
const chatStorage = new Map<string, Chat>();

export const saveChat = async ({ id, messages, externalUserId }: {
  id: string;
  messages: Message[];
  externalUserId: string;
}) => {
  const chat: Chat = {
    id,
    messages,
    externalUserId,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  chatStorage.set(id, chat);
  return chat;
};

export const getChatById = async ({ id }: { id: string }) => {
  return chatStorage.get(id) || null;
};

export const deleteChatById = async ({ id }: { id: string }) => {
  return chatStorage.delete(id);
};

export const getChatsByExternalUserId = async ({ externalUserId }: { externalUserId: string }) => {
  const chats: Chat[] = [];
  for (const chat of chatStorage.values()) {
    if (chat.externalUserId === externalUserId) {
      chats.push(chat);
    }
  }
  return chats.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
};

// Mock code submission functions for development
interface CodeSubmission {
  id: string;
  externalUserId: string;
  questionSlug: string;
  code: string;
  language: string;
  problemTitle?: string;
  createdAt: Date;
  updatedAt: Date;
}

const submissionStorage = new Map<string, CodeSubmission>();

export const getCodeSubmissionByUserAndQuestion = async ({ 
  externalUserId, 
  questionSlug 
}: { 
  externalUserId: string; 
  questionSlug: string; 
}) => {
  for (const submission of submissionStorage.values()) {
    if (submission.externalUserId === externalUserId && submission.questionSlug === questionSlug) {
      return submission;
    }
  }
  return null;
};

export const saveCodeSubmission = async ({ 
  externalUserId, 
  questionSlug, 
  code, 
  language, 
  problemTitle 
}: { 
  externalUserId: string; 
  questionSlug: string; 
  code: string; 
  language: string; 
  problemTitle?: string; 
}) => {
  const submission: CodeSubmission = {
    id: crypto.randomUUID(),
    externalUserId,
    questionSlug,
    code,
    language,
    problemTitle,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  submissionStorage.set(submission.id, submission);
  return submission;
};

export const updateCodeSubmission = async ({ 
  externalUserId, 
  questionSlug, 
  code, 
  language, 
  problemTitle 
}: { 
  externalUserId: string; 
  questionSlug: string; 
  code: string; 
  language: string; 
  problemTitle?: string; 
}) => {
  for (const submission of submissionStorage.values()) {
    if (submission.externalUserId === externalUserId && submission.questionSlug === questionSlug) {
      submission.code = code;
      submission.language = language;
      submission.problemTitle = problemTitle;
      submission.updatedAt = new Date();
      return submission;
    }
  }
  
  // If not found, create new submission
  return saveCodeSubmission({ externalUserId, questionSlug, code, language, problemTitle });
}; 