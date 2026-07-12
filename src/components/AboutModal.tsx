import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Github, Linkedin, Mail } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function LeetCodeIcon({
  size = 24,
  className,
  ...props
}: { size?: number } & React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path d="M13.483 0v7.425l5.738 5.738v7.425L24 13.483V0h-5.738l-4.779 4.779V0h-.001zm0 7.425L8.704 12.204v7.425l4.779-4.779V7.425h-.001zM8.704 0v7.425L3.925 12.204v7.425l9.558-9.558V0H8.704z" />
    </svg>
  );
}

const socialLinks = [
  {
    name: 'GitHub',
    href: 'https://github.com/FireStormy1',
    icon: Github,
    label: 'Visit Saswat Dixit on GitHub',
    external: true,
  },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/in/saswatdixit/',
    icon: Linkedin,
    label: 'Visit Saswat Dixit on LinkedIn',
    external: true,
  },
  {
    name: 'LeetCode',
    href: 'https://leetcode.com/u/FireStormy/',
    icon: LeetCodeIcon,
    label: 'Visit Saswat Dixit on LeetCode',
    external: true,
  },
  {
    name: 'Email',
    href: 'mailto:saswatdixit01@gmail.com',
    icon: Mail,
    label: 'Email Saswat Dixit',
    external: false,
  },
];

export function AboutModal({ isOpen, onClose }: AboutModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.5, bounce: 0.3 }}
            className="relative w-full max-w-2xl glass-panel rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between p-8 border-b border-white/5 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary" />
              <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full blur-[100px] opacity-20 pointer-events-none bg-primary" />

              <div className="z-10">
                <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight">
                  Saswat <span className="text-primary">Dixit</span>
                </h2>
                <p className="mt-2 text-muted-foreground text-sm sm:text-base">
                  B.Tech in Computer Science & Engineering, Silicon University
                </p>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/10 transition-colors text-muted-foreground hover:text-white z-10"
                aria-label="Close about modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="p-8 space-y-8">
              <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  I enjoy building things that work beautifully in the real world, not just on paper. Every project is a chance to sharpen my craft and ship something meaningful.
                </p>
              </div>

              {/* Connect with Me */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                  <span className="text-sm uppercase tracking-widest text-muted-foreground font-medium">
                    Connect with Me
                  </span>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                </div>

                <div className="flex flex-wrap justify-center gap-4">
                  {socialLinks.map((link) => (
                    <Tooltip key={link.name}>
                      <TooltipTrigger asChild>
                        <a
                          href={link.href}
                          target={link.external ? '_blank' : undefined}
                          rel={link.external ? 'noopener noreferrer' : undefined}
                          aria-label={link.label}
                          className="group relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl glass text-muted-foreground hover:text-white transition-all duration-300 hover:scale-110 hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(79,195,247,0.4)] hover:border-primary/50"
                        >
                          <link.icon
                            size={22}
                            className="relative z-10 transition-transform duration-300 group-hover:scale-110"
                          />
                          <span className="absolute inset-0 rounded-2xl bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </a>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" sideOffset={8}>
                        <p>{link.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
