import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { CustomFurnitureRequest } from '@/models/CustomFurnitureRequest';
import { authenticateRequest } from '@/lib/auth';
import { sendEmail } from '@/lib/mailer';

// GET - Get user's custom furniture requests
export async function GET(req: NextRequest) {
  try {
    const user = await authenticateRequest(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const requests = await CustomFurnitureRequest.find({ userId: user.id }).sort({ createdAt: -1 }).lean();

    const formattedRequests = requests.map(req => ({
      id: String(req._id),
      furnitureType: req.furnitureType,
      roomType: req.roomType || undefined,
      dimensions: req.dimensions || undefined,
      material: req.material || undefined,
      color: req.color || undefined,
      style: req.style || undefined,
      budget: req.budget ? Number(req.budget) : undefined,
      timeline: req.timeline || undefined,
      status: req.status,
      createdAt: (req.createdAt as Date).toISOString(),
      updatedAt: (req.updatedAt as Date).toISOString(),
    }));

    return NextResponse.json({ requests: formattedRequests });
  } catch (error) {
    console.error('Custom furniture requests fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch requests' }, { status: 500 });
  }
}

// POST - Create custom furniture request
export async function POST(req: NextRequest) {
  try {
    const user = await authenticateRequest(req);
    const {
      name,
      email,
      phone,
      furnitureType,
      roomType,
      dimensions,
      material,
      color,
      style,
      requirements,
      budget,
      timeline,
    } = await req.json();

    if (!name || !email || !phone || !furnitureType) {
      return NextResponse.json(
        { error: 'Name, email, phone, and furniture type are required' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const request = await CustomFurnitureRequest.create({
      userId: user?.id || null,
      name,
      email,
      phone,
      furnitureType,
      roomType,
      dimensions,
      material,
      color,
      style,
      requirements,
      budget: budget ? parseFloat(budget) : undefined,
      timeline,
      status: 'PENDING',
    });

    // Send email notification to admin
    const adminEmailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Custom Furniture Request</title>
</head>
<body style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
  <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 8px;">
    <h2 style="color: #d97706; margin-bottom: 20px;">New Custom Furniture Request</h2>
    <table style="width: 100%; border-collapse: collapse;">
      <tr><td style="padding: 8px 0; font-weight: bold; color: #333;">Name:</td><td style="padding: 8px 0;">${name}</td></tr>
      <tr><td style="padding: 8px 0; font-weight: bold; color: #333;">Email:</td><td style="padding: 8px 0;">${email}</td></tr>
      <tr><td style="padding: 8px 0; font-weight: bold; color: #333;">Phone:</td><td style="padding: 8px 0;">${phone}</td></tr>
      <tr><td style="padding: 8px 0; font-weight: bold; color: #333;">Furniture Type:</td><td style="padding: 8px 0;">${furnitureType}</td></tr>
      ${roomType ? `<tr><td style="padding: 8px 0; font-weight: bold; color: #333;">Room Type:</td><td style="padding: 8px 0;">${roomType}</td></tr>` : ''}
      ${dimensions ? `<tr><td style="padding: 8px 0; font-weight: bold; color: #333;">Dimensions:</td><td style="padding: 8px 0;">${dimensions}</td></tr>` : ''}
      ${material ? `<tr><td style="padding: 8px 0; font-weight: bold; color: #333;">Material:</td><td style="padding: 8px 0;">${material}</td></tr>` : ''}
      ${color ? `<tr><td style="padding: 8px 0; font-weight: bold; color: #333;">Color:</td><td style="padding: 8px 0;">${color}</td></tr>` : ''}
      ${style ? `<tr><td style="padding: 8px 0; font-weight: bold; color: #333;">Style:</td><td style="padding: 8px 0;">${style}</td></tr>` : ''}
      ${budget ? `<tr><td style="padding: 8px 0; font-weight: bold; color: #333;">Budget:</td><td style="padding: 8px 0;">₹${budget}</td></tr>` : ''}
      ${timeline ? `<tr><td style="padding: 8px 0; font-weight: bold; color: #333;">Timeline:</td><td style="padding: 8px 0;">${timeline}</td></tr>` : ''}
      ${requirements ? `<tr><td colspan="2" style="padding: 8px 0; font-weight: bold; color: #333;">Requirements:</td></tr><tr><td colspan="2" style="padding: 8px 0;">${requirements}</td></tr>` : ''}
    </table>
  </div>
</body>
</html>
    `;

    // Send email to customer
    const customerEmailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Request Received - Wooden Art</title>
</head>
<body style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
  <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 8px;">
    <h2 style="color: #d97706; margin-bottom: 20px;">Thank You, ${name}!</h2>
    <p style="color: #333; line-height: 1.6;">
      We've received your custom furniture request for <strong>${furnitureType}</strong>. Our team will review your requirements and contact you shortly to discuss details and provide a quote.
    </p>
    <p style="color: #333; line-height: 1.6; margin-top: 20px;">
      Request ID: <strong>CFR-${String(request._id)}</strong>
    </p>
    <p style="color: #666; font-size: 14px; margin-top: 30px;">
      Best regards,<br>
      Wooden Art Team
    </p>
  </div>
</body>
</html>
    `;

    try {
      // Send emails (optional - don't fail if email fails)
      await Promise.all([
        sendEmail(process.env.ADMIN_EMAIL || email, 'New Custom Furniture Request', adminEmailHtml),
        sendEmail(email, 'Request Received - Wooden Art', customerEmailHtml),
      ]);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Continue even if email fails
    }

    return NextResponse.json(
      {
        success: true,
        request: {
          id: String(request._id),
          furnitureType: request.furnitureType,
          status: request.status,
          createdAt: (request.createdAt as Date).toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Custom furniture request creation error:', error);
    return NextResponse.json({ error: 'Failed to create request' }, { status: 500 });
  }
}


