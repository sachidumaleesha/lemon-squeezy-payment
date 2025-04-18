import { Button } from "@/components/ui/button";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <SignedIn>
        <UserButton />
      </SignedIn>
      <SignedOut>
        <div className="flex gap-2">
          <Button size="sm" className="cursor-pointer" asChild>
            <SignUpButton mode="modal"/>
          </Button>
          <Button size="sm" className="cursor-pointer" asChild>
            <SignInButton mode="modal" />
          </Button>
        </div>
      </SignedOut>
    </div>
  );
}
