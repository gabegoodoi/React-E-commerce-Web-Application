import React from "react";

const UserContext = React.createContext({
    user: {
        token: '',  // Only store the token for now
        isLoggedIn: false  // Flag to indicate if user is logged in
    },
    setUser: () => {}  // Function to update the user data in context
});

export default UserContext;
