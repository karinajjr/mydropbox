import React from "react"
import { AuthProvider } from "./components/contexts/AuthContext"
import { BrowserRouter as Router, Route } from "react-router-dom"
import Login from "./components/authentecation/Login"
import PrivateRoute from "./components/authentecation/PrivateRoute"
import ForgotPassword from "./components/authentecation/ForgotPassword"
import UpdateProfile from "./components/authentecation/UpdateProfile"
import Signup from "./components/authentecation/Signup"
import Dashbord from "./drive/Dashbord" 
import 'bootstrap/dist/css/bootstrap.css'
import Profile from "./components/authentecation/Profile"

function App() {
  return (

        <Router>
          <AuthProvider>
            {/* <Switch> */}
            {/* drive */}
             <PrivateRoute exact path="/" component={Dashbord}/>
             <PrivateRoute exact path="/folder/:folderId" component={Dashbord}/>
              {/* profile */}
              <PrivateRoute exact path="/user" component={Profile} />
              <PrivateRoute path="/update-profile" component={UpdateProfile} />

               {/* auth */}
              <Route path="/signup" component={Signup} />
              <Route path="/login" component={Login} />
              <Route path="/forgot-password" component={ForgotPassword} />
            {/* </Switch> */}
          </AuthProvider>
        </Router>
  )
}

export default App 
