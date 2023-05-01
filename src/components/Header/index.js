import {Component} from 'react'
import Cookies from 'js-cookie'
import {Link, withRouter} from 'react-router-dom'
import {IoIosCloseCircle} from 'react-icons/io'
import {GiHamburgerMenu} from 'react-icons/gi'
import {FaSearch} from 'react-icons/fa'
import './index.css'

class Header extends Component {
  state = {
    IconClicked: false,
    searchInput: '',
  }

  getColor = curr => {
    const {history} = this.props
    if (history.location.pathname === curr) {
      return '#0b69ff'
    }
    return '#262626'
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onClickSearchIcon = () => {
    const {searchInput} = this.state
    const {onSearchCaption} = this.props
    onSearchCaption(searchInput)
  }

  onClickLogout = () => {
    Cookies.remove('jwt_token')
    const {history} = this.props
    history.replace('/login')
  }

  onClickToggleButton = () =>
    this.setState(prevState => ({IconClicked: !prevState.IconClicked}))

  renderMobileViewLinksContainer = () => (
    <div className="links-content">
      <ul className="nav-link-container">
        <li className="nav-menu-item">
          <Link to="/" className="nav-link" style={{color: this.getColor('/')}}>
            Home
          </Link>
        </li>
        <li className="nav-menu-item">
          <button type="button" className="mobile-search-btn">
            Search
          </button>
        </li>
        <li className="nav-menu-item">
          <Link
            to="/my-profile"
            className="nav-link"
            style={{color: this.getColor('/my-profile')}}
          >
            Profile
          </Link>
        </li>
      </ul>
      <button type="button" className="logout-btn" onClick={this.onClickLogout}>
        Logout
      </button>

      <button className="close-btn" type="button">
        <IoIosCloseCircle
          className="closeIcon"
          onClick={this.onClickToggleButton}
        />
      </button>
    </div>
  )

  renderSearchInput = () => {
    const {searchInput} = this.state
    return (
      <div className="search-input-container">
        <input
          value={searchInput}
          type="search"
          className="search-input"
          placeholder="Search Caption"
          onChange={this.onChangeSearchInput}
        />
        <button
          type="button"
          className="desktop-search-button"
          onClick={this.onClickSearchIcon}
        >
          <FaSearch className="search-icon" />
        </button>
      </div>
    )
  }

  render() {
    const {IconClicked} = this.state
    return (
      <>
        <nav className="header-section">
          <div className="mobileView">
            <div className="icon-Links-container">
              <div className="logo-name-container">
                <Link to="/" className="nav-link">
                  <img
                    src="https://res.cloudinary.com/r947j17/image/upload/v1645429333/logo-img_fwln5f.png"
                    alt="website logo"
                    className="website-log"
                  />
                </Link>
                <h1 className="logo-name">Insta Share</h1>
              </div>

              <div className="mobile-view-container">
                <button
                  type="button"
                  className="menu-button"
                  onClick={this.onClickToggleButton}
                >
                  <GiHamburgerMenu className="menu-icon" />
                </button>
              </div>
            </div>
            {IconClicked && this.renderMobileViewLinksContainer()}
          </div>
          <div className="desktopView">
            <div className="logo-name-container">
              <Link to="/" className="nav-link">
                <img
                  src="https://res.cloudinary.com/r947j17/image/upload/v1645429333/logo-img_fwln5f.png"
                  alt="website logo"
                  className="website-log"
                />
              </Link>
              <h1 className="logo-name">Insta Share</h1>
            </div>
            <div className="desktop-links-content">
              <ul className="desktop-links-container">
                <li className="nav-menu-item">{this.renderSearchInput()}</li>
                <li className="nav-menu-item">
                  <Link
                    to="/"
                    className="nav-link"
                    style={{color: this.getColor('/')}}
                  >
                    Home
                  </Link>
                </li>
                <li className="nav-menu-item">
                  <Link
                    to="/my-profile"
                    className="nav-link"
                    style={{color: this.getColor('/my-profile')}}
                  >
                    Profile
                  </Link>
                </li>
              </ul>
              <button
                type="button"
                className="logout-btn"
                onClick={this.onClickLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </nav>
      </>
    )
  }
}

export default withRouter(Header)
