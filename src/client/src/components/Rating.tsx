import styled from "styled-components";

const RatingContainer = styled.div`
  display: flex;
  flex-direction: column;
  font-family: system-ui;
  align-items:flex-start;
  width:100%;
`;

const StarsContainer = styled.div`
  display: flex;
  align-items: center;
`;
interface Star {
  filled: boolean;
  fontSize: number;
}
const Star = styled.span<Star>`
  color: ${(props) => (props.filled ? "#ffd700" : "#e2e8f0")};
  font-size: ${(props) => props.fontSize}px;
`;

const RatingTotal = styled.p`
  font-size: 40px;
  font-weight: 700;
  font-family:system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
`;

const RatingCount = styled.p`
  font-size: 14px;
  color: #6b7280;
`;

const Rating = ({ rating, fontSize = 16, showVol = false }) => {
  const stars = Array(5)
    .fill(0)
    .map((_, index) => (
      <Star key={index} filled={index < rating} fontSize={fontSize}>
        &#9733;
      </Star>
    ));

  return (
    <RatingContainer>
      {showVol && <RatingTotal>4.4</RatingTotal>}
      <StarsContainer>{stars}</StarsContainer>
      {showVol && <RatingCount>200</RatingCount>}
    </RatingContainer>
  );
};

export default Rating;
