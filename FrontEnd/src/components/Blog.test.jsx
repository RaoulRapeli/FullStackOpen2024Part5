import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import BlogForm from './blogForm'
import { expect } from 'vitest'

test('Display Title and other, not url and likes', () => {
  const blog = {
    title: 'Testing',
    author: 'RMR',
    url: 'google',
    likes: 5,
    user: { username: 'RR' }
  }
  const user = {
    username: 'RR'
  }

  const { container } = render(<Blog blog={blog} user={user} />)
  //screen.debug()
  const div = container.querySelector('.blog')
  expect(div).toHaveTextContent(blog.title)
  expect(div).toHaveTextContent(blog.author)
  expect(div).not.toHaveTextContent(blog.url)
  expect(div).not.toHaveTextContent(blog.likes)
})

test('Display url,likes and user name after button click', async () => {
  const blog = {
    title: 'Testing',
    author: 'RMR',
    url: 'google',
    likes: 5,
    user: {
      username: 'RR',
      name: 'Raoul Rapeli'
    }
  }
  const tempUser = {
    username: 'RR'
  }

  const user = userEvent.setup()
  const { container } = render(<Blog blog={blog} user={tempUser} />)
  const viewButton = screen.getByText('view')
  await user.click(viewButton)
  const div = container.querySelector('.blog')
  expect(div).toHaveTextContent(blog.url)
  expect(div).toHaveTextContent(blog.likes)
  expect(div).toHaveTextContent(blog.user.name)
})

test('Press like button twice and confirm there are two requests', async () => {
  const blog = {
    title: 'Testing',
    author: 'RMR',
    url: 'google',
    likes: 5,
    user: {
      username: 'RR',
      name: 'Raoul Rapeli'
    }
  }
  const tempUser = {
    username: 'RR'
  }
  const updateLikes = vi.fn()
  const user = userEvent.setup()
  const { container } = render(<Blog blog={blog} user={tempUser} updateLikes={updateLikes} />)
  const viewButton = screen.getByText('view')
  await user.click(viewButton)
  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)
  expect(updateLikes.mock.calls).toHaveLength(2)
})

test('When adding new blog is the data passed correctly', async () => {
  const blog = {
    title: 'Testing',
    author: 'RMR',
    url: 'google',
    likes: 0,
  }
  const addBlog = vi.fn()
  const user = userEvent.setup()
  const { container } = render(<BlogForm { ...{ addBlog } } />)
  const newBlogButton = screen.getByText('new blog')
  await user.click(newBlogButton)
  const title = screen.getByPlaceholderText('insert title')
  const author = screen.getByPlaceholderText('insert author')
  const url = screen.getByPlaceholderText('insert url')
  await userEvent.type(title, blog.title )
  await userEvent.type(author, blog.author )
  await userEvent.type(url, blog.url )
  const saveButton = screen.getByText('create')
  await user.click(saveButton)
  expect(addBlog.mock.calls).toHaveLength(1)
  expect(addBlog.mock.calls[0][0].title).equals(blog.title)
  expect(addBlog.mock.calls[0][0].author).equals(blog.author)
  expect(addBlog.mock.calls[0][0].url).equals(blog.url)
  expect(addBlog.mock.calls[0][0].likes).equals(blog.likes)
})
