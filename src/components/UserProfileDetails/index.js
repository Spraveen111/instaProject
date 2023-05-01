import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsGrid3X3} from 'react-icons/bs'
import {BiCamera} from 'react-icons/bi'
import Header from '../Header'
import './index.css'

const apiUrlStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class UserProfileDetails extends Component {
  state = {
    userProfileData: {},
    posts: [],
    stories: [],
    apiStatus: apiUrlStatusConstants.initial,
  }

  componentDidMount() {
    this.getUserProfileDetails()
  }

  getFormattedData = data => ({
    followersCount: data.followers_count,
    followingCount: data.following_count,
    id: data.id,
    profilePic: data.profile_pic,
    userBio: data.user_bio,
    userId: data.user_id,
    userName: data.user_name,
    postsCount: data.posts_count,
  })

  getUserProfileDetails = async () => {
    const {match} = this.props
    const {params} = match
    const {userId} = params
    this.setState({apiStatus: apiUrlStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const userProfileAPI = `https://apis.ccbp.in/insta-share/users/${userId}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(userProfileAPI, options)
    if (response.ok === true) {
      const data = await response.json()
      console.log(data)
      const profileUserData = this.getFormattedData(data.user_details)
      console.log(profileUserData)
      const {posts} = data.user_details
      const {stories} = data.user_details
      this.setState({
        userProfileData: profileUserData,
        posts,
        stories,
        apiStatus: apiUrlStatusConstants.success,
      })
    }
    if (response.status === 400) {
      this.setState({apiStatus: apiUrlStatusConstants.failure})
    }
  }

  renderLoader = () => (
    <div className="loader-container">
      <Loader type="TailSpin" color="#4094EF" height={50} width={50} />
    </div>
  )

  onClickUserProfileRetry = () => this.getUserProfileDetails()

  renderFailureView = () => (
    <div className="failureView-container">
      <img
        src="https://res.cloudinary.com/r947j17/image/upload/v1645428949/Something-Went-Wrong_ilcaww.png"
        alt="failure view"
        className="failure-img"
      />
      <p className="failure-text">Something went wrong. Please try again</p>
      <button
        type="button"
        className="try-again-btn"
        onClick={this.onClickUserProfileRetry}
      >
        Try again
      </button>
    </div>
  )

  renderStories = () => {
    const {stories} = this.state
    return (
      <ul className="user-profile-storyline-list">
        {stories.map(story => (
          <li className="user-story-list-items" key={story.id}>
            <img
              src={story.image}
              alt="user story"
              className="user-story-image"
            />
          </li>
        ))}
      </ul>
    )
  }

  renderPosts = () => {
    const {posts} = this.state
    const showPostsList = posts.length > 0

    return showPostsList ? (
      <div className="user-profile-posts-container">
        <div className="user-icon-name-container">
          <BsGrid3X3 className="user-posts-icon" />
          <h1 className="user-posts-name">Posts</h1>
        </div>
        <ul className="user-profile-posts-list-container">
          {posts.map(eachPost => (
            <li className="user-profile-posts-list-item" key={eachPost.id}>
              <img
                src={eachPost.image}
                alt="user post"
                className="user-post-images"
              />
            </li>
          ))}
        </ul>
      </div>
    ) : (
      <div className="user-posts-failure-container">
        <BiCamera className="user-no-posts-icon" />
        <h1 className="user-no-posts-text">No Posts Yet</h1>
      </div>
    )
  }

  renderUserProfilePostsDetails = () => {
    const {userProfileData} = this.state
    const {
      followersCount,
      followingCount,
      postsCount,
      profilePic,
      userBio,
      userName,
      userId,
    } = userProfileData
    return (
      <div className="userProfileContainer">
        <div className="user-profile-content">
          <img
            src={profilePic}
            alt="user profile"
            className="user-profile-pic"
          />
          <div className="user-profile-bio-content">
            <h1 className="user-profile-name">{userName}</h1>
            <div className="userposts-followers-following">
              <div className="user-posts-count">
                <p className="user-counts">
                  <span className="count">{postsCount}</span> posts
                </p>
                <p className="user-counts">
                  <span className="count">{followersCount}</span> followers
                </p>
                <p className="user-counts">
                  <span className="count">{followingCount}</span> following
                </p>
              </div>
            </div>
            <p className="user-profile-user-name">{userId}</p>
            <p className="specificUserBio">{userBio}</p>
          </div>
        </div>
        {this.renderStories()}
        <hr className="dash" />
        {this.renderPosts()}
      </div>
    )
  }

  renderMyProfile = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiUrlStatusConstants.inProgress:
        return this.renderLoader()
      case apiUrlStatusConstants.success:
        return this.renderUserProfilePostsDetails()
      case apiUrlStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div>
          <div>{this.renderMyProfile()}</div>
        </div>
      </>
    )
  }
}

export default UserProfileDetails
