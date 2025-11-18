import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaHome, FaUser, FaHashtag } from "react-icons/fa";

export default function Sidebar({first}) {
    const router = useRouter();
    const [id] = useAuth();

    const accountPage = () => {
        if (id != "") {
            router.push("/accounts/" + id + "?myaccount=true")
        } else {
            router.push("/login")
        }
    }

    const navItems = [
        {
            icon: FaHome,
            label: "ホーム",
            href: "/home",
            active: first === "home"
        },
        {
            icon: FaUser,
            label: "プロフィール",
            onClick: accountPage,
            active: first === "accounts"
        }
    ];

    return (
        <div className="h-full bg-white border-r border-gray-200 flex flex-col">
            {/* Logo/Brand */}
            <div className="p-2 lg:p-4 border-b border-gray-200">
                <div className="hidden lg:block">
                    <h1 className="text-xl font-bold text-primary-600">AI SNS</h1>
                </div>
                <div className="lg:hidden flex justify-center">
                    <FaHashtag className="text-primary-600 text-lg" />
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-2 lg:p-4">
                <ul className="space-y-1 lg:space-y-2">
                    {navItems.map((item, index) => (
                        <li key={index}>
                            {item.href ? (
                                <Link href={item.href}>
                                    <div className={`flex items-center justify-center lg:justify-start p-2 lg:p-3 rounded-lg transition-colors duration-200 cursor-pointer ${
                                        item.active 
                                            ? 'bg-primary-100 text-primary-700' 
                                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                    }`}>
                                        <item.icon className="text-lg lg:text-xl" />
                                        <span className="ml-3 hidden lg:block font-medium">{item.label}</span>
                                    </div>
                                </Link>
                            ) : (
                                <div 
                                    onClick={item.onClick}
                                    className={`flex items-center justify-center lg:justify-start p-2 lg:p-3 rounded-lg transition-colors duration-200 cursor-pointer ${
                                        item.active 
                                            ? 'bg-primary-100 text-primary-700' 
                                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                    }`}
                                >
                                    <item.icon className="text-lg lg:text-xl" />
                                    <span className="ml-3 hidden lg:block font-medium">{item.label}</span>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </nav>

            {/* User info */}
            {id && (
                <div className="p-2 lg:p-4 border-t border-gray-200">
                    <div className="flex items-center justify-center lg:justify-start">
                        <div className="w-6 h-6 lg:w-8 lg:h-8 bg-primary-600 rounded-full flex items-center justify-center">
                            <FaUser className="text-white text-xs lg:text-sm" />
                        </div>
                        <div className="ml-3 hidden lg:block">
                            <p className="text-sm font-medium text-gray-900">ログイン中</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}