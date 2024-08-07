import React, { useState } from "react";
import { ArrowLeft, CalendarClock, PhoneCall, Star, X } from "lucide-react";
import styled from "styled-components";
import { Hospital } from "../types";
import Rating from "./Rating";
import { useLocation, useNavigate } from "react-router-dom";

const demoReviews = [
  {
    name: "John Doe",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    rating: 5,
    content: "Excellent service and caring staff. Highly recommended!",
    date: "June 15, 2024",
  },
  {
    name: "Jane Smith",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    rating: 4,
    content: "Good experience overall. Clean facilities and professional doctors.",
    date: "June 10, 2024",
  },
  {
    name: "Mike Johnson",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    rating: 3,
    content: "Average experience. Wait times could be improved.",
    date: "June 5, 2024",
  },
  {
    name: "Emily Brown",
    avatar: "https://randomuser.me/api/portraits/women/4.jpg",
    rating: 5,
    content: "Outstanding care! The staff went above and beyond to ensure my comfort.",
    date: "May 30, 2024",
  },
  {
    name: "David Lee",
    avatar: "https://randomuser.me/api/portraits/men/5.jpg",
    rating: 4,
    content: "Very satisfied with the treatment. Modern facilities and knowledgeable doctors.",
    date: "May 25, 2024",
  },
];

const HospitalProfileViewer = () => {
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const location = useLocation();
  const hospital = location.state?.hospital;
  const navigate = useNavigate();
  const handleCall = () => {
    window.location.href = `tel:${hospital?.phone}`;
  };

  const handleAppointment = () => {
    navigate("/ping-chat", {
      state: { hospital },
    });
  };

  return (
    <Overlay>
      <HPRenderer>
        <Header>
          <ArrowLeft
            onClick={()=> navigate('/')}
            style={{
              background: "#ededed",
              width: "35px",
              height: "35px",
              padding: "8px",
              borderRadius: "50%",
              cursor: "pointer",
            }}
          />
        </Header>
        <HPInfoRenderer>
          <HAvatar src={hospital?.avatar || "default-avatar.png"} />

          <HMetaInfo>
            <div className="name-status">
              <h2>{hospital?.hospitalName || "N/A"}</h2>
              {hospital?.status == "Available" && (
                <span className="active-ripple"></span>
              )}

              <span
                className="h-p-status"
                style={{
                  borderColor:
                    hospital?.status == "Available"
                      ? "green"
                      : "crimson",
                  color:
                    hospital?.status == "Available"
                      ? "green"
                      : "crimson",
                }}
              >
                {hospital?.status == "Available"
                  ? hospital?.status
                  : "N/A"}
              </span>
            </div>
            <p className="h-p-joined">
              Joined on:{" "}
              {hospital?.createdAt
                ? new Date(hospital.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "N/A"}
            </p>
            <div className="button-group">
              <Button onClick={handleCall}>
                <PhoneCall /> Call
              </Button>
              <Button onClick={handleAppointment}>
                <CalendarClock /> Book Appointment
              </Button>
            </div>
          </HMetaInfo>
          <Rating fontSize={24} rating={hospital?.rating ||4} showVol={true} />
        </HPInfoRenderer>
        <HospitalProfileReviews>
          <ReviewHeader>
            <h2>Reviews</h2>
            <WriteReviewButton onClick={() => setIsReviewModalOpen(true)}>
              Write a Review
            </WriteReviewButton>
          </ReviewHeader>
          {demoReviews.map((review, index) => (
            <ReviewItem key={index}>
              <ReviewAvatar src={review.avatar} alt={review.name} />
              <ReviewContent>
                <ReviewHeader>
                  <div>
                    <h3>{review.name}</h3>
                    <ReviewDate>{review.date}</ReviewDate>
                  </div>
                  <StarRating rating={review.rating} />
                </ReviewHeader>
                <p>{review.content}</p>
              </ReviewContent>
            </ReviewItem>
          ))}
        </HospitalProfileReviews>
      </HPRenderer>
      {isReviewModalOpen && (
        <ReviewModal onClose={() => setIsReviewModalOpen(false)} />
      )}
    </Overlay>
  );
};

const StarRating = ({
  rating,
  onRatingChange = null,
}: {
  rating: number;
  onRatingChange?: ((rating: number) => void) | null;
}) => {
  return (
    <StarContainer>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={16}
          fill={star <= rating ? "#FFD700" : "none"}
          stroke={star <= rating ? "#FFD700" : "#ccc"}
          style={{ cursor: onRatingChange ? "pointer" : "default" }}
          onClick={() => onRatingChange && onRatingChange(star)}
        />
      ))}
    </StarContainer>
  );
};

const ReviewModal = ({ onClose }: { onClose: () => void }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log({ rating, review });
    onClose();
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalHeader>
          <h2>Provide a Review</h2>
          <CloseButton onClick={onClose}>
            <X size={24} />
          </CloseButton>
        </ModalHeader>
        <form onSubmit={handleSubmit}>
          <RatingContainer>
            <label>Your Rating</label>
            <StarRating rating={rating} onRatingChange={setRating} />
          </RatingContainer>
          <TextAreaContainer>
            <label htmlFor="review">Your Review</label>
            <textarea
              id="review"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Share your experience..."
              rows={5}
            />
          </TextAreaContainer>
          <SubmitButton type="submit">Submit Review</SubmitButton>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default HospitalProfileViewer;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const HPRenderer = styled.div`
  position: relative;
  max-width: 600px;
  width: 100%;
  max-height: 100vh;
  overflow-y: auto;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding-bottom: 60px;
`;

const Header = styled.div`
  width: 100%;
  height: 60px;
  background-color: #fff;
  border-bottom: 1px solid #ededed;
  border-top-right-radius: 12px;
  border-top-left-radius: 12px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
`;

const HPInfoRenderer = styled.div`
  width: 100%;
  padding: 24px;
  background-color: #fff;
  border-bottom: 1px solid #ededed;
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
  text-align: center;
`;

const HAvatar = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  @media (max-width: 480px) {
    width: 100px;
    height: 100px;
  }
`;

const HMetaInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  .active-ripple {
    position: relative;
  }  .active-ripple::before,
  .active-ripple::after {
    position: absolute;
    content: "";
    height: 4px;
    width: 4px;
    border-radius: 50%;
    left: -12px;
    bottom: 5px;
    background-color: #5bc9d3;
  }
  .active-ripple::before {
    width: 8px;
    height: 8px;
    background-color: #5bc9d3;
  }
  .active-ripple::after {
    width: 8px;
    height: 8px;
    animation: pulse 1s linear infinite;
  }
  .h-p-joined {
    font-size: 14px;
    color: #666;
  }
  .name-status {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }

  .h-p-status {
    padding: 4px 12px;
    border-radius: 20px;
    border: 1px solid green;
    font-size: 14px;
  }

  .button-group {
    display: flex;
    justify-content: center;
    gap: 12px;
    flex-wrap: wrap;
  }
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content:center;
  gap: 8px;
  background-color: #5bc9d3;
  padding: 8px 16px;
  color: #fff;
  font-size:12px; 
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #29787f;
  }

  svg {
    width: 18px;
  }
`;

const HospitalProfileReviews = styled.div`
  padding: 24px;
  height: 100%;
  width: 100%;
  overflow-y: auto;
  h2 {
    margin-bottom: 16px;
  }
`;

const ReviewItem = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  border-bottom: 1px solid #ededed;
  padding-bottom: 10px;
`;

const ReviewAvatar = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
`;

const ReviewContent = styled.div`
  flex: 1;
  font-size: 14px;
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const WriteReviewButton = styled(Button)`
  background-color: #29787f;
  font-size: 12px;
  border-radius: 0;
  padding: 5px 10px;
`;

const ReviewDate = styled.span`
  font-size: 12px;
  color: #666;
`;

const ModalOverlay = styled(Overlay)`
  background: rgba(0, 0, 0, 0.7);
`;

const ModalContent = styled.div`
  background: white;
  padding: 24px;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  h2 {
    font-weight: 700;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #333;
`;

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
`;

const TextAreaContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;

  textarea {
    padding: 10px;
    border: 1px solid #ccc;
    outline: none;
    border-radius: 4px;
    font-family: inherit;
    resize: vertical;
    width: 100%;
  }
`;

const SubmitButton = styled(Button)`
  text-align: center;
  font-size: 14px;
  width: 100%;
  padding: 12px;
`;

const StarContainer = styled.div`
  display: flex;
  gap: 2px;
`;

