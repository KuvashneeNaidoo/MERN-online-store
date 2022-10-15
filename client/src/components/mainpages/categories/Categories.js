import React, { useState, useContext } from 'react';
import { GlobalState } from '../../../GlobalState';
import axios from 'axios';
import './categories.css';

// Created states within the Categories function
function Categories() {
  const state = useContext(GlobalState);
  const [categories] = state.categoriesAPI.categories;
  const [category, setCategory] = useState('');
  const [token] = state.token;
  const [callback, setCallback] = state.categoriesAPI.callback;
  const [onEdit, setOnEdit] = useState(false);
  const [id, setID] = useState('');

  /**
   * A productCategoryCreation function is created to handle the creation of categories.
   * If the onEdit variable is true, a PUT request is made to the API to modify/edit the category names.
   * An authorization token is passed in the header to protect user information.
   * If the onEdit variable is false, a POST request is made to the API to create a new category.
   */
  const productCategoryCreation = async (e) => {
    e.preventDefault();
    try {
      if (onEdit) {
        const res = await axios.put(
          `/api/category/${id}`,
          { name: category },
          {
            headers: { Authorization: token },
          }
        );
        alert(res.data.msg);
      } else {
        const res = await axios.post(
          '/api/category',
          { name: category },
          {
            headers: { Authorization: token },
          }
        );
        alert(res.data.msg);
      }
      setOnEdit(false);
      setCategory('');
      setCallback(!callback);
    } catch (error) {
      alert(error.response.data.msg);
    }
  };

  /* Created the productCategoryUpdate function to handle the product category category of which the values will be 
  set once it is passed. */
  const productCategoryUpdate = async (id, name) => {
    setID(id);
    setCategory(name);
    setOnEdit(true);
  };

  /**
   * A productCategoryRemoval function is created to handle the removal of categories.
   * A DELETE request is made to the API using the id variable to delete a specific category.
   * An authorization token is passed in the header to protect user information.
   */
  const productCategoryRemoval = async (id) => {
    try {
      const res = await axios.delete(`/api/category/${id}`, {
        headers: { Authorization: token },
      });
      alert(res.data.msg);
      setCallback(!callback);
    } catch (error) {
      alert(error.response.data.msg);
    }
  };

  // The structure of the categories page is displayed below in a form based on the functions we coded.
  return (
    <div className="categories">
      <form onSubmit={productCategoryCreation}>
        <label htmlFor="category">Product categories</label>
        <input
          type="text"
          name="category"
          value={category}
          required
          onChange={(e) => setCategory(e.target.value)}
        />
        <button type="submit">{onEdit ? 'Update' : 'Create'}</button>
      </form>

      <div className="col">
        {categories.map((category) => (
          <div className="row" key={category._id}>
            <p>{category.name}</p>
            <div>
              <button
                onClick={() =>
                  productCategoryUpdate(category._id, category.name)
                }
              >
                Edit
              </button>
              <button onClick={() => productCategoryRemoval(category._id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* We export the 'Categories' component in order to display this code in App.js. */
export default Categories;
