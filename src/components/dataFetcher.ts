import { unstable_createResource as createResource } from 'react-cache';

export const dataResource = createResource(() =>
  fetch('https://api.iextrading.com/1.0/stock/aapl/chart')
    .then(response => response.json())
    .then(console.log)
);
