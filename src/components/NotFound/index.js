import {Link} from 'react-router-dom'
import './index.css'

const NotFound = () => (
  <div className="notFoundContainer">
    <img
      src="https://res.cloudinary.com/r947j17/image/upload/v1645428761/Page-Not-Found_hvcpgt.png"
      alt="page not found"
      className="not-found-img"
    />
    <h1 className="not-Found-heading">Page Not Found</h1>
    <p className="Not-Found-reason">
      we are sorry, the page you requested could not be found.Please go back to
      the homepage.
    </p>
    <Link to="/" className="nav-link">
      <button type="button" className="homepage-btn">
        Home Page
      </button>
    </Link>
  </div>
)

export default NotFound
