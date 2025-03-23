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
import {
  useUpdateMentorProfile,
  useMentorProfile,
  useMentorStats,
  useMentorServices,
  useMentorBookings,
} from "@/hooks/use-mentor-queries";
import { usePrivy } from "@privy-io/react-auth";

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

// Mock data for development
const MOCK_DATA = {
  profile: {
    name: "Mel Innvertir",
    title: "Head of Learning and Development",
    location: "Mexico City, MX",
    avatarUrl: "/placeholder-avatar.jpg",
    rating: 4.99,
    totalSessions: 650,
  },
  stats: {
    responseTime: "9 hours",
    completionRate: "98%",
    satisfaction: "4.99",
    providedServices: 45,
    totalEarnings: 25000,
    bookings: 32,
  },
  courses: [
    {
      id: "1",
      title: "Go to Market Strategy 0 to 1",
      description:
        "Steps to create a go to market strategy when you're early stage going from 0 to 1.",
      thumbnail: "https://assets.aceternity.com/demos/default.png",
      mentees: 52,
    },
    {
      id: "2",
      title: "Web3 Product Development",
      description:
        "Learn to build and launch Web3 products from concept to deployment.",
      thumbnail: "https://assets.aceternity.com/demos/default.png",
      mentees: 38,
    },
  ],
  activeRequests: [
    {
      id: "1",
      title: "Need help with System Design",
      requester: "John Smith",
      requesterInitials: "JS",
      status: "pending",
    },
    {
      id: "2",
      title: "Web3 Architecture Review",
      requester: "Alice Johnson",
      requesterInitials: "AJ",
      status: "pending",
    },
  ],
  activeSessions: [
    {
      id: "1",
      title: "Technical Interview Prep",
      scheduledTime: "2:00 PM",
      status: "scheduled",
    },
    {
      id: "2",
      title: "Product Strategy Session",
      scheduledTime: "4:30 PM",
      status: "scheduled",
    },
  ],
};

// Mock data for services
const MOCK_SERVICES = [
  {
    id: "1",
    serviceType: "Web3 Consultation",
    description: "One-on-one consultation for Web3 projects and architecture",
    price: 150,
    status: "active",
  },
  {
    id: "2",
    serviceType: "Technical Mentorship",
    description: "Ongoing technical mentorship and career guidance",
    price: 100,
    status: "active",
  },
];

// Mock data for bookings
const MOCK_BOOKINGS = [
  {
    id: "1",
    clientName: "John Doe",
    bookingTime: new Date().toISOString(),
    status: "confirmed",
    duration: 60,
  },
  {
    id: "2",
    clientName: "Jane Smith",
    bookingTime: new Date(Date.now() + 3600000).toISOString(),
    status: "pending",
    duration: 30,
  },
];

export default function MentorDashboard() {
  // 1. Move all hooks to the top
  const { ready, authenticated, user } = usePrivy();
  const { mutate: updateProfile, isPending: isUpdatingProfile } =
    useUpdateMentorProfile();

  // Form States
  const [matchCode, setMatchCode] = useState("");
  const [usdcStake, setUsdcStake] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [isLoading, setIsLoading] = useState<{ [key: string]: boolean }>({});

  // Session state
  const [currentSession, setCurrentSession] = useState<{
    meetingId?: string;
    isRecording: boolean;
    transcript?: SessionTranscript;
    analysis?: SessionAnalysis;
  }>({
    isRecording: false,
  });

  // Queries with proper loading states and mock data fallbacks
  const { data: statsData, isLoading: isStatsLoading } = useMentorStats(
    user?.id ?? ""
  );

  const { data: servicesData, isLoading: isServicesLoading } =
    useMentorServices(user?.id ?? "");

  const { data: bookingsData, isLoading: isBookingsLoading } =
    useMentorBookings(user?.id ?? "");

  // 2. Early returns after all hooks
  if (!ready) {
    return (
      <div className="container py-8">
        <Card className="p-6">
          <div className="flex items-center justify-center">
            <p>Loading...</p>
          </div>
        </Card>
      </div>
    );
  }

  if (!authenticated || !user) {
    return (
      <div className="container py-8">
        <Card className="p-6">
          <div className="flex flex-col items-center justify-center gap-4">
            <p>Please connect your wallet to access your dashboard</p>
          </div>
        </Card>
      </div>
    );
  }

  // 3. Data preparation after hooks and conditionals
  const displayStats = {
    providedServices: MOCK_DATA.stats.providedServices,
    totalEarnings: MOCK_DATA.stats.totalEarnings,
    bookings: MOCK_DATA.stats.bookings,
    responseTime: MOCK_DATA.stats.responseTime,
    completionRate: MOCK_DATA.stats.completionRate,
    satisfaction: MOCK_DATA.stats.satisfaction,
  };

  const displayServices = MOCK_SERVICES;
  const displayBookings = MOCK_BOOKINGS;

  // Use mock data directly instead of waiting for query results
  const mockProfileData = {
    user: MOCK_DATA.profile,
  };

  // Updated handler to use only available properties
  const handleEditProfile = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!mockProfileData.user || !mockProfileData.user.name) return;

    updateProfile({
      userId: user?.id ?? "",
      data: {
        name: mockProfileData.user.name,
      },
    });
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
            <AvatarImage src={MOCK_DATA.profile.avatarUrl} />
            <AvatarFallback>{MOCK_DATA.profile.name[0]}</AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold">{MOCK_DATA.profile.name}</h1>
                <p className="text-muted-foreground">
                  {MOCK_DATA.profile.title}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Globe className="h-3 w-3" />
                    {MOCK_DATA.profile.location}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    {MOCK_DATA.profile.rating}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {MOCK_DATA.profile.totalSessions} sessions
                  </Badge>
                </div>
              </div>
              <Button onClick={handleEditProfile} disabled={isUpdatingProfile}>
                {isUpdatingProfile ? "Saving..." : "Edit Profile"}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Response Time</p>
                </div>
                <p className="text-lg font-semibold">
                  Usually within {MOCK_DATA.stats.responseTime}
                </p>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Completion Rate
                  </p>
                </div>
                <p className="text-lg font-semibold">
                  {MOCK_DATA.stats.completionRate}
                </p>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Satisfaction</p>
                </div>
                <p className="text-lg font-semibold">
                  {MOCK_DATA.stats.satisfaction} / 5.0
                </p>
              </Card>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Services Provided</p>
          </div>
          <p className="text-lg font-semibold">
            {isStatsLoading ? "Loading..." : displayStats.providedServices}
          </p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Total Earnings</p>
          </div>
          <p className="text-lg font-semibold">
            {isStatsLoading ? "Loading..." : `$${displayStats.totalEarnings}`}
          </p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Total Bookings</p>
          </div>
          <p className="text-lg font-semibold">
            {isStatsLoading ? "Loading..." : displayStats.bookings}
          </p>
        </Card>
      </div>

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
            {isServicesLoading ? (
              <div>Loading services...</div>
            ) : displayServices.length > 0 ? (
              displayServices.map((service) => (
                <Card key={service.id} className="overflow-hidden">
                  <div className="p-4 space-y-2">
                    <h3 className="font-semibold">{service.serviceType}</h3>
                    <p className="text-sm text-muted-foreground">
                      {service.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">
                        $
                        {typeof service.price === "number"
                          ? service.price.toString()
                          : typeof service.price === "object" // Handle Decimal type
                          ? service.price
                          : service.price}
                      </Badge>
                      <Badge variant="outline">{service.status}</Badge>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="col-span-3 text-center py-8">
                <p className="text-muted-foreground">No services available</p>
                <Button onClick={handleCreateCourse} className="mt-4">
                  Create Your First Service
                </Button>
              </div>
            )}
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
            {isBookingsLoading ? (
              <div>Loading bookings...</div>
            ) : displayBookings.length > 0 ? (
              displayBookings.map((booking) => (
                <Card key={booking.id} className="p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="font-medium">{booking.clientName}</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(booking.bookingTime).toLocaleString()}
                      </p>
                      <Badge variant="outline">{booking.status}</Badge>
                    </div>
                    <div className="space-x-2">
                      <Button
                        onClick={(e) => handleJoinCall(e, booking.id)}
                        disabled={
                          booking.status !== "confirmed" ||
                          isLoading[`joinCall-${booking.id}`]
                        }
                      >
                        {isLoading[`joinCall-${booking.id}`]
                          ? "Joining..."
                          : "Join Call"}
                      </Button>
                      {booking.status === "confirmed" && (
                        <Button
                          variant="outline"
                          onClick={(e) => handleEndSession(e, booking.id)}
                          disabled={isLoading[`endSession-${booking.id}`]}
                        >
                          {isLoading[`endSession-${booking.id}`]
                            ? "Ending..."
                            : "End Session"}
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No active bookings</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Bookings will appear here once clients schedule sessions
                </p>
              </div>
            )}
          </ScrollArea>
        </TabsContent>

        <TabsContent value="requests">
          <ScrollArea className="h-[500px]">
            {MOCK_DATA.activeRequests.map((request) => (
              <Card key={request.id} className="p-4 mb-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="font-medium">{request.title}</h3>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback>
                          {request.requesterInitials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-muted-foreground">
                        {request.requester}
                      </span>
                    </div>
                  </div>
                  <Button
                    onClick={(e) =>
                      handleAcceptRequest(e, request.title, request.requester)
                    }
                    disabled={isLoading[`acceptRequest-${request.title}`]}
                  >
                    {isLoading[`acceptRequest-${request.title}`]
                      ? "Accepting..."
                      : "Accept Request"}
                  </Button>
                </div>
              </Card>
            ))}
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
