'use client';

import { NextStudio } from 'next-sanity/studio';
import config from '../../../sanity.config';

export const dynamic = 'force-static';

export default function AdminPage() {
  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-slate-900">
      <NextStudio config={config} />
    </div>
  );
}
