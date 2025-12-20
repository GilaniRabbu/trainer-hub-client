import { FaUserTie } from "react-icons/fa";
import Link from "next/link";

interface LogoProps {
  onClick?: () => void;
}

export default function Logo({ onClick }: LogoProps) {
  return (
    <Link href="/" onClick={onClick} className="flex items-center space-x-2">
      <FaUserTie className="w-4 h-4" />
      <span className="font-bold">TrainerHub</span>
    </Link>
  );
}
