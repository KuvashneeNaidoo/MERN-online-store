import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { GlobalState } from '../../../GlobalState';
import Loading from '../utils/loading/Loading';
import { useHistory, useParams } from 'react-router-dom';
import './createProducts.css';

// Created a variable to store product information in order for the administrator to create a new product.
const initialState = {
  product_id: '',
  title: '',
  price: 0,
  description:
    'Add this bright and comfortable clothing item to your new season wardrobe. This piece of clothing features a v-neck design with button detail.',
  content: 'This item is made up of 100% polyester.',
  category: '',
  _id: '',
};

// Created states within the CreateProduct function
function CreateProduct() {
  const state = useContext(GlobalState);
  const [product, setProduct] = useState(initialState);
  const [categories] = state.categoriesAPI.categories;
  const [images, setImages] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isAdmin] = state.userAPI.isAdmin;
  const [token] = state.token;
  const history = useHistory();
  const param = useParams();

  const [products] = state.productsAPI.products;
  const [onEdit, setOnEdit] = useState(false);
  const [callback, setCallback] = state.productsAPI.callback;

  /**
   * We use the useEffect hook to see if the param.id is true and has a value.
   * If the value exists, we update the onEdit variable.
   * We use the forEach loop to loop through the products array to determine if the product and param id match.
   * If matched, the product and image will be updated.
   */
  useEffect(() => {
    if (param.id) {
      setOnEdit(true);
      products.forEach((product) => {
        if (product._id === param.id) {
          setProduct(product);
          setImages(product.images);
        }
      });
    } else {
      setOnEdit(false);
      setProduct(initialState);
      setImages(false);
    }
  }, [param.id, products]);

  /**
   * A function is created in order to handle the user input.
   * We update the state by setting the product information based on the name and value of the item.
   * */
  const handleUserInput = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  /**
   * A product Upload Handler is created in order to upload the product image.
   * We check if the user is an admin or not. If the user is not an admin, a message will be returned.
   * To upload an image, the image must be in a jpeg or png format. If not, a message will be returned.
   * We will append the file and make an API call so the formData is uploaded successfully.
   * Lastly, we update the state of the product.
   * */
  const productUploadHandler = async (e) => {
    e.preventDefault();
    try {
      if (!isAdmin) return alert('Sorry! You are not an admin member.');
      const file = e.target.files[0];
      if (!file) return alert('File does not exist.');
      if (file.type !== 'image/jpeg' && file.type !== 'image/png')
        return alert(
          'The format of the file is incorrect. The format of the image must be in either png and jpeg.'
        );
      let formData = new FormData();
      formData.append('file', file);
      setLoading(true);
      const res = await axios.post('/api/upload', formData, {
        headers: {
          'content-type': 'multipart/form-data',
          Authorization: token,
        },
      });

      setLoading(false);
      setImages(res.data);
    } catch (error) {
      alert(error.response.data.msg);
    }
  };

  /**
   * A image Removal Handler is created in order to delete/remove the product image.
   * We check if the user is an admin or not. If the user is not an admin, a message will be returned.
   * To delete an image, a POST request is made which will identify the public_id key value in order to delete the image.
   * An authorization token is passed in the header to protect user information.
   * Lastly, we update the state of the product.
   */
  const imageRemovalHandler = async () => {
    try {
      if (!isAdmin) return alert('Sorry! You are not an admin member.');
      setLoading(true);
      await axios.post(
        '/api/destroy',
        { public_id: images.public_id },
        {
          headers: { Authorization: token },
        }
      );
      setLoading(false);
      setImages(false);
    } catch (error) {
      alert(error.response.data.msg);
    }
  };

  /**
   * A product Submission Handler is created in order to submit the product form.
   * We check if the user is an admin or not. If the user is not an admin, a message will be returned.
   * If the admin member does not upload an image upon submission, a message will be returned.
   * If the onEdit variable has a value/is true, a PUT request will be made to the API in order to update the form.
   * If the product's id is specified, the product information will be updated by using the product._id variable.
   * Else, the image variable which is stored in the products array will be passed.
   * An authorization token is passed in the header to protect user information.
   * We now update the state of the product.
   * Once the product has been created, the useHistory hook is used to redirect the user back to the home page.
   */
  const productSubmissionHandler = async (e) => {
    e.preventDefault();
    try {
      if (!isAdmin) return alert('Sorry! You are not an admin member.');
      if (!images)
        return alert(
          'Please upload an image of the product before creating a product.'
        );
      if (onEdit) {
        await axios.put(
          `/api/products/${product._id}`,
          { ...product, images },
          {
            headers: { Authorization: token },
          }
        );
      } else {
        await axios.post(
          '/api/products',
          { ...product, images },
          {
            headers: { Authorization: token },
          }
        );
      }

      setCallback(!callback);
      history.push('/');
    } catch (error) {
      alert(error.response.data.msg);
    }
  };

  /* A variable is created to store the style property for the uploaded image. */
  const uploadImageStyles = {
    display: images ? 'block' : 'none',
  };

  // The structure of the Create Products page is displayed below based on the functions we coded above.
  return (
    <div className="create_product">
      <div className="upload">
        <input
          type="file"
          name="file"
          id="file_up"
          onChange={productUploadHandler}
        />

        {loading ? (
          <div id="file_img" style={uploadImageStyles}>
            <Loading />
          </div>
        ) : (
          <div id="file_img" style={uploadImageStyles}>
            <img src={images ? images.url : ''} alt="" />
            <span onClick={imageRemovalHandler}>X</span>
          </div>
        )}
      </div>

      <form onSubmit={productSubmissionHandler}>
        <div className="row">
          <label htmlFor="product_id">Product ID:</label>
          <input
            type="text"
            name="product_id"
            id="product_id"
            required
            value={product.product_id}
            onChange={handleUserInput}
            disabled={onEdit}
          />
        </div>

        <div className="row">
          <label htmlFor="title">Product title:</label>
          <input
            type="text"
            name="title"
            id="title"
            required
            value={product.title}
            onChange={handleUserInput}
          />
        </div>

        <div className="row">
          <label htmlFor="price">Product price:</label>
          <input
            type="number"
            name="price"
            id="price"
            required
            value={product.price}
            onChange={handleUserInput}
          />
        </div>

        <div className="row">
          <label htmlFor="description">Product description:</label>
          <textarea
            type="text"
            name="description"
            id="description"
            required
            value={product.description}
            rows="5"
            onChange={handleUserInput}
          />
        </div>

        <div className="row">
          <label htmlFor="content">Product details:</label>
          <textarea
            type="text"
            name="content"
            id="content"
            required
            value={product.content}
            rows="7"
            onChange={handleUserInput}
          />
        </div>

        <div className="row">
          <label htmlFor="categories">Product categories: </label>
          <select
            name="category"
            value={product.category}
            onChange={handleUserInput}
          >
            <option value="">Please select a category</option>
            {categories.map((category) => (
              <option value={category._id} key={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">
          {onEdit ? 'Update Product' : 'Create Product'}
        </button>
      </form>
    </div>
  );
}

/* We export the 'CreateProduct' component in order to display this code in App.js. */
export default CreateProduct;
