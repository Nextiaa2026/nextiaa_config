import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { websites } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;

    const website = await db.query.websites.findFirst({
      where: eq(websites.id, id),
      with: {
        sections: true,
        services: true,
        teamMembers: true,
      },
    });

    if (!website) {
      return NextResponse.json({ error: 'Website not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: website });
  } catch (error) {
    console.error('Error fetching website:', error);
    return NextResponse.json({ error: 'Failed to fetch website' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const body = await request.json();
    const { name, slug, url, description, status } = body;

    const result = await db
      .update(websites)
      .set({
        name,
        slug,
        url,
        description,
        status: status as 'active' | 'inactive' | 'archived',
        updatedAt: new Date(),
      })
      .where(eq(websites.id, id))
      .returning();

    if (!result.length) {
      return NextResponse.json({ error: 'Website not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: result[0] });
  } catch (error: unknown) {
    console.error('Error updating website:', error);
    return NextResponse.json({ error: 'Failed to update website' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;

    await db.delete(websites).where(eq(websites.id, id));

    return NextResponse.json({ success: true, message: 'Website deleted successfully' });
  } catch (error) {
    console.error('Error deleting website:', error);
    return NextResponse.json({ error: 'Failed to delete website' }, { status: 500 });
  }
}
