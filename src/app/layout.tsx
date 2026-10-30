
import "@/app/globals.css";
import Navbar from './../components/Home/Navbar';
import Footer from './../components/Home/Footer';

export const metadata = {
  title: "BookNook - A Cozy Online Library",
  description: "Add a book, borrow a book, return a book.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark"> {/* Toggle 'dark' class for default theme */}
      <body className="min-h-screen flex flex-col bg-[#faf8f5] dark:bg-[#181614] text-[#2d2a26] dark:text-[#f0eae1] font-serif transition-colors duration-300 antialiased">
        {/* Navbar at top */}
        <Navbar />

        {/* Main Content takes up all remaining vertical space */}
        <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>

        {/* Footer always anchored at the bottom */}
        <Footer />
      </body>
    </html>
  );
}