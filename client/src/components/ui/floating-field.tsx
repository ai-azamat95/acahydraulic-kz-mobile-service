import { useId, type ComponentProps, type ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import "./floating-field.css";

/** A real, persistent label. Placeholder text is only an optional example. */
export function FloatingField({
  id,
  label,
  filled = false,
  alwaysFloat = false,
  className,
  children,
}: {
  id: string;
  label: string;
  filled?: boolean;
  alwaysFloat?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn("floating-field", className)}
      data-filled={filled || alwaysFloat}
    >
      {children}
      <label className="floating-field__label" htmlFor={id}>
        {label}
      </label>
    </div>
  );
}

export function FloatingInput({
  label,
  id,
  className,
  fieldClassName,
  alwaysFloat,
  ...props
}: ComponentProps<typeof Input> & {
  label: string;
  alwaysFloat?: boolean;
  fieldClassName?: string;
}) {
  const generatedId = useId();
  const fieldId = id || generatedId;
  return (
    <FloatingField
      id={fieldId}
      label={label}
      filled={String(props.value ?? props.defaultValue ?? "").length > 0}
      alwaysFloat={alwaysFloat}
      className={fieldClassName}
    >
      <Input
        {...props}
        id={fieldId}
        placeholder={props.placeholder || " "}
        className={cn("floating-field__control", className)}
      />
    </FloatingField>
  );
}

export function FloatingTextarea({
  label,
  id,
  className,
  ...props
}: ComponentProps<typeof Textarea> & { label: string }) {
  const generatedId = useId();
  const fieldId = id || generatedId;
  return (
    <FloatingField
      id={fieldId}
      label={label}
      alwaysFloat
      className="floating-field--textarea"
    >
      <Textarea
        {...props}
        id={fieldId}
        className={cn("floating-field__control", className)}
      />
    </FloatingField>
  );
}
