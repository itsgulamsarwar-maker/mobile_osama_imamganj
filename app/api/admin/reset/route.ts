import { NextResponse } from 'next/server';
import { resetInventoryToDefaults } from '@/lib/inventoryStore';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const data = await resetInventoryToDefaults();
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
