export default function Loading() {
  return (
    <div className="flex justify-center items-center min-h-[50vh]">
      <div className="text-xl text-gray-500 font-semibold animate-pulse">
        데이터를 불러오는 중입니다...
      </div>
    </div>
  );
}