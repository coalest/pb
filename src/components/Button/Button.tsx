import type { ReactNode, MouseEvent } from "react";

type ButtonProps = {
  children: ReactNode;
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
  disabled: boolean;
  className?: string;
};

const Button = ({ className, onClick, disabled, children }: ButtonProps) => {
  return (
    <button
      style={{ outline: "none" }} // Fix white outline in Chrome
      className={className}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
