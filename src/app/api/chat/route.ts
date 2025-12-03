import { NextRequest, NextResponse } from 'next/server';
import { AgentOrchestrator } from '@/lib/agents/orchestrator';
import { LoanApplication, Message } from '@/lib/types';

// In-memory session storage (use Redis/Database in production)
const sessions = new Map<string, {
  orchestrator: AgentOrchestrator;
  application: LoanApplication;
  messages: Message[];
}>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, sessionId } = body;

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
    }

    // Get or create session
    let session = sessions.get(sessionId);
    
    if (!session) {
      // Create new session
      const orchestrator = new AgentOrchestrator();
      const application: LoanApplication = {
        customerId: '',
        name: '',
        phone: '',
        email: '',
        requestedAmount: 0,
        tenure: 0,
        purpose: '',
        employmentType: '',
        currentStage: 'initial',
      };
      
      session = {
        orchestrator,
        application,
        messages: [],
      };
      
      sessions.set(sessionId, session);
    }

    // Add user message to history
    if (message && message.trim() !== '') {
      const userMessage: Message = {
        id: `msg-${Date.now()}-user`,
        role: 'user',
        content: message,
        timestamp: new Date(),
      };
      session.messages.push(userMessage);
    }

    // Process message through orchestrator
    const result = await session.orchestrator.processMessage(
      message || '',
      session.application,
      session.messages
    );

    // Add assistant response to history
    const assistantMessage: Message = {
      id: `msg-${Date.now()}-assistant`,
      role: 'assistant',
      content: result.response,
      timestamp: new Date(),
      agentType: result.agentType as any,
      metadata: result.metadata,
    };
    session.messages.push(assistantMessage);

    // Update session
    session.application = result.application;
    sessions.set(sessionId, session);

    return NextResponse.json({
      message: result.response,
      application: result.application,
      metadata: result.metadata,
      agentType: result.agentType,
      conversationHistory: session.messages,
    });

  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const sessionId = searchParams.get('sessionId');

  if (!sessionId) {
    return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
  }

  const session = sessions.get(sessionId);

  if (!session) {
    return NextResponse.json({ 
      application: null,
      messages: [],
      exists: false 
    });
  }

  return NextResponse.json({
    application: session.application,
    messages: session.messages,
    exists: true,
  });
}
