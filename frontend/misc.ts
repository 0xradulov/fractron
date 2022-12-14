import { testcollection, testcollection2 } from './addresses';

export const trimAddress = (address: string) => {
  return address.slice(0, 10) + '...' + address.slice(30, address.length);
};

export const indexToImageName = (i: number) => {
  // assumes that i < 1000
  let name = 'image_part_';
  if (i < 10) {
    name += `00${i}.jpg`;
  } else if (i < 100) {
    name += `0${i}.jpg`;
  } else {
    name += `${i}.jpg`;
  }

  return name;
};

export const wl: { [key: string]: any } = {
  mainnet: {
    bayctron: {
      name: 'BAYC TRON',
      address: 'TWi53fvZgTsW8tvAQmYVeThnBeyJqEfJhQ',
      baseURI: 'https://tronapes.com/api/v1/nft/ape/',
      endURI: '',
      ipfsImage: false,
    },
    mayctron: {
      name: 'MAYC TRON',
      address: 'TJjKSaj9UD9tQ27zvN6hpXiCwN2VsdNW7P',
      baseURI: 'https://tronapes.com/api/v1/nft/mutant/',
      endURI: '',
      ipfsImage: false,
    },
    coolcatstron: {
      name: 'Cool Cats Tron',
      address: 'TAf4C5L5hXDh4o3ZufeUni4LEQbH1LHrz7',
      baseURI: 'https://coolcatstron.com/cat/',
      endURI: '',
      ipfsImage: false,
    },
    metaversenameservice: {
      name: 'Metaverse Name Service',
      address: 'TYsma2okjEgeBgfS9xRL5uq4L5EzjokM9t',
      baseURI: 'https://api.mns.network/mns/metadata/',
      endURI: '',
      ipfsImage: false,
    },
  },
  shasta: {
    trontastybones: {
      name: 'Tron Tasty Bones',
      address: 'TCHRNBEF8WR7VprekUz1ZHx23pWN4QjUAC',
      baseURI: 'https://tb-api.tastybones.xyz/api/token/',
      endURI: '',
      ipfsImage: false,
    },
    troncryptocoven: {
      name: 'Tron Crypto Coven',
      address: 'TCHRNBEF8WR7VprekUz1ZHx23pWN4QjUAC',
      baseURI:
        'https://ipfs.io/ipfs/QmUf92JK7EUPX8VKhDvHrXDhuTmqy3scC8C5aLQp1HjXKy/',
      endURI: '.json',
      ipfsImage: false,
    },
    testcollection: {
      name: 'Test Collection',
      address: testcollection.shasta,
      baseURI: '',
      endURI: '',
      ipfsImage: false,
    },
    testcollection2: {
      name: 'Test Collection 2',
      address: testcollection2.shasta,
      baseURI: '',
      endURI: '',
      ipfsImage: false,
    },
  },
};
