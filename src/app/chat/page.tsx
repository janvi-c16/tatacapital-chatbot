"use client";

import { useState, useEffect, useRef } from 'react';
import { Send, Loader2, MessageSquare, Calculator as CalcIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatusIndicator } from '@/components/chat/StatusIndicator';
import { EMICalculator } from '@/components/chat/EMICalculator';
import { FileUpload } from '@/components/chat/FileUpload';
import { ApprovalCard } from '@/components/chat/ApprovalCard';
import { LoanApplication, Message } from '@/lib/types';

export default function ChatPage() {
  const [sessionId] = useState(() => `session-${Date.now()}`);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [application, setApplication] = useState<LoanApplication | null>(null);
  const [showCalculator, setShowCalculator] = useState(false);
  const [downloadingPDF, setDownloadingPDF] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initialize chat
    sendMessage('');
  }, []);

  const sendMessage = async (userMessage: string) => {
    if (loading) return;

    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          sessionId,
        }),
      });

      if (!response.ok) throw new Error('Failed to send message');

      const data = await response.json();
      
      setMessages(data.conversationHistory || []);
      setApplication(data.application);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'Sorry, something went wrong. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}-user`,
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    sendMessage(input);
    setInput('');
  };

  const handleDownloadPDF = async () => {
    setDownloadingPDF(true);
    try {
      const response = await fetch('/api/generate-sanction-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ application }),
      });

      const data = await response.json();
      
      if (data.pdf) {
        // Download PDF
        const link = document.createElement('a');
        link.href = data.pdf;
        link.download = `Sanction_Letter_${data.refNo}.pdf`;
        link.click();
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setDownloadingPDF(false);
    }
  };

  const handleFileUploadComplete = (data: any) => {
    const uploadMessage: Message = {
      id: `msg-${Date.now()}-system`,
      role: 'assistant',
      content: `✅ Document verified! Your monthly income has been confirmed as ₹${data.extractedData.salaryAmount.toLocaleString('en-IN')}. Proceeding with application...`,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, uploadMessage]);
    
    // Continue the flow
    setTimeout(() => sendMessage('Document uploaded'), 1000);
  };

  const needsDocumentUpload = messages.some(m => 
    m.role === 'assistant' && m.content.includes('Upload Document')
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-700 to-purple-900 text-white shadow-lg sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <span className="text-purple-700 font-bold text-xl">T</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">Tata Capital</h1>
              <p className="text-xs text-purple-200">Personal Loan Assistant</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowCalculator(!showCalculator)}
            className="text-white hover:bg-purple-600"
          >
            <CalcIcon className="w-4 h-4 mr-2" />
            {showCalculator ? 'Hide' : 'Show'} Calculator
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chat Area */}
          <div className="lg:col-span-2 space-y-4">
            {/* Status Indicator */}
            {application && (
              <StatusIndicator stage={application.currentStage} />
            )}

            {/* Chat Messages */}
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 flex flex-col h-[600px]">
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-3 ${
                        message.role === 'user'
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.role === 'user' ? 'text-purple-200' : 'text-gray-500'
                      }`}>
                        {new Date(message.timestamp).toLocaleTimeString('en-IN', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-lg px-4 py-3">
                      <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4">
                <div className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    disabled={loading}
                    className="flex-1"
                  />
                  <Button
                    type="submit"
                    disabled={loading || !input.trim()}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </form>
            </div>

            {/* Approval Card */}
            {application?.decision && (
              <ApprovalCard
                application={application}
                onDownloadPDF={handleDownloadPDF}
                downloadingPDF={downloadingPDF}
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* EMI Calculator */}
            {(showCalculator || !application) && (
              <EMICalculator
                initialAmount={application?.requestedAmount || 500000}
                initialTenure={application?.tenure || 24}
                initialRate={application?.interestRate || 10.5}
              />
            )}

            {/* File Upload */}
            {needsDocumentUpload && !application?.salarySlipUploaded && (
              <FileUpload
                sessionId={sessionId}
                onUploadComplete={handleFileUploadComplete}
              />
            )}

            {/* Info Cards */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-purple-600" />
                Test Numbers
              </h3>
              <div className="space-y-2 text-xs">
                <div className="bg-green-50 p-2 rounded border border-green-200">
                  <p className="font-semibold text-green-700">✅ Instant Approval:</p>
                  <p className="text-green-600">9876543210, 9876543211</p>
                </div>
                <div className="bg-yellow-50 p-2 rounded border border-yellow-200">
                  <p className="font-semibold text-yellow-700">⚠️ Conditional:</p>
                  <p className="text-yellow-600">9876543212, 9876543213, 9876543214</p>
                </div>
                <div className="bg-red-50 p-2 rounded border border-red-200">
                  <p className="font-semibold text-red-700">❌ Rejection:</p>
                  <p className="text-red-600">9876543215 - 9876543219</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
