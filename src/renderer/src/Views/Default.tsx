import { Button } from "@mui/material";
import {
  Logout,
  SettingsSuggest,
  Storage as StorageIcon,
  AccessAlarm as AccessAlarmIcon,
} from "@mui/icons-material";
import { useEffect } from "react";
import getData from "../utils/getData";

interface IDefaultProps {
  startTimer: React.MouseEventHandler<HTMLButtonElement>;
  exit: React.MouseEventHandler<HTMLButtonElement>;
  openSettings: React.MouseEventHandler<HTMLButtonElement>;
  openStorage: React.MouseEventHandler<HTMLButtonElement>;
}
export default function Default(props: IDefaultProps) {
  const { startTimer, exit, openSettings, openStorage } = props;
  useEffect(() => {
    getData("api/setView?view=small");
  }, []);
  return (
    <>
      <Button color="primary" variant="contained" onClick={startTimer}>
        <AccessAlarmIcon sx={{ color: "#fff" }} />
        &nbsp;Shift
      </Button>
      <Button color="primary" variant="contained" onClick={openStorage}>
        <StorageIcon />
        &nbsp; Records
      </Button>
      <Button color="secondary" variant="contained" onClick={openSettings}>
        <SettingsSuggest />
        &nbsp;Settings
      </Button>
      <Button color="error" variant="contained" onClick={exit}>
        <Logout sx={{ color: "#fff" }} />
      </Button>
    </>
  );
}
