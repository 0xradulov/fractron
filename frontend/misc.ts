export const trimAddress = (address: string) => {
  return address.slice(0, 10) + '...' + address.slice(30, address.length);
};

export const wl: { [key: string]: any } = {
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
  mooncatz: {
    name: 'Tron Moon Catz',
    address: 'TLHjJLASw223bG6FNGjfzBJmeWeVMb7Li7',
    baseURI: '',
    endURI: '',
    ipfsImage: false,
  },
  tronbullclub: {
    name: 'Tron Bull Club',
    address: '',
    baseURI:
      'https://ipfs.io/ipfs/QmVEWNACYMp9DKMZWvYBXdQWVt9UjgFFtiLuyj1ibFgy5R/',
    endURI: '.json',
    ipfsImage: true,
  },
  tronninjas: {
    name: 'Tron Ninjas',
    address: 'TERdH6zm9eqGjDST9GXJ37qVBoutpJuUzV',
    baseURI: 'https://tronninjas.com/api/TNinjas?id=',
    endURI: '',
    ipfsImage: false,
  },
};
