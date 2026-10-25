import React from "react";
import { RouterProvider } from "react-router-dom";
import { myRouter } from "./router";
import { AppProvider } from "./context/AppContext";

const App = () => {
  return (
    <AppProvider>
      <RouterProvider router={myRouter} />
    </AppProvider>
  );
};

export default App;
