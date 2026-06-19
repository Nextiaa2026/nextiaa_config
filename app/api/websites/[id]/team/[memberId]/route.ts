import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { teamMembers } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; memberId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id: websiteId, memberId } = await params;
    const body = await request.json();

    const {
      name,
      role,
      email,
      phone,
      department,
      location,
      bio,
      image,
      linkedIn,
      twitter,
      github,
      socialLinks,
      isActive,
      order,
    } = body;

    const result = await db
      .update(teamMembers)
      .set({
        ...(name !== undefined && { name }),
        ...(role !== undefined && { role }),
        ...(email !== undefined && { email }),
        ...(phone !== undefined && { phone }),
        ...(department !== undefined && { department }),
        ...(location !== undefined && { location }),
        ...(bio !== undefined && { bio }),
        ...(image !== undefined && { image }),
        ...(linkedIn !== undefined && { linkedIn }),
        ...(twitter !== undefined && { twitter }),
        ...(github !== undefined && { github }),
        ...(socialLinks !== undefined && { socialLinks }),
        ...(isActive !== undefined && { isActive }),
        ...(order !== undefined && { order }),
        updatedAt: new Date(),
      })
      .where(and(eq(teamMembers.id, memberId), eq(teamMembers.websiteId, websiteId)))
      .returning();

    if (!result.length) {
      return NextResponse.json({ error: 'Team member not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: result[0] });
  } catch (error) {
    console.error('Error updating team member:', error);
    return NextResponse.json({ error: 'Failed to update team member' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; memberId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id: websiteId, memberId } = await params;

    const result = await db
      .delete(teamMembers)
      .where(and(eq(teamMembers.id, memberId), eq(teamMembers.websiteId, websiteId)))
      .returning();

    if (!result.length) {
      return NextResponse.json({ error: 'Team member not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: result[0] });
  } catch (error) {
    console.error('Error deleting team member:', error);
    return NextResponse.json({ error: 'Failed to delete team member' }, { status: 500 });
  }
}
