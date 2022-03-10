import { Contract } from 'web3-eth-contract';

interface IWebContext {
  zombieContract: Contract | null;
  accounts: Array<string>;
  setZombieContract(zombieContract: Contract | null): void;
  setAccounts(accounts: Array<string>): void;
}

export interface IDefaultContext {
  dapp: IWebContext;
}

const defaultContext: IDefaultContext = {
  dapp: {
    zombieContract: null,
    accounts: [],
    setZombieContract(zombieContract: Contract | null) {
      this.zombieContract = zombieContract;
    },
    setAccounts(accounts: Array<string>) {
      this.accounts = accounts;
    }
  }
};

export default defaultContext;
