"use client";

import * as React from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useT } from "@/components/language-provider";

type StrengthLevel = 0 | 1 | 2 | 3 | 4;

/** Dictionary keys per strength level. */
const STRENGTH_LABEL_KEYS: Record<StrengthLevel, string> = {
  0: "passwordStrength.tooWeak",
  1: "passwordStrength.weak",
  2: "passwordStrength.fair",
  3: "passwordStrength.good",
  4: "passwordStrength.strong",
};

const ACTIVE_SEGMENT_COLORS: Record<StrengthLevel, string> = {
  0: "bg-hover-bg-strong",
  1: "bg-red",
  2: "bg-orange",
  3: "bg-yellow",
  4: "bg-green",
};

const LABEL_TEXT_COLORS: Record<StrengthLevel, string> = {
  0: "text-foreground-subtle",
  1: "text-red",
  2: "text-orange",
  3: "text-yellow",
  4: "text-green",
};

interface Requirement {
  labelKey: string;
  test: (pw: string) => boolean;
}

const REQUIREMENTS: Requirement[] = [
  { labelKey: "passwordStrength.reqLength", test: (pw) => pw.length >= 8 },
  { labelKey: "passwordStrength.reqLowercase", test: (pw) => /[a-z]/.test(pw) },
  { labelKey: "passwordStrength.reqUppercase", test: (pw) => /[A-Z]/.test(pw) },
  { labelKey: "passwordStrength.reqNumber", test: (pw) => /\d/.test(pw) },
  {
    labelKey: "passwordStrength.reqSpecial",
    test: (pw) => /[^a-zA-Z0-9]/.test(pw),
  },
];

function computeStrength(pw: string): StrengthLevel {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[a-z]/.test(pw)) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^a-zA-Z0-9]/.test(pw)) score++;
  return Math.min(4, score) as StrengthLevel;
}

export interface PasswordStrengthProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  password: string;
  showChecklist?: boolean;
}

const PasswordStrength = React.forwardRef<HTMLDivElement, PasswordStrengthProps>(
  ({ className, password, showChecklist = false, ...props }, ref) => {
    const t = useT();
    const strength = computeStrength(password);

    return (
      <div ref={ref} className={cn("w-full space-y-2", className)} {...props}>
        <div className="flex items-center gap-2">
          <div className="flex flex-1 gap-1.5" aria-hidden="true">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={cn(
                  "h-1.5 flex-1 rounded-full transition-colors duration-base",
                  i < strength
                    ? ACTIVE_SEGMENT_COLORS[strength]
                    : "bg-hover-bg-strong"
                )}
              />
            ))}
          </div>
          <span
            className={cn(
              "text-xs font-medium tabular-nums",
              LABEL_TEXT_COLORS[strength]
            )}
            aria-live="polite"
          >
            {t(STRENGTH_LABEL_KEYS[strength])}
          </span>
        </div>
        {showChecklist && (
          <ul className="space-y-1" aria-label={t("passwordStrength.requirements")}>
            {REQUIREMENTS.map((req) => {
              const passed = req.test(password);
              return (
                <li
                  key={req.labelKey}
                  className="flex items-center gap-2 text-xs"
                >
                  {passed ? (
                    <Check
                      className="h-3 w-3 shrink-0 text-green"
                      aria-hidden="true"
                    />
                  ) : (
                    <X
                      className="h-3 w-3 shrink-0 text-foreground-subtle"
                      aria-hidden="true"
                    />
                  )}
                  <span
                    className={cn(
                      passed
                        ? "text-foreground"
                        : "text-foreground-subtle"
                    )}
                  >
                    {t(req.labelKey)}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    );
  }
);
PasswordStrength.displayName = "PasswordStrength";

export { PasswordStrength, computeStrength };
