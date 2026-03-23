import * as React from "react";

import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, onChange, ...props }, ref) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length > 0) {
      const textarea = e.target;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const currentValue = textarea.value;
      const capitalizedValue = currentValue.charAt(0).toUpperCase() + currentValue.slice(1);

      if (currentValue !== capitalizedValue) {
        textarea.value = capitalizedValue;
        textarea.setSelectionRange(start, end);
      }
    }

    if (onChange) {
      onChange(e);
    }
  };

  return (
    <textarea
      onChange={handleChange}
      autoCapitalize="sentences"
      className={cn(
        "flex min-h-[120px] w-full rounded-xl border border-input bg-background px-4 py-3 ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-xl resize-y",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
