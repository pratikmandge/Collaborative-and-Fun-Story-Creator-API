import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCurrentUser, logout } from '../features/auth/authSlice'
import { Link, useNavigate } from 'react-router-dom'
import '../css/header.css'

const Header = () => {
    const dispatch = useDispatch()
    const currentUser = useSelector((state) => state.auth.user)
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(fetchCurrentUser());
    }, [dispatch, currentUser]);

    const logoutUser = () => {
        dispatch(logout())
        navigate('/login');
    }

    return (
        <header>
            <Link to={"/"}>
                <img src="/story.jpeg" alt="story logo" />
            </Link>
            <h3>Fun Story Creator</h3>
            {currentUser ?
                <div>
                    <p>{currentUser}</p>
                    <button onClick={logoutUser} className="button logout">Logout</button>
                </div> :
                <div id='auth'>
                    <Link to={'/login'} className="button login">Login</Link>
                    <Link to={'/signup'} className="button Register">Signup</Link>
                </div>
            }
        </header>
    )
}

export default Header