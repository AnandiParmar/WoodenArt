import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models/User';
import { authenticateRequest } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await authenticateRequest(request);
    
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    await connectToDatabase();
    const foundUser = await User.findById(id).select({ password: 0, verificationToken: 0, resetOtp: 0, resetOtpExpiresAt: 0 }).lean();

    if (!foundUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: { id: String(foundUser._id), firstName: foundUser.firstName, lastName: foundUser.lastName, email: foundUser.email, role: foundUser.role, isActive: foundUser.isActive, createdAt: foundUser.createdAt, updatedAt: foundUser.updatedAt } });
  } catch (error) {
    console.error('User fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await authenticateRequest(request);
    
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    const { id } = await context.params;
    await connectToDatabase();

    const body = await request.json();
    const { firstName, lastName, email, password, role, isActive } = body;

    // Check if user exists
    const existingUser = await User.findById(id).lean();

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== existingUser.email) {
      const emailExists = await User.findOne({ email }).lean();

      if (emailExists) {
        return NextResponse.json(
          { error: 'Email already in use' },
          { status: 400 }
        );
      }
    }

    // Prepare update data
    const updateData: any = {
      firstName: firstName || existingUser.firstName,
      lastName: lastName || existingUser.lastName,
      email: email || existingUser.email,
      role: role || existingUser.role,
      isActive: isActive !== undefined ? isActive : existingUser.isActive,
    };

    // Hash password if provided
    if (password) {
      const bcrypt = require('bcryptjs');
      updateData.password = await bcrypt.hash(password, 12);
    }

    const updatedUser = await User.findByIdAndUpdate(id, { $set: updateData }, { new: true }).select({ password: 0 }).lean();

    return NextResponse.json({
      message: 'User updated successfully',
      data: { id: String(updatedUser!._id), firstName: updatedUser!.firstName, lastName: updatedUser!.lastName, email: updatedUser!.email, role: updatedUser!.role, isActive: updatedUser!.isActive, createdAt: updatedUser!.createdAt, updatedAt: updatedUser!.updatedAt },
    });
  } catch (error) {
    console.error('User update error:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await authenticateRequest(request);
    
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    const { id } = await context.params;
    await connectToDatabase();
    const existingUser = await User.findById(id).lean();

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Prevent admin from deleting themselves
    if (String(id) === String(user.id)) {
      return NextResponse.json(
        { error: 'Cannot delete your own account' },
        { status: 400 }
      );
    }

    await User.findByIdAndDelete(id);

    return NextResponse.json({
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error('User deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}

