import type { FC } from "react";

interface ArrowProps {
  className: string;
}

const Arrow: FC<ArrowProps> = ({ className }) => {
  return (
    <svg
      className={className}
      width="32"
      height="36"
      viewBox="0 0 32 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17.0607 6.93934C16.4749 6.35355 15.5251 6.35355 14.9393 6.93934L5.3934 16.4853C4.80761 17.0711 4.80761 18.0208 5.3934 18.6066C5.97919 19.1924 6.92893 19.1924 7.51472 18.6066L16 10.1213L24.4853 18.6066C25.0711 19.1924 26.0208 19.1924 26.6066 18.6066C27.1924 18.0208 27.1924 17.0711 26.6066 16.4853L17.0607 6.93934ZM16 28H17.5L17.5 8H16H14.5L14.5 28H16Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default Arrow;
