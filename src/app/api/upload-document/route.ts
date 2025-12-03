import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const sessionId = formData.get('sessionId') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only PDF and images allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      );
    }

    // In production, upload to cloud storage (S3, Cloudinary, etc.)
    // For now, we'll simulate verification
    
    // Simulate document processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock salary verification (in production, use OCR/AI)
    const mockSalaryAmount = Math.floor(Math.random() * 50000) + 40000;
    
    return NextResponse.json({
      success: true,
      message: 'Document uploaded and verified successfully',
      documentId: `DOC-${Date.now()}`,
      fileName: file.name,
      fileSize: file.size,
      uploadedAt: new Date().toISOString(),
      verified: true,
      extractedData: {
        salaryAmount: mockSalaryAmount,
        documentType: 'salary_slip',
      },
    });

  } catch (error) {
    console.error('Document Upload Error:', error);
    return NextResponse.json(
      { error: 'Failed to upload document' },
      { status: 500 }
    );
  }
}
