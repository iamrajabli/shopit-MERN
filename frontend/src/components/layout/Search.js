import { useState } from 'react';

const Search = ({ navigate }) => {

    const [keyword, setKeyword] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()

        if (keyword) {
            navigate(`/search/${keyword}`)
        } else {
            navigate('')
        }

    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <input
                        onChange={e => setKeyword(e.target.value)}
                        type="text"
                        id="search_field"
                        className="form-control"
                        placeholder="Enter Product Name ..."
                    />
                    <div className="input-group-append">
                        <button id="search_btn" className="btn">
                            <i className="fa fa-search" aria-hidden="true"></i>
                        </button>
                    </div>
                </div>
            </form>
        </>
    );
};

export default Search;