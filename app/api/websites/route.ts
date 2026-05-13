import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { websites } from '@/lib/db/schema';
import { eq, ilike, and } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    let conditions = [];

    if (status) {
      // Correctly type the status enum
      conditions.push(eq(websites.status, status as 'active' | 'inactive' | 'archived'));
    }

    if (search) {
      conditions.push(ilike(websites.name, `%${search}%`));
    }

    const allWebsites = await db
      .select()
      .from(websites)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(websites.createdAt);

    return NextResponse.json({
      success: true,
      data: allWebsites,
    });
  } catch (error) {
    console.error('Error fetching websites:', error);
    return NextResponse.json({ error: 'Failed to fetch websites' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, slug, url, description, status } = body;

    if (!name || !url || !slug) {
      return NextResponse.json({ error: 'Name, URL, and Slug are required' }, { status: 400 });
    }

    const apiKey = `web_${crypto.randomUUID().replace(/-/g, '').substring(0, 24)}`;

    const result = await db
      .insert(websites)
      .values({
        name,
        slug,
        url,
        description,
        status: (status as 'active' | 'inactive' | 'archived') || 'active',
        apiKey,
        ownerId: session.user.id,
      })
      .returning();

    return NextResponse.json({
      success: true,
      data: result[0],
    }, { status: 201 });
  } catch (error: unknown) {
    console.error('Error creating website:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage.includes('unique')) {
      return NextResponse.json({ error: 'Website URL, Slug or API Key already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create website' }, { status: 500 });
  }
}
