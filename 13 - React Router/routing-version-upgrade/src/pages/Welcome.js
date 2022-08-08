import { Link, Outlet, Route, Routes } from 'react-router-dom';

const Welcome = () => {
    return (
        <section>
            <h1>The Welcome Page</h1>
            {
                // <Route path='/welcome/new-user'>
                //     <p>Welcome, new user.</p>
                // </Route>
            }
            <Link to='./new-user'>New User</Link>
            {
                // <Routes>
                //     <Route path='/new-user' element={<p>Welcome, new user.</p>} />
                // </Routes>
            }
            <Outlet />
        </section>
    );
};

export default Welcome;
