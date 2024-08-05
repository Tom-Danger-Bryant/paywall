"use client";

import { AuthForm } from "@/components/AuthForm";
import { withTurnkey } from "@/hoc";

function Home() {
  return (
    <main>
      <div className="flex w-full h-screen justify-center items-center">
        <AuthForm />
      </div>
    </main>
  );
}

export default withTurnkey(Home);
