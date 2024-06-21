import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification  from './components/Notification'
import BlogForm from './components/blogForm'
import PropTypes from 'prop-types'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [messageType, setMessageType] = useState({})

  const resetStyle = {}
  const sortByColumn = (data, column, order) => {
    if(order === 'asc'){
      return data.sort((a,b) => a[column] - b[column])
    }
    else{
      return data.sort((a,b) => b[column] - a[column])
    }
  }
  useEffect(() => {
    if(user){
      blogService.getAll().then(blogs => {
        blogs = sortByColumn(blogs, 'likes', 'desc')
        setBlogs( blogs )
      })
    }
  }, [user])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('wrong username or password')
      let defaultStyle = {
        color:'red',
        backgroundColor:'lightgray',
        border:'3px solid red',
        borderRadius:'3px',
        padding:'10px',
        fontSize:'18px'
      }
      setMessageType(defaultStyle)
      setTimeout(() => {
        setErrorMessage(null)
        setMessageType(resetStyle)
      }, 5000)
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const loginForm = () => (
    <>
      <div>
        <h2>Log in to application</h2>
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              type='text'
              value={username}
              name='Username'
              id='username'
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              type='password'
              value={password}
              name='Password'
              id='password'
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type='submit' id='login-button'>login</button>
        </form>
      </div>
    </>
  )

  const addBlog = async (newBlog) => {

    await blogService.create(newBlog).then((resultsBlog) =>
    {
      resultsBlog.user = { name:user.name }
      var tempBlogs = blogs.concat([resultsBlog])
      tempBlogs = sortByColumn(tempBlogs, 'likes', 'desc')
      setBlogs(tempBlogs)
      setErrorMessage(`a new blog ${resultsBlog.title} by ${resultsBlog.author} added`)
      let defaultStyle = {
        color:'green',
        backgroundColor:'lightgray',
        border:'3px solid green',
        borderRadius:'3px',
        padding:'10px',
        fontSize:'18px'
      }
      setMessageType(defaultStyle)
      setTimeout(() => {
        setErrorMessage(null)
        setMessageType(resetStyle)
      }, 5000)
    })
  }

  const updateLikes = async (newBlog) => {
    var tempNewBlog = structuredClone(newBlog)
    var id = tempNewBlog.id
    delete tempNewBlog.id
    tempNewBlog.user = tempNewBlog.user.id
    await blogService.update(id,tempNewBlog).then((resultsBlog) =>
    {
      var tempBlogs = structuredClone(blogs)
      tempBlogs = tempBlogs.map(blog => {
        if(blog.id === id){
          var tempUser = blog.user
          blog = resultsBlog
          blog.user = tempUser
          return blog
        }
        else{
          return blog
        }
      })
      tempBlogs = sortByColumn(tempBlogs, 'likes', 'desc')
      setBlogs(tempBlogs)

      setErrorMessage(`blog ${resultsBlog.title} by ${resultsBlog.author} likes has been updated`)
      let defaultStyle = {
        color:'green',
        backgroundColor:'lightgray',
        border:'3px solid green',
        borderRadius:'3px',
        padding:'10px',
        fontSize:'18px'
      }
      setMessageType(defaultStyle)
      setTimeout(() => {
        setErrorMessage(null)
        setMessageType(resetStyle)
      }, 5000)
    })
  }

  const deletBlog = async (toBeDeletedblog) => {
    if(window.confirm(`Remove blog ${toBeDeletedblog.title} by ${toBeDeletedblog.author}`)){
      await blogService.remove(toBeDeletedblog.id).then(() => {
        var tempBlogs = blogs.filter(blog => blog.id !== toBeDeletedblog.id)
        setBlogs(tempBlogs)
        let defaultStyle = {
          color:'green',
          backgroundColor:'lightgray',
          border:'3px solid green',
          borderRadius:'3px',
          padding:'10px',
          fontSize:'18px'
        }
        setErrorMessage(`blog ${toBeDeletedblog.title} by ${toBeDeletedblog.author} has been removed`)
        setMessageType(defaultStyle)
        setTimeout(() => {
          setErrorMessage(null)
          setMessageType(resetStyle)
        }, 5000)
      })
    }
  }

  BlogForm.propTypes  = {
    addBlog: PropTypes.func.isRequired
  }

  return (
    <div>
      <h2>blogs</h2>

      <Notification message={errorMessage} messageType={messageType}/>

      <div>
        {user?
          <span style={{ display:'flex' }}>
            {user.name} logged in
            <form onSubmit={handleLogout}>
              <button type='submit'>logout</button>
            </form>
          </span>
          :null
        }
      </div>
      {!user && loginForm()}
      {user && <BlogForm {...{ addBlog }}/>}
      <div className='blogList'>
        {user && blogs.map(blog =>
          <Blog key={blog.id} {...{ blog,updateLikes, deletBlog,user }}/>
        )}
      </div>
    </div>
  )
}

export default App