// ============================================
// API: /api/research — Run AI Research Pipeline
// ============================================

import { NextRequest } from 'next/server';
import { createResearchGraph } from '@/lib/agents/graph';
import { searchTicker } from '@/lib/data/yahoo-finance';
import { saveReport } from '@/lib/db';
import type { ResearchState } from '@/lib/types';
import { auth } from '@/auth';

export const maxDuration = 120;

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id || 'guest';
    const body = await req.json();
    const { company } = body;

    if (!company) {
      return Response.json({ error: 'Company name is required' }, { status: 400 });
    }

    if (!process.env.GOOGLE_API_KEY) {
      return Response.json({ error: 'GOOGLE_API_KEY is not configured. Please add it to your .env.local file.' }, { status: 500 });
    }

    // Resolve ticker
    let ticker = '';
    try {
      const searchResult = await searchTicker(company);
      if (searchResult) {
        ticker = searchResult.ticker;
      }
    } catch {
      // Continue without ticker
    }

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const sendEvent = (event: Record<string, unknown>) => {
          const data = `data: ${JSON.stringify(event)}\n\n`;
          controller.enqueue(encoder.encode(data));
        };

        try {
          const graph = createResearchGraph();

          const steps = [
            'company_research',
            'financial_analysis',
            'news_intelligence',
            'market_sentiment',
            'risk_assessment',
            'investment_committee',
          ];

          const stepLabels: Record<string, string> = {
            company_research: 'Researching Company',
            financial_analysis: 'Analyzing Financials',
            news_intelligence: 'Checking News',
            market_sentiment: 'Evaluating Sentiment',
            risk_assessment: 'Assessing Risks',
            investment_committee: 'Generating Recommendation',
          };

          let currentStepIdx = 0;
          let finalState: Partial<ResearchState> = {};

          // Send initial step
          sendEvent({
            type: 'step_start',
            step: steps[0],
            label: stepLabels[steps[0]],
            timestamp: Date.now(),
          });

          // Stream through the graph
          const streamIterator = await graph.stream(
            {
              company,
              ticker,
              currentStep: 'starting',
              errors: [],
            },
            { streamMode: 'updates' }
          );

          for await (const chunk of streamIterator) {
            const entries = Object.entries(chunk as Record<string, Record<string, unknown>>);
            for (const [, stateUpdate] of entries) {
              const stepId = steps[currentStepIdx] || 'unknown';

              // Merge into final state
              finalState = { ...finalState, ...(stateUpdate as Partial<ResearchState>) };

              sendEvent({
                type: 'step_complete',
                step: stepId,
                label: stepLabels[stepId] || stepId,
                timestamp: Date.now(),
              });

              currentStepIdx++;

              if (currentStepIdx < steps.length) {
                sendEvent({
                  type: 'step_start',
                  step: steps[currentStepIdx],
                  label: stepLabels[steps[currentStepIdx]],
                  timestamp: Date.now(),
                });
              }
            }
          }

          // Build complete state
          const completeState: ResearchState = {
            company: finalState.company || company,
            ticker: finalState.ticker || ticker,
            currentStep: 'complete',
            companyResearch: finalState.companyResearch || null,
            financialAnalysis: finalState.financialAnalysis || null,
            newsIntelligence: finalState.newsIntelligence || null,
            marketSentiment: finalState.marketSentiment || null,
            riskAssessment: finalState.riskAssessment || null,
            recommendation: finalState.recommendation || null,
            errors: finalState.errors || [],
          };

          // Save to database
          let reportId: string | undefined;
          if (completeState.recommendation) {
            const report = await saveReport(
              userId,
              completeState.companyResearch?.name || company,
              completeState.ticker || ticker,
              completeState.recommendation.recommendation,
              completeState.recommendation.confidence,
              completeState
            );
            reportId = report.id;
          }

          sendEvent({
            type: 'complete',
            step: 'complete',
            data: { ...completeState, reportId },
            timestamp: Date.now(),
          });
        } catch (error) {
          sendEvent({
            type: 'step_error',
            step: 'pipeline',
            error: error instanceof Error ? error.message : 'An unexpected error occurred',
            timestamp: Date.now(),
          });
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
    console.error('Research API error:', error);
    return Response.json(
      { error: error instanceof Error ? error.message : 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
