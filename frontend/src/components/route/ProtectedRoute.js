import { useDispatch, useSelector } from "react-redux";

import { useEffect } from "react";
import { loadUser } from "../../redux/actions/user.actions";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const dispatch = useDispatch();
    const { isAuthenticaded, loading, user } = useSelector((state) => state.auth);

    useEffect(() => {
        if (!user) {
            dispatch(loadUser())
        }
    }, [isAuthenticaded, loading, dispatch, user])


    if (loading) return <h1>loading...</h1>

    if (!loading && isAuthenticaded) {
        if (!user) {
            return <Navigate to='/' />
        }

        return children
    } else {
        return <Navigate to={'/login'} />
    }
};

export default ProtectedRoute;