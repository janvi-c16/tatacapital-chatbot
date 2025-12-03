import { NextRequest, NextResponse } from 'next/server';
import jsPDF from 'jspdf';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { application } = body;

    if (!application) {
      return NextResponse.json({ error: 'Application data required' }, { status: 400 });
    }

    // Generate PDF
    const doc = new jsPDF();
    
    // Tata Capital Header
    doc.setFillColor(80, 35, 120); // Tata Capital purple
    doc.rect(0, 0, 220, 30, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text('TATA CAPITAL', 105, 15, { align: 'center' });
    doc.setFontSize(12);
    doc.text('Personal Loan Sanction Letter', 105, 23, { align: 'center' });
    
    // Reset text color
    doc.setTextColor(0, 0, 0);
    
    // Reference and Date
    doc.setFontSize(10);
    const refNo = `TC/PL/${application.customerId}/${Date.now()}`;
    const date = new Date().toLocaleDateString('en-IN');
    doc.text(`Ref No: ${refNo}`, 20, 45);
    doc.text(`Date: ${date}`, 20, 52);
    
    // Applicant Details
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('To,', 20, 65);
    doc.setFont(undefined, 'normal');
    doc.text(application.name, 20, 72);
    doc.text(`Customer ID: ${application.customerId}`, 20, 79);
    doc.text(`Mobile: ${application.phone}`, 20, 86);
    doc.text(`Email: ${application.email}`, 20, 93);
    
    // Subject
    doc.setFont(undefined, 'bold');
    doc.text('Subject: Personal Loan Sanction Letter', 20, 106);
    
    // Body
    doc.setFont(undefined, 'normal');
    doc.text('Dear Customer,', 20, 116);
    
    let yPos = 126;
    if (application.decision === 'conditional') {
      doc.text('We are pleased to inform you that your personal loan application has been', 20, yPos);
      yPos += 7;
      doc.text('CONDITIONALLY APPROVED subject to fulfillment of certain conditions.', 20, yPos);
    } else {
      doc.text('Congratulations! We are pleased to inform you that your personal loan', 20, yPos);
      yPos += 7;
      doc.text('application has been APPROVED.', 20, yPos);
    }
    
    yPos += 12;
    doc.setFont(undefined, 'bold');
    doc.text('LOAN DETAILS:', 20, yPos);
    doc.setFont(undefined, 'normal');
    yPos += 8;
    
    const details = [
      `Loan Amount Sanctioned: ₹${application.sanctionedAmount?.toLocaleString('en-IN')}`,
      `Interest Rate: ${application.interestRate}% per annum`,
      `Tenure: ${application.tenure} months`,
      `Monthly EMI: ₹${application.emi?.toLocaleString('en-IN')}`,
      `Total Amount Payable: ₹${((application.emi || 0) * application.tenure).toLocaleString('en-IN')}`,
      `Processing Fee: ₹${Math.round((application.sanctionedAmount || 0) * 0.02).toLocaleString('en-IN')} (2%)`,
    ];
    
    details.forEach(detail => {
      doc.text(`• ${detail}`, 25, yPos);
      yPos += 7;
    });
    
    // Conditions (if any)
    if (application.conditions && application.conditions.length > 0) {
      yPos += 5;
      doc.setFont(undefined, 'bold');
      doc.text('CONDITIONS:', 20, yPos);
      doc.setFont(undefined, 'normal');
      yPos += 8;
      
      application.conditions.forEach((condition: string, index: number) => {
        const lines = doc.splitTextToSize(`${index + 1}. ${condition}`, 170);
        lines.forEach((line: string) => {
          if (yPos > 270) {
            doc.addPage();
            yPos = 20;
          }
          doc.text(line, 25, yPos);
          yPos += 7;
        });
      });
    }
    
    // Next Steps
    if (yPos > 230) {
      doc.addPage();
      yPos = 20;
    }
    
    yPos += 5;
    doc.setFont(undefined, 'bold');
    doc.text('NEXT STEPS:', 20, yPos);
    doc.setFont(undefined, 'normal');
    yPos += 8;
    
    const steps = application.decision === 'conditional' 
      ? [
          '1. Review and accept the terms and conditions',
          '2. Submit required documents to fulfill conditions',
          '3. Complete KYC verification',
          '4. Pay processing fee',
          '5. Loan disbursement within 3-5 business days'
        ]
      : [
          '1. Review and accept the terms and conditions',
          '2. Complete KYC verification',
          '3. Pay processing fee',
          '4. Loan disbursement within 24-48 hours'
        ];
    
    steps.forEach(step => {
      doc.text(step, 25, yPos);
      yPos += 7;
    });
    
    // Validity
    yPos += 5;
    const validityDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN');
    doc.setFont(undefined, 'bold');
    doc.text(`Validity: This sanction letter is valid until ${validityDate}`, 20, yPos);
    
    // Footer
    yPos += 15;
    doc.setFont(undefined, 'normal');
    doc.setFontSize(9);
    doc.text('For any queries, please contact:', 20, yPos);
    yPos += 6;
    doc.text('Phone: 1800-209-8800', 20, yPos);
    yPos += 5;
    doc.text('Email: support@tatacapital.com', 20, yPos);
    
    // Bottom footer
    doc.setFillColor(80, 35, 120);
    doc.rect(0, 280, 220, 17, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.text('Tata Capital Limited | www.tatacapital.com', 105, 290, { align: 'center' });
    
    // Generate PDF as base64
    const pdfBase64 = doc.output('datauristring');
    
    return NextResponse.json({
      success: true,
      pdf: pdfBase64,
      refNo,
    });

  } catch (error) {
    console.error('PDF Generation Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}
