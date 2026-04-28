import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import { MemoryRouter, Routes, Route } from 'react-router-dom'

test('Render information but buttons are not displayed when not signed in', () => {
  const blog = {
    id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://example.com',
    likes: 5,
  }

  const blogId = '5a422aa71b54a676234d17f8'

  render(
    <MemoryRouter initialEntries={[`/notes/${blogId}`]}>
      <Routes>
        <Route
          path="/notes/:id"
          element={
            <Blog
              blog={blog}
              updateLike={vi.fn()}
              removePost={vi.fn()}
            />
          }
        />
      </Routes>
    </MemoryRouter>
  )

  // visible by default
  expect(screen.getByText(/Go To Statement Considered Harmful/)).toBeVisible()
  expect(screen.getByText(/Edsger W\. Dijkstra/)).toBeVisible()
  expect(screen.getByText('http://example.com')).toBeVisible()
  expect(screen.getByText(/likes:\s*5/i)).toBeVisible()

  //make sure buttons are not shown
  expect(screen.queryByRole('button', { name: 'upvote' })).not.toBeInTheDocument()
})


test('Likes button is visible once logged in and clicks upvote twice', async () => {
  const blog = {
    id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://example.com',
    likes: 5,
  }

  const user = {
    username: "tester",
    name: "tester123",
    password: "password123"
  }

  const blogId = '5a422aa71b54a676234d17f8'
  const updateLike = vi.fn()
  render(
    <MemoryRouter initialEntries={[`/notes/${blogId}`]}>
      <Routes>
        <Route
          path="/notes/:id"
          element={
            <Blog
              blog={blog}
              user={user}
              updateLike={updateLike}
              removePost={vi.fn()}
            />
          }
        />
      </Routes>
    </MemoryRouter>
  )

  await expect(screen.getByRole('button', { name: 'upvote' })).toBeVisible()
  const guest = userEvent.setup()
  await guest.click(screen.getByRole('button', { name: 'upvote' }))
  await guest.click(screen.getByRole('button', { name: 'upvote' }))

  await expect(updateLike.mock.calls).toHaveLength(2)

})