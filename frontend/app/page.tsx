import { redirect } from 'next/navigation';

export default function Home() {
  //todos 페이지 리다이렉트
  redirect('/todos');
}
