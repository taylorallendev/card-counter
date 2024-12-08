import { describe, it, expect, beforeEach } from 'vitest'
import { BlackjackEngine } from '../blackjack'
import { calculateScore } from '@/lib/utils'

describe('BlackjackEngine', () => {
  let engine: BlackjackEngine

  beforeEach(() => {
    engine = new BlackjackEngine()
  })

  describe('initial state', () => {
    it('should initialize with correct number of cards', () => {
      const state = engine.getState()
      expect(state.playerHand).toHaveLength(2)
      expect(state.dealerHand).toHaveLength(2)
      expect(state.gameStatus).toBe('playing')
    })

    it('should start with a valid deck', () => {
      const state = engine.getState()
      expect(state.deck.length).toBeGreaterThan(0)
      // Each card should have a valid suit and rank
      state.deck.forEach(card => {
        expect(card).toHaveProperty('suit')
        expect(card).toHaveProperty('rank')
      })
    })
  })

  describe('hit', () => {
    it('should add a card to player hand', () => {
      const initialState = engine.getState()
      const initialHandSize = initialState.playerHand.length

      engine.hit()

      const newState = engine.getState()
      expect(newState.playerHand.length).toBe(initialHandSize + 1)
    })

    it('should not allow hit when game is over', () => {
      engine.stand() // End the game
      const stateBeforeHit = engine.getState()

      engine.hit()

      const stateAfterHit = engine.getState()
      expect(stateAfterHit.playerHand).toEqual(stateBeforeHit.playerHand)
    })

    it('should set status to playerBust if score exceeds 21', () => {
      // Force player to bust by hitting multiple times
      for (let i = 0; i < 5; i++) {
        engine.hit()
        const state = engine.getState()
        if (state.gameStatus === 'playerBust') break
      }

      const finalState = engine.getState()
      expect(finalState.gameStatus).toBe('playerBust')
      expect(calculateScore(finalState.playerHand)).toBeGreaterThan(21)
    })
  })

  describe('stand', () => {
    it('should deal cards to dealer until score is 17 or higher', () => {
      engine.stand()
      const state = engine.getState()

      const dealerScore = calculateScore(state.dealerHand)
      expect(dealerScore).toBeGreaterThanOrEqual(17)
    })

    it('should not allow further actions after standing', () => {
      engine.stand()
      const stateAfterStand = engine.getState()

      engine.hit() // Try to hit after standing

      const stateAfterHit = engine.getState()
      expect(stateAfterHit).toEqual(stateAfterStand)
    })

    it('should correctly determine winner', () => {
      engine.stand()
      const state = engine.getState()

      const validGameStates = ['dealerBust', 'dealerWin', 'playerWin', 'tie']
      expect(validGameStates).toContain(state.gameStatus)
    })
  })
})
