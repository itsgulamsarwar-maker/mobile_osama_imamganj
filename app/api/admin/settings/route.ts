import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getActiveSiteSettings, updateSiteSettings } from '@/lib/inventoryStore';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const settings = await getActiveSiteSettings();
    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.storeName) {
      return NextResponse.json(
        { success: false, error: 'Store name is required' },
        { status: 400 }
      );
    }
    const updated = await updateSiteSettings(body);
    revalidatePath('/', 'layout');
    revalidatePath('/');
    revalidatePath('/admin');
    return NextResponse.json({ success: true, settings: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
