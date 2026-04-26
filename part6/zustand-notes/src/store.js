import { create } from 'zustand'
import noteService from "./services/notes"
import { devtools } from 'zustand/middleware'

const useNoteStore = create(devtools((set, get) => ({
  notes: [],
  filter: 'all',
  actions: {
    add: async (note) => {
      const newNote = await noteService.createNew(note)
      set(state => ({ notes: state.notes.concat(newNote) })
      )
    },
    toggleImportance: async (id) => {
      const note = get().notes.find(n => n.id === id)
      const updated = await noteService.update(
        id, { ...note, important: !note.important }
      )
      set(
        state => ({
          notes: state.notes.map(note =>
            note.id === id ? updated : note
          )
        })
      )
    },
    setFilter: value => set(() => ({ filter: value })),
    initialize: async () => {
      const notes = await noteService.getAll()
      set(() => ({ notes }))
    }
  }
})))
export default useNoteStore

export const useNotes = () => {
  const notes = useNoteStore((state) => state.notes)
  const filter = useNoteStore((state) => state.filter)
  if (filter === 'important') return notes.filter(n => n.important)
  if (filter === 'nonimportant') return notes.filter(n => !n.important)
  return notes
}
export const useFilter = () => useNoteStore((state) => state.filter)
export const useNoteActions = () => useNoteStore((state) => state.actions)
