import Link from "next/link";

// app/forbidden/page.js (Next.js App Router)
export default function ForbiddenPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">403 - Forbidden</h1>
      <p className="text-gray-600 mb-4">Bạn không có quyền truy cập trang này.</p>
      <Link href="/" className="text-blue-500 underline">Quay lại Trang chủ</Link>
    </div>
  );
}
