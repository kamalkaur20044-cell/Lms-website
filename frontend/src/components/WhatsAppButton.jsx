"use client";

const WHATSAPP_NUMBER = "9198233-00034"; 
const WHATSAPP_MESSAGE = "Hello! I'd like to know more about Lakshya's courses.";

export default function WhatsAppButton() {
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="whatsapp-float group"
    >
      {/* Tooltip */}
      <span className="whatsapp-tooltip">
        Chat with us!
      </span>

      {/* WhatsApp SVG icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48"
        className="w-7 h-7 fill-white drop-shadow"
      >
        <path d="M4.868 43.303l2.694-9.835a18.863 18.863 0 01-2.527-9.468C5.038 13.514 13.906 4.645 24.887 4.645c5.325.002 10.323 2.077 14.088 5.845a19.775 19.775 0 015.832 14.097c-.004 10.983-8.874 19.853-19.854 19.853a19.86 19.86 0 01-9.496-2.42L4.868 43.303zm10.67-6.155l.602.357a16.507 16.507 0 008.74 2.496c9.124 0 16.546-7.42 16.55-16.547.002-4.42-1.717-8.576-4.836-11.698a16.47 16.47 0 00-11.707-4.853c-9.132 0-16.552 7.419-16.556 16.545a16.49 16.49 0 002.713 9.064l.422.671-1.795 6.554 6.867-1.59zM34.187 28.56c-.124-.207-.453-.331-.948-.58-1.19-.597-3.516-1.734-4.058-1.932-.541-.207-.935-.31-1.329.311-.395.62-1.521 1.931-1.864 2.326-.342.394-.685.443-1.273.148-2.46-1.23-4.07-2.197-5.69-4.983-.428-.737.428-.685 1.223-2.279.136-.27.068-.507-.038-.714-.104-.207-.932-2.246-1.277-3.075-.336-.807-.677-.696-.932-.71-.24-.011-.508-.014-.776-.014-.27 0-.708.1-1.08.507-.37.407-1.42 1.388-1.42 3.384 0 1.997 1.455 3.927 1.657 4.2.206.274 2.863 4.374 6.936 6.133 2.577 1.113 3.586 1.207 4.874 1.016.785-.118 2.42-.99 2.76-1.946.342-.955.342-1.773.24-1.942z"/>
      </svg>

      {/* Pulse ring */}
      <span className="whatsapp-pulse" aria-hidden="true" />
    </a>
  );
}
