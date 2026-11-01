import React from "react";
import Link from "next/link";
import { BookOpen, ArrowRight, User } from "lucide-react";

interface BookCardProps {
  data: {
    _id?: string;
    id?: string;
    title: string;
    author: string;
    category: string;
    coverImage?: string;
    description?: string;
    copies?: number;
    createdAt?: string;
  };
}

export default function BookCard({ data }: BookCardProps) {
  const bookId = data._id || data.id;

  return (
    <div className="group rounded-[1.5rem] border border-[#e8e2d9] dark:border-[#2a2622] bg-[#fdfcfa] dark:bg-[#1c1a18] overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between">
      
      {/* Top Image & Category Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#3e342a]/15">
        {data.coverImage && !data.coverImage.startsWith("blob:") ? (
          <img
            src={data.coverImage}
            alt={data.title}
            className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-[#8c8275] gap-2 p-4 text-center">
            <BookOpen className="h-8 w-8 opacity-40" />
            <span className="text-xs">Image unavailable (Blob URL)</span>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />

        {/* Category Badge */}
        <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-[#3e342a]/85 backdrop-blur-md text-[11px] font-semibold text-[#faf8f5] shadow">
          {data.category}
        </span>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Title */}
          <h3 className="font-serif text-xl font-bold tracking-tight text-[#2d2a26] dark:text-[#f0eae1] line-clamp-1 group-hover:text-[#8c6d46] dark:group-hover:text-[#d4a373] transition-colors">
            {data.title}
          </h3>

          {/* Author Name */}
          <div className="flex items-center gap-1.5 text-xs text-[#8c6d46] dark:text-[#d4a373] font-medium mt-1">
            <User className="h-3.5 w-3.5" />
            <span className="truncate">By {data.author}</span>
          </div>

          {/* Short Description */}
          {data.description && (
            <p className="text-xs text-[#625b52] dark:text-[#a89f91] mt-2.5 line-clamp-2 leading-relaxed">
              {data.description}
            </p>
          )}
        </div>

        {/* Card Footer */}
        <div className="pt-4 border-t border-[#e8e2d9]/40 dark:border-[#2d2924] flex items-center justify-between gap-3">
          <div className="text-[11px] text-[#8c8275] dark:text-[#a89f91]">
            Copies:{" "}
            <strong className="text-[#2d2a26] dark:text-[#f0eae1]">
              {data.copies ?? 1}
            </strong>
          </div>

          <Link
            href={`/books/${bookId}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#3e342a] dark:bg-[#d4a373] text-[#faf8f5] dark:text-[#181614] text-xs font-semibold shadow hover:opacity-95 transition-all group/btn cursor-pointer"
          >
            <span>View Details</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}