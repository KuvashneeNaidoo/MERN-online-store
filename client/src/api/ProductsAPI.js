import { useState, useEffect } from 'react';
import axios from 'axios';

/* Within our ProductsAPI, we will begin by creating some states to store our products in for this 
application. The states of the inital values for the products, category, sorting and search requests will be empty 
since the values will always be changing.  The page however will always be reset to 1 whereas the result will always 
display from 0. We use the useState hook to declare our variables. This will help to preserve our values each time it 
is called. We will update the state with a callback.*/
function ProductsAPI() {
  const [products, setProducts] = useState([]);
  const [callback, setCallback] = useState(false);
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [result, setResult] = useState(0);

  /**
   * We will use the useEffect hook to fetch our data.
   * Axios will make a GET request to the API.
   * This will help us to get our products from port number 8080 which is then stored in our database.
   * The number of products to be displayed on the page is limited to 8.
   * The getCategories() function will then be called and set.
   * Next, we can return the states to be used in other components.
   */
  useEffect(() => {
    const getProducts = async () => {
      const res = await axios.get(
        `/api/products?limit=${
          page * 8
        }&${category}&${sort}&title[regex]=${search}`
      );
      setProducts(res.data.products);
      setResult(res.data.result);
    };
    getProducts();
  }, [callback, category, sort, search, page]);

  return {
    products: [products, setProducts],
    callback: [callback, setCallback],
    category: [category, setCategory],
    sort: [sort, setSort],
    search: [search, setSearch],
    page: [page, setPage],
    result: [result, setResult],
  };
}

/* We export ProductsAPI to be used in other components for the application to function. */
export default ProductsAPI;
