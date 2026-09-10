import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

function ensureUploadDir() {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
}

export async function POST(req: NextRequest) {
  try {
    ensureUploadDir();

    const contentType = req.headers.get('content-type') || '';

    // Case 1: Standard FormData upload
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;

      if (!file) {
        return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Sanitize extension or default to .webp
      const originalExt = path.extname(file.name) || '.webp';
      const ext = originalExt.toLowerCase() === '.png' || originalExt.toLowerCase() === '.jpg' || originalExt.toLowerCase() === '.jpeg' ? originalExt : '.webp';
      const filename = `mob-${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;
      const filepath = path.join(UPLOAD_DIR, filename);

      fs.writeFileSync(filepath, buffer);

      const publicUrl = `/uploads/${filename}`;
      return NextResponse.json({
        success: true,
        url: publicUrl,
        filename,
        size: buffer.length,
      });
    }

    // Case 2: JSON base64 upload
    const body = await req.json();
    if (body.dataUrl) {
      const matches = body.dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        return NextResponse.json({ success: false, error: 'Invalid base64 data URL' }, { status: 400 });
      }

      const base64Data = matches[2];
      const buffer = Buffer.from(base64Data, 'base64');
      const filename = `mob-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.webp`;
      const filepath = path.join(UPLOAD_DIR, filename);

      fs.writeFileSync(filepath, buffer);

      const publicUrl = `/uploads/${filename}`;
      return NextResponse.json({
        success: true,
        url: publicUrl,
        filename,
        size: buffer.length,
      });
    }

    return NextResponse.json(
      { success: false, error: 'Expected multipart/form-data or dataUrl JSON' },
      { status: 400 }
    );
  } catch (err: any) {
    console.error('Upload error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
