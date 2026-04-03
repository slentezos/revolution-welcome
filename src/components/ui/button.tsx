import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-xl font-semibold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0 active:scale-[0.98]",
  {
    variants: {
      variant: {
        // Mise à jour pour utiliser la couleur du thème Kalimera
        default: "bg-[#1B2333] text-white hover:bg-[#1B2333]/90 shadow-md",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border-2 border-[hsl(var(--gold))] bg-transparent text-foreground hover:bg-[hsl(var(--gold))]/10 transition-all",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // Ajout d'un variant luxe pour vos CTAs
        luxury: "bg-[hsl(var(--gold))] text-[#1B2333] hover:brightness-110 shadow-luxury font-bold",
      },
      size: {
        // On augmente massivement les hauteurs pour le confort Senior
        default: "h-14 px-8 py-3",
        sm: "h-11 rounded-lg px-4 text-lg",
        lg: "h-16 rounded-2xl px-12 text-2xl", // Pour les gros boutons "Commencer"
        xl: "h-20 rounded-2xl px-14 text-2xl tracking-wide", // Taille maximale
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
