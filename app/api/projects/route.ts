import { NextResponse } from 'next/server';
import { getProjects } from '@/lib/projects';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const projects = getProjects();
    return NextResponse.json(projects, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: '获取项目列表失败' }, { status: 500 });
  }
}
