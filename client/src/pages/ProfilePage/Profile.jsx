import React from 'react';
import Footer from "../../components/shared/Footer";
import Navbar from "../../components/shared/navbar-components/Navbar";
import ProfilePage from './ProfilePage';

const Profile = () => {
    return (
        <div >
            <section className="sticky top-0 z-50">
            <Navbar/>
            </section>
            <section className=" min-h-[80vh]">
            <ProfilePage/>           
            </section>
            <section>
            <Footer/>           
            </section>
            
        </div>
    );
};

export default Profile;