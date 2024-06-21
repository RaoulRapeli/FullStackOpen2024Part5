import { useState } from 'react'
const BlogForm = ({ addBlog }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [toggleCreateBlogView, setToggleCreateBlogView] = useState(false)

  const handleAddBlog = (event) => {
    event.preventDefault()
    var newBlog = {
      title: newTitle,
      author: newAuthor,
      url: newUrl,
      likes: 0,
    }
    addBlog(newBlog)
    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
    setToggleCreateBlogView(false)
  }

  return (
    <>
      <div>
        <h2>create new</h2>
      </div>
      {toggleCreateBlogView?
        <>
          <form onSubmit={handleAddBlog}>
            <div>
              title:<input
                value={newTitle}
                placeholder='insert title'
                id='titleInput'
                onChange={event => setNewTitle(event.target.value)}
              />
            </div>
            <div>
              author:<input
                value={newAuthor}
                placeholder='insert author'
                id='authorInput'
                onChange={event => setNewAuthor(event.target.value)}
              />
            </div>
            <div>
              url:<input
                value={newUrl}
                placeholder='insert url'
                id='urlInput'
                onChange={event => setNewUrl(event.target.value)}
              />
            </div>
            <button type="submit" id='createBlogButton'>create</button>
          </form>
          <button onClick={() => setToggleCreateBlogView(false)}>cancel</button>
        </>
        :
        <button onClick={() => setToggleCreateBlogView(true)}>new blog</button>
      }

    </>
  )
}

export default BlogForm