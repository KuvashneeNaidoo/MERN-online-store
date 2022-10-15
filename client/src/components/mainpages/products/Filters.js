import React, { useContext } from 'react';
import { GlobalState } from '../../../GlobalState';

// Created states within the Filters function
function Filters() {
  const state = useContext(GlobalState);
  const [categories] = state.categoriesAPI.categories;
  const [category, setCategory] = state.productsAPI.category;
  const [sort, setSort] = state.productsAPI.sort;
  const [search, setSearch] = state.productsAPI.search;

  /* Create the handleCategory in order to update the category state variable */
  const handleCategory = (e) => {
    setCategory(e.target.value);
    setSearch('');
  };

  // The structure of the Filter menu is displayed below based on the functions we coded.
  return (
    <div className="filter_menu">
      <div className="row">
        <span className="sortAndFilterHeadings">Filters: </span>
        <select name="category" value={category} onChange={handleCategory}>
          <option value="">All Products</option>
          {categories.map((category) => (
            <option value={'category=' + category._id} key={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <input
        type="text"
        value={search}
        placeholder="Enter your search criteria"
        onChange={(e) => setSearch(e.target.value.toLowerCase())}
        className="searchInputFilter"
      />

      <div className="row sort">
        <span className="sortAndFilterHeadings">Sort By: </span>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="selectFilterComponent"
        >
          <option value="">Newest</option>
          <option value="sort=oldest">Oldest</option>
          <option value="sort=-price">Price: High-Low</option>
          <option value="sort=price">Price: Low-High</option>
        </select>
      </div>
    </div>
  );
}

/* We export the 'Filters' component in order to display this code in App.js. */
export default Filters;
