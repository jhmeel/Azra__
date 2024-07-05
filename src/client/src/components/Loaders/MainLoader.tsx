import { useEffect } from "react";
import styled from "styled-components";
import { cardio } from "ldrs";

const Section = styled.section`
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, #000 0%, #38b2ac 100%);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MainLoader = () => {
  useEffect(() => {
    cardio.register();
  }, []);

  return (
    <Section>
      <l-cardio size="50" stroke="4" speed="2" color="white"></l-cardio>
    </Section>
  );
};

export default MainLoader;
