import { createBrowserRouter } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import Exhibitions from './pages/Exhibitions'
import ExhibitionDetail from './pages/ExhibitionDetail'
import Collection from './pages/Collection'
import CollectionDetail from './pages/CollectionDetail'
import ArtworkDetail from './pages/ArtworkDetail'
import Visit from './pages/Visit'
import Booking from './pages/Booking'
import Login from './pages/Login'
import Profile from './pages/Profile'
import About from './pages/About'
import Contact from './pages/Contact'

export const myRouter = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true,                    element: <Home /> },
      { path: 'exhibitions',            element: <Exhibitions /> },
      { path: 'exhibitions/:id',        element: <ExhibitionDetail /> },
      { path: 'collection',             element: <Collection /> },
      { path: 'collection/:id',         element: <CollectionDetail /> },
      { path: 'artworks/:id',           element: <ArtworkDetail /> },
      { path: 'visit',                  element: <Visit /> },
      { path: 'booking',                element: <Booking /> },
      { path: 'login',                  element: <Login /> },
      { path: 'register',               element: <Login /> },
      { path: 'profile',                element: <Profile /> },
      { path: 'about',                  element: <About /> },
      { path: 'contact',                element: <Contact /> },
    ],
  },
])
