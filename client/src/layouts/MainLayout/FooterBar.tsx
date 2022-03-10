import { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';

const FooterBar = () => {

  let [currentYear, setCurrentYear] = useState<number>(2022);

  useEffect(() => {
    let year = (new Date()).getFullYear();
    setCurrentYear(year);
  }, []);

  return (
    <footer className="py-5 bg-dark">
      <Container>
        <p className="m-0 text-center text-white">NFT Zombies {currentYear}</p>
      </Container>
    </footer>
  );
};

export default FooterBar;
