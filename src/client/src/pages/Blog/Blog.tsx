import React, { useState } from 'react';
import styled from 'styled-components';
const articles = [
  {
    id: 1,
    title: 'Understanding Diabetes: A Comprehensive Guide',
    author: 'Dr. John Doe',
    publishDate: 'July 4, 2024',
    content: `Diabetes is a chronic condition that affects how your body turns food into energy. There are two main types: Type 1 and Type 2. In Type 1 diabetes, the body doesn't produce insulin, while in Type 2, the body doesn't use insulin effectively.

Symptoms of diabetes include increased thirst, frequent urination, blurred vision, and fatigue. Managing diabetes involves monitoring blood sugar levels, maintaining a healthy diet, regular exercise, and, in some cases, medication or insulin therapy.

Recent advancements in diabetes care include continuous glucose monitoring systems and artificial pancreas technology, which are improving the quality of life for many patients. It's crucial for individuals with diabetes to work closely with their healthcare providers to develop an effective management plan.`,
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    banner: '',
    readingTime: 3
  },
  {
    id: 2,
    title: 'The Importance of Vaccination in Public Health',
    author: 'Dr. Jane Smith',
    publishDate: 'July 3, 2024',
    content: `Vaccinations are crucial for preventing diseases and protecting public health. They work by stimulating the immune system to recognize and fight specific pathogens. Vaccines have been instrumental in eradicating diseases like smallpox and significantly reducing the incidence of others like polio and measles.

The concept of herd immunity is vital in vaccination programs. When a large portion of a population is vaccinated, it becomes difficult for diseases to spread, protecting even those who cannot be vaccinated due to medical reasons.

Despite the proven benefits, vaccine hesitancy remains a challenge. It's important to address concerns with factual information and emphasize the overwhelming scientific evidence supporting vaccine safety and efficacy. Staying up-to-date with recommended vaccinations is a key aspect of personal and community health.`,
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    banner: '',
    readingTime: 4
  },
 
];

const Container = styled.div`
  max-width:800px;
  margin: 0 auto;
  padding: 20px;
  h1{
  font-size:2.4rem;
  font-family:'ulagadi-bold';
  }
`;

const ArticleCard = styled.article`
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
  overflow: hidden;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const Banner = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const CardContent = styled.div`
  padding: 20px;
`;

const Title = styled.h2`
  color: #333;
  font-size: 1.5rem;
  margin-bottom: 10px;
`;

const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
`;

const AuthorName = styled.p`
  color: #666;
  font-size: 1rem;
  font-weight: bold;
`;

const PublishDate = styled.p`
  color: #999;
  font-size: 0.9rem;
`;

const ReadingTime = styled.span`
  color: #999;
  font-size: 0.9rem;
  margin-left: 10px;
`;

const Excerpt = styled.p`
  color: #444;
  font-size: 1rem;
  line-height: 1.6;
  margin-top: 10px;
`;

const ReadMore = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 8px 16px;
  font-size: 0.9rem;
  cursor: pointer;
  margin-top: 10px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const Popup = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const PopupContent = styled.div`
  background-color: white;
  padding: 30px;
  border-radius: 12px;
  max-width: 800px;
  max-height: 80vh;
  overflow-y: auto;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
`;

const Blog = () => {
  const [selectedArticle, setSelectedArticle] = useState(null);

  const openArticle = (article) => {
    setSelectedArticle(article);
  };

  const closeArticle = () => {
    setSelectedArticle(null);
  };

  return (
    <Container>
      <h1>Blog</h1>
      {articles.map((article) => (
        <ArticleCard key={article.id}>
         {article.banner &&  <Banner src={article.banner} alt={article.title} />}
          <CardContent>
            <Title>{article.title}</Title>
            <AuthorInfo>
              <Avatar src={article.avatar} alt={article.author} />
              <div>
                <AuthorName>{article.author}</AuthorName>
                <PublishDate>{article.publishDate}
                  <ReadingTime>· {article.readingTime} min read</ReadingTime>
                </PublishDate>
              </div>
            </AuthorInfo>
            <Excerpt>{article.content.substring(0, 150)}...</Excerpt>
            <ReadMore onClick={() => openArticle(article)}>Read More</ReadMore>
          </CardContent>
        </ArticleCard>
      ))}
      {selectedArticle && (
        <Popup>
          <PopupContent>
            <CloseButton onClick={closeArticle}>&times;</CloseButton>
            <h2>{selectedArticle.title}</h2>
            <AuthorInfo>
              <Avatar src={selectedArticle.avatar} alt={selectedArticle.author} />
              <div>
                <AuthorName>{selectedArticle.author}</AuthorName>
                <PublishDate>{selectedArticle.publishDate}
                  <ReadingTime>· {selectedArticle.readingTime} min read</ReadingTime>
                </PublishDate>
              </div>
            </AuthorInfo>
            <p>{selectedArticle.content}</p>
          </PopupContent>
        </Popup>
      )}
    </Container>
  );
};

export default Blog;