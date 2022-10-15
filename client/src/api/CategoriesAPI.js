import { useState, useEffect } from 'react';
import axios from 'axios';

/* Within our CategoriesAPI, we will begin by creating some states to store our categories in for this 
application. The states of the inital values will be empty since the values will always be changing.  
We use the useState hook to declare our variables. This will help to preserve our values each time it is called. 
We will update the state with a callback.*/
function CategoriesAPI() {
  const [categories, setCategories] = useState([]);
  const [callback, setCallback] = useState(false);

  /**
   * We will use the useEffect hook to fetch our data.
   * Axios will make a GET request to the API.
   * This will help us to get our categories from port number 8080 "/category" which is then stored in our database.
   * The getCategories() function will then be called and set.
   * Next, we can return the state to be used in other components.
   */
  useEffect(() => {
    const getCategories = async () => {
      const res = await axios.get('/api/category');
      setCategories(res.data);
    };
    getCategories();
  }, [callback]);

  return {
    categories: [categories, setCategories],
    callback: [callback, setCallback],
  };
}

/* We export CategoriesAPI to be used in other components for the application to function. */
export default CategoriesAPI;
