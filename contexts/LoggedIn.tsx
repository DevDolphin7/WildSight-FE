import { createContext, useState } from "react";

export const LoggedInContext = createContext<any>({});

export const LoggedInProvider = ({ children }: any) => {
  const [loggedIn, setLoggedIn] = useState(null);

  return (
    <LoggedInContext.Provider value={{ loggedIn, setLoggedIn }}>
      {children}
    </LoggedInContext.Provider>
  );
};
