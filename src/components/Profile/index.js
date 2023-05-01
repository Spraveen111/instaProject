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

class Profile extends Component {
  state = {
    myProfileData: {},
    posts: [],
    stories: [],
    apiStatus: apiUrlStatusConstants.initial,
  }

  componentDidMount() {
    this.getMyProfileData()
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

  getMyProfileData = async () => {
    this.setState({apiStatus: apiUrlStatusConstants.inProgress})
    const myProfileAPI = 'https://apis.ccbp.in/insta-share/my-profile'
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(myProfileAPI, options)
    if (response.ok === true) {
      const data = await response.json()
      const profileData = this.getFormattedData(data.profile)
      const {posts} = data.profile
      const {stories} = data.profile
      this.setState({
        myProfileData: profileData,
        posts,
        stories,
        apiStatus: apiUrlStatusConstants.success,
      })
    } else if (response.status === 400) {
      this.setState({apiStatus: apiUrlStatusConstants.failure})
    }
  }

  onClickTryAgainProfile = () => this.getMyProfileData()

  renderPosts = () => {
    const {posts} = this.state
    const showPostsList = posts.length > 0

    return showPostsList ? (
      <div className="my-profile-posts-container">
        <div className="icon-name-container">
          <BsGrid3X3 className="posts-icon" />
          <h1 className="posts-name">Posts</h1>
        </div>
        <ul className="profile-posts-list-container">
          {posts.map(eachPost => (
            <li className="profile-posts-list-item" key={eachPost.id}>
              <img src={eachPost.image} alt="my post" className="post-images" />
            </li>
          ))}
        </ul>
        <BiCamera className="no-posts-icon" />
      </div>
    ) : (
      <div className="posts-failure-container">
        <BiCamera className="no-posts-icon" />
        <h1 className="no-posts-text">No Posts Yet</h1>
      </div>
    )
  }

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
        onClick={this.onClickTryAgainProfile}
      >
        Try again
      </button>
    </div>
  )

  renderLoader = () => (
    <div className="loader-container">
      <Loader type="TailSpin" color="#4094EF" height={50} width={50} />
    </div>
  )

  renderStories = () => {
    const {stories} = this.state
    return (
      <ul className="my-profile-storyline-list">
        {stories.map(story => (
          <li className="my-story-list-items" key={story.id}>
            <img src={story.image} alt="my story" className="my-story-image" />
          </li>
        ))}
      </ul>
    )
  }

  renderProfilePostsDetails = () => {
    const {myProfileData} = this.state
    const {
      followersCount,
      followingCount,
      postsCount,
      profilePic,
      userBio,
      userName,
      userId,
    } = myProfileData
    return (
      <div className="myProfileContainer">
        <div className="my-profile-content">
          <img src={profilePic} alt="my profile" className="my-profile-pic" />
          <div className="profile-bio-content">
            <h1 className="profile-name">{userName}</h1>
            <div className="posts-followers-following">
              <div className="posts-count">
                <p className="counts">
                  <span className="count">{postsCount}</span> posts
                </p>
                <p className="counts">
                  <span className="count">{followersCount}</span> followers
                </p>
                <p className="counts">
                  <span className="count">{followingCount}</span> following
                </p>
              </div>
            </div>
            <p className="profile-user-name">{userId}</p>
            <p className="userBio">{userBio}</p>
          </div>
        </div>
        {this.renderStories()}
        <hr className="line" />
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
        return this.renderProfilePostsDetails()
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
        <div>{this.renderMyProfile()}</div>
      </>
    )
  }
}

export default Profile
