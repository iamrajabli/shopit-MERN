import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../redux/actions/product.actions';
import MetaData from './layout/MetaData'
import Product from './product/Product';
import Loader from './layout/Loader';
import { useAlert } from 'react-alert';
import Pagination from "react-js-pagination";
import { useNavigate, useParams } from 'react-router-dom';
import Slider from '@mui/material/Slider';

const Home = () => {

    const dispatch = useDispatch()
    const alert = useAlert()

    const {
        products,
        productsCount,
        resPerPage,
        error,
        loading,
        filteredProductsCount } = useSelector(state => state.products)

    const { keyword } = useParams()
    const [currentPage, setCurrentPage] = useState(1)
    const [price, setPrice] = useState([0, 1000])
    const [category, setCategory] = useState('')
    const [rating, setRating] = useState(0)



    const categories = [
        'All',
        'Electronics',
        'Cameras',
        'Laptops',
        'Accessories',
        'Headphones',
        'Food',
        "Books",
        'Clothes/Shoes',
        'Beauty/Health',
        'Sports',
        'Outdoor',
        'Home'
    ]


    useEffect(() => {

        if (error) {
            return alert.error(error)
        }

        dispatch(getProducts(currentPage, keyword, price, category, rating))

    }, [dispatch,
        error,
        alert,
        currentPage,
        keyword,
        price,
        category,
        rating])

    const setCurrentPageNo = (page) => {
        setCurrentPage(page)
    }

    const setRangeValue = (event, value) => {
        setPrice(value)
    }

    const resetFilters = () => {
        setCurrentPage('')
        setPrice([0, 1000])
        setCategory('')
        setRating(0)
        setCurrentPage(1)
    }


    return (
        <>
            <MetaData title={'Buy Best Products Online'} />

            <h1 id='products_heading'>Latest Products</h1>

            <section id="products" className="container mt-5">
                <div className="row">
                    <div className='col-12 col-md-3 mt-3'>
                        <div className="price">
                            <h2>Price</h2>
                            <Slider
                                value={price}
                                onChange={setRangeValue}
                                min={0}
                                max={1000}
                                valueLabelDisplay="auto"
                            />
                        </div>

                        <div className="category mt-5">
                            <h2>Categories</h2>

                            <ul className='p-0'>
                                {categories.map(category => (
                                    <li
                                        style={{ cursor: 'pointer', listStyleType: 'none' }}
                                        key={category}
                                        onClick={() => category === 'All' ? setCategory('') : setCategory(category)}>
                                        {category}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="ratings mt-5">
                            <h2>Ratings</h2>

                            <ul className='p-0'>
                                {[5, 4, 3, 2, 1].map(star => (
                                    <li
                                        onClick={() => setRating(star)}
                                        style={{ cursor: 'pointer', listStyleType: 'none' }}
                                        key={star}>
                                        <div className="rating-outer">
                                            <div
                                                className="rating-inner"
                                                style={{ width: `${star * 20}%` }}></div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="category mt-5">
                            <button
                                onClick={resetFilters}
                                className='btn btn-warning'>
                                Reset
                            </button>
                        </div>
                    </div>
                    {loading ? <Loader /> :
                        <div className="col-9">
                            <div className="row">
                                {products && products.map(product => (
                                    <Product key={product._id} product={product} />
                                ))}
                            </div>
                        </div>
                    }
                </div>
            </section>
            {filteredProductsCount > resPerPage &&
                <div className="d-flex justify-content-center mt-5">
                    <Pagination
                        activePage={currentPage}
                        totalItemsCount={productsCount}
                        itemsCountPerPage={resPerPage}
                        onChange={setCurrentPageNo}
                        nextPageText={'Next'}
                        prevPageText={'Previous'}
                        firstPageText={'First'}
                        lastPageText={'Last'}
                        itemClass='page-item'
                        linkClass='page-link'
                    />
                </div>
            }
        </>
    );
};

export default Home;