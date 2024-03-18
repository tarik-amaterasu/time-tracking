import { Typography, Button, CircularProgress } from "@mui/material";
import { Pause, NoteAdd, PlayArrow, PlaylistRemove } from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";
import getData from "../utils/getData";
interface ICountProps {
  time: string;
  pauseTimer: () => void;
  onContinue: () => void;
  onErase: React.MouseEventHandler<HTMLButtonElement>;
  stopTimer: () => void;
  recordInfo: () => [number, (_now?: number) => string];
}

export default function Count(props: ICountProps) {
  const { time, stopTimer, pauseTimer, recordInfo, onContinue, onErase } =
    props;
  const timeRef = useRef(0);
  const [isConfirm, setIsConfirm] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);
  function onTimerPaused() {
    pauseTimer();
    setIsConfirm(true);
    timeRef.current = new Date().getTime();
  }
  function onAddRecord() {
    setIsSending(true);
    const [startTime, getTime] = recordInfo();
    const store = JSON.parse(
      localStorage.getItem("STORED_RECORD") || "[]"
    )! as Array<{
      date: string;
      startTime: number;
      endTime: number;
      durationInS: number;
      duration: string;
    }>;
    const date = new Date().toLocaleDateString();
    const _startTime = startTime;
    const _endTime = timeRef.current;
    const _durationInS = _endTime - _startTime;
    const duration = getTime(_endTime);
    const record = {
      date,
      startTime: _startTime,
      endTime: _endTime,
      durationInS: _durationInS,
      duration,
    };
    store.push(record);
    localStorage.setItem("STORED_RECORD", JSON.stringify(store));
    getData("api/addRecord", {
      fetchOptions: {
        method: "POST",
        body: JSON.stringify(record),
      },
    })
      .then(() => {
        setIsSending(false);
        stopTimer();
      })
      .catch((err) => {
        setIsSending(false);
        alert(err.message);
      });
  }
  function onContinueClicked() {
    onContinue();
    setIsConfirm(false);
  }
  useEffect(() => {
    getData("api/setView?view=small");
    getData("api/setBadge");
    return () => {
      getData("api/unsetBadge");
    };
  }, []);
  return (
    <>
      <Typography variant="h2" sx={{ color: "#F2F2F3" }}>
        {time}
      </Typography>
      <div className="stopContainer">
        {isSending ? (
          <div
            style={{
              minWidth: 400,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress
              sx={{ color: "#F7E6C4" }}
              size={60}
              thickness={3}
            />
          </div>
        ) : isConfirm ? (
          <>
            <Button variant="contained" color="success" onClick={onAddRecord}>
              <NoteAdd />
              &nbsp; Store Record
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={onContinueClicked}
            >
              <PlayArrow />
              &nbsp; Continue
            </Button>
            <Button variant="contained" color="error" onClick={onErase}>
              <PlaylistRemove />
              &nbsp; Erase
            </Button>
          </>
        ) : (
          <Button variant="contained" color="secondary" onClick={onTimerPaused}>
            <Pause sx={{ color: "#fff" }} />
            &nbsp;Stop Timer
          </Button>
        )}
      </div>
    </>
  );
}
