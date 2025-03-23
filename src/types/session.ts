export type SessionStatus =
  | "disputed"
  | "pending_signature"
  | "executed"
  | "paid";

export interface Session {
  id: string;
  title: string;
  date: string;
  duration: string;
  qualityScore: number;
  status: SessionStatus;
  student: {
    speakingTime: number;
    engagement: number;
  };
  instructor: {
    speakingTime: number;
  };
}

export interface SessionCardProps {
  session: Session;
  onStatusChange?: (status: SessionStatus) => void;
}

export interface SessionStats {
  totalSessions: number;
  averageQualityScore: number;
  disputedSessions: number;
  completedSessions: number;
  averageStudentEngagement: number;
}
