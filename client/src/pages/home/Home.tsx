import Web3 from 'web3';
import { Link } from 'react-router-dom';
import { IToastStatus, IZombie } from '../../interfaces';
import { AppContext } from '../../context';
import React, { useState, useEffect, useContext } from 'react';
import { OverlaySpinner, ZombieCard } from '../../components/ui';
import { Button, Col, Container, Dropdown, Form, Row, Spinner, Toast, ToastContainer } from 'react-bootstrap';

const Home = () => {

  const { dapp } = useContext(AppContext);

  const [zombieName, setZombieName] = useState<string>('');
  const [userZombies, setUserZombies] = useState<Array<IZombie>>([]);
  const [mintingZombie, setMintingZombie] = useState<boolean>(false);
  const [feedingZombie, setFeedingZombie] = useState<boolean>(false);
  const [currentAccount, setCurrentAccount] = useState<string>('0xc');
  const [isRestingZombie, setIsRestingZombie] = useState<boolean>(false);
  const [levelingUpZombie, setLevelingUpZombie] = useState<boolean>(false);
  const [isRetrievingZombies, setIsRetrievingZombies] = useState<boolean>(false);
  const [isMakingZombieHungry, setIsMakingZombieHungry] = useState<boolean>(false);
  const [toastStatus, setToastStatus] = useState<IToastStatus>({ message: '', type: 'success', show: false });

  useEffect(() => {
    setCurrentAccount(dapp.accounts[0]);
  }, [dapp.accounts]);

  useEffect(() => {
    const componentInit = async () => {
      let active = true;
      if (active === true &&
        mintingZombie === false &&
        levelingUpZombie === false &&
        feedingZombie === false &&
        isRestingZombie === false &&
        isMakingZombieHungry === false) {
        retrieveUserZombies();
      }

      return () => {
        active = false;
      };
    };
    componentInit();
  }, [mintingZombie, levelingUpZombie, feedingZombie, isRestingZombie, isMakingZombieHungry]);

  const retrieveUserZombies = async () => {
    setIsRetrievingZombies(true);

    let zombies: Array<IZombie> = [];
    let zombieIds: Array<string> = await dapp.zombieContract?.methods
      .getUserOwnedTokenIds(dapp.accounts[0]).call({ from: dapp.accounts[0] });

    if (zombieIds !== null) {
      for (let i = 0; i < zombieIds.length; i++) {
        let currentTimestamp = Math.floor(new Date().getTime() / 1000);
        let parsedId = parseInt(zombieIds[i]);
        let result = await dapp.zombieContract?.methods.zombies(parsedId).call();
        let isReady = await dapp.zombieContract?.methods.isReady(parsedId, currentTimestamp).call();
        let hungerLevel = await dapp.zombieContract?.methods.getHungerLevel(parsedId, currentTimestamp).call();

        let zombie: IZombie = {
          id: parsedId,
          cooldownTime: parseInt(result.cooldownTime),
          dna: parseInt(result.dna),
          name: result.name,
          level: parseInt(result.level),
          lossCount: parseInt(result.lossCount),
          winCount: parseInt(result.winCount),
          isReady: isReady,
          hungerLevel: parseInt(hungerLevel)
        };
        zombies.push(zombie);
      }
    }

    setUserZombies(zombies);
    setIsRetrievingZombies(false);
  };

  const mintZombie: React.MouseEventHandler<HTMLButtonElement> = () => {
    if (!zombieName || zombieName === '') {
      showToastMessage('please give your zombie a name', 'warning');
      return;
    }

    setMintingZombie(true);
    dapp.zombieContract?.methods.mint(zombieName).send({ from: dapp.accounts[0] })
      .then(() => {
        showToastMessage(`A zombie called "${zombieName}" successfully created`, 'success');
        setZombieName('');
      })
      .catch((err: Error) => {
        console.log(err);
        showToastMessage(`Failed to create "${zombieName}"`, 'danger');
      })
      .finally(() => setMintingZombie(false));
  };

  const showToastMessage = (msg: string, msgType: string): void => {
    setToastStatus({ message: msg, type: msgType, show: true });
  };

  const onToastClose = (): void => {
    setToastStatus({ ...toastStatus, show: false });
  };

  const handleZombieNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setZombieName(event.target.value);
  };

  const levelUpZombie = (zombieId: number): void => {
    setLevelingUpZombie(true);
    let value = Web3.utils.toWei('0.15', 'ether');
    dapp.zombieContract?.methods.levelUp(zombieId)
      .send({ from: dapp.accounts[0], value: value })
      .then(() => {
        showToastMessage('Zombie successfully leveled up!', 'success');
      })
      .catch((err: Error) => {
        console.log(err);
        showToastMessage('Failed to levelup zombie', 'danger');
      })
      .finally(() => setLevelingUpZombie(false));
  };

  const feedZombie = (zombieId: number): void => {
    setFeedingZombie(true);
    dapp.zombieContract?.methods.feed(zombieId)
      .send({ from: dapp.accounts[0] })
      .then(() => {
        showToastMessage('Yummy! This zombie has been fed. Energy restored', 'success');
      })
      .catch((err: Error) => {
        console.log(err);
        showToastMessage('Failed to feed zombie', 'danger');
      })
      .finally(() => {
        setFeedingZombie(false);
      });
  };

  const restZombie = (zombieId: number): void => {
    setIsRestingZombie(true);
    dapp.zombieContract?.methods.restZombie(zombieId)
      .send({ from: dapp.accounts[0] })
      .then(() => {
        showToastMessage('This zombie is now rested', 'success');
      })
      .catch((err: Error) => {
        console.log(err);
        showToastMessage('Failed to rest zombie', 'danger');
      })
      .finally(() => {
        setIsRestingZombie(false);
      });
  };

  const makeZombieHungry = (zombieId: number): void => {
    setIsMakingZombieHungry(true);
    dapp.zombieContract?.methods.makeZombieHungry(zombieId)
      .send({ from: dapp.accounts[0] })
      .then(() => {
        showToastMessage('This zombie is now a bit more hungry', 'success');
      })
      .catch((err: Error) => {
        console.log(err);
        showToastMessage('Failed to make zombie hungry', 'danger');
      })
      .finally(() => {
        setIsMakingZombieHungry(false);
      });
  };

  return (
    <>
      {userZombies.length !== 0 &&
        <header className="bg-dark py-3">
          <Container className="px-2 px-lg-3 my-3">
            <div className="text-center text-white">
              <h1 className="display-6 fw-bolder">{currentAccount}'s zombies</h1>
              <p className="lead fw-normal text-white-50">view all your zombies, or click the button to create one</p>
              <Form.Group className="mb-3">
                <Form.Label>Zombie Name</Form.Label>
                <Form.Control
                  className="w-50 m-auto"
                  disabled={mintingZombie}
                  value={zombieName}
                  onChange={handleZombieNameChange}
                  type="text"
                  placeholder="Zombie name" />
                <Form.Text className="text-muted mb-1">
                  The zombie name needs to be unique
                </Form.Text>
              </Form.Group>
              <Button
                className="mb-0"
                disabled={mintingZombie}
                onClick={!mintingZombie ? mintZombie : undefined}>
                {mintingZombie ? <><Spinner className="mx-1" size="sm" animation="border" />creating...</> : 'Create Zombie'}
              </Button>
            </div>
          </Container>
        </header>
      }
      <section>
        <Container className="px-4 px-lg-5 my-5">
          {userZombies.length === 0
            ?
            <div>
              <div className="p-4 p-lg-5 bg-light rounded-3 text-center">
                <div className="m-4 m-lg-5">
                  <h1 className="display-5 fw-bold">A warm welcome!</h1>
                  <p className="fs-4">Looks like you don't have any zombies. Create one now!</p>
                  <Form.Group className="mb-3">
                    <Form.Label>Zombie Name</Form.Label>
                    <Form.Control
                      className="w-50 m-auto"
                      disabled={mintingZombie}
                      value={zombieName}
                      onChange={handleZombieNameChange}
                      type="text"
                      placeholder="Zombie name" />
                    <Form.Text className="text-muted mb-1">
                      The zombie name needs to be unique
                    </Form.Text>
                  </Form.Group>
                  <Button
                    variant="dark"
                    size="lg"
                    className="mb-0"
                    disabled={mintingZombie}
                    onClick={!mintingZombie ? mintZombie : undefined}>
                    {mintingZombie && <Spinner className="mx-1" size="sm" animation="border" />}
                    Create Zombie
                  </Button>
                </div>
              </div>
            </div>
            :
            <Row md={3} xl={4} className="gx-4 gx-lg-5">
              {userZombies.map((zombie: IZombie, index) => (
                <Col className="mb-2" key={index}>
                  <ZombieCard zombie={zombie}>
                    <div className="d-grid gap-2">
                      {zombie.isReady ?
                        <Link className='btn btn-primary' to={`fight/${zombie.id}`}>
                          GO FIGHT!
                        </Link>
                        :
                        <Button title="this zombie is tired" disabled={true} variant="primary">
                          GO FIGHT!
                        </Button>
                      }
                      <Button
                        disabled={levelingUpZombie || zombie.level >= 10}
                        variant="secondary"
                        onClick={() => {
                          if (!levelingUpZombie) {
                            levelUpZombie(zombie.id);
                          }
                        }}>
                        {levelingUpZombie && <Spinner className="mx-1" size="sm" animation="border" />}
                        {zombie.level >= 10 ? 'MAX LEVEL' : 'LEVEL UP'}
                      </Button>
                      <Button
                        disabled={feedingZombie}
                        variant="outline-danger"
                        onClick={() => {
                          if (!feedingZombie) {
                            feedZombie(zombie.id);
                          }
                        }}>
                        {feedingZombie && <Spinner className="mx-1" size="sm" animation="border" />}
                        FEED
                      </Button>
                      <Dropdown className="d-grid">
                        <Dropdown.Toggle variant="outline-secondary">
                          Dev Options
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item
                            onClick={() => {
                              if (!isRestingZombie) {
                                restZombie(zombie.id);
                              }
                            }}
                            disabled={isRestingZombie}>
                            {isRestingZombie && <Spinner className="mx-1" size="sm" animation="border" />}
                            Rest
                          </Dropdown.Item>
                          <Dropdown.Item
                            onClick={() => {
                              if (!isMakingZombieHungry) {
                                makeZombieHungry(zombie.id);
                              }
                            }}
                            disabled={isMakingZombieHungry}>
                            {isMakingZombieHungry && <Spinner className="mx-1" size="sm" animation="border" />}
                            Make Hungry
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
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
}

export default Home;
