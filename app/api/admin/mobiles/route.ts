import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import {
  getInventoryMobiles,
  addInventoryMobile,
  updateInventoryMobile,
  deleteInventoryMobile,
  bulkDeleteInventoryMobiles,
  bulkUpdateInventoryStatus,
} from '@/lib/inventoryStore';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const mobiles = await getInventoryMobiles();
    return NextResponse.json({ success: true, mobiles });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.title || !body.brand || body.price === undefined) {
      return NextResponse.json(
        { success: false, error: 'Title, Brand, and Price are required' },
        { status: 400 }
      );
    }
    const created = await addInventoryMobile(body);
    revalidatePath('/', 'layout');
    revalidatePath('/');
    return NextResponse.json({ success: true, mobile: created });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { _id, ...patch } = body;
    if (!_id) {
      return NextResponse.json({ success: false, error: 'Missing mobile ID (_id)' }, { status: 400 });
    }
    const updated = await updateInventoryMobile(_id, patch);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Mobile not found' }, { status: 404 });
    }
    revalidatePath('/', 'layout');
    revalidatePath('/');
    return NextResponse.json({ success: true, mobile: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const queryId = url.searchParams.get('id');

    // Check if single ID in query parameter
    if (queryId) {
      const deleted = await deleteInventoryMobile(queryId);
      revalidatePath('/', 'layout');
      revalidatePath('/');
      return NextResponse.json({ success: deleted, deletedCount: deleted ? 1 : 0 });
    }

    // Check if bulk deletion requested via request body
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      // body may be empty
    }

    if (body.ids && Array.isArray(body.ids)) {
      const deletedCount = await bulkDeleteInventoryMobiles(body.ids);
      revalidatePath('/', 'layout');
      revalidatePath('/');
      return NextResponse.json({ success: true, deletedCount });
    }

    if (body.id) {
      const deleted = await deleteInventoryMobile(body.id);
      revalidatePath('/', 'layout');
      revalidatePath('/');
      return NextResponse.json({ success: deleted, deletedCount: deleted ? 1 : 0 });
    }

    return NextResponse.json(
      { success: false, error: 'Provide id in query or { ids: [...] } in body' },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { ids, isSold, isUrgentSale } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ success: false, error: 'Missing ids array' }, { status: 400 });
    }

    const updatedCount = await bulkUpdateInventoryStatus(ids, { isSold, isUrgentSale });
    revalidatePath('/', 'layout');
    revalidatePath('/');
    return NextResponse.json({ success: true, updatedCount });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
