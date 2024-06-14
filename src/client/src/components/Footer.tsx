import { Facebook, Twitter, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 py-4 text-center text-white">
      <div className="flex justify-center space-x-4">
        <a
          href="https://www.facebook.com/healthhub"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Facebook className="w-6 h-6 text-gray-300 hover:text-white" />
        </a>
        <a
          href="https://twitter.com/healthhub"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Twitter className="w-6 h-6 text-gray-300 hover:text-white" />
        </a>
        <a
          href="https://www.instagram.com/healthhub"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Instagram className="w-6 h-6 text-gray-300 hover:text-white" />
        </a>
      </div>
      <p className="mt-4">
        &copy; {new Date().getFullYear()} Azra. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
