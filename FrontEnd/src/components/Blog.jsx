import { useState } from 'react'

const Blog = ({ blog,updateLikes,deletBlog,user }) => {
  const [toggleInformation, setToggleInformation] = useState(false)

  const blogStyle = {
    paddingTop: 2,
    paddingLeft: 5,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }
  const marginLeft = {
    marginLeft:5
  }
  const handleLike = () => {
    var newBlog = structuredClone(blog)
    newBlog.likes++
    updateLikes(newBlog)
  }

  return (
    <div style={blogStyle} className='blog'>
      <div>
        <span>{blog.title}</span>
        <span> {blog.author}</span>
        {toggleInformation?
          <button style={marginLeft} onClick={() => setToggleInformation(false)}>hide</button>
          :
          <button style={marginLeft} onClick={() => setToggleInformation(true)}>view</button>
        }
      </div>
      <div className='toggleInformation'>
        {toggleInformation?
          <>
            <div>{blog.url}</div>
            <div>
              <span className='amountOfLikes'>{blog.likes}</span>
              <button style={marginLeft} onClick={() => handleLike()} className='likeButton'>like</button>
            </div>
            <div>{blog.user.name}</div>
            {blog.user.username === user.username?
              <div>
                <span style={{ backgroundColor:'DodgerBlue', borderRadius:'3px',paddingLeft:'3px',paddingRight:'3px',cursor:'pointer' }} onClick={() => deletBlog(blog)}>remove</span>
              </div>
              :
              null
            }
          </>
          :
          null
        }
      </div>
    </div>
  )
}

export default Blog