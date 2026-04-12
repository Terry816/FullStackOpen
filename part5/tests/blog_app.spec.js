const { test, expect, beforeEach, describe, afterEach } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {

  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })
    await page.goto('/login')
  })

  test('Login form is shown', async ({ page }) => {
    const username = page.getByLabel('username')
    const password = page.getByLabel('password')
    const loginButton = page.getByRole('button', { name: 'login' })

    await expect(username).toBeVisible()
    await expect(password).toBeVisible()
    await expect(loginButton).toBeVisible()
  })

  describe("Login", () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
      const loginText = page.getByText("Matti Luukkainen logged in")
      await expect(loginText).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'wrong')
      const errorDiv = page.locator('.error')
      await expect(errorDiv).toContainText('wrong username or password')
      const loginText = page.getByText("Matti Luukkainen logged in")
      await expect(loginText).not.toBeVisible()
    })

    describe('When logged in', () => {
      beforeEach(async ({ page }) => {
        await loginWith(page, 'mluukkai', 'salainen')
      })

      test('a new blog can be created', async ({ page }) => {
        const title = "this is a test blog"
        const author = "Matt Luckey"
        const url = "http://localhost:3001"
        await createBlog(page, title, author, url)
        const errorMsg = page.getByText('A New Blog: this is a test blog by Matt Luckey has been added')
        await expect(errorMsg).toBeVisible()
        await expect(page.getByRole('link', { name: /this is a test blog/ })).toBeVisible()

        await expect(page.getByText(url)).not.toBeVisible()
        await expect(page.getByText('likes')).not.toBeVisible()
      })

      describe('After a new blog is created', () => {
        const title = "this is a test blog"
        const author = "Matt Luckey"
        const url = "http://localhost:3001"

        beforeEach(async ({ page }) => {
          await createBlog(page, title, author, url)
          await page.getByRole('link', { name: /this is a test blog/ }).waitFor()
          await page.getByRole('link', { name: /this is a test blog/ }).click()
        })

        test('blog like button works as expected', async ({ page }) => {
          await expect(page.getByTestId('url')).toBeVisible()
          await expect(page.getByText('likes: 0')).toBeVisible()

          await page.getByRole('button', { name: 'upvote' }).click()
          await expect(page.getByText('likes: 1')).toBeVisible()
        })

        test('delete a blog', async ({ page }) => {
          const removeButton = page.getByRole('button', { name: 'remove' })
          await expect(removeButton).toBeVisible()
          page.once('dialog', dialog => {
            console.log(`Dialog message: ${dialog.message()}`);
            dialog.accept().catch(() => { });
          });
          await removeButton.click()

          await expect(page.getByText('this is a test blog Matt Luckey')).toHaveCount(0);
        })

        test('deleting someone else\'s blog should not work', async ({ page, request }) => {
          //first create a new user and then login and try and remove it
          await page.getByRole('button', { name: 'Logout' }).click()
          await request.post('/api/users', {
            data: {
              name: 'Terry Kim',
              username: 'Terry',
              password: 'password123'
            }
          })
          await page.goto('/login')
          await loginWith(page, "Terry", "password123")
          await expect(page.getByText(/this is a test blog/)).toBeVisible()
          await page.getByRole('link', { name: /this is a test blog/ }).click()
          await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()

        })


      })


    })

  })




})