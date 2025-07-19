import Link from "next/link";
import getServerSession from "@/lib/server-session";
import Logout from "@/components/ui/Logout";
export default async function Home() {
  const session = await getServerSession();
  
  return (
    <div className="flex flex-col items-center justify-center my-20">
      <h1 className="text-4xl font-bold tracking-tighter">Next.js + Hono + BetterAuth 🔥</h1>
      <div className="flex mt-10 items-center justify-center gap-4">
        {session ? (
          <>
            You are signed in as {session.user.email}. <Logout />
          </>
        ) : (
          <>
            <Link href="/login" className="text-2xl font-bold">Login</Link>
            <Link href="/signup" className="text-2xl font-bold">Signup</Link>
          </>
        )}
      </div>
      <div className="flex mt-10 items-center flex-col justify-center gap-4">
        <Link href="/protected" className="text-2xl font-bold underline">Fetch data from protected route</Link>
        <Link href="/normal" className="text-2xl font-bold underline">Fetch data from non-protected route</Link>
      </div>
    </div>
  );
}
