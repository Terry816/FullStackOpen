import { render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'


test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  const user = userEvent.setup()
  const createBlog = vi.fn()

  render(
    <MemoryRouter>
      <BlogForm createBlog={createBlog} />
    </MemoryRouter>
  )
  const title = screen.getByRole('textbox', { name: /title/i })
  const author = screen.getByRole('textbox', { name: /author/i })
  const url = screen.getByRole('textbox', { name: /url/i })

  await user.type(title, 'testing a form...')
  await user.type(author, 'Terry Kim')
  await user.type(url, 'http://example.com')
  await user.click(screen.getByRole('button', { name: /create/i }))
  expect(createBlog).toHaveBeenCalledTimes(1)
  expect(createBlog).toHaveBeenCalledWith({
    title: 'testing a form...',
    author: 'Terry Kim',
    url: 'http://example.com',
  })
})