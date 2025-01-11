"use client"

import { useParams, usePathname } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function AccountPage() {

    const [accountId, setAccountId] = useState("");
    const [accountName, setAccountName] = useState("");
    const [loading, setLoading] = useState(true);
    const params = useParams();

    useEffect(() => {

        const getAccount = async () => {
            const res = await fetch("http://localhost:3000/api/accounts/" + params.account_id, {
                method: "GET", 
                credentials: 'include'
            });
        }

        setAccountId(params.account_id);
        setLoading(false);
        getAccount();
    }, [params]) 

    return (
        <div>
            {loading ? (<div>loading...</div>) : 
            (
                <div>
                    {accountId}
                </div>
            )
            }
        </div>
    );
}