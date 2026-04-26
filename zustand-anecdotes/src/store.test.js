import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'

vi.mock('./services/anecdotes', () => ({
  default: {
    getAll: vi.fn(),
    createNew: vi.fn(),
    updateVote: vi.fn(),
    remove: vi.fn(),
  }
}))

import anecdoteService from './services/anecdotes'
import useAnecdoteStore, { useAnecdotes, useFilter, useAnecdoteActions } from './store'

beforeEach(() => {
  useAnecdoteStore.setState({ anecdotes: [], filter: '' })
  vi.clearAllMocks()
})

describe("useAnecdoteActions", () => {
  it("initialize works as expected", async () => {
    const mockAnecdote = [{ id: 1, content: "Test" }]
    anecdoteService.getAll.mockResolvedValue(mockAnecdote)

    const { result } = renderHook(() => useAnecdoteActions())

    await act(async () => {
      await result.current.initialize()
    })
    const { result: anecdoteResult } = renderHook(() => useAnecdotes())
    expect(anecdoteResult.current).toEqual(mockAnecdote)
  })

  describe("With some anecdotes initally loaded", () => {
    const anecdotes = [
      {
        content: "did this work. First",
        votes: 1,
        id: 1
      },
      {
        content: "Third in line",
        votes: 3,
        id: 2
      },
      {
        content: "Second. now does it work",
        votes: 2,
        id: 3
      }
    ]

    beforeEach(() => {
      useAnecdoteStore.setState({ anecdotes })
    })

    it("Anecdotes returned in sorted order", async () => {

      const { result } = renderHook(() => useAnecdotes())
      expect(result.current).toEqual([anecdotes[1], anecdotes[2], anecdotes[0]])
    })

    it("Filtering works", async () => {
      useAnecdoteStore.setState({ anecdotes, filter: "work" })
      const { result } = renderHook(() => useAnecdotes())
      expect(result.current).toEqual([anecdotes[2], anecdotes[0]])
    })

    it("Upvote works as expected", async () => {
      const mockUpvote = {
        content: "did this work. First",
        votes: 2,
        id: 1
      }
      anecdoteService.updateVote.mockResolvedValue(mockUpvote)

      const { result } = renderHook(() => useAnecdoteActions())
      await act(async () => {
        await result.current.vote(1)
      })
      const { result: anecdoteResult } = renderHook(() => useAnecdotes())
      expect(anecdoteResult.current[2].votes).toEqual(2)
    })

  })



})
