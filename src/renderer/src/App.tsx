import { useState, useRef, useEffect } from "react";
import "./main.css";
import Count from "./Views/Count";
import Default from "./Views/Default";
import Settings from "./Views/Settings";
import getData from "./utils/getData";
import Records from "./Views/Records";
import Banner from "./assets/banner2.png";
function App() {
  const [view, setView] = useState<"STOPPED" | "COUNT" | "SETTINGS" | "VIEW">(
    localStorage.getItem("IS_RUNNING") == "1" ? "COUNT" : "STOPPED"
    // "VIEW"
  );
  const [time, setTime] = useState<string>("");
  const startTime = useRef<number>(
    localStorage.getItem("CURRENT_TIMER")
      ? +localStorage.getItem("CURRENT_TIMER")!
      : 0
  );
  const interval = useRef<NodeJS.Timeout>();
  function pauseTimer() {
    clearInterval(interval?.current);
  }
  function onGoBack() {
    setView("STOPPED");
    getData(`api/setView?view=small`);
  }
  function onContinue() {
    clearInterval(interval?.current);
    handleUpdate();
    interval.current = setInterval(handleUpdate, 500);
  }
  function recordInfo() {
    return [startTime.current, getTime];
  }
  function startTimer() {
    const _time = new Date().getTime();
    localStorage.setItem("CURRENT_TIMER", _time.toString());
    localStorage.setItem("IS_RUNNING", "1");
    startTime.current = _time;
    clearInterval(interval?.current);
    handleUpdate();
    interval.current = setInterval(handleUpdate, 500);
    setView("COUNT");
  }
  function getTime(_now: number = new Date().getTime()) {
    if (!startTime.current) return "--";
    const now = _now || new Date().getTime();
    const then = startTime.current;
    const difference = now - then;
    const seconds = Math.floor(difference / 1000);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secondsRemaining = seconds % 60;
    const formattedHours = hours.toString().padStart(2, "0");
    const formattedMinutes = minutes.toString().padStart(2, "0");
    const formattedSeconds = secondsRemaining.toString().padStart(2, "0");
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  }
  function handleUpdate() {
    setTime(getTime());
  }
  function stopTimer() {
    clearInterval(interval?.current);
    setView("STOPPED");
    localStorage.setItem("IS_RUNNING", "0");
    localStorage.removeItem("CURRENT_TIMER");
  }
  function onErase() {
    clearInterval(interval?.current);
    setView("STOPPED");
    localStorage.setItem("IS_RUNNING", "0");
    localStorage.removeItem("CURRENT_TIMER");
  }
  function onCancel() {
    getData(`api/setView?view=small`);
    setView("STOPPED");
  }
  function onOpenSettings() {
    setView("SETTINGS");
    getData(`api/setView?view=expanded`);
  }
  function onOpenRecords() {
    setView("VIEW");
    getData(`api/setView?view=expanded`);
  }
  function exit() {
    getData("api/exit");
  }
  useEffect(() => {
    if (localStorage.getItem("IS_RUNNING") == "1") {
      handleUpdate();
      clearInterval(interval?.current);
      interval.current = setInterval(handleUpdate, 500);
    }
  }, []);
  switch (view) {
    case "VIEW": {
      return <Records onGoBack={onGoBack} />;
    }
    case "SETTINGS": {
      return <Settings onCancel={onCancel} />;
    }
    case "COUNT": {
      return (
        <Count
          time={time}
          stopTimer={stopTimer}
          pauseTimer={pauseTimer}
          onContinue={onContinue}
          onErase={onErase}
          recordInfo={recordInfo as any}
        />
      );
    }
    case "STOPPED": {
      return (
        <Default
          startTimer={startTimer}
          exit={exit}
          openSettings={onOpenSettings}
          openStorage={onOpenRecords}
        />
      );
    }
  }
  return <></>;
}

function MainApp() {
  return (
    <>
      <div className="banner-container">
        <img src={Banner} alt="banner" className="banner" />
        <img src={Banner} alt="banner" className="banner flipped" />
        <img src={Banner} alt="banner" className="banner" />
      </div>
      <App />
    </>
  );
}
export default MainApp;
