"use client";
import { useState, type FormEvent, type MouseEvent } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CalendarDays,
  Clock,
  Star,
  Users,
  BookOpen,
  Settings,
  Zap,
  Globe,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

// Add new types for session management
type SessionQuality = {
  studentEngagement: number;
  teacherClarity: number;
  pronunciationCorrection: number;
  vocabularyRelevance: number;
  pacing: number;
  overallScore: number;
};

type SessionAnalysis = {
  duration: number;
  speakerBreakdown: {
    teacher: number;
    student: number;
  };
  languageBreakdown: {
    targetLanguage: number;
    nativeLanguage: number;
  };
  learningObjectives: string[];
  vocabularyCovered: string[];
  qualityScore: SessionQuality;
  recommendations: string[];
};

type SessionTranscript = {
  meetingId: string;
  title: string;
  duration: number;
  transcript: string;
  summary: {
    overview: string;
    actionItems: string[];
    outline: { time: string; topic: string }[];
    keywords: string[];
  };
};

export default function MentorDashboard() {
  // Form States
  const [matchCode, setMatchCode] = useState("");
  const [usdcStake, setUsdcStake] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [isLoading, setIsLoading] = useState<{ [key: string]: boolean }>({});

  // New state for session management
  const [currentSession, setCurrentSession] = useState<{
    meetingId?: string;
    isRecording: boolean;
    transcript?: SessionTranscript;
    analysis?: SessionAnalysis;
  }>({
    isRecording: false,
  });

  // Profile Actions
  const handleEditProfile = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading({ ...isLoading, editProfile: true });
    try {
      toast.info("🚧 Edit Profile - Coming Soon", {
        description: "This feature is under development",
      });
    } finally {
      setIsLoading({ ...isLoading, editProfile: false });
    }
  };

  // Course Actions
  const handleManageCourse = async (
    e: MouseEvent<HTMLButtonElement>,
    courseTitle: string
  ) => {
    e.preventDefault();
    setIsLoading({ ...isLoading, [`manageCourse-${courseTitle}`]: true });
    try {
      toast.info("🚧 Course Management - Coming Soon", {
        description: `Managing course: ${courseTitle}`,
      });
    } finally {
      setIsLoading({ ...isLoading, [`manageCourse-${courseTitle}`]: false });
    }
  };

  const handleCreateCourse = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading({ ...isLoading, createCourse: true });
    try {
      toast.info("🚧 Create Course - Coming Soon", {
        description: "The course creation feature is under development",
      });
    } finally {
      setIsLoading({ ...isLoading, createCourse: false });
    }
  };

  // Session Actions
  const handleStakeUsdc = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!usdcStake) {
      toast.error("Please enter a stake amount");
      return;
    }
    setIsLoading({ ...isLoading, stakeUsdc: true });
    try {
      toast.info("🚧 Stake USDC - Coming Soon", {
        description: `Staking ${usdcStake} USDC`,
      });
    } finally {
      setIsLoading({ ...isLoading, stakeUsdc: false });
    }
  };

  const handleJoinCall = async (
    e: MouseEvent<HTMLButtonElement>,
    sessionTitle: string
  ) => {
    e.preventDefault();
    setIsLoading({ ...isLoading, [`joinCall-${sessionTitle}`]: true });
    try {
      // Initialize Otter AI session
      const response = await fetch("/api/sessions/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionTitle,
          meetingLink,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message);

      setCurrentSession({
        ...currentSession,
        meetingId: data.meetingId,
        isRecording: true,
      });

      toast.success("Successfully joined session", {
        description: "Recording and transcription started",
      });
    } catch (error) {
      toast.error("Failed to join session", {
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    } finally {
      setIsLoading({ ...isLoading, [`joinCall-${sessionTitle}`]: false });
    }
  };

  const handleEndSession = async (
    e: MouseEvent<HTMLButtonElement>,
    sessionTitle: string
  ) => {
    e.preventDefault();
    if (!currentSession.meetingId) return;

    setIsLoading({ ...isLoading, [`endSession-${sessionTitle}`]: true });
    try {
      const response = await fetch("/api/sessions/end", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          meetingId: currentSession.meetingId,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message);

      // Update session with transcript and analysis
      setCurrentSession({
        ...currentSession,
        isRecording: false,
        transcript: data.transcript,
        analysis: data.analysis,
      });

      // If quality threshold is met, trigger payment
      if (data.analysis.qualityScore.overallScore >= 7) {
        await handleQualityBasedPayment(data.analysis);
      }

      toast.success("Session completed", {
        description: "Transcript and analysis are ready",
      });
    } catch (error) {
      toast.error("Failed to end session", {
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    } finally {
      setIsLoading({ ...isLoading, [`endSession-${sessionTitle}`]: false });
    }
  };

  const handleQualityBasedPayment = async (analysis: SessionAnalysis) => {
    try {
      const response = await fetch("/api/sessions/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ analysis }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message);

      toast.success("Payment processed", {
        description: `Quality score: ${analysis.qualityScore.overallScore}/10`,
      });
    } catch (error) {
      toast.error("Payment processing failed", {
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
    }
  };

  // Help Request Actions
  const handleAcceptRequest = async (
    e: MouseEvent<HTMLButtonElement>,
    requestTitle: string,
    requester: string
  ) => {
    e.preventDefault();
    setIsLoading({ ...isLoading, [`acceptRequest-${requestTitle}`]: true });
    try {
      toast.info("🚧 Accept Request - Coming Soon", {
        description: `Accepting request from ${requester}: ${requestTitle}`,
      });
    } finally {
      setIsLoading({ ...isLoading, [`acceptRequest-${requestTitle}`]: false });
    }
  };

  // Settings Actions
  const handleSaveSettings = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading({ ...isLoading, saveSettings: true });
    try {
      // Validate inputs
      if (!meetingLink) {
        toast.error("Please enter a meeting link");
        return;
      }
      if (!hourlyRate) {
        toast.error("Please enter an hourly rate");
        return;
      }

      toast.success("Settings saved!", {
        description: "Your preferences have been updated",
      });
    } finally {
      setIsLoading({ ...isLoading, saveSettings: false });
    }
  };

  return (
    <div className="container py-8 space-y-8">
      {/* Profile Section */}
      <Card className="p-6">
        <div className="flex items-start gap-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src="/placeholder-avatar.jpg" />
            <AvatarFallback>ME</AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold">Mel Innvertir</h1>
                <p className="text-muted-foreground">
                  Head of Learning and Development
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Globe className="h-3 w-3" />
                    Mexico City, MX
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    4.99
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    650 sessions
                  </Badge>
                </div>
              </div>
              <Button
                onClick={handleEditProfile}
                disabled={isLoading.editProfile}
              >
                {isLoading.editProfile ? "Saving..." : "Edit Profile"}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Response Time</p>
                </div>
                <p className="text-lg font-semibold">Usually within 9 hours</p>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Completion Rate
                  </p>
                </div>
                <p className="text-lg font-semibold">98%</p>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Satisfaction</p>
                </div>
                <p className="text-lg font-semibold">4.99 / 5.0</p>
              </Card>
            </div>
          </div>
        </div>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="courses" className="space-y-6">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-4 gap-4">
          <TabsTrigger value="courses" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            My Courses
          </TabsTrigger>
          <TabsTrigger value="sessions" className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            Active Sessions
          </TabsTrigger>
          <TabsTrigger value="requests" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Help Requests
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Course Cards */}
            <Card className="overflow-hidden">
              <div className="aspect-video relative">
                <img
                  src="https://assets.aceternity.com/demos/default.png"
                  alt="Course thumbnail"
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="p-4 space-y-2">
                <h3 className="font-semibold">Go to Market Strategy 0 to 1</h3>
                <p className="text-sm text-muted-foreground">
                  Steps to create a go to market strategy when you're early
                  stage going from 0 to 1.
                </p>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">52 mentees</Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) =>
                      handleManageCourse(e, "Go to Market Strategy 0 to 1")
                    }
                    disabled={
                      isLoading["manageCourse-Go to Market Strategy 0 to 1"]
                    }
                  >
                    {isLoading["manageCourse-Go to Market Strategy 0 to 1"]
                      ? "Managing..."
                      : "Manage"}
                  </Button>
                </div>
              </div>
            </Card>

            {/* Add New Course Card */}
            <Card className="flex items-center justify-center aspect-[4/3] border-2 border-dashed">
              <Button
                variant="ghost"
                className="flex flex-col gap-2"
                onClick={handleCreateCourse}
                disabled={isLoading.createCourse}
              >
                <BookOpen className="h-8 w-8" />
                <span>
                  {isLoading.createCourse ? "Creating..." : "Create New Course"}
                </span>
              </Button>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-4">
          <Card className="p-6">
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Match Code</label>
                  <Input
                    placeholder="Enter match code"
                    value={matchCode}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setMatchCode(e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">USDC Stake</label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Stake amount"
                      value={usdcStake}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setUsdcStake(e.target.value)
                      }
                    />
                    <Button
                      onClick={handleStakeUsdc}
                      disabled={isLoading.stakeUsdc}
                    >
                      {isLoading.stakeUsdc ? "Staking..." : "Stake"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <ScrollArea className="h-[400px]">
            <Card className="p-4 mb-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="font-medium">Technical Interview Prep</h3>
                  <p className="text-sm text-muted-foreground">
                    Today at 2:00 PM
                  </p>
                  {currentSession.isRecording && (
                    <Badge variant="destructive" className="animate-pulse">
                      Recording
                    </Badge>
                  )}
                </div>
                <div className="flex gap-2">
                  {!currentSession.isRecording ? (
                    <Button
                      onClick={(e) =>
                        handleJoinCall(e, "Technical Interview Prep")
                      }
                      disabled={isLoading["joinCall-Technical Interview Prep"]}
                    >
                      {isLoading["joinCall-Technical Interview Prep"]
                        ? "Joining..."
                        : "Join Call"}
                    </Button>
                  ) : (
                    <Button
                      variant="destructive"
                      onClick={(e) =>
                        handleEndSession(e, "Technical Interview Prep")
                      }
                      disabled={
                        isLoading["endSession-Technical Interview Prep"]
                      }
                    >
                      {isLoading["endSession-Technical Interview Prep"]
                        ? "Ending..."
                        : "End Session"}
                    </Button>
                  )}
                </div>
              </div>
              {currentSession.transcript && (
                <div className="mt-4 space-y-2">
                  <h4 className="font-medium">Session Summary</h4>
                  <p className="text-sm text-muted-foreground">
                    {currentSession.transcript.summary.overview}
                  </p>
                  {currentSession.analysis && (
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div>
                        <p className="text-sm font-medium">Quality Score</p>
                        <p className="text-2xl font-bold">
                          {currentSession.analysis.qualityScore.overallScore}/10
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Duration</p>
                        <p className="text-2xl font-bold">
                          {currentSession.analysis.duration} min
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Card>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="requests">
          <ScrollArea className="h-[500px]">
            {/* Help Requests List */}
            <Card className="p-4 mb-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="font-medium">Need help with System Design</h3>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback>JS</AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-muted-foreground">
                      John Smith
                    </span>
                  </div>
                </div>
                <Button
                  onClick={(e) =>
                    handleAcceptRequest(
                      e,
                      "Need help with System Design",
                      "John Smith"
                    )
                  }
                  disabled={
                    isLoading["acceptRequest-Need help with System Design"]
                  }
                >
                  {isLoading["acceptRequest-Need help with System Design"]
                    ? "Accepting..."
                    : "Accept Request"}
                </Button>
              </div>
            </Card>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="settings">
          <Card className="p-6">
            <form onSubmit={handleSaveSettings}>
              <h2 className="text-lg font-semibold mb-4">Mentor Settings</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Meeting Link</label>
                    <Input
                      placeholder="https://meet.google.com/example"
                      value={meetingLink}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setMeetingLink(e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Hourly Rate (USDC)
                    </label>
                    <Input
                      type="number"
                      placeholder="100"
                      value={hourlyRate}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setHourlyRate(e.target.value)
                      }
                    />
                  </div>
                </div>
                <Button type="submit" disabled={isLoading.saveSettings}>
                  {isLoading.saveSettings ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
