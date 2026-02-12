import { Link } from 'react-router-dom';
import styled from 'styled-components';

// Styled Components - CSS-in-JS
const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
`;

const Content = styled.div`
  text-align: center;
  color: white;
  max-width: 600px;
`;

const Title = styled.h1`
  font-size: 3.5rem;
  margin-bottom: 1rem;
  font-weight: 700;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  margin-bottom: 3rem;
  opacity: 0.9;
  line-height: 1.6;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const StyledLink = styled(Link)`
  background: white;
  color: #667eea;
  padding: 1rem 2.5rem;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
    background: #f0f0f0;
  }
  
  &:active {
    transform: translateY(0);
  }
`;

function HomePage() {
  return (
    <Container>
      <Content>
        <Title>🎾 Lets Play Tennis!</Title>
        <Subtitle>
          Find your perfect tennis partner, schedule matches, and enjoy the game!
        </Subtitle>
        <ButtonContainer>
          <StyledLink to="/register">Sign Up</StyledLink>
          <StyledLink to="/login">Login</StyledLink>
        </ButtonContainer>
      </Content>
    </Container>
  );
}

export default HomePage;
