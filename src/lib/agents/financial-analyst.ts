import type { ResearchGraphStateType } from './state';

export async function financialAnalystAgent(
  state: ResearchGraphStateType
): Promise<Partial<ResearchGraphStateType>> {
  try {
    // LLM call has been consolidated into Agent 1 for efficiency
    // We just pause briefly so the UI animation looks good
    await new Promise(r => setTimeout(r, 800));
    
    return {
      currentStep: 'financial_analysis_complete',
    };
  } catch (error) {
    return {
      errors: [`Financial Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`],
      currentStep: 'financial_analysis_error',
    };
  }
}
