export default function getAvgRating(
  ratingArr: {
    rating: number;
  }[]
): number {
  if (ratingArr.length === 0) return 0;

  const totalReviewCount = ratingArr.reduce((acc, curr) => {
    acc += curr.rating;
    return acc;
  }, 0);

  const multiplier = 10 ** 1;
  const avgReviewCount =
    Math.round((totalReviewCount / ratingArr.length) * multiplier) / multiplier;

  return avgReviewCount;
}
