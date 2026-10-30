"use client";

import React, { useState } from "react";
import { User, Mail, Image as ImageIcon, Edit3, Save, X, Sparkles, BookOpen, BookmarkCheck, Library, ShieldCheck } from "lucide-react";

export default function ProfilePage() {
  // Initial user state
  const [user, setUser] = useState({
    name: "Alex Johnson",
    email: "alex@booknook.lib",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=faces",
    role: "Library Curator",
    joinedDate: "October 2025",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(user.name);
  const [tempAvatar, setTempAvatar] = useState(user.avatar);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setUser((prev) => ({
      ...prev,
      name: tempName,
      avatar: tempAvatar || prev.avatar,
    }));
    setIsEditing(false);
    setSuccessMessage("Profile updated successfully!");
    setTimeout(() => setSuccessMessage(""), 4000);
  };

  const handleCancel = () => {
    setTempName(user.name);
    setTempAvatar(user.avatar);
    setIsEditing(false);
  };

  // Mock user stats
  const stats = [
    { label: "Books Added", value: "12", icon: Library },
    { label: "Active Borrows", value: "3", icon: BookmarkCheck },
    { label: "Reading Streak", value: "14 Days", icon: Sparkles },
  ];

  return (
    <div className="min-h-screen  py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Success Toast Notification */}
        {successMessage && (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 flex items-center gap-3 text-emerald-800 dark:text-emerald-300 shadow-lg animate-fade-in">
            <Sparkles className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span className="text-sm font-medium">{successMessage}</span>
          </div>
        )}

        {/* Profile Hero Header Card */}
        <div className="bg-[#fdfcfa] dark:bg-[#1c1a18] border border-[#e8e2d9] dark:border-[#2a2622] rounded-[2.5rem] shadow-2xl overflow-hidden relative">
          
          {/* Decorative Top Banner Pattern */}
          <div className="h-40 bg-gradient-to-r from-[#3e342a] via-[#5c4d3f] to-[#8c6d46] dark:from-[#141211] dark:via-[#221f1c] dark:to-[#3e342a] relative px-6 sm:px-10 pt-6 flex justify-between items-start">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/20 backdrop-blur-md text-[#f0eae1] text-xs font-medium tracking-wide">
              <ShieldCheck className="h-3.5 w-3.5 text-[#d4a373]" /> {user.role}
            </div>
            <span className="text-xs text-[#f0eae1]/80 font-serif italic hidden sm:inline">
              Member since {user.joinedDate}
            </span>
          </div>

          <div className="px-6 sm:px-10 pb-8 pt-0 relative">
            <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between -mt-16 sm:-mt-20 gap-6 mb-6">
              
              {/* Avatar & Basic Info */}
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
                <div className="relative group">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-32 w-32 rounded-3xl object-cover border-4 border-[#fdfcfa] dark:border-[#1c1a18] shadow-2xl"
                  />
                  <div className="absolute inset-0 rounded-3xl bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium backdrop-blur-[2px]">
                    Avatar
                  </div>
                </div>

                <div className="space-y-1 pb-2">
                  <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#2d2a26] dark:text-[#f0eae1]">
                    {user.name}
                  </h1>
                  <p className="text-xs sm:text-sm text-[#8c8275] dark:text-[#a89f91] flex items-center justify-center sm:justify-start gap-1.5">
                    <Mail className="h-3.5 w-3.5" /> {user.email}
                  </p>
                </div>
              </div>

              {/* Edit Profile Toggle Button */}
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-5 py-2.5 rounded-xl bg-[#3e342a] dark:bg-[#d4a373] text-[#faf8f5] dark:text-[#181614] text-sm font-medium hover:opacity-95 shadow-md transition flex items-center gap-2 cursor-pointer"
                >
                  <Edit3 className="h-4 w-4" /> Edit Profile
                </button>
              )}
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#e8e2d9] dark:border-[#2a2622]">
              {stats.map((stat, idx) => {
                const IconComponent = stat.icon;
                return (
                  <div key={idx} className="p-4 rounded-2xl bg-[#f2ede4]/50 dark:bg-[#141211] border border-[#e8e2d9]/60 dark:border-[#2a2622] flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-[#8c6d46]/15 dark:bg-[#d4a373]/15 text-[#8c6d46] dark:text-[#d4a373] flex items-center justify-center shrink-0">
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs text-[#8c8275] uppercase tracking-wider font-semibold">{stat.label}</p>
                      <p className="text-lg font-bold font-serif text-[#2d2a26] dark:text-[#f0eae1]">{stat.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Edit Profile Form Drawer Section */}
            {isEditing && (
              <form onSubmit={handleSave} className="mt-8 p-6 sm:p-8 rounded-2xl bg-[#f2ede4]/70 dark:bg-[#141211] border border-[#e8e2d9] dark:border-[#2a2622] space-y-5 animate-fade-in">
                <div className="flex items-center justify-between border-b border-[#e8e2d9] dark:border-[#2a2622] pb-3">
                  <h3 className="text-base font-serif font-bold text-[#2d2a26] dark:text-[#f0eae1]">
                    Update Personal Information
                  </h3>
                  <span className="text-xs text-[#8c6d46] font-medium">Edit Mode Active</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Edit Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#625b52] dark:text-[#a89f91]">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-3.5 h-4 w-4 text-[#8c8275]" />
                      <input
                        type="text"
                        required
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#e8e2d9] dark:border-[#2d2924] bg-[#faf8f5] dark:bg-[#1c1a18] text-sm text-[#2d2a26] dark:text-[#f0eae1] focus:outline-none focus:ring-2 focus:ring-[#8c6d46]/50 transition"
                      />
                    </div>
                  </div>

                  {/* Edit Image Avatar URL */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#625b52] dark:text-[#a89f91]">
                      Avatar Image URL
                    </label>
                    <div className="relative">
                      <ImageIcon className="absolute left-3.5 top-3.5 h-4 w-4 text-[#8c8275]" />
                      <input
                        type="url"
                        required
                        value={tempAvatar}
                        onChange={(e) => setTempAvatar(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#e8e2d9] dark:border-[#2d2924] bg-[#faf8f5] dark:bg-[#1c1a18] text-sm text-[#2d2a26] dark:text-[#f0eae1] focus:outline-none focus:ring-2 focus:ring-[#8c6d46]/50 transition"
                      />
                    </div>
                  </div>
                </div>

                {/* Form Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-5 py-2.5 rounded-xl border border-[#e8e2d9] dark:border-[#2a2622] text-[#625b52] dark:text-[#a89f91] text-sm font-medium hover:bg-[#faf8f5] dark:hover:bg-[#1c1a18] transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <X className="h-4 w-4" /> Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#3e342a] dark:bg-[#d4a373] text-[#faf8f5] dark:text-[#181614] text-sm font-medium hover:opacity-95 shadow-md transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Save className="h-4 w-4" /> Save Changes
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}