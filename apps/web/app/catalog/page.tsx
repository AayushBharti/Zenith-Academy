"use client";

import {
  ArrowRight,
  Code2,
  Cpu,
  Globe,
  Layout,
  Loader2,
  Search,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDebounceValue } from "usehooks-ts";
import { CourseCard } from "@/components/common/course-card";
// Components
import { CourseSlider } from "@/components/common/course-slider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

// Types & Utils
import { COURSE_STATUS } from "@/data/constants";
import type { Category, CourseDetails } from "@/types/course";
import { apiConnector } from "@/utils/api-connector";
import { categories as categoryApis, courseEndpoints } from "@/utils/apis";

// --- Helper for Category Icons ---
const getCategoryStyle = (name: string) => {
  const lower = name.toLowerCase();
  if (lower.includes("blockchain") || lower.includes("web3"))
    return {
      icon: Globe,
      color: "text-indigo-600 dark:text-indigo-400",
      bg: "bg-indigo-50 dark:bg-indigo-900/20",
    };
  if (lower.includes("web"))
    return {
      icon: Layout,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-900/20",
    };
  if (lower.includes("ai") || lower.includes("intelligence"))
    return {
      icon: Cpu,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-50 dark:bg-purple-900/20",
    };
  return { icon: Code2, color: "text-primary", bg: "bg-primary/10" };
};

export default function CatalogPage() {
  // Data State
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [trendingCourses, setTrendingCourses] = useState<CourseDetails[]>([]);
  const [newCourses, setNewCourses] = useState<CourseDetails[]>([]);
  const [loading, setLoading] = useState(true);

  // Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebounceValue(searchQuery, 500);
  const [searchResults, setSearchResults] = useState<CourseDetails[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // --- 1. Fetch Initial Data ---
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const [catRes, coursesRes] = await Promise.all([
          apiConnector("GET", categoryApis.CATEGORIES_API),
          apiConnector("GET", courseEndpoints.GET_ALL_COURSE_API),
        ]);

        if (catRes?.data?.success) {
          setAllCategories(catRes.data.data);
        }

        if (coursesRes?.data?.success) {
          const publishedCourses = coursesRes.data.data.filter(
            (c: CourseDetails) => c.status === COURSE_STATUS.PUBLISHED
          );
          setTrendingCourses(publishedCourses.slice(0, 5));
          setNewCourses([...publishedCourses].reverse().slice(0, 5));
        }
      } catch (error) {
        console.error("Failed to fetch catalog data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // --- 2. Search Logic ---
  useEffect(() => {
    const handleSearch = async () => {
      if (!debouncedSearchQuery || debouncedSearchQuery.trim() === "") {
        setSearchResults([]);
        setHasSearched(false);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      setHasSearched(true);

      try {
        const res = await apiConnector(
          "POST",
          courseEndpoints.SEARCH_COURSES_API,
          {
            searchQuery: debouncedSearchQuery,
          }
        );

        if (res?.data?.success) {
          const publishedResults = res.data.data.filter(
            (c: CourseDetails) => c.status === COURSE_STATUS.PUBLISHED
          );
          setSearchResults(publishedResults);
        }
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setIsSearching(false);
      }
    };

    handleSearch();
  }, [debouncedSearchQuery]);

  const clearSearch = () => {
    setSearchQuery("");
    setHasSearched(false);
  };

  if (loading) return <CatalogPageSkeleton />;

  return (
    <div className="min-h-screen bg-background pt-20 pb-20 text-foreground">
      {/* ================= HEADER SECTION (Vercel Style) ================= */}
      <div className="sticky top-16 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container py-4 md:py-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Title Area */}
            <div className="space-y-1">
              <h1 className="font-semibold text-2xl tracking-tight">
                Explore Catalog
              </h1>
              <p className="text-muted-foreground text-sm">
                Browse categories or search for specific courses.
              </p>
            </div>

            {/* Search Input (Minimalist) */}
            <div className="relative w-full md:w-[320px]">
              <div className="relative">
                <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  className="h-9 w-full border-border/50 bg-muted/50 pr-9 pl-9 text-sm transition-all focus-visible:ring-1 focus-visible:ring-primary/20"
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search courses..."
                  type="text"
                  value={searchQuery}
                />
                {(searchQuery || isSearching) && (
                  <div className="absolute top-2.5 right-2.5">
                    {isSearching ? (
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    ) : (
                      <button
                        className="text-muted-foreground hover:text-foreground"
                        onClick={clearSearch}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <div className="container space-y-12 py-8">
        {/* --- SEARCH RESULTS VIEW --- */}
        {hasSearched ? (
          <motion.div
            animate={{ opacity: 1 }}
            className="space-y-6"
            initial={{ opacity: 0 }}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-medium text-lg">
                Results for{" "}
                <span className="text-primary">"{debouncedSearchQuery}"</span>
              </h2>
              <Badge className="text-xs" variant="secondary">
                {searchResults.length} found
              </Badge>
            </div>

            {searchResults.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {searchResults.map((course) => (
                  <CourseCard course={course} key={course._id} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-muted/30 py-20 text-center">
                <Search className="mb-3 h-10 w-10 text-muted-foreground opacity-50" />
                <h3 className="font-medium text-lg">No results found</h3>
                <p className="mt-1 text-muted-foreground text-sm">
                  Try adjusting your search query or browse categories.
                </p>
                <Button
                  className="mt-4"
                  onClick={clearSearch}
                  size="sm"
                  variant="outline"
                >
                  Clear Search
                </Button>
              </div>
            )}
          </motion.div>
        ) : (
          /* --- DEFAULT VIEW --- */
          <div className="fade-in-50 slide-in-from-bottom-4 animate-in space-y-16 duration-500">
            {/* Categories Grid */}
            <section className="space-y-4">
              <h3 className="font-semibold text-lg tracking-tight">
                Categories
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {allCategories.map((cat) => {
                  const style = getCategoryStyle(cat.name);
                  const Icon = style.icon;
                  return (
                    <Link
                      className="group outline-none"
                      href={`/catalog/${cat.slug}`}
                      key={cat._id}
                    >
                      <Card className="h-full border border-border/50 bg-background/50 shadow-sm transition-all duration-200 hover:border-primary/20 hover:bg-muted/50 hover:shadow-md">
                        <CardContent className="flex items-center gap-4 p-4">
                          <div
                            className={`rounded-md p-2.5 ${style.bg} ${style.color}`}
                          >
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="truncate font-medium text-sm transition-colors group-hover:text-primary">
                                {cat.name}
                              </h4>
                              <ArrowRight className="-translate-x-2 h-3.5 w-3.5 text-muted-foreground/50 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                            </div>
                            <p className="mt-0.5 truncate text-muted-foreground text-xs">
                              View courses
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </section>

            {/* Trending Courses */}
            {trendingCourses.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-lg tracking-tight">
                    Popular Now
                  </h2>
                </div>
                <CourseSlider courses={trendingCourses} />
              </section>
            )}

            <Separator className="bg-border/60" />

            {/* New Arrivals */}
            {newCourses.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-lg tracking-tight">
                    Just Added
                  </h2>
                </div>
                <CourseSlider courses={newCourses} />
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// --- Skeleton Component ---
function CatalogPageSkeleton() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="container space-y-12">
        {/* Header Skeleton */}
        <div className="flex flex-col justify-between gap-4 border-b pb-6 md:flex-row">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-full md:w-[320px]" />
        </div>

        {/* Categories Skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-32" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton className="h-20 w-full rounded-lg border" key={i} />
            ))}
          </div>
        </div>

        {/* Courses Skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-40" />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Skeleton className="h-[280px] w-full rounded-xl" key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
