"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  Star,
  Clock,
  MapPin,
  Filter,
  Wallet,
  Trophy,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Agent {
  id: string;
  name: string;
  title: string;
  rating: number;
  reviews: number;
  sessions: number;
  location: string;
  timezone: string;
  responseTime: string;
  price: string;
  skills: string[];
  image?: string;
}

interface BookingDialogProps {
  agent: Agent;
  onClose: () => void;
}

function BookingDialog({ agent, onClose }: BookingDialogProps) {
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleBooking = async () => {
    setIsLoading(true);
    try {
      // Here we would integrate with the smart contract
      console.log(`Booking session with ${agent.name} for ${amount} USDC`);
      onClose();
    } catch (error) {
      console.error("Booking failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Book Session with {agent.name}</DialogTitle>
        <DialogDescription>
          Transfer USDC to escrow to secure your booking. The funds will be
          released after the session.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={agent.image} />
            <AvatarFallback>
              {agent.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="grid gap-1">
            <h4 className="font-medium leading-none">{agent.name}</h4>
            <p className="text-sm text-muted-foreground">{agent.title}</p>
          </div>
        </div>
        <div className="grid gap-2">
          <label htmlFor="amount" className="text-sm font-medium leading-none">
            Amount (USDC)
          </label>
          <div className="relative">
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="pr-12"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              USDC
            </span>
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleBooking} disabled={isLoading || !amount}>
          <Wallet className="mr-2 h-4 w-4" />
          {isLoading ? "Confirming..." : "Transfer to Escrow"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

function StakingDialog({ onClose }: { onClose: () => void }) {
  const [stakeAmount, setStakeAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleStaking = async () => {
    setIsLoading(true);
    try {
      // Here we would integrate with the smart contract
      console.log(`Staking ${stakeAmount} USDC`);
      onClose();
    } catch (error) {
      console.error("Staking failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Stake & Earn Rewards</DialogTitle>
        <DialogDescription>
          Stake USDC to earn rewards for completing quests and objectives. The
          higher your stake, the bigger your potential rewards!
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <label htmlFor="stake" className="text-sm font-medium leading-none">
            Stake Amount (USDC)
          </label>
          <div className="relative">
            <Input
              id="stake"
              type="number"
              value={stakeAmount}
              onChange={(e) => setStakeAmount(e.target.value)}
              placeholder="Enter stake amount"
              className="pr-12"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              USDC
            </span>
          </div>
        </div>
        <div className="rounded-lg bg-muted p-4">
          <div className="flex items-center gap-2 text-sm">
            <Trophy className="h-4 w-4 text-yellow-500" />
            <span>
              Potential Reward:{" "}
              {stakeAmount ? `${Number(stakeAmount) * 2} USDC` : "0 USDC"}
            </span>
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleStaking} disabled={isLoading || !stakeAmount}>
          <Trophy className="mr-2 h-4 w-4" />
          {isLoading ? "Confirming..." : "Place Bet"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

const mockAgents: Agent[] = [
  {
    id: "1",
    name: "Sarah Chen",
    title: "Senior Software Engineer @ Microsoft",
    rating: 4.99,
    reviews: 368,
    sessions: 650,
    location: "Seattle, United States",
    timezone: "(GMT-8)",
    responseTime: "Usually responds in 2 hours",
    price: "50 USDC/hr",
    skills: ["React", "TypeScript", "System Design", "Career Growth"],
    image: "https://avatars.githubusercontent.com/u/1234567?v=4",
  },
  {
    id: "2",
    name: "Michael Rodriguez",
    title: "Tech Lead @ Google",
    rating: 4.95,
    reviews: 245,
    sessions: 420,
    location: "San Francisco, United States",
    timezone: "(GMT-8)",
    responseTime: "Usually responds in 4 hours",
    price: "75 USDC/hr",
    skills: ["JavaScript", "Node.js", "Architecture", "Mentoring"],
    image: "https://avatars.githubusercontent.com/u/2345678?v=4",
  },
  {
    id: "3",
    name: "Emma Watson",
    title: "Senior Product Manager @ Amazon",
    rating: 4.97,
    reviews: 189,
    sessions: 310,
    location: "London, UK",
    timezone: "(GMT+0)",
    responseTime: "Usually responds in 3 hours",
    price: "60 USDC/hr",
    skills: ["Product Strategy", "Agile", "User Research", "Leadership"],
    image: "https://avatars.githubusercontent.com/u/3456789?v=4",
  },
  {
    id: "4",
    name: "Raj Patel",
    title: "Blockchain Developer @ Polygon",
    rating: 4.98,
    reviews: 156,
    sessions: 280,
    location: "Bangalore, India",
    timezone: "(GMT+5:30)",
    responseTime: "Usually responds in 1 hour",
    price: "45 USDC/hr",
    skills: ["Solidity", "Web3.js", "DeFi", "Smart Contracts"],
    image: "https://avatars.githubusercontent.com/u/4567890?v=4",
  },
  {
    id: "5",
    name: "Sophie Martin",
    title: "UI/UX Lead @ Figma",
    rating: 5.0,
    reviews: 203,
    sessions: 340,
    location: "Paris, France",
    timezone: "(GMT+1)",
    responseTime: "Usually responds in 5 hours",
    price: "65 USDC/hr",
    skills: ["UI Design", "User Experience", "Design Systems", "Figma"],
    image: "https://avatars.githubusercontent.com/u/5678901?v=4",
  },
  {
    id: "6",
    name: "Alex Thompson",
    title: "DevOps Engineer @ AWS",
    rating: 4.92,
    reviews: 178,
    sessions: 290,
    location: "Toronto, Canada",
    timezone: "(GMT-5)",
    responseTime: "Usually responds in 2 hours",
    price: "55 USDC/hr",
    skills: ["AWS", "Kubernetes", "CI/CD", "Infrastructure"],
    image: "https://avatars.githubusercontent.com/u/6789012?v=4",
  },
  {
    id: "7",
    name: "Maria Garcia",
    title: "Data Scientist @ Netflix",
    rating: 4.96,
    reviews: 134,
    sessions: 220,
    location: "Madrid, Spain",
    timezone: "(GMT+1)",
    responseTime: "Usually responds in 3 hours",
    price: "70 USDC/hr",
    skills: ["Machine Learning", "Python", "Data Analysis", "AI"],
    image: "https://avatars.githubusercontent.com/u/7890123?v=4",
  },
  {
    id: "8",
    name: "David Kim",
    title: "Mobile Dev Lead @ Coinbase",
    rating: 4.94,
    reviews: 167,
    sessions: 280,
    location: "Seoul, South Korea",
    timezone: "(GMT+9)",
    responseTime: "Usually responds in 4 hours",
    price: "60 USDC/hr",
    skills: ["React Native", "iOS", "Android", "Crypto"],
    image: "https://avatars.githubusercontent.com/u/8901234?v=4",
  },
  {
    id: "9",
    name: "Lisa Anderson",
    title: "Security Engineer @ 1Password",
    rating: 4.99,
    reviews: 145,
    sessions: 240,
    location: "Stockholm, Sweden",
    timezone: "(GMT+1)",
    responseTime: "Usually responds in 2 hours",
    price: "80 USDC/hr",
    skills: ["Security", "Penetration Testing", "Cryptography", "Zero Trust"],
    image: "https://avatars.githubusercontent.com/u/9012345?v=4",
  },
  {
    id: "10",
    name: "James Wilson",
    title: "Engineering Manager @ Stripe",
    rating: 4.97,
    reviews: 212,
    sessions: 360,
    location: "New York, United States",
    timezone: "(GMT-5)",
    responseTime: "Usually responds in 6 hours",
    price: "90 USDC/hr",
    skills: [
      "Engineering Leadership",
      "Team Building",
      "System Design",
      "Scaling",
    ],
    image: "https://avatars.githubusercontent.com/u/1023456?v=4",
  },
  {
    id: "11",
    name: "Nina Kowalski",
    title: "Game Developer @ Unity",
    rating: 4.93,
    reviews: 156,
    sessions: 260,
    location: "Warsaw, Poland",
    timezone: "(GMT+1)",
    responseTime: "Usually responds in 3 hours",
    price: "50 USDC/hr",
    skills: ["Unity3D", "Game Design", "C#", "3D Graphics"],
    image: "https://avatars.githubusercontent.com/u/1123456?v=4",
  },
  {
    id: "12",
    name: "Omar Hassan",
    title: "ML Engineer @ OpenAI",
    rating: 5.0,
    reviews: 98,
    sessions: 150,
    location: "Dubai, UAE",
    timezone: "(GMT+4)",
    responseTime: "Usually responds in 1 hour",
    price: "100 USDC/hr",
    skills: ["Deep Learning", "NLP", "PyTorch", "LLMs"],
    image: "https://avatars.githubusercontent.com/u/1234567?v=4",
  },
];

export default function StudentDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [showStakingDialog, setShowStakingDialog] = useState(false);

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by skill, name, or expertise..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>
        <div className="max-w-sm md:max-w-md ">
          <Dialog open={showStakingDialog} onOpenChange={setShowStakingDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="ml-4">
                <Trophy className="mr-2 h-4 w-4" />
                Stake & Earn
              </Button>
            </DialogTrigger>
            <StakingDialog onClose={() => setShowStakingDialog(false)} />
          </Dialog>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockAgents.map((agent) => (
          <Card key={agent.id} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={agent.image} />
                    <AvatarFallback>
                      {agent.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{agent.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {agent.title}
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="gap-1">
                  <Star className="h-3 w-3 fill-current" />
                  {agent.rating}
                </Badge>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {agent.location} {agent.timezone}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {agent.responseTime}
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">
                    {agent.reviews} reviews
                  </span>
                  {" • "}
                  <span className="text-muted-foreground">
                    {agent.sessions} sessions
                  </span>
                  {" • "}
                  <span className="font-medium text-foreground">
                    {agent.price}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {agent.skills.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>

              <Dialog
                open={showBookingDialog && selectedAgent?.id === agent.id}
                onOpenChange={(open) => {
                  setShowBookingDialog(open);
                  if (!open) setSelectedAgent(null);
                }}
              >
                <DialogTrigger asChild>
                  <Button
                    className="w-full mt-4"
                    onClick={() => {
                      setSelectedAgent(agent);
                      setShowBookingDialog(true);
                    }}
                  >
                    Request a Call
                  </Button>
                </DialogTrigger>
                {selectedAgent && (
                  <BookingDialog
                    agent={selectedAgent}
                    onClose={() => {
                      setShowBookingDialog(false);
                      setSelectedAgent(null);
                    }}
                  />
                )}
              </Dialog>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
