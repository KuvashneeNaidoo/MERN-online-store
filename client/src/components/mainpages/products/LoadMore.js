import React, { useContext } from 'react';
import { GlobalState } from '../../../GlobalState';

// Created states within the LoadMore function
function LoadMore() {
  const state = useContext(GlobalState);
  const [page, setPage] = state.productsAPI.page;
  const [result] = state.productsAPI.result;

  /* The Load More button will appear when the page displays 8 or less products. */
  return (
    <div className="load_more">
      {result < page * 8 ? (
        ''
      ) : (
        <button onClick={() => setPage(page + 1)}>Load more</button>
      )}
    </div>
  );
}

/* We export the 'LoadMore' component in order to display this code in App.js. */
export default LoadMore;
