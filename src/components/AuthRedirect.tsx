"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthRedirect() {
    const router = useRouter();

    useEffect(() => {
        // Run only on client side
        if (typeof window !== "undefined") {
            const user = localStorage.getItem("konebd_user");
            if (user) {
                router.push("/catalog");
            }
        }
    }, [router]);

    return null;
}
