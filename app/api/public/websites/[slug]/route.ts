import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { websites } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const website = await db.query.websites.findFirst({
      where: eq(websites.slug, slug),
      with: {
        sections: {
          where: (sections, { eq }) => eq(sections.isActive, true),
          orderBy: (sections, { asc }) => [asc(sections.order)],
        },
        services: {
          where: (services, { eq }) => eq(services.isActive, true),
          orderBy: (services, { asc }) => [asc(services.order)],
        },
        teamMembers: {
          where: (members, { eq }) => eq(members.isActive, true),
          orderBy: (members, { asc }) => [asc(members.order)],
        },
      },
    });

    if (!website) {
      return NextResponse.json(
        { success: false, error: 'Platform not found' },
        { status: 404 }
      );
    }

    // Hide internal fields
    const { apiKey, ownerId, ...publicData } = website;

    return NextResponse.json({
      success: true,
      data: publicData,
    });
  } catch (error) {
    console.error('Public API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve platform data' },
      { status: 500 }
    );
  }
}
