"use client";

const PHONE_NUMBER = "tel:+919823300034"; 

export default function FloatingCallButton() {
  return (
    <>
      <style>{`
        @keyframes callPulse {
          0%   { transform: scale(1);    opacity: 0.7; }
          70%  { transform: scale(1.65); opacity: 0;   }
          100% { transform: scale(1.65); opacity: 0;   }
        }
        .call-float-btn .call-pulse {
          animation: callPulse 2s ease-out infinite;
        }
        .call-float-btn .call-tooltip {
          opacity: 0;
          transition: opacity 0.2s ease;
        }
        .call-float-btn:hover .call-tooltip,
        .call-float-btn:active .call-tooltip {
          opacity: 1;
        }
        @media (min-width: 640px) {
          .call-float-btn { display: none !important; }
        }
      `}</style>

      <a
        href={PHONE_NUMBER}
        aria-label="Call us"
        className="call-float-btn"
        style={{
          position: "fixed",
          bottom: "100px",
          right: "28px",
          zIndex: 9999,
          width: "52px",
          height: "52px",
          backgroundColor: "#C8102E",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 6px 20px rgba(200,16,46,0.5)",
          textDecoration: "none",
          transition: "transform 0.25s ease, box-shadow 0.25s ease",
        }}
      >
        {/* Tooltip */}
        <span
          className="call-tooltip"
          style={{
            position: "absolute",
            bottom: "62px",
            left: "50%",
            transform: "translateX(-50%)",
            whiteSpace: "nowrap",
            background: "#1a1a2e",
            color: "#fff",
            fontSize: "0.7rem",
            fontWeight: 600,
            padding: "4px 10px",
            borderRadius: "20px",
            pointerEvents: "none",
          }}
        >
          Call Us
        </span>

        {/* Phone SVG icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={22}
          height={22}
          fill="none"
          viewBox="0 0 24 24"
          stroke="white"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
          />
        </svg>

        {/* Pulse ring */}
        <span
          className="call-pulse"
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background: "rgba(200,16,46,0.35)",
          }}
        />
      </a>
    </>
  );
}
