'use client';
import { useState, useEffect } from 'react';

export default function Home() {
  const dummyContent = Array.from({ length: 10 }, (_, i) => (
    <div key={i} className="my-4 rounded-lg bg-gray-200 p-8 shadow-md">
      <h2 className="text-xl font-semibold text-blue-600">Phần tử số {i + 1}</h2>
      <p className="mt-2 text-gray-700">
        nội dung thử nghiệm để kiểm tra tính năng cuộn trang. Khi bạn cuộn xuống, các phần tử này sẽ
        xuất hiện liên tiếp, mô phỏng một trang web có nhiều nội dung.
      </p>
    </div>
  ));

  return (
    <div>
      <div class="flex w-[200px] gap-2 mb-4">
  <div class="shrink-0 w-[80px] bg-blue-500">Fixed</div>
  <div class="truncate bg-red-500">
    Đây là một đoạn văn bản rất dài sẽ KHÔNG bị cắt
  </div>
</div>


<div class="flex w-[200px] gap-2">
  <div class="shrink-0 w-[80px] bg-blue-500">Fixed</div>
  <div class="min-w-0 truncate bg-red-500">
    Đây là một đoạn văn bản rất dài sẽ bị cắt
  </div>
</div>
    </div>
  );
}
