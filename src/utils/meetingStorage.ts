import { MeetingState } from "./meetingTypes";

const KEY = "meeting_system";

export const getData = (): MeetingState => {
  return JSON.parse(localStorage.getItem(KEY) || JSON.stringify({
    availability: [],
    requests: []
  }));
};

export const saveData = (data: MeetingState) => {
  localStorage.setItem(KEY, JSON.stringify(data));
};