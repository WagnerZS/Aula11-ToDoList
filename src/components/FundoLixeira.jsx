export function FundoLixeira({ width }) {
  return (
    <div
      className={`
        absolute right-0 top-0 h-full flex items-center justify-center
        pointer-events-none bg-red-700 border-2 border-red-700
      `}
      style={{
        width: `${width}px`,
        minWidth: "2.5rem",
        transition: "width 0.1s cubic-bezier(0.4,0,0.2,1)",
        willChange: "width",
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="black"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2"
        />
      </svg>
    </div>
  );
}