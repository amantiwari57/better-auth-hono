"use client";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function Logout() {
  const router = useRouter();
  return <button onClick={async () => { await authClient.signOut({
        fetchOptions: {
            credentials: "include",
            onSuccess: () => {
               router.push("/")
            },
        },
    })}} className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-md tracking-tighter font-bold">Logout</button>;
}

