import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/_components/ui/card";
import { Button } from "./_components/ui/button";
import { Trophy, PlayCircle } from "lucide-react";
import { auth } from '@clerk/nextjs/server'

export default async function Home() {
  const { userId } = await auth();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-5xl font-extrabold tracking-tight text-center sm:text-[5rem] text-gray-700">
          Card Counter
        </h1>

        <Card className="w-full max-w-md bg-white/10">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-gray-600">Welcome to Card Counter</CardTitle>
            <CardDescription className="text-center text-gray-400">
              Test your skills in this exciting game of Blackjack
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4 text-center">
            <Trophy className="w-16 h-16 text-yellow-500" />
            <p className="text-lg text-gray-600">
              Challenge the dealer, make strategic decisions, and aim for 21!
            </p>
          </CardContent>
          <CardFooter className="flex justify-center pb-6">
            {userId ? (
              <Link href="/game">
                <Button className="bg-gray-800 hover:bg-gray-700 text-white">
                  <PlayCircle className="mr-2 h-5 w-5" />
                  Play Now
                </Button>
              </Link>
            ) : (
              <Link href="/sign-in">
                <Button className="bg-gray-800 hover:bg-gray-700 text-white">
                  Sign In to Play
                </Button>
              </Link>
            )}
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
