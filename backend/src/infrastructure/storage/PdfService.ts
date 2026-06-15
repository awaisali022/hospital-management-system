import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import { env } from '../../config/env.js';

export class PdfService {
  async generatePrescriptionPdf(input: {
    prescriptionId: string;
    date: Date;
    medications: Array<{
      name: string;
      dosage: string;
      frequency: string;
      duration: string;
      instructions?: string;
    }>;
    instructions?: string;
    doctor: {
      firstName: string;
      lastName: string;
      pmcNumber: string;
      specializations: string[];
    };
    patient: {
      firstName: string;
      lastName: string;
      gender?: string;
      dateOfBirth?: Date;
    };
    clinic?: {
      name: string;
      address: string;
      city: string;
    };
  }): Promise<Buffer> {
    return new Promise(async (resolve, reject) => {
      try {
        const doc = new PDFDocument({ size: 'A4', margin: 50 });
        const buffers: Buffer[] = [];

        doc.on('data', (chunk) => buffers.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(buffers)));
        doc.on('error', (err) => reject(err));

        // Header / Doctor Info (Right side)
        doc.fillColor('#2563EB').fontSize(24).font('Helvetica-Bold').text('DoctorHub AI', 50, 50);
        doc.fillColor('#0F172A').fontSize(16).text(`Dr. ${input.doctor.firstName} ${input.doctor.lastName}`, 50, 80);
        doc.fontSize(10).font('Helvetica')
          .text(`Specializations: ${input.doctor.specializations.join(', ')}`)
          .text(`PMC License #: ${input.doctor.pmcNumber}`);

        // Clinic Info (Left side)
        const clinicName = input.clinic?.name || 'DoctorHub Affiliate Clinic';
        const clinicAddress = input.clinic?.address 
          ? `${input.clinic.address}, ${input.clinic.city}`
          : 'Telehealth Virtual consultation';
        doc.fontSize(10).font('Helvetica')
          .text(clinicName, 350, 80, { align: 'right', width: 200 })
          .text(clinicAddress, 350, 95, { align: 'right', width: 200 });

        doc.moveDown(2);
        
        // Draw Horizontal Separator line
        doc.moveTo(50, 135).lineTo(545, 135).strokeColor('#E2E8F0').lineWidth(1).stroke();

        // Prescription Metadata / Patient Info
        doc.moveDown(1.5);
        doc.fillColor('#1E3A8A').fontSize(12).font('Helvetica-Bold').text('PRESCRIPTION DETAILS', 50, 150);
        
        doc.fillColor('#0F172A').fontSize(10).font('Helvetica')
          .text(`Date: ${new Date(input.date).toLocaleDateString()}`, 50, 170)
          .text(`Patient: ${input.patient.firstName} ${input.patient.lastName}`, 50, 185)
          .text(`Gender: ${input.patient.gender || 'Not specified'}`, 50, 200);

        const dob = input.patient.dateOfBirth;
        if (dob) {
          const age = new Date().getFullYear() - new Date(dob).getFullYear();
          doc.text(`Age: ${age} years`, 50, 215);
        }

        doc.moveTo(50, 235).lineTo(545, 235).strokeColor('#E2E8F0').lineWidth(1).stroke();

        // Rx Table Headers
        doc.moveDown(3);
        const startY = 255;
        doc.fillColor('#2563EB').font('Helvetica-Bold').fontSize(10)
          .text('Medication Name', 50, startY)
          .text('Dosage', 220, startY)
          .text('Frequency', 310, startY)
          .text('Duration', 410, startY)
          .text('Instructions', 470, startY);

        doc.moveTo(50, 270).lineTo(545, 270).strokeColor('#2563EB').lineWidth(1.5).stroke();

        // Rx Table Body
        let currentY = 280;
        doc.fillColor('#0F172A').font('Helvetica').fontSize(9);
        
        for (const med of input.medications) {
          // Check page bounds before writing
          if (currentY > 650) {
            doc.addPage();
            currentY = 50;
          }

          doc.font('Helvetica-Bold').text(med.name, 50, currentY, { width: 160 });
          doc.font('Helvetica').text(med.dosage, 220, currentY, { width: 80 });
          doc.text(med.frequency, 310, currentY, { width: 90 });
          doc.text(med.duration, 410, currentY, { width: 50 });
          doc.text(med.instructions || '-', 470, currentY, { width: 75 });

          currentY += 25;
        }

        // Notes and General Instructions
        if (input.instructions) {
          if (currentY > 600) {
            doc.addPage();
            currentY = 50;
          }
          doc.moveDown(2);
          doc.fillColor('#1E3A8A').font('Helvetica-Bold').fontSize(10).text('GENERAL INSTRUCTIONS', 50, currentY + 10);
          doc.fillColor('#0F172A').font('Helvetica').fontSize(9).text(input.instructions, 50, currentY + 25, { width: 350 });
        }

        // Generate QR code for verification link
        const verificationLink = `${env.FRONTEND_URL}/verify-prescription/${input.prescriptionId}`;
        const qrBuffer = await QRCode.toBuffer(verificationLink, { width: 90, margin: 1 });

        // Embed QR Code in Footer
        const footerY = 680;
        doc.moveTo(50, footerY - 10).lineTo(545, footerY - 10).strokeColor('#E2E8F0').lineWidth(1).stroke();
        
        doc.image(qrBuffer, 50, footerY, { width: 70 });
        doc.fontSize(8).fillColor('#64748B')
          .text('Verify prescription authenticity by scanning this QR code.', 130, footerY + 20)
          .text('DoctorHub AI Smart Healthcare Consultation Ecosystem', 130, footerY + 32)
          .text('Disclaimer: Generative digital invoice. For therapeutic audit purposes only.', 130, footerY + 44);

        // Sign off
        doc.fontSize(10).fillColor('#0F172A').font('Helvetica-Bold')
          .text(`Dr. ${input.doctor.firstName} ${input.doctor.lastName}`, 380, footerY + 15, { align: 'right', width: 165 })
          .font('Helvetica').fontSize(8)
          .text('PMC Licensed Medical Officer', 380, footerY + 30, { align: 'right', width: 165 });

        doc.end();
      } catch (err) {
        reject(err);
      }
    });
  }
}
