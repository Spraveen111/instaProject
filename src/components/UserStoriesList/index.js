import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Slider from 'react-slick'

/* Add css to your project */
import './index.css'

const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 5,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1100,
      settings: {
        slidesToShow: 5,
        slidesToScroll: 1,
      },
    },

    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 5,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      },
    },
  ],
}

const apiUrlStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class UserStoriesList extends Component {
  state = {
    userStoriesList: [],
    apiStatus: apiUrlStatusConstants.initial,
  }

  componentDidMount() {
    this.getUserStoriesDetails()
  }

  getUserStoriesDetails = async () => {
    this.setState({apiStatus: apiUrlStatusConstants.inProgress})
    const userStoriesAPI = 'https://apis.ccbp.in/insta-share/stories'
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(userStoriesAPI, options)
    if (response.ok === true) {
      const data = await response.json()
      const formattedData = data.users_stories.map(eachItem => ({
        storyUrl: eachItem.story_url,
        userId: eachItem.user_id,
        userName: eachItem.user_name,
      }))
      this.setState({
        userStoriesList: formattedData,
        apiStatus: apiUrlStatusConstants.success,
      })
    }
  }

  renderLoader = () => (
    <div className="loader-container-stories">
      <Loader type="TailSpin" color="#4094EF" height={30} width={30} />
    </div>
  )

  renderSlider = () => {
    const {userStoriesList} = this.state
    return (
      <Slider {...settings}>
        {userStoriesList.map(eachLogo => (
          <div className="slick-item" key={eachLogo.userId}>
            <img
              className="logo-image"
              src={eachLogo.storyUrl}
              alt="user story"
            />
            <p className="slickUsername">{eachLogo.userName}</p>
          </div>
        ))}
      </Slider>
    )
  }

  renderUsersStories = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiUrlStatusConstants.inProgress:
        return this.renderLoader()
      case apiUrlStatusConstants.success:
        return this.renderSlider()
      default:
        return null
    }
  }

  render() {
    return <div className="slick-container">{this.renderUsersStories()}</div>
  }
}

export default UserStoriesList
