export type Suit = '♠' | '♥' | '♦' | '♣';
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

export interface Card {
  suit: Suit;
  rank: Rank;
}

export type GameStatus = 'playing' | 'revealing' | 'playerBust' | 'dealerBust' | 'playerWin' | 'dealerWin' | 'tie';

export interface GameState {
  deck: Card[];
  playerHand: Card[];
  dealerHand: Card[];
  gameStatus: GameStatus;
  revealIndex: number;
}
