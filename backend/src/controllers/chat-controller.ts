import { Request, Response } from 'express';
import crypto from 'crypto';
import { z } from 'zod';
import { convertToCoreMessages, streamText, Message } from "ai";
import { AuthenticatedRequest } from '@/middleware/auth';
import { geminiProModel } from '@/services/ai-service';
import { 
  getUserProgress, 
  getRecentActivity, 
  getFilteredQuestions, 
  getTags, 
  getUserContextForPrompt 
} from '@/services/ai-actions';
import { 
  getChatById, 
  saveChat, 
  deleteChatById, 
  getChatsByExternalUserId 
} from '@/services/queries';
import { SearchService, SearchResult } from '@/services/search-service';

const chatRequestSchema = z.object({
  id: z.string(),
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
    // id is optional since useChat doesn't always send it
    id: z.string().optional(),
  })),
});

export const streamChat = async (req: Request, res: Response) => {
  try {
    const { id, messages } = chatRequestSchema.parse(req.body);

    const coreMessages = convertToCoreMessages(messages).filter(
      (message) => message.content.length > 0,
    );

    // Dynamic system prompt with user context
    const systemPrompt = `
You are an expert DSA (Data Structures & Algorithms) tutor named Odin helping users master programming concepts and problem-solving skills.

## Your Teaching Philosophy:
- **Encouraging but honest**: Celebrate progress while acknowledging real difficulties
- **Step-by-step guidance**: Never give direct solutions, provide hints and progressive guidance
- **Contextual learning**: Use the student's progress data above to personalize advice and recommendations
- **Conversational flow**: Maintain natural conversation while leveraging your tools for context

## Your Capabilities:
- Track and analyze user progress across different topics and difficulty levels
- Provide personalized problem recommendations based on learning patterns
- Explain concepts with examples tailored to user's experience level
- Give hints and guidance for specific problems without revealing solutions
- Identify weak areas and suggest focused practice
- Create learning paths for structured skill development
- **Search the web for current information** when users ask about latest contests, news, or real-time data

## Guidelines:
- Reference recent activity and bookmarked problems when relevant
- Don't confirm too much, which question to solve is predefined you need not to ask much about what to fetch
- Use encouraging language while being realistic about difficulty
- Break down complex problems into manageable steps
- Reference user's past solved problems to build confidence
- Ask clarifying questions to understand what the user needs help with
- Keep responses concise but comprehensive
- Use tools to fetch relevant context instead of making assumptions
- **Use the searchWeb tool** when users ask about current events, latest contests, or information that might be time-sensitive
- **When using search results**: Present the information in a clear, organized way. Mention the source URLs and provide a summary of the key findings

## Today's date: ${new Date().toLocaleDateString()}

Remember: Your goal is to guide users to understand concepts and solve problems independently, not to give them answers directly. Personalize your approach based on their current progress and learning patterns.
    `;

    const result = await streamText({
      model: geminiProModel,
      system: systemPrompt,
      messages: coreMessages.slice(-10),
      tools: {
        getUserProgressOverview: {
          description: "Get comprehensive overview of user's DSA learning progress including total problems solved, difficulty breakdown, and overall statistics",
          parameters: z.object({
            includeStats: z.boolean().default(true).describe("Include detailed statistics"),
            timeRange: z.enum(["week", "month", "all"]).default("all").describe("Time range for progress data")
          }),
          execute: async ({ timeRange }) => {
            // For now, use a mock user ID since authentication is disabled
            const userId = 'mock-user-123';
            const progress = await getUserProgress(userId, { timeRange });
            return progress;
          },
        },
        getFilteredQuestionsToSolve: {
          description: "Fetch a curated list of DSA questions by passing SCREAMING_SNAKE_CASE topic name based on selected topics and difficulty levels, along with user-specific metadata like solved/bookmarked status.",
          parameters: z.object({
            topics: z.array(z.string()).min(1).describe("List of topic tags to filter questions by"),
            limit: z.number().min(1).max(100).default(50).describe("Maximum number of questions to fetch (default 50)"),
            unsolvedOnly: z.boolean().optional().describe("If true, only return unsolved questions for the user")
          }),
          execute: async ({ topics, limit, unsolvedOnly }) => {
            // For now, use a mock user ID since authentication is disabled
            const userId = 'mock-user-123';
            const response = await getFilteredQuestions({ topics, userId, limit, unsolvedOnly });
            return response;
          }
        },
        searchWeb: {
          description: "Search the web for current information, latest news, or real-time data that might not be in the AI's training data",
          parameters: z.object({
            query: z.string().describe("Search query to look up on the web")
          }),
          execute: async ({ query }) => {
            try {
              const searchService = SearchService.getInstance();
              const results = await searchService.searchWeb(query);
              
              if (results.length === 0) {
                return {
                  message: `No search results found for: ${query}`,
                  results: []
                };
              }

              return {
                message: `Found ${results.length} search results for: ${query}`,
                results: results.map((result: SearchResult, index: number) => ({
                  rank: index + 1,
                  title: result.title,
                  snippet: result.snippet,
                  url: result.link
                }))
              };
            } catch (error) {
              console.error('Search tool error:', error);
              return {
                message: `Unable to search for: ${query}. Please try a different search term.`,
                results: []
              };
            }
          },
        },
      },
      onFinish: async ({ responseMessages }) => {
        // For now, skip saving chat since authentication is disabled
        // In production, this would save the chat to the database
        console.log('Chat finished, would save to database in production');
      },
    });

    // Set proper headers for streaming
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');
    
    // Get the streaming response and pipe it to the response
    const streamResponse = result.toDataStreamResponse();
    const reader = streamResponse.body?.getReader();
    
    if (!reader) {
      return res.status(500).json({ error: 'Failed to create stream' });
    }

    // Read and forward the stream
    const pump = async () => {
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          // Convert Uint8Array to string and send
          const chunk = new TextDecoder().decode(value);
          res.write(chunk);
        }
        res.end();
      } catch (error) {
        console.error('Stream pump error:', error);
        res.end();
      }
    };

    pump();
    return;
  } catch (error) {
    console.error('Chat stream error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getChatHistory = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const chats = await getChatsByExternalUserId({ externalUserId: req.user.id });
    return res.json(chats);
  } catch (error) {
    console.error('Get chat history error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteChat = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!id) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    const chat = await getChatById({ id });
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    if (chat.externalUserId !== req.user.id) {
      return res.status(401).json({ error: 'Unauthorized to delete this chat' });
    }

    await deleteChatById({ id });
    return res.json({ message: 'Chat deleted successfully' });
  } catch (error) {
    console.error('Delete chat error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}; 