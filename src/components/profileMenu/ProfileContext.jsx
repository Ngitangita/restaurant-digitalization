import React, { createContext, useState, useContext } from 'react';


const ProfileContext = createContext();


export function ProfileProvider({ children }) {
    const [profileImage, setProfileImage] = useState('../public/test.jpg');

    return (
        <ProfileContext.Provider value={{ profileImage, setProfileImage }}>
            {children}
        </ProfileContext.Provider>
    );
}
export function useProfile() {
    return useContext(ProfileContext);
}
