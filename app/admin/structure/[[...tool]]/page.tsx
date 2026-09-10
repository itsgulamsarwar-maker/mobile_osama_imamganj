import { redirect } from 'next/navigation';

export default function AdminStructureFallbackPage() {
  redirect('/admin');
}
