import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sections } from '@/lib/db/schema';
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

    const allSections = await db.query.sections.findMany({
      where: eq(sections.websiteId, websiteId),
      orderBy: (s, { asc }) => [asc(s.order)],
    });

    return NextResponse.json({ success: true, data: allSections });
  } catch (error) {
    console.error('Error fetching sections:', error);
    return NextResponse.json({ error: 'Failed to fetch sections' }, { status: 500 });
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
    const { title, subtitle, content, type, isActive, order } = body;

    const result = await db
      .insert(sections)
      .values({
        websiteId,
        title,
        subtitle,
        content,
        type,
        isActive: isActive ?? true,
        order: order ?? 0,
      })
      .returning();

    return NextResponse.json({ success: true, data: result[0] }, { status: 201 });
  } catch (error) {
    console.error('Error creating section:', error);
    return NextResponse.json({ error: 'Failed to create section' }, { status: 500 });
  }
}
