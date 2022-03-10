import { Container, Navbar } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const NavigationBar = () => {

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand>NFT Zombies</Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle />
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
