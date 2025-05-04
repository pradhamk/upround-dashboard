import * as React from "react"

const UpRoundLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    {...props}
    viewBox="0 0 120 80"
  >
    <title>UpRound Logo</title>
    <g fill="none" fillRule="evenodd" transform="translate(7 5)">
      <path
        stroke="#7ED8C5"
        strokeWidth={14.59}
        d="m68.04 36.16-12 11.82c-3.92 3.86-10.32 10.21-14.21 14.1L29.6 74.31a10 10 0 0 1-14.15 0L3.21 62.07a10 10 0 0 1 0-14.15l12.23-12.26L29.6 21.51 51.04.16"
      />
      <rect
        width={37.33}
        height={37.31}
        x={56.623}
        y={36.383}
        stroke="#7ED8C5"
        strokeWidth={14.59}
        rx={10.01}
        transform="rotate(-44.99 75.288 55.038)"
      />
      <path
        className="fill-white dark:fill-black"
        fillRule="nonzero"
        d="m53.296 73.916-6.484-6.484 13.286-13.287 6.485 6.484z"
      />
    </g>
  </svg>
)

export default UpRoundLogo
