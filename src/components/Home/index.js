import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import Slider from 'react-slick'

import Header from '../Header'
import UserPostsItem from '../UserPostsItem'
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

class Home extends Component {
  state = {
    userStoriesList: [],
    userPostsList: [],
    apiStatus: apiUrlStatusConstants.initial,
    onSearchInput: '',
  }

  componentDidMount() {
    this.getUserStoriesDetails()
    this.getUserPostList()
  }

  getFormattedData = data => ({
    createdAt: data.created_at,
    likesCount: data.likes_count,
    postId: data.post_id,
    profilePic: data.profile_pic,
    userId: data.user_id,
    userName: data.user_name,
    caption: data.post_details.caption,
    imageUrl: data.post_details.image_url,
    comments: data.comments.map(eachComment => ({
      comment: eachComment.comment,
      userId: eachComment.user_id,
      userName: eachComment.user_name,
    })),
  })

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

  getUserPostList = async () => {
    this.setState({apiStatus: apiUrlStatusConstants.inProgress})
    const {onSearchInput} = this.state
    const postsAPI = `https://apis.ccbp.in/insta-share/posts?search=${onSearchInput}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(postsAPI, options)
    const data = await response.json()
    if (response.ok === true) {
      const postsData = data.posts.map(eachData =>
        this.getFormattedData(eachData),
      )
      this.setState({
        userPostsList: postsData,
        apiStatus: apiUrlStatusConstants.success,
      })
    } else if (data.status_code === 400) {
      this.setState({apiStatus: apiUrlStatusConstants.failure})
    }
  }

  onSearchCaption = search => {
    this.setState({onSearchInput: search}, this.getUserPostList)
  }

  renderFailureView = () => (
    <div className="failureView-content-home">
      <img
        src="https://res.cloudinary.com/r947j17/image/upload/v1645428892/Search-Not-Found_pezc4b.png"
        alt="failure view"
        className="Home-failure-img"
      />
      <p className="failure-text">Something went wrong. Please try again</p>
      <button
        type="button"
        className="try-again-btn"
        onClick={this.onClickTryAgainHome}
      >
        Try again
      </button>
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

  onClickTryAgainHome = () => this.getUserPostList()

  renderUserPostsList = () => {
    const {userPostsList} = this.state
    const postLength = userPostsList.length > 0
    return postLength ? (
      <ul className="posts-container">
        {userPostsList.map(posts => (
          <UserPostsItem key={posts.userId} postDetails={posts} />
        ))}
      </ul>
    ) : (
      <div className="failureView-content-home">
        <h1 className="searchResults">Search Results</h1>
        <img
          src="https://res.cloudinary.com/r947j17/image/upload/v1645428892/Search-Not-Found_pezc4b.png"
          alt="search not found"
          className="Home-failure-img"
        />
        <p className="failure-text">Try different keyword or search again</p>
        <button
          type="button"
          className="try-again-btn"
          onClick={this.onClickTryAgainHome}
        >
          Try again
        </button>
      </div>
    )
  }

  renderPostsStatus = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiUrlStatusConstants.inProgress:
        return this.renderLoader()
      case apiUrlStatusConstants.success:
        return this.renderUserPostsList()
      case apiUrlStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  renderUsersStories = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiUrlStatusConstants.inProgress:
        return this.renderLoader()
      case apiUrlStatusConstants.success:
        return this.renderSlider()
      case apiUrlStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  renderLoader = () => (
    <div className="loader-container-stories">
      <Loader type="TailSpin" color="#4094EF" height={30} width={30} />
    </div>
  )

  render() {
    return (
      <>
        <Header onSearchCaption={this.onSearchCaption} />
        <div className="userstories-posts-container">
          <div className="slick-container">{this.renderUsersStories()}</div>
          {this.renderPostsStatus()}
        </div>
      </>
    )
  }
}

export default Home
