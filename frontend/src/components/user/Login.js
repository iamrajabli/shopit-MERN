import { useSelector, useDispatch } from 'react-redux'
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import Loader from '../layout/Loader'
import MetaData from '../layout/MetaData'
import { useAlert } from 'react-alert'
import { login, clearErros } from '../../redux/actions/user.actions'

const Login = () => {


    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const alert = useAlert()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { isAuthenticaded, error, loading } = useSelector(state => state.auth)


    useEffect(() => {

        if (isAuthenticaded) {
            navigate('/')
        }
        if (error && !error.includes('Login first to access this resource')) {
            alert.error(error)
            dispatch(clearErros())
        }

    }, [dispatch, alert, isAuthenticaded, error, navigate])

    const handleSubmit = async (e) => {
        e.preventDefault()

        dispatch(login(email, password))
    }

    return (
        <>
            {loading ? <Loader /> : (
                <>
                    <MetaData title={'Login'} />


                    <div className="row wrapper">
                        <div className="col-10 col-lg-5">
                            <form
                                onSubmit={handleSubmit}
                                className="shadow-lg">
                                <h1 className="mb-3">Login</h1>
                                <div className="form-group">
                                    <label htmlFor="email_field">Email</label>
                                    <input
                                        onChange={(e) => setEmail(e.target.value)}
                                        value={email}
                                        type="email"
                                        id="email_field"
                                        className="form-control"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="password_field">Password</label>
                                    <input
                                        onChange={(e) => setPassword(e.target.value)}
                                        value={password}
                                        type="password"
                                        id="password_field"
                                        className="form-control"
                                    />
                                </div>

                                <Link to="/password/forgot" className="float-right mb-4">Forgot Password?</Link>

                                <button
                                    id="login_button"
                                    type="submit"
                                    className="btn btn-block py-3"
                                >
                                    LOGIN
                                </button>

                                <Link to="/register" className="float-right mt-3">New User?</Link>
                            </form>
                        </div>
                    </div>

                </>
            )}
        </>
    );
};

export default Login;