import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import UserPostsItem from '../UserPostsItem'
import './index.css'

const apiUrlStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class UsersPosts extends Component {
  state = {
    userPostsList: [],
    apiStatus: apiUrlStatusConstants.initial,
  }

  componentDidMount() {
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

  getUserPostList = async () => {
    this.setState({apiStatus: apiUrlStatusConstants.inProgress})
    const postsAPI = 'https://apis.ccbp.in/insta-share/posts'
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(postsAPI, options)
    if (response.ok === true) {
      const data = await response.json()
      const postsData = data.posts.map(eachData =>
        this.getFormattedData(eachData),
      )
      this.setState({
        userPostsList: postsData,
        apiStatus: apiUrlStatusConstants.success,
      })
    } else this.setState({apiStatus: apiUrlStatusConstants.failure})
  }

  onClickTryAgain = () => this.getUserPostList()

  renderFailureView = () => (
    <div className="failureView-content-home">
      <img
        src="https://res.cloudinary.com/r947j17/image/upload/v1645431151/Home-failure_fh7wgm.png"
        alt="failure view"
        className="Home-failure-img"
      />
      <p className="failure-text">Something went wrong. Please try again</p>
      <button
        type="button"
        className="try-again-btn"
        onClick={this.onClickTryAgain}
      >
        Try again
      </button>
    </div>
  )

  renderLoader = () => (
    <div className="loader-container-home">
      <Loader type="TailSpin" color="#4094EF" height={30} width={30} />
    </div>
  )

  renderUserPostsList = () => {
    const {userPostsList} = this.state
    return (
      <ul className="posts-container">
        {userPostsList.map(posts => (
          <UserPostsItem key={posts.postId} postDetails={posts} />
        ))}
      </ul>
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

  render() {
    return <>{this.renderPostsStatus()}</>
  }
}

export default UsersPosts
