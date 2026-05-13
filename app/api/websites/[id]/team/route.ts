import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { teamMembers } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id: websiteId } = await params;

    const members = await db.query.teamMembers.findMany({
      where: eq(teamMembers.websiteId, websiteId),
      orderBy: (members, { asc }) => [asc(members.order)],
    });

    return NextResponse.json({ success: true, data: members });
  } catch (error) {
    console.error('Error fetching team members:', error);
    return NextResponse.json({ error: 'Failed to fetch team members' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id: websiteId } = await params;
    const body = await request.json();
    const { name, role, bio, image, socialLinks, isActive, order } = body;

    const result = await db
      .insert(teamMembers)
      .values({
        websiteId,
        name,
        role,
        bio,
        image,
        socialLinks,
        isActive: isActive ?? true,
        order: order ?? 0,
      })
      .returning();

    return NextResponse.json({ success: true, data: result[0] }, { status: 201 });
  } catch (error) {
    console.error('Error creating team member:', error);
    return NextResponse.json({ error: 'Failed to create team member' }, { status: 500 });
  }
}
