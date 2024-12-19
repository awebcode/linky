import React from "react";
import { Github } from "lucide-react"; // Icon for GitHub
import { Button } from "../ui/button";
import { signIn } from "next-auth/react";
import { FaGoogle } from "react-icons/fa";
interface Props {
  isSignIn?: boolean;
}
const AuthButtons: React.FC<Props> = ({ isSignIn = true }) => {
  return (
    <div className="flex items-center flex-wrap gap-2">
      {/* Google Sign-In/Sign-Up Button */}
      <Button
        onClick={() => signIn("google")}
        className="flex items-center justify-center w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none transition duration-200"
      >
        <FaGoogle className="mr-2" />
        Sign {isSignIn ? "in" : "up"} with Google
      </Button>

      {/* GitHub Sign-In/Sign-Up Button */}
      <Button
        onClick={() => signIn("github")}
        className="flex items-center justify-center w-full p-3 bg-card-foreground text-card rounded-lg  focus:outline-none transition duration-200"
      >
        <Github className="mr-2" size={20} />
        Sign {isSignIn ? "in" : "up"} with GitHub
      </Button>
    </div>
  );
};

export default AuthButtons;
