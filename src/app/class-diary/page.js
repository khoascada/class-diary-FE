export default function Home() {
  const dummyContent = Array.from({ length: 50 }, (_, i) => (
    <div key={i} className="p-8 my-4 bg-gray-200 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-blue-600">
        Phần tử số {i + 1}
      </h2>
      <p className="mt-2 text-gray-700">
        Đây là . Khi bạn cuộn xuống, các phần tử này sẽ xuất hiện liên tiếp, mô phỏng một trang web có nhiều nội dung.
      </p>
    </div>
  ));

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="mb-8 text-3xl font-bold text-gray-800">
        Trang chủ - Cuộn xuống để xem nội dung
      </h1>
      {dummyContent}
    </div>
  );
}