import { ChatGoogleGenerativeAI } from '@langchain/google-genai';

export async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function invokeWithRetry(model: ChatGoogleGenerativeAI, prompt: any[]): Promise<any> {
  const maxRetries = 4;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await model.invoke(prompt);
    } catch (error: any) {
      const errMsg = error?.message || String(error);
      if (i < maxRetries - 1 && errMsg.includes('429')) {
        // Try to extract exact wait time from Google's error
        const match = errMsg.match(/retry in ([\d\.]+)s/);
        let waitMs = 15000; // default to 15 seconds if not explicitly stated
        if (match && match[1]) {
           waitMs = parseFloat(match[1]) * 1000 + 1500; // Add 1.5s buffer
        }
        console.warn(`[Agent] Rate limit hit. Waiting ${Math.round(waitMs/1000)}s before retrying...`);
        await delay(waitMs);
        continue;
      }
      throw error;
    }
  }
  throw new Error("Max retries exceeded");
}
