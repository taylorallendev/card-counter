'use client'

import React, { useState, useEffect } from 'react';
import { Card as CardComponent } from './card'
import { Card, createDeck, calculateScore } from '@/lib/utils';
import { RefreshCw, Plus, HandIcon as HandStop, Trophy, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/lib/hooks/use-toast';
import { Card as UICard, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/_components/ui/card";
import { Button } from '../_components/ui/button';

export default function BlackjackPage() {
    const [deck, setDeck] = useState<Card[]>([]);
    const [playerHand, setPlayerHand] = useState<Card[]>([]);
    const [dealerHand, setDealerHand] = useState<Card[]>([]);
    const [gameStatus, setGameStatus] = useState<'playing' | 'revealing' | 'playerBust' | 'dealerBust' | 'playerWin' | 'dealerWin' | 'tie'>('playing');
    const [revealIndex, setRevealIndex] = useState<number>(0);
    const { toast } = useToast();

    const isGameOver = !['playing', 'revealing'].includes(gameStatus);
    const didPlayerWin = gameStatus === 'playerWin' || gameStatus === 'dealerBust';
    const isTie = gameStatus === 'tie';

    useEffect(() => {
        startNewGame();
    }, []);

    useEffect(() => {
        if (gameStatus === 'playing' || gameStatus === 'revealing') return;

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
            },
            revealing: {
                title: "Revealing Dealer's Hand",
                description: "Showing dealer's hidden card",
                variant: "secondary" as const
            }
        };

        const status = messages[gameStatus];
        if (status) {
            toast({
                title: status.title,
                description: status.description,
                variant: status.variant,
            });
        }
    }, [gameStatus, toast]);

    function startNewGame() {
        const newDeck = createDeck();
        setDeck(newDeck);
        setPlayerHand([newDeck.pop()!, newDeck.pop()!]);
        setDealerHand([newDeck.pop()!, newDeck.pop()!]);
        setGameStatus('playing');
        setRevealIndex(0);
    }

    function hit() {
        if (gameStatus !== 'playing') return;

        const newPlayerHand = [...playerHand, deck.pop()!];
        setPlayerHand(newPlayerHand);
        setDeck([...deck]);

        if (calculateScore(newPlayerHand) > 21) {
            setGameStatus('playerBust');
        }
    }

    function stand() {
        if (gameStatus !== 'playing') return;

        setGameStatus('revealing');
        let newDealerHand = [...dealerHand];
        let newDeck = [...deck];

        // First reveal the hidden card
        const revealHiddenCard = () => {
            setRevealIndex(1);

            // After revealing hidden card, start drawing new cards if needed
            setTimeout(() => {
                while (calculateScore(newDealerHand) < 17) {
                    newDealerHand.push(newDeck.pop()!);
                }
                setDealerHand(newDealerHand);
                setDeck(newDeck);

                // Reveal each new card with animation
                let currentIndex = 2;
                const revealInterval = setInterval(() => {
                    if (currentIndex <= newDealerHand.length) {
                        setRevealIndex(currentIndex);
                        currentIndex++;
                    } else {
                        clearInterval(revealInterval);
                        // Determine game outcome after all cards are revealed
                        setTimeout(() => {
                            const playerScore = calculateScore(playerHand);
                            const dealerScore = calculateScore(newDealerHand);

                            if (dealerScore > 21) {
                                setGameStatus('dealerBust');
                            } else if (playerScore > dealerScore) {
                                setGameStatus('playerWin');
                            } else if (dealerScore > playerScore) {
                                setGameStatus('dealerWin');
                            } else {
                                setGameStatus('tie');
                            }
                        }, 500); // Wait a bit before showing final result
                    }
                }, 800); // Time between each card reveal
            }, 1000); // Time to show hidden card before drawing new ones
        };

        // Start the reveal sequence
        setTimeout(revealHiddenCard, 500);
    }

    return (
        <div className="min-h-screen bg-background text-foreground p-4 flex flex-col items-center justify-center">
            <div className="w-full max-w-4xl bg-slate-300 rounded-lg border border-border/50 p-8 shadow-lg backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-12 bg-muted rounded-lg p-6 shadow-md border border-border/20"
                >
                    <h2 className="text-2xl font-semibold mb-4 text-primary">Dealer's Hand</h2>
                    <div className="flex space-x-4 mb-4 overflow-x-auto pb-4">
                        {dealerHand.map((card, index) => (
                            <motion.div
                                key={index}
                                initial={index > revealIndex ? { rotateY: -180, opacity: 0 } : false}
                                animate={index <= revealIndex ? { rotateY: 0, opacity: 1 } : { rotateY: -180, opacity: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <CardComponent
                                    card={card}
                                    isHidden={gameStatus === 'playing' && index === 1}
                                />
                            </motion.div>
                        ))}
                    </div>
                    {gameStatus !== 'playing' && (
                        <p className="text-xl font-medium text-primary">
                            Score: {calculateScore(dealerHand)}
                        </p>
                    )}
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mb-12 bg-muted rounded-lg p-6 shadow-md border border-border/20"
                >
                    <h2 className="text-2xl font-semibold mb-4 text-primary">Your Hand</h2>
                    <div className="flex space-x-4 mb-4 overflow-x-auto pb-4">
                        {playerHand.map((card, index) => (
                            <CardComponent key={index} card={card} />
                        ))}
                    </div>
                    <p className="text-xl font-medium text-primary">
                        Score: {calculateScore(playerHand)}
                    </p>
                </motion.div>
            </div>
            <div className="flex justify-center space-x-4 mt-8">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2 px-4 rounded-md flex items-center shadow transition-colors duration-200 disabled:opacity-50"
                    onClick={hit}
                    disabled={gameStatus !== 'playing'}
                >
                    <Plus className="mr-2" size={20} /> Hit
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-secondary hover:bg-secondary/90 text-primary font-medium py-2 px-4 rounded-md flex items-center shadow transition-colors duration-200 disabled:opacity-50"
                    onClick={stand}
                    disabled={gameStatus !== 'playing'}
                >
                    <HandStop className="mr-2" size={20} /> Stand
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-accent hover:bg-accent/90 text-accent-foreground font-medium py-2 px-4 rounded-md flex items-center shadow transition-colors duration-200"
                    onClick={startNewGame}
                >
                    <RefreshCw className="mr-2" size={20} /> New Game
                </motion.button>
            </div>
            {isGameOver && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                    >
                        <UICard className="w-[350px] shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center justify-center text-2xl">
                                    {didPlayerWin && (
                                        <>
                                            <Trophy className="w-8 h-8 text-primary mr-2" />
                                            Victory!
                                        </>
                                    )}
                                    {!didPlayerWin && !isTie && (
                                        <>
                                            <XCircle className="w-8 h-8 text-destructive mr-2" />
                                            Game Over
                                        </>
                                    )}
                                    {isTie && (
                                        <>
                                            <HandStop className="w-8 h-8 text-muted-foreground mr-2" />
                                            It's a Tie!
                                        </>
                                    )}
                                </CardTitle>
                                <CardDescription className="text-center text-lg mt-2">
                                    {didPlayerWin && "Congratulations on your win!"}
                                    {!didPlayerWin && !isTie && "Better luck next time!"}
                                    {isTie && "Nobody wins this round."}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="text-center">
                                <div className="space-y-2">
                                    <p>Your Score: {calculateScore(playerHand)}</p>
                                    <p>Dealer's Score: {calculateScore(dealerHand)}</p>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-center">
                                <Button
                                    onClick={startNewGame}
                                    className="w-full"
                                    variant={didPlayerWin ? "default" : isTie ? "secondary" : "outline"}
                                >
                                    <RefreshCw className="mr-2 h-4 w-4" />
                                    Play Again
                                </Button>
                            </CardFooter>
                        </UICard>
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
}
