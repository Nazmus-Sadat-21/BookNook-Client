import Banner from '@/components/Home/Banner';
import GenreVibeExplorer from '@/components/Home/GenreVibeExplorer';
import BorrowingSteps from '@/components/Home/BorrowingSteps';
export default function Home() {
  return (
    <div className="space-y-12">
      {/* Banner / Hero Slider */}
      <Banner />
      {/* 2. Extra Section 1: Interactive Vibe Matcher */}
      <GenreVibeExplorer />

      {/* 3. Extra Section 2: How Borrowing Works */}
      <BorrowingSteps />
      {/* Other sections (e.g. Featured Books, Categories, etc.) will go here */}
    </div>
  );
}
