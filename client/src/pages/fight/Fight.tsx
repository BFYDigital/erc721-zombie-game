import { AppContext } from '../../context';
import { useState, useEffect, useContext } from 'react';
import { IToastStatus, IZombie } from '../../interfaces';
import { useParams, useNavigate } from 'react-router-dom';
import { OverlaySpinner, ZombieCard } from '../../components/ui';
import { Button, Container, Col, Row, Spinner, Toast, ToastContainer } from 'react-bootstrap';

const Fight = () => {

  const { dapp } = useContext(AppContext);
  const navigate = useNavigate();
  const { zombieId } = useParams();

  const [isAttacking, setIsAttacking] = useState<boolean>(false);;
  const [enemyZombies, setEnemyZombies] = useState<Array<IZombie>>([]);
  const [isRetrievingZombies, setIsRetrievingZombies] = useState<boolean>(false);
  const [toastStatus, setToastStatus] = useState<IToastStatus>({ message: '', type: 'success', show: false });

  useEffect(() => {
    dapp.zombieContract?.events.Victory({}, () => {
      showToastMessage('You won! Glory to the winner!', 'success');
    });

    dapp.zombieContract?.events.Loss({}, () => {
      showToastMessage('You lost! Your zombie is tired. Going back home...', 'warning');
      setTimeout(() => navigate('/'), 5000);
    });
  }, []);

  useEffect(() => {
    const componentInit = async () => {
      setIsRetrievingZombies(true);

      let zombies: Array<IZombie> = [];
      const zombiesData = await dapp.zombieContract?.methods
        .getEnemyZombies()
        .call({ from: dapp.accounts[0] });

      for (let i = 0; i < zombiesData.length; i++) {
        let currentTimestamp = Math.floor(new Date().getTime() / 1000);
        let currentZombie = zombiesData[i];
        let isReady = await dapp.zombieContract?.methods
          .isReady(currentZombie.id, currentTimestamp)
          .call({ from: dapp.accounts[0] });
        let hungerLevel = await dapp.zombieContract?.methods
          .getHungerLevel(currentZombie.id, currentTimestamp)
          .call({ from: dapp.accounts[0] });

        let zombie: IZombie = {
          id: currentZombie.id,
          cooldownTime: currentZombie.cooldownTime,
          dna: parseInt(currentZombie.dna as string),
          name: currentZombie.name,
          level: currentZombie.level,
          lossCount: currentZombie.lossCount,
          winCount: currentZombie.winCount,
          isReady: isReady,
          hungerLevel: hungerLevel
        };
        zombies.push(zombie);
      }
      setEnemyZombies(zombies);
      setIsRetrievingZombies(false);
    };

    if (isAttacking === false) {
      componentInit();
    }
  }, [isAttacking]);

  const fightZombie = (targetId: number) => {
    setIsAttacking(true);

    dapp.zombieContract?.methods
      .attack(zombieId, targetId)
      .send({ from: dapp.accounts[0] })
      .then(() => {

      })
      .catch((err: Error) => {
        console.log(err);
        showToastMessage('Failed to attack zombie', 'danger');
      })
      .finally(() => setIsAttacking(false));
  };

  const showToastMessage = (msg: string, msgType: string): void => {
    setToastStatus({ message: msg, type: msgType, show: true });
  };

  const onToastClose = (): void => {
    setToastStatus({ ...toastStatus, show: false });
  };

  return (
    <>
      <header className="bg-dark py-3">
        <Container className="px-2 px-lg-3 my-3">
          <div className="text-center text-white">
            <p className="lead fw-normal text-white-50">
              Pick a zombie to fight!
            </p>
          </div>
        </Container>
      </header>
      <section>
        <Container className="px-4 px-lg-5 my-5">
          {enemyZombies.length === 0 ?
            <Container>
              <div className="p-4 p-lg-5 bg-light rounded-3 text-center">
                <div className="m-4 m-lg-5">
                  <h1 className="display-5 fw-bold">There's no other zombies around!</h1>
                  <p className="fs-4">Looks like we're the only ones here. Invite other users to play.</p>
                </div>
              </div>
            </Container>
            :
            <Row className="gx-4 gx-lg-5 row-cols-2 row-cols-md-3 row-cols-xl-4">
              {enemyZombies.map((zombie: IZombie, index) => (
                <Col className="mb-5" md={4} key={index}>
                  <ZombieCard zombie={zombie}>
                    {zombie.isReady ?
                      <Button
                        disabled={!zombie.isReady || isAttacking}
                        variant="danger"
                        onClick={() => { fightZombie(zombie.id) }}>
                        {isAttacking && <Spinner className="mx-1" size="sm" animation="border" />}
                        FIGHT!
                      </Button>
                      :
                      <Button title="this zombie is tired" disabled={true} variant="danger">
                        FIGHT!
                      </Button>
                    }
                  </ZombieCard>
                </Col>
              ))}
            </Row>
          }
        </Container>
      </section>

      <ToastContainer position="bottom-center">
        <Toast
          autohide={true}
          show={toastStatus.show}
          onClose={onToastClose}
          className="d-inline-block m-2"
          bg={toastStatus.type}>
          <Toast.Body className="text-center fs-4">
            {toastStatus.message}
          </Toast.Body>
        </Toast>
      </ToastContainer>

      <OverlaySpinner show={isRetrievingZombies} />
    </>
  );
};

export default Fight;
