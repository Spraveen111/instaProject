import {Component} from 'react'
import Cookies from 'js-cookie'
import {Link} from 'react-router-dom'
import {BiShareAlt} from 'react-icons/bi'
import {BsHeart} from 'react-icons/bs'
import {FcLike} from 'react-icons/fc'
import {FaRegComment} from 'react-icons/fa'

import './index.css'

class UserPostsItem extends Component {
  state = {
    likeStatus: false,
    message: '',
  }

  getLikeStatus = async () => {
    const {likeStatus} = this.state
    const {postDetails} = this.props
    const {postId} = postDetails
    const jwtToken = Cookies.get('jwt_token')
    const postLikeAPI = `https://apis.ccbp.in/insta-share/posts/${postId}/like`
    const options = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify({like_status: likeStatus}),
    }
    const response = await fetch(postLikeAPI, options)
    const data = await response.json()
    this.setState({message: data.message})
  }

  onClickLikeButton = () => {
    this.setState({likeStatus: true}, this.getLikeStatus, this.renderLikesCount)
  }

  onClickUnlikeButton = () => {
    this.setState(
      {likeStatus: false},
      this.getLikeStatus,
      this.renderLikesCount,
    )
  }

  renderComments = () => {
    const {postDetails} = this.props
    return (
      <ul className="comments-container">
        {postDetails.comments.map(eachComment => (
          <li className="commentItem" key={eachComment.userId}>
            <p className="comment">
              <span className="commenterName">{eachComment.userName}</span>
              {eachComment.comment}
            </p>
          </li>
        ))}
      </ul>
    )
  }

  renderLikeButton = () => (
    <button type="button" className="like-btn" onClick={this.onClickLikeButton}>
      <BsHeart className="likes-comments-icons" />
    </button>
  )

  renderUnlikeButton = () => (
    <button
      type="button"
      className="like-btn"
      onClick={this.onClickUnlikeButton}
    >
      <FcLike className="likes-comments-icons" />
    </button>
  )

  renderLikesCount = () => {
    const {message} = this.state
    const {postDetails} = this.props
    const {likesCount} = postDetails
    let count = likesCount + 1
    switch (message) {
      case 'Post has been liked':
        return count
      case 'Post has been disliked':
        count -= 1
        return count
      default:
        return likesCount
    }
  }

  render() {
    const {postDetails} = this.props
    const {likeStatus} = this.state
    const {
      profilePic,
      userName,
      imageUrl,
      caption,
      createdAt,
      userId,
    } = postDetails
    return (
      <li className="post-List-Item">
        <div className="profileImg-name">
          <div className="box">
            <img src={profilePic} className="img" alt="post author profile" />
          </div>
          <h1 className="user-home-profile-name">
            <Link to={`/users/${userId}`} className="nav-link">
              {userName}
            </Link>
          </h1>
        </div>
        <img src={imageUrl} alt="post" className="post-image" />
        <div className="likes-comments-container">
          <div className="likes-comment-share-container">
            {likeStatus ? this.renderUnlikeButton() : this.renderLikeButton()}
            <FaRegComment className="likes-comments-icons" />
            <BiShareAlt className="likes-comments-icons" />
          </div>
          <p className="likesCount">{this.renderLikesCount()} likes</p>
          <p className="caption">{caption}</p>
          {this.renderComments()}
          <p className="created-time">{createdAt}</p>
        </div>
      </li>
    )
  }
}
export default UserPostsItem
//  <BsFillShareFill className="likes-comments-icons" /> Post has been disliked Post has been liked
