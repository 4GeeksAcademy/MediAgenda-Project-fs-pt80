import React from "react";
import { useCalendlyEventListener, InlineWidget } from "react-calendly";

export const Calendly = () => {
  useCalendlyEventListener({
    onProfilePageViewed: () => console.log("onProfilePageViewed"),
    onDateAndTimeSelected: () => console.log("onDateAndTimeSelected"),
    onEventTypeViewed: () => console.log("onEventTypeViewed"),
    onEventScheduled: (e) => console.log(e.data.payload),
    onPageHeightResize: (e) => console.log(e.data.payload.height),
  });

  return (
    <div className="App">
      <InlineWidget url="https://calendly.com/proyectofinalmmediagenda" />
    </div>
  );
};

