export const queryKeys = {
  profile: {
    all: ["profile"],
    enrolledCourses: () => [...queryKeys.profile.all, "enrolled-courses"],
    instructorDashboard: () => [
      ...queryKeys.profile.all,
      "instructor-dashboard",
    ],
  },
  course: {
    all: ["course"],
    list: () => [...queryKeys.course.all, "list"],
    detail: (id: string) => [...queryKeys.course.all, "detail", id],
    fullDetail: (id: string) => [...queryKeys.course.all, "full-detail", id],
    categories: () => [...queryKeys.course.all, "categories"],
    instructorCourses: () => [...queryKeys.course.all, "instructor-courses"],
    search: (q: string) => [...queryKeys.course.all, "search", q],
  },
  catalog: {
    all: ["catalog"],
    page: (categoryId: string) => [
      ...queryKeys.catalog.all,
      "page",
      categoryId,
    ],
  },
  payment: {
    all: ["payment"],
    history: (params?: { status?: string; limit?: number }) => [
      ...queryKeys.payment.all,
      "history",
      params,
    ],
    instructorEarnings: () => [...queryKeys.payment.all, "instructor-earnings"],
  },
} as const;
