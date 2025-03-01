import AccountDeletePage from "@/components/accountDelete"
import { Suspense } from "react";

export default function DeleteAccountPage() {

    return (
        <Suspense>
             <AccountDeletePage />
        </Suspense>
       
    )
}