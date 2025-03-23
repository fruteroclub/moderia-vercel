"use client";

import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CalendarDays,
  Users,
  TrendingUp,
  Brain,
  Briefcase,
  Archive,
  AlertTriangle,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface StatsCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  trend?: string;
}

function StatsCard({ title, value, description, icon, trend }: StatsCardProps) {
  return (
    <Card className="p-6 space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className="text-foreground/80">{icon}</div>
      </div>
      <div className="flex items-baseline gap-2">
        <p className="text-2xl font-bold">{value}</p>
        {trend && (
          <span className="text-sm text-emerald-600">
            +{trend}% from last week
          </span>
        )}
      </div>
      <p className="text-sm text-foreground/60">{description}</p>
    </Card>
  );
}

function HelpRequestCard({
  title,
  author,
  time,
  tags,
  applicants,
}: {
  title: string;
  author: { name: string; image?: string };
  time: string;
  tags: string[];
  applicants: number;
}) {
  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h3 className="font-medium">{title}</h3>
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={author.image} />
              <AvatarFallback>
                {author.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-foreground/60">{author.name}</span>
            <span className="text-sm text-foreground/60">• {time}</span>
          </div>
        </div>
        <Badge variant="outline">{applicants} applied</Badge>
      </div>
      <div className="flex gap-2">
        {tags.map((tag) => (
          <Badge key={tag} variant="secondary">
            {tag}
          </Badge>
        ))}
      </div>
    </Card>
  );
}

interface SessionCardProps {
  title: string;
  date: string;
  status: "paid" | "pending_signature" | "executed" | "disputed";
  mentee: {
    name: string;
    image?: string;
  };
  duration: string;
  onAction: () => void;
}

function SessionCard({
  title,
  date,
  status,
  mentee,
  duration,
  onAction,
}: SessionCardProps) {
  const statusConfig = {
    paid: {
      label: "Paid",
      color: "bg-emerald-500/10 text-emerald-500",
      icon: <CheckCircle2 className="h-4 w-4" />,
      action: "Archive",
      buttonVariant: "outline" as const,
    },
    pending_signature: {
      label: "Pending Signature",
      color: "bg-yellow-500/10 text-yellow-500",
      icon: <Clock className="h-4 w-4" />,
      action: "Sign & Approve",
      buttonVariant: "default" as const,
    },
    executed: {
      label: "Executed",
      color: "bg-blue-500/10 text-blue-500",
      icon: <CheckCircle2 className="h-4 w-4" />,
      action: "Sign",
      buttonVariant: "default" as const,
    },
    disputed: {
      label: "Disputed",
      color: "bg-red-500/10 text-red-500",
      icon: <AlertTriangle className="h-4 w-4" />,
      action: "Start Dispute",
      buttonVariant: "destructive" as const,
    },
  };

  const config = statusConfig[status];

  return (
    <Card className="p-4 mb-4">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <h3 className="font-medium">{title}</h3>
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={mentee.image} />
              <AvatarFallback>
                {mentee.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-foreground/60">{mentee.name}</span>
            <span className="text-sm text-foreground/60">• {date}</span>
            <Badge variant="outline">{duration}</Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={config.color} variant="outline">
            <div className="flex items-center gap-1">
              {config.icon}
              {config.label}
            </div>
          </Badge>
          <Button variant={config.buttonVariant} size="sm" onClick={onAction}>
            {config.action}
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default function Dashboard() {
  return (
    <div className="container py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Badge variant="default" className="text-lg px-4 py-2">
          Pro Mentor
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Earnings This Week"
          value="$1,250"
          description="Total earnings from completed sessions"
          icon={<TrendingUp className="h-5 w-5" />}
          trend="12"
        />
        <StatsCard
          title="Teaching Streak"
          value="15 days"
          description="Consecutive days with 4.5+ rating"
          icon={<CalendarDays className="h-5 w-5" />}
        />
        <StatsCard
          title="Job Interviews Generated"
          value="8"
          description="Interviews secured by mentees"
          icon={<Briefcase className="h-5 w-5" />}
          trend="25"
        />
        <StatsCard
          title="Skills Added"
          value="24"
          description="New skills acquired by mentees"
          icon={<Brain className="h-5 w-5" />}
          trend="8"
        />
      </div>

      <Tabs defaultValue="upcoming" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming Sessions</TabsTrigger>
          <TabsTrigger value="recent">Recent Sessions</TabsTrigger>
          <TabsTrigger value="requests">Help Requests</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          <ScrollArea className="h-[400px] pr-4">
            {/* Placeholder for upcoming sessions */}
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="font-medium">Technical Interview Prep</h3>
                    <p className="text-sm text-foreground/60">
                      Tomorrow at 2:00 PM
                    </p>
                  </div>
                  <Badge>45 min</Badge>
                </div>
              </Card>
            ))}
          </ScrollArea>
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          <ScrollArea className="h-[400px] pr-4">
            <SessionCard
              title="System Design Deep Dive"
              date="Today at 2:00 PM"
              status="paid"
              mentee={{ name: "Alex Johnson" }}
              duration="60 min"
              onAction={() => console.log("Archive session")}
            />
            <SessionCard
              title="React Performance Workshop"
              date="Yesterday at 4:00 PM"
              status="pending_signature"
              mentee={{ name: "Sarah Chen" }}
              duration="90 min"
              onAction={() => console.log("Sign and approve")}
            />
            <SessionCard
              title="Career Strategy Session"
              date="March 15, 2024"
              status="executed"
              mentee={{ name: "Mike Brown" }}
              duration="45 min"
              onAction={() => console.log("Sign session")}
            />
            <SessionCard
              title="Technical Interview Prep"
              date="March 14, 2024"
              status="disputed"
              mentee={{ name: "Emma Wilson" }}
              duration="60 min"
              onAction={() => console.log("Start dispute process")}
            />
          </ScrollArea>
        </TabsContent>

        <TabsContent value="requests" className="space-y-4">
          <ScrollArea className="h-[400px] pr-4">
            <HelpRequestCard
              title="Need help with System Design Interview"
              author={{ name: "John Smith" }}
              time="2 hours ago"
              tags={["System Design", "Interview Prep"]}
              applicants={3}
            />
            <div className="h-4" />
            <HelpRequestCard
              title="React Performance Optimization"
              author={{ name: "Sarah Chen" }}
              time="5 hours ago"
              tags={["React", "Performance"]}
              applicants={1}
            />
          </ScrollArea>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <ScrollArea className="h-[400px] pr-4">
            {/* Placeholder for completed sessions */}
            {Array.from({ length: 5 }).map((_, i) => (
              <Card key={i} className="p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="font-medium">Career Growth Strategy</h3>
                    <p className="text-sm text-foreground/60">
                      Completed on March {10 + i}
                    </p>
                  </div>
                  <Badge variant="secondary">⭐ 5.0</Badge>
                </div>
              </Card>
            ))}
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
