import React from "react";
import { Github } from "lucide-react"; // Icon for GitHub
import { Button } from "../ui/button";
import { signIn } from "next-auth/react";
import { FaGoogle } from "react-icons/fa";
interface Props {
  isSignIn?: boolean;
}
const SocialButtons: React.FC<Props> = ({ isSignIn = true }) => {
  return (
    <div className="flex items-center flex-wrap my-2 gap-2">
      {/* Google Sign-In/Sign-Up Button */}
      <Button
        onClick={() => signIn("google")}
        className="w-full bg-background text-accent-foreground shadow-xl"
      >
        <FaGoogle className="mr-2" />
        Sign {isSignIn ? "in" : "up"} with Google
      </Button>

      {/* GitHub Sign-In/Sign-Up Button */}
      <Button
        onClick={() => signIn("github")}
        className="w-full bg-foreground text-background shadow-xl"
      >
        <Github className="mr-2" size={20} />
        Sign {isSignIn ? "in" : "up"} with GitHub
      </Button>
    </div>
  );
};

export default SocialButtons;
