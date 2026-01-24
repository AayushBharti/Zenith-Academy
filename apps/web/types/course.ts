export interface Instructor {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  image: string;
  accountType: string;
  additionalDetails: {
    gender: string;
    dateOfBirth: string;
    about: string;
    contactNumber: string;
  };
  createdAt: string;
  updatedAt: string;
  active: string;
  approved: string;
}

export interface Review {
  rating: number;
  review: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    image: string;
  };
}

export interface SubSection {
  _id: string;
  title: string;
  description: string;
  videoUrl: string;
}

export interface Section {
  _id: string;
  sectionName: string;
  subSection: SubSection[];
}

export interface CourseDetails {
  _id: string;
  courseName: string;
  category: Category;
  courseDescription: string;
  price: number;
  thumbnail: string;
  instructor: Instructor;
  ratingAndReviews: Review[];
  studentsEnrolled: string[];
  courseContent: Section[];
  createdAt: string;
  updatedAt: string;
  whatYouWillLearn: string;
  instructions: string;
  status: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  courses: CourseDetails[];
}
