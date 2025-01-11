"use client"

import { useParams, usePathname } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function AccountPage() {

    const [accountId, setAccountId] = useState("");
    const [accountName, setAccountName] = useState("");
    const [loading, setLoading] = useState(true);
    const [followerNum, setFollowerNum] = useState(0);
    const [followeeNum, setFolloweeNum] = useState(0);
    const [statusCode, setStatusCode] = useState(0)
    const params = useParams();

    const id = localStorage.getItem("id");

    useEffect(() => {

        const getAccount = async () => {
            const res = await fetch("/api/accounts/" + params.account_id, {
                method: "GET",
                credentials: 'include'
            });
            if (res.ok) {
                const data = await res.json();
                console.log(data);
                setAccountName(data.name);
                setFolloweeNum(data.followeeNum);
                setFollowerNum(data.followerNum);
            }
            setStatusCode(res.status)
            setLoading(false)
        }

        setAccountId(params.account_id);
        getAccount();
    }, [params])

    return (
        <div>
            {loading ? (<div>loading...</div>) :
                (
                    <div>
                    {(200 <= statusCode) && (statusCode <= 299) && 
                        <div className="container mt-3">
                            <span style={{display: "flex"}}>
                                <h3>{accountName}</h3>
                                {id != accountId && <div className="container">
                                    <button className="btn btn-primary rounded-pill">フォロー</button>
                                </div>}
                            </span>
                            <div className="container">
                                <div>フォロワー:&nbsp;{followerNum}</div>
                                <div>フォロー中:&nbsp;{followeeNum}</div>
                            </div>
                            <div>

                            </div>
                        </div>
                    }
                    {statusCode == 404 && 
                        <div className="container mt-3">
                            <h3>アカウントが見つかりません</h3>
                        </div>
                    }
                    </div>
                )
            }
        </div>
    );
}