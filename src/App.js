import {Route, Switch, Redirect} from 'react-router-dom'

import Home from './components/Home'
import Profile from './components/Profile'
import LoginForm from './components/LoginForm'
import UserProfileDetails from './components/UserProfileDetails'
import ProtectedRoute from './components/ProtectedRoute'
import NotFound from './components/NotFound'
import './App.css'

const App = () => (
  <Switch>
    <Route exact path="/login" component={LoginForm} />
    <ProtectedRoute exact path="/" component={Home} />
    <ProtectedRoute exact path="/my-profile" component={Profile} />
    <ProtectedRoute
      exact
      path="/users/:userId"
      component={UserProfileDetails}
    />
    <Route path="/bad-path" component={NotFound} />
    <Redirect to="/bad-path" />
  </Switch>
)
export default App
