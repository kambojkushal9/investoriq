// ============================================
// API: /api/copilot/chat — Streaming AI Copilot
// ============================================

import { NextRequest } from 'next/server';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { buildContextPrompt } from '@/lib/copilot/context-builder';
import { COPILOT_SYSTEM_PROMPT, EXPLAIN_SCREEN_PROMPT, EXPLAIN_MODE_INSTRUCTIONS } from '@/lib/copilot/prompts';
import type { CopilotChatRequest } from '@/lib/copilot/types';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body: CopilotChatRequest = await req.json();
    const { message, context, history, explainScreen } = body;

    if (!message && !explainScreen) {
      return Response.json({ error: 'Message is required' }, { status: 400 });
    }

    if (!process.env.GOOGLE_API_KEY) {
      return Response.json({ error: 'GOOGLE_API_KEY not configured' }, { status: 500 });
    }

    const contextPrompt = buildContextPrompt(context);
    const modeInstructions = EXPLAIN_MODE_INSTRUCTIONS[context.explainMode] || '';

    // Build system prompt
    let systemPrompt = COPILOT_SYSTEM_PROMPT + modeInstructions;
    systemPrompt += `\n\n${contextPrompt}`;

    // Build message list
    const messages: [string, string][] = [['system', systemPrompt]];

    // Add conversation history (last 10 messages for context window management)
    const recentHistory = (history || []).slice(-10);
    for (const msg of recentHistory) {
      messages.push([msg.role === 'user' ? 'human' : 'assistant', msg.content]);
    }

    // Add current message
    if (explainScreen) {
      messages.push(['human', EXPLAIN_SCREEN_PROMPT]);
    } else {
      messages.push(['human', message]);
    }

    const model = new ChatGoogleGenerativeAI({
      model: 'gemini-2.5-flash',
      apiKey: process.env.GOOGLE_API_KEY,
      temperature: 0.5,
      maxRetries: 2,
      streaming: true,
    });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const response = await model.stream(messages);

          for await (const chunk of response) {
            const text = typeof chunk.content === 'string'
              ? chunk.content
              : Array.isArray(chunk.content)
                ? chunk.content.map((c: any) => (typeof c === 'string' ? c : c.text || '')).join('')
                : '';

            if (text) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'chunk', content: text })}\n\n`));
            }
          }

          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'done' })}\n\n`));
        } catch (error) {
          const errMsg = error instanceof Error ? error.message : 'Unknown error';
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'error', content: errMsg })}\n\n`));
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Copilot API error:', error);
    return Response.json(
      { error: error instanceof Error ? error.message : 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
