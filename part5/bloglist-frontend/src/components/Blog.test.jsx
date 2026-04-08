import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders title and author but not url and likes', () => {
  const blog = {
    id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://example.com',
    likes: 5,
  }
  render(<Blog blog={blog} updateLike={vi.fn()} removePost={vi.fn()} />)

  // visible by default
  expect(screen.getByText(/Go To Statement Considered Harmful/)).toBeVisible()
  expect(screen.getByText(/Edsger W\. Dijkstra/)).toBeVisible()

  // present but hidden by default
  expect(screen.getByText('http://example.com')).not.toBeVisible()
  expect(screen.getByText(/likes:\s*5/i)).not.toBeVisible()
})


test('Likes and URL is visible once view is clicked', async () => {
  const blog = {
    id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://example.com',
    likes: 5,
  }
  const updateLike = vi.fn()
  render(<Blog blog={blog} updateLike={updateLike} removePost={vi.fn()} />)
  // upvote button is inside Togglable, so first open it
  const user = userEvent.setup()
  await user.click(screen.getByText('view'))

  expect(screen.getByText('http://example.com')).toBeVisible()
  expect(screen.getByText(/likes:\s*5/i)).toBeVisible()
})

test('Like is incremented twice when clicked twice', async () => {
  const blog = {
    id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://example.com',
    likes: 5,
  }
  const updateLike = vi.fn()
  render(<Blog blog={blog} updateLike={updateLike} removePost={vi.fn()} />)
  // upvote button is inside Togglable, so first open it
  const user = userEvent.setup()
  await user.click(screen.getByText('view'))
  await user.click(screen.getByText('upvote'))
  await user.click(screen.getByText('upvote'))

  expect(updateLike.mock.calls).toHaveLength(2)
})