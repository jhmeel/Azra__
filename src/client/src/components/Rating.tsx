import React from "react";

const Rating = ({ rating }: { rating: number }) => {
  const stars = Array(5)
    .fill(0)
    .map((_, index) => (
      <span key={index} style={{ color: index < rating ? "#ffd700" : "#e2e8f0" }}>
        &#9733;
      </span>
    ));
  return <div>{stars}</div>;
};

export default Rating;
