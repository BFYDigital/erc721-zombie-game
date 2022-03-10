import { useContext, useEffect, useState } from 'react';
import { useRoutes } from 'react-router-dom';
import { Button, Container, Spinner } from 'react-bootstrap';
import detectEthereumProvider from '@metamask/detect-provider';
import { AppContext } from '../context';
import { AbiItem } from 'web3-utils';
import FeedingZombie from '../contracts/FeedingZombie.json';
import routes from '../router';
import Web3 from "web3";

const ConnectAccount = () => {

  const { dapp } = useContext(AppContext);

  const content = useRoutes(routes);

  const [message, setMessage] = useState<string>('loading...');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [canConnect, setCanConnect] = useState<boolean>(false);
  const [isInitialised, setIsInitialised] = useState<boolean>(false);

  useEffect(() => {

    const init = async () => {
      const provider = await detectEthereumProvider();
      if (!provider) {
        setMessage('Wallet provider not detected. Please install MetaMask.');
        return;
      }

      if (provider !== window.ethereum) {
        setMessage('Please ensure that you do not have multiple wallets installed.');
        return;
      }

      const ethereum = (window as any).ethereum;

      if (ethereum) {
        const web3 = new Web3(ethereum);
        ethereum.on('chainChanged', () => window.location.reload());
        ethereum.on('accountsChanged', () => {
          window.location.reload();
          console.log('accounts changed');
        });

        const accounts = await web3.eth.getAccounts();
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = (FeedingZombie.networks as any)[networkId];

        const contract = new web3.eth.Contract(
          FeedingZombie.abi as AbiItem[],
          deployedNetwork?.address,
        );

        // set accounts
        dapp.setAccounts(accounts);
        // set attack zombie contract
        dapp.setZombieContract(contract);

        setIsInitialised(true);
        setMessage('Click the connect button to get started.');
        setCanConnect(true);
        connect();
      }
    };
    init();
  }, []);

  const handleAccountsChanged = (accounts: Array<string>) =>
    setIsConnected((accounts.length === 0) ? false : true);

  const connect = () => {
    const ethereum = (window as any).ethereum;
    setIsConnecting(true);

    ethereum
      .request({ method: 'eth_requestAccounts' })
      .then(handleAccountsChanged)
      .catch((err: any) => {
        console.log(err);
        if (err.code === 4001) {
          setMessage('Click the connect button to get started.');
          setIsConnecting(false);
        }
        else if (err.code === -32002) {
          setMessage('Connection request send. Check Metamask');
        }
        else {
          console.error(err);
          setIsConnecting(false);
        }
      });
  };

  return (
    <>
      {
        isConnected
          ?
          <AppContext.Provider value={{ dapp }}>
            {isInitialised && content}
          </AppContext.Provider >
          :
          <Container className="px-4 px-lg-5 my-5">
            <div className="p-4 p-lg-5 bg-light rounded-3 text-center">
              <div className="m-4 m-lg-5">
                <p className="fs-4">{message}</p>
                <Button
                  variant="dark"
                  size="lg"
                  className="mb-0"
                  disabled={isConnecting || !canConnect}
                  onClick={!isConnecting ? connect : undefined}>
                  {isConnecting && <Spinner className="mx-1" size="sm" animation="border" />}
                  {isConnecting ? 'Connecting' : 'Connect'}
                </Button>
              </div>
            </div>
          </Container>
      }</>
  );
};

export default ConnectAccount;
