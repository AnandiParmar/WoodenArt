import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models/User';
import { authenticateRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await authenticateRequest(request);
    
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    const skip = (page - 1) * limit;

    // Build where clause for search
    await connectToDatabase();
    const where: any = search ? {
      $or: [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ],
    } : {};

    const sort: any = { [sortBy]: sortOrder.toLowerCase() === 'asc' ? 1 : -1 };
    const [rows, total] = await Promise.all([
      User.find(where).sort(sort).skip(skip).limit(limit).select({ password: 0, verificationToken: 0, resetOtp: 0, resetOtpExpiresAt: 0 }).lean(),
      User.countDocuments(where),
    ]);

    return NextResponse.json({
      data: rows.map((u: any) => ({ id: String(u._id), firstName: u.firstName, lastName: u.lastName, email: u.email, role: u.role, isActive: u.isActive, createdAt: u.createdAt, updatedAt: u.updatedAt })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Users fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await authenticateRequest(request);
    
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { firstName, lastName, email, password, role, isActive } = body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { error: 'All required fields must be provided' },
        { status: 400 }
      );
    }

    // Check if user already exists
    await connectToDatabase();
    const existingUser = await User.findOne({ email }).lean();

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
      const bcrypt = await import('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 12);

    const newUserDoc = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: role || 'USER',
      isActive: isActive !== undefined ? isActive : true,
    });

    return NextResponse.json({
      message: 'User created successfully',
      data: { id: String(newUserDoc._id), firstName: newUserDoc.firstName, lastName: newUserDoc.lastName, email: newUserDoc.email, role: newUserDoc.role, isActive: newUserDoc.isActive, createdAt: newUserDoc.createdAt, updatedAt: newUserDoc.updatedAt },
    });
  } catch (error) {
    console.error('User creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}

