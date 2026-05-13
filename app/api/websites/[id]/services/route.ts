import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { services } from '@/lib/db/schema';
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

    const allServices = await db.query.services.findMany({
      where: eq(services.websiteId, websiteId),
      orderBy: (s, { asc }) => [asc(s.order)],
    });

    return NextResponse.json({ success: true, data: allServices });
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
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
    const { name, description, price, icon, isActive, order } = body;

    const result = await db
      .insert(services)
      .values({
        websiteId,
        name,
        description,
        price,
        icon,
        isActive: isActive ?? true,
        order: order ?? 0,
      })
      .returning();

    return NextResponse.json({ success: true, data: result[0] }, { status: 201 });
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 });
  }
}
