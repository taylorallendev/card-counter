import { Card, GameState, GameStatus } from './types';
import { createDeck, calculateScore } from '../utils';

export class BlackjackEngine {
  private state: GameState;

  constructor() {
    this.state = this.getInitialState();
  }

  private getInitialState(): GameState {
    const deck = createDeck();
    return {
      deck,
      playerHand: [deck.pop()!, deck.pop()!],
      dealerHand: [deck.pop()!, deck.pop()!],
      gameStatus: 'playing',
      revealIndex: 0,
    };
  }

  public getState(): GameState {
    return { ...this.state };
  }

  public reset(): void {
    this.state = this.getInitialState();
  }

  public hit(): void {
    if (this.state.gameStatus !== 'playing') return;

    const newPlayerHand = [...this.state.playerHand, this.state.deck.pop()!];
    this.state.playerHand = newPlayerHand;

    if (calculateScore(newPlayerHand) > 21) {
      this.state.gameStatus = 'playerBust';
    }
  }

  public stand(): void {
    if (this.state.gameStatus !== 'playing') return;

    this.state.gameStatus = 'revealing';
    let newDealerHand = [...this.state.dealerHand];

    while (calculateScore(newDealerHand) < 17) {
      newDealerHand.push(this.state.deck.pop()!);
    }

    this.state.dealerHand = newDealerHand;
    this.determineWinner();
  }

  private determineWinner(): void {
    const dealerScore = calculateScore(this.state.dealerHand);
    const playerScore = calculateScore(this.state.playerHand);

    if (dealerScore > 21) {
      this.state.gameStatus = 'dealerBust';
    } else if (dealerScore > playerScore) {
      this.state.gameStatus = 'dealerWin';
    } else if (dealerScore < playerScore) {
      this.state.gameStatus = 'playerWin';
    } else {
      this.state.gameStatus = 'tie';
    }
  }
}
