import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navLinks = [{
    label: "Players",
    href: "/players"
  }, {
    label: "Trainers",
    href: "/trainers"
  }, {
    label: "For Clubs",
    href: "/clubs"
  }, {
    label: "How It Works",
    href: "/#how-it-works"
  }, {
    label: "About Us",
    href: "/about"
  }, {
    label: "Contact",
    href: "/#contact"
  }];
  return <motion.nav className="fixed top-0 left-0 right-0 z-50 glass-strong" initial={{
    y: -100
  }} animate={{
    y: 0
  }} transition={{
    duration: 0.5
  }}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
              <span className="text-xl font-bold text-primary-foreground">i</span>
            </div>
            <span className="text-xl font-bold text-foreground">iHandball</span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => <a key={link.label} href={link.href} className="text-muted-foreground hover:text-foreground transition-colors duration-200">
                {link.label}
              </a>)}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <a href="/auth"><Button variant="ghost">Log In</Button></a>
            <a href="/book-call">
              <Button variant="default">Schedule Call</Button>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 text-foreground" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && <motion.div className="md:hidden py-4 border-t border-border" initial={{
        opacity: 0,
        height: 0
      }} animate={{
        opacity: 1,
        height: "auto"
      }} exit={{
        opacity: 0,
        height: 0
      }}>
            <div className="flex flex-col gap-4">
              {navLinks.map(link => <a key={link.label} href={link.href} className="text-muted-foreground hover:text-foreground transition-colors duration-200 py-2" onClick={() => setIsOpen(false)}>
                  {link.label}
                </a>)}
              <div className="flex flex-col gap-2 pt-4 border-t border-border">
                <a href="/auth" className="w-full"><Button variant="ghost" className="w-full">Log In</Button></a>
                <a href="/book-call" className="w-full">
                  <Button variant="default" className="w-full">Schedule Call</Button>
                </a>
              </div>
            </div>
          </motion.div>}
      </div>
    </motion.nav>;
};
export default Navbar;