import { Link, useNavigate } from "react-router-dom";
import Search from "./Search";
import { useSelector, useDispatch } from "react-redux";
import { useAlert } from "react-alert";
import { logout } from "../../redux/actions/user.actions";

const Header = () => {
    const navigate = useNavigate()

    const alert = useAlert()
    const dispatch = useDispatch()


    const { user } = useSelector(state => state.auth)


    const logoutHandler = () => {
        dispatch(logout());
        alert.success('Logged out successfuly.');
    }

    return (
        <>
            <nav className="navbar row">
                <div className="col-12 col-md-3">
                    <div className="navbar-brand">
                        <Link to="/">
                            <img src="/images/shopit_logo.png" alt='logo' />
                        </Link>
                    </div>
                </div>

                <div className="col-12 col-md-6 mt-2 mt-md-0">
                    <Search navigate={navigate} />
                </div>

                <div className="col-12 col-md-3 mt-4 mt-md-0 text-center">

                    <Link to='/cart' style={{ textDecoration: 'none' }}>
                        <span id="cart" className="ml-3">Cart</span>
                    </Link>

                    <span className="ml-1" id="cart_count">2</span>



                    {user ? (
                        <div className="ml-4 dropdown d-inline">
                            <Link to='/me'
                                className="btn btn-dropdown-toggle text-white"
                                type="button" id="dropDownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">

                                <figure className="avatar avatar-nav">
                                    <img
                                        src={user.avatar && user.avatar.url}
                                        alt={user && user.name}
                                        className="rounded-circle"
                                    />
                                </figure>
                                <span>{user && user.name}</span>
                            </Link>

                            <div className="dropdown-menu" aria-labelledby="dropDownMenuButton">
                                {user && user.roles !== 'admin' ? (
                                    <Link className="dropdown-item text-danger" to='/orders'>
                                        Orders
                                    </Link>
                                ) : (
                                    <Link className="dropdown-item text-danger" to='/dashboard'>
                                        Dashboard
                                    </Link>
                                )}
                                <Link className="dropdown-item text-danger" to='/me'>
                                    Profile
                                </Link>
                                <Link className="dropdown-item text-danger" to='/' onClick={logoutHandler}>
                                    Logout
                                </Link>
                            </div>
                        </div>
                    ) : <Link to={'/login'} className="btn ml-4" id="login_btn">Login</Link>}

                </div>
            </nav>
        </>
    );
};

export default Header;