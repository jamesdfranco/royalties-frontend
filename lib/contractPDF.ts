import jsPDF from 'jspdf';

export interface ContractData {
  // Contract identification
  contractId: string;
  nftMint: string;
  
  // Creator info
  creatorWallet: string;
  
  // Buyer info
  buyerWallet: string;
  
  // Contract terms
  workName: string;
  platform: string;
  percentage: number;
  durationSeconds: number;
  priceUsdc: number;
  resaleAllowed: boolean;
  
  // Timing
  purchaseDate?: Date;
  startTimestamp?: number;
  
  // Payout info
  totalDeposited?: number;
  totalClaimed?: number;
  availableToClaim?: number;
}

export function generateContractPDF(data: ContractData): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  let yPos = margin;
  
  // Helper function to add centered text
  const addCenteredText = (text: string, y: number, fontSize: number, isBold: boolean = false) => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    doc.text(text, pageWidth / 2, y, { align: 'center' });
  };
  
  // Helper function to add left-aligned text
  const addText = (text: string, y: number, fontSize: number, isBold: boolean = false) => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    doc.text(text, margin, y);
  };
  
  // Helper function to add a key-value pair
  const addField = (label: string, value: string, y: number) => {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(label, margin, y);
    doc.setFont('helvetica', 'normal');
    doc.text(value, margin + 50, y);
    return y + 7;
  };
  
  // Helper function to draw a line
  const drawLine = (y: number) => {
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
  };
  
  // Calculate timing info
  const now = new Date();
  const startDate = data.startTimestamp 
    ? new Date(data.startTimestamp * 1000) 
    : data.purchaseDate || now;
  
  let endDate: Date | null = null;
  let timeRemaining = '';
  let status = 'Active';
  
  if (data.durationSeconds > 0) {
    endDate = new Date(startDate.getTime() + (data.durationSeconds * 1000));
    const remaining = endDate.getTime() - now.getTime();
    
    if (remaining <= 0) {
      status = 'Expired';
      timeRemaining = 'Contract has expired';
    } else {
      const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
      const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      timeRemaining = `${days} days, ${hours} hours remaining`;
    }
  } else {
    timeRemaining = 'Perpetual (no expiration)';
  }
  
  // ===== HEADER =====
  addCenteredText('ROYALTY CONTRACT', yPos, 24, true);
  yPos += 10;
  addCenteredText('Digital Royalty Rights Agreement', yPos, 12);
  yPos += 8;
  addCenteredText('royalties.fun', yPos, 10);
  yPos += 15;
  
  drawLine(yPos);
  yPos += 10;
  
  // ===== CONTRACT IDENTIFICATION =====
  addText('CONTRACT DETAILS', yPos, 14, true);
  yPos += 10;
  
  yPos = addField('Contract ID:', data.contractId.slice(0, 20) + '...' + data.contractId.slice(-8), yPos);
  yPos = addField('NFT Mint:', data.nftMint.slice(0, 20) + '...' + data.nftMint.slice(-8), yPos);
  yPos = addField('Generated:', now.toLocaleString(), yPos);
  yPos = addField('Status:', status, yPos);
  yPos += 5;
  
  drawLine(yPos);
  yPos += 10;
  
  // ===== PARTIES =====
  addText('PARTIES', yPos, 14, true);
  yPos += 10;
  
  yPos = addField('Creator:', data.creatorWallet.slice(0, 20) + '...', yPos);
  yPos = addField('Rights Holder:', data.buyerWallet.slice(0, 20) + '...', yPos);
  yPos += 5;
  
  drawLine(yPos);
  yPos += 10;
  
  // ===== ROYALTY TERMS =====
  addText('ROYALTY TERMS', yPos, 14, true);
  yPos += 10;
  
  // Work description
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const workDesc = `The Creator agrees to pay the Rights Holder ${data.percentage}% of revenue generated from:`;
  doc.text(workDesc, margin, yPos, { maxWidth: contentWidth });
  yPos += 10;
  
  // Work name box
  doc.setFillColor(245, 245, 245);
  doc.rect(margin, yPos - 4, contentWidth, 14, 'F');
  doc.setFont('helvetica', 'bold');
  doc.text(data.workName || 'Unnamed Work', margin + 5, yPos + 3);
  doc.setFont('helvetica', 'normal');
  doc.text(`Platform: ${data.platform || 'Not specified'}`, margin + 5, yPos + 9);
  yPos += 18;
  
  yPos = addField('Percentage:', `${data.percentage}%`, yPos);
  yPos = addField('Purchase Price:', `$${data.priceUsdc.toLocaleString()} USDC`, yPos);
  yPos = addField('Resale Rights:', data.resaleAllowed ? 'Transferable' : 'Non-transferable', yPos);
  yPos += 5;
  
  drawLine(yPos);
  yPos += 10;
  
  // ===== DURATION =====
  addText('DURATION', yPos, 14, true);
  yPos += 10;
  
  yPos = addField('Start Date:', startDate.toLocaleDateString(), yPos);
  if (data.durationSeconds > 0 && endDate) {
    yPos = addField('End Date:', endDate.toLocaleDateString(), yPos);
    const durationMonths = Math.floor(data.durationSeconds / (30 * 24 * 60 * 60));
    const durationDays = Math.floor((data.durationSeconds % (30 * 24 * 60 * 60)) / (24 * 60 * 60));
    yPos = addField('Duration:', `${durationMonths} months, ${durationDays} days`, yPos);
  } else {
    yPos = addField('End Date:', 'Perpetual', yPos);
    yPos = addField('Duration:', 'Perpetual (no expiration)', yPos);
  }
  yPos = addField('Time Remaining:', timeRemaining, yPos);
  yPos += 5;
  
  drawLine(yPos);
  yPos += 10;
  
  // ===== PAYOUT SUMMARY =====
  if (data.totalDeposited !== undefined) {
    addText('PAYOUT SUMMARY', yPos, 14, true);
    yPos += 10;
    
    yPos = addField('Total Deposited:', `$${(data.totalDeposited || 0).toFixed(2)} USDC`, yPos);
    yPos = addField('Total Claimed:', `$${(data.totalClaimed || 0).toFixed(2)} USDC`, yPos);
    yPos = addField('Available:', `$${(data.availableToClaim || 0).toFixed(2)} USDC`, yPos);
    yPos += 5;
    
    drawLine(yPos);
    yPos += 10;
  }
  
  // ===== OBLIGATIONS =====
  addText('CREATOR OBLIGATIONS', yPos, 14, true);
  yPos += 10;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  const obligations = [
    `1. The Creator shall deposit ${data.percentage}% of all revenue earned from "${data.workName}" into the contract payout pool.`,
    `2. Payments shall be made in USDC to the smart contract address.`,
    `3. The Rights Holder may claim accrued payouts at any time.`,
    `4. This agreement is enforceable on the Solana blockchain.`,
  ];
  
  for (const obligation of obligations) {
    const lines = doc.splitTextToSize(obligation, contentWidth);
    doc.text(lines, margin, yPos);
    yPos += (lines.length * 5) + 3;
  }
  
  yPos += 5;
  drawLine(yPos);
  yPos += 10;
  
  // ===== FOOTER =====
  doc.setFontSize(8);
  doc.setTextColor(128);
  doc.text('This document is generated automatically from on-chain data.', margin, yPos);
  yPos += 4;
  doc.text('Contract terms are enforced by the Solana blockchain smart contract.', margin, yPos);
  yPos += 4;
  doc.text(`Verify on-chain: https://explorer.solana.com/address/${data.contractId}?cluster=devnet`, margin, yPos);
  
  // Page number
  doc.text(`Page 1 of 1`, pageWidth - margin - 20, doc.internal.pageSize.getHeight() - 10);
  
  // Save the PDF
  const filename = `royalty-contract-${data.contractId.slice(0, 8)}.pdf`;
  doc.save(filename);
}

// Alternative: Generate and return as blob for preview
export function generateContractPDFBlob(data: ContractData): Blob {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  
  // ... same content generation as above ...
  // For now, reuse the same logic
  generateContractContent(doc, data);
  
  return doc.output('blob');
}

// Internal function to generate content (reusable)
function generateContractContent(doc: jsPDF, data: ContractData): void {
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  let yPos = margin;
  
  // Helper functions (same as above)
  const addCenteredText = (text: string, y: number, fontSize: number, isBold: boolean = false) => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    doc.text(text, pageWidth / 2, y, { align: 'center' });
  };
  
  const addText = (text: string, y: number, fontSize: number, isBold: boolean = false) => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    doc.text(text, margin, y);
  };
  
  const addField = (label: string, value: string, y: number) => {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(label, margin, y);
    doc.setFont('helvetica', 'normal');
    doc.text(value, margin + 50, y);
    return y + 7;
  };
  
  const drawLine = (y: number) => {
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
  };
  
  // Calculate timing
  const now = new Date();
  const startDate = data.startTimestamp 
    ? new Date(data.startTimestamp * 1000) 
    : data.purchaseDate || now;
  
  let endDate: Date | null = null;
  let timeRemaining = '';
  let status = 'Active';
  
  if (data.durationSeconds > 0) {
    endDate = new Date(startDate.getTime() + (data.durationSeconds * 1000));
    const remaining = endDate.getTime() - now.getTime();
    
    if (remaining <= 0) {
      status = 'Expired';
      timeRemaining = 'Contract has expired';
    } else {
      const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
      const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      timeRemaining = `${days} days, ${hours} hours remaining`;
    }
  } else {
    timeRemaining = 'Perpetual (no expiration)';
  }
  
  // Generate content (same as generateContractPDF)
  addCenteredText('ROYALTY CONTRACT', yPos, 24, true);
  yPos += 10;
  addCenteredText('Digital Royalty Rights Agreement', yPos, 12);
  yPos += 8;
  addCenteredText('royalties.fun', yPos, 10);
  yPos += 15;
  drawLine(yPos);
  yPos += 10;
  
  addText('CONTRACT DETAILS', yPos, 14, true);
  yPos += 10;
  yPos = addField('Contract ID:', data.contractId.slice(0, 20) + '...' + data.contractId.slice(-8), yPos);
  yPos = addField('NFT Mint:', data.nftMint.slice(0, 20) + '...' + data.nftMint.slice(-8), yPos);
  yPos = addField('Generated:', now.toLocaleString(), yPos);
  yPos = addField('Status:', status, yPos);
  yPos += 5;
  drawLine(yPos);
  yPos += 10;
  
  addText('PARTIES', yPos, 14, true);
  yPos += 10;
  yPos = addField('Creator:', data.creatorWallet.slice(0, 20) + '...', yPos);
  yPos = addField('Rights Holder:', data.buyerWallet.slice(0, 20) + '...', yPos);
  yPos += 5;
  drawLine(yPos);
  yPos += 10;
  
  addText('ROYALTY TERMS', yPos, 14, true);
  yPos += 10;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const workDesc = `The Creator agrees to pay the Rights Holder ${data.percentage}% of revenue generated from:`;
  doc.text(workDesc, margin, yPos, { maxWidth: contentWidth });
  yPos += 10;
  
  doc.setFillColor(245, 245, 245);
  doc.rect(margin, yPos - 4, contentWidth, 14, 'F');
  doc.setFont('helvetica', 'bold');
  doc.text(data.workName || 'Unnamed Work', margin + 5, yPos + 3);
  doc.setFont('helvetica', 'normal');
  doc.text(`Platform: ${data.platform || 'Not specified'}`, margin + 5, yPos + 9);
  yPos += 18;
  
  yPos = addField('Percentage:', `${data.percentage}%`, yPos);
  yPos = addField('Purchase Price:', `$${data.priceUsdc.toLocaleString()} USDC`, yPos);
  yPos = addField('Resale Rights:', data.resaleAllowed ? 'Transferable' : 'Non-transferable', yPos);
  yPos += 5;
  drawLine(yPos);
  yPos += 10;
  
  addText('DURATION', yPos, 14, true);
  yPos += 10;
  yPos = addField('Start Date:', startDate.toLocaleDateString(), yPos);
  if (data.durationSeconds > 0 && endDate) {
    yPos = addField('End Date:', endDate.toLocaleDateString(), yPos);
    const durationMonths = Math.floor(data.durationSeconds / (30 * 24 * 60 * 60));
    const durationDays = Math.floor((data.durationSeconds % (30 * 24 * 60 * 60)) / (24 * 60 * 60));
    yPos = addField('Duration:', `${durationMonths} months, ${durationDays} days`, yPos);
  } else {
    yPos = addField('End Date:', 'Perpetual', yPos);
    yPos = addField('Duration:', 'Perpetual (no expiration)', yPos);
  }
  yPos = addField('Time Remaining:', timeRemaining, yPos);
  yPos += 5;
  drawLine(yPos);
  yPos += 10;
  
  if (data.totalDeposited !== undefined) {
    addText('PAYOUT SUMMARY', yPos, 14, true);
    yPos += 10;
    yPos = addField('Total Deposited:', `$${(data.totalDeposited || 0).toFixed(2)} USDC`, yPos);
    yPos = addField('Total Claimed:', `$${(data.totalClaimed || 0).toFixed(2)} USDC`, yPos);
    yPos = addField('Available:', `$${(data.availableToClaim || 0).toFixed(2)} USDC`, yPos);
    yPos += 5;
    drawLine(yPos);
    yPos += 10;
  }
  
  addText('CREATOR OBLIGATIONS', yPos, 14, true);
  yPos += 10;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  const obligations = [
    `1. The Creator shall deposit ${data.percentage}% of all revenue earned from "${data.workName}" into the contract payout pool.`,
    `2. Payments shall be made in USDC to the smart contract address.`,
    `3. The Rights Holder may claim accrued payouts at any time.`,
    `4. This agreement is enforceable on the Solana blockchain.`,
  ];
  
  for (const obligation of obligations) {
    const lines = doc.splitTextToSize(obligation, contentWidth);
    doc.text(lines, margin, yPos);
    yPos += (lines.length * 5) + 3;
  }
  
  yPos += 5;
  drawLine(yPos);
  yPos += 10;
  
  doc.setFontSize(8);
  doc.setTextColor(128);
  doc.text('This document is generated automatically from on-chain data.', margin, yPos);
  yPos += 4;
  doc.text('Contract terms are enforced by the Solana blockchain smart contract.', margin, yPos);
  yPos += 4;
  doc.text(`Verify on-chain: https://explorer.solana.com/address/${data.contractId}?cluster=devnet`, margin, yPos);
  
  doc.text(`Page 1 of 1`, pageWidth - margin - 20, doc.internal.pageSize.getHeight() - 10);
}

