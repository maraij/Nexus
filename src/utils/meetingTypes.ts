export type AvailabilitySlot = {
  id: string;
  date: string;
};

export type MeetingRequest = {
  id: string;
  title: string;
  date: string;
  status: "pending" | "accepted" | "rejected";
};

export type MeetingState = {
  availability: AvailabilitySlot[];
  requests: MeetingRequest[];
};