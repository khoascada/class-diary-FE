import Link from 'next/link';

// app/forbidden/page.js (Next.js App Router)
export default function ForbiddenPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="mb-4 text-4xl font-bold">403 - Forbidden</h1>
      <p className="mb-4 text-gray-600">Bạn không có quyền truy cập trang này.</p>
      <Link href="/" className="text-blue-500 underline">
        Quay lại Trang chủ
      </Link>
    </div>
  );
}
