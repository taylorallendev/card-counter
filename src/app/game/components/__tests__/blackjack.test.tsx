import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BlackjackGame } from '../blackjack'
import { useToast } from '@/lib/hooks/use-toast'

// Mock the toast hook
const mockToast = vi.fn()
vi.mock('@/lib/hooks/use-toast', () => ({
  useToast: () => ({
    toast: mockToast
  })
}))

describe('BlackjackGame', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders initial game state', () => {
    render(<BlackjackGame />)

    expect(screen.getByText('Dealer\'s Hand')).toBeInTheDocument()
    expect(screen.getByText('Your Hand')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /hit/i })).toBeEnabled()
    expect(screen.getByRole('button', { name: /stand/i })).toBeEnabled()
  })

  it('allows player to hit and updates the game state', async () => {
    render(<BlackjackGame />)

    const initialCards = screen.getAllByRole('img').length
    const hitButton = screen.getByRole('button', { name: /hit/i })

    fireEvent.click(hitButton)

    // Wait for animation and state update
    await new Promise(resolve => setTimeout(resolve, 500))

    const newCards = screen.getAllByRole('img').length
    expect(newCards).toBe(initialCards + 1)
  })

  it('allows player to stand and reveals dealer\'s cards', () => {
    render(<BlackjackGame />)

    const standButton = screen.getByRole('button', { name: /stand/i })
    fireEvent.click(standButton)

    // After standing, the game should be over and buttons disabled
    expect(screen.getByRole('button', { name: /hit/i })).toBeDisabled()
    expect(screen.getByRole('button', { name: /stand/i })).toBeDisabled()
  })

  it('allows starting a new game', () => {
    render(<BlackjackGame />)

    const newGameButton = screen.getByRole('button', { name: /new game/i })
    fireEvent.click(newGameButton)

    // After new game, buttons should be enabled
    expect(screen.getByRole('button', { name: /hit/i })).toBeEnabled()
    expect(screen.getByRole('button', { name: /stand/i })).toBeEnabled()
  })

  it('shows correct number of cards initially', async () => {
    render(<BlackjackGame />)

    // Wait for initial animation
    await new Promise(resolve => setTimeout(resolve, 500))

    const cards = screen.getAllByRole('img')
    expect(cards.length).toBe(4) // 2 for player, 2 for dealer
  })

  it('shows toast notification when game ends', async () => {
    render(<BlackjackGame />)

    // Force the game to end by standing
    const standButton = screen.getByRole('button', { name: /stand/i })
    fireEvent.click(standButton)

    // Wait for state update and effect to run
    await new Promise(resolve => setTimeout(resolve, 500))

    // Toast should be called with game result
    expect(mockToast).toHaveBeenCalled()
  })
})
