import React from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { CheckCircle2, XCircle } from "lucide-react";

AOS.init();

function Alert(props) {
  const capitalize = (word) => {
    if (word === "danger") {
      word = "error";
    }
    const lower = word.toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  };

  if (!props.alert) return <div className="h-14"></div>;

  return (
    <div
      className="h-14 fixed top-10 right-4 transform -translate-x-1/2 -translate-y-1/2 z-50 min-w-[320px] max-w-[420px]"
      data-aos="fade-left"
      data-aos-easing="ease-out"
      data-aos-duration="400"
    >
      <div
        className={`
          flex items-center gap-3 p-4 rounded-lg shadow-lg border-l-4
          ${
            props.alert.type === "success"
              ? "bg-green-50 border-l-green-500 text-green-800"
              : props.alert.type === "danger"
              ? "bg-red-50 border-l-red-500 text-red-800"
              : ""
          }
        `}
      >
        {props.alert.type === "success" ? (
          <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
        ) : (
          <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
        )}
        <div className="flex-1">
          <p className="text-sm font-medium">
            <span className="font-semibold">
              {capitalize(props.alert.type)}
            </span>
            {": "}
            {props.alert.message}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Alert;
