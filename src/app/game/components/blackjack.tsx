'use client'

import React, { useState, useEffect } from 'react';
import { Card as CardComponent } from '../card';
import { BlackjackEngine } from '@/lib/blackjack/blackjack';
import { RefreshCw, Plus, HandIcon as HandStop, Trophy, XCircle } from 'lucide-react';
import { useToast } from '@/lib/hooks/use-toast';
import { Card as UICard, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/_components/ui/card";
import { Button } from '@/app/_components/ui/button';
import { GameState } from '@/lib/blackjack/types';

export function BlackjackGame() {
    const [gameEngine] = useState(() => new BlackjackEngine());
    const [gameState, setGameState] = useState<GameState>(gameEngine.getState());
    const { toast } = useToast();

    const isGameOver = !['playing', 'revealing'].includes(gameState.gameStatus);
    const didPlayerWin = gameState.gameStatus === 'playerWin' || gameState.gameStatus === 'dealerBust';
    const isTie = gameState.gameStatus === 'tie';

    useEffect(() => {
        if (gameState.gameStatus === 'playing' || gameState.gameStatus === 'revealing') return;

        const messages = {
            playerBust: {
                title: "You bust!",
                description: "Dealer wins this round.",
                variant: "destructive" as const
            },
            dealerBust: {
                title: "Dealer busts!",
                description: "You win this round!",
                variant: "default" as const
            },
            playerWin: {
                title: "Congratulations!",
                description: "You win this round!",
                variant: "default" as const
            },
            dealerWin: {
                title: "Dealer wins",
                description: "Better luck next time!",
                variant: "destructive" as const
            },
            tie: {
                title: "It's a tie!",
                description: "The game is a draw.",
                variant: "secondary" as const
            }
        };

        const status = messages[gameState.gameStatus];
        if (status) {
            toast({
                title: status.title,
                description: status.description,
                variant: status.variant,
            });
        }
    }, [gameState.gameStatus, toast]);

    function startNewGame() {
        gameEngine.reset();
        setGameState(gameEngine.getState());
    }

    function hit() {
        gameEngine.hit();
        setGameState(gameEngine.getState());
    }

    function stand() {
        gameEngine.stand();
        setGameState(gameEngine.getState());
    }

    return (
        <div className="container mx-auto px-4 h-full">
            <div className="mb-8 flex justify-between">
                <Button
                    onClick={startNewGame}
                    variant="outline"
                    className="flex items-center gap-2"
                >
                    <RefreshCw className="h-4 w-4" />
                    New Game
                </Button>
            </div>

            <div className="grid gap-8">
                <UICard>
                    <CardHeader>
                        <CardTitle>Dealer&apos;s Hand</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-4">
                            {gameState.dealerHand.map((card, index) => (
                                <CardComponent
                                    key={`${card.suit}-${card.rank}-${index}`}
                                    card={card}
                                    isHidden={index === 1 && gameState.gameStatus === 'playing'}
                                />
                            ))}
                        </div>
                    </CardContent>
                </UICard>

                <UICard>
                    <CardHeader>
                        <CardTitle>Your Hand</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-4">
                            {gameState.playerHand.map((card, index) => (
                                <CardComponent
                                    key={`${card.suit}-${card.rank}-${index}`}
                                    card={card}
                                />
                            ))}
                        </div>
                    </CardContent>
                    <CardFooter className="flex gap-4">
                        <Button
                            onClick={hit}
                            disabled={isGameOver}
                            className="flex items-center gap-2"
                        >
                            <Plus className="h-4 w-4" />
                            Hit
                        </Button>
                        <Button
                            onClick={stand}
                            disabled={isGameOver}
                            variant="secondary"
                            className="flex items-center gap-2"
                        >
                            <HandStop className="h-4 w-4" />
                            Stand
                        </Button>
                    </CardFooter>
                </UICard>
            </div>
        </div>
    );
}
