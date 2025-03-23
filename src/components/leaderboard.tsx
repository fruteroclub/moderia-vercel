"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Placeholder data
const topEarners = Array.from({ length: 7 }, (_, i) => ({
  id: `e${i}`,
  name: `Mentor ${i + 1}`,
  earnings: 5000 - i * 500,
  type: "Mentor",
}));

const mostSkilled = Array.from({ length: 7 }, (_, i) => ({
  id: `s${i}`,
  name: `Mentee ${i + 1}`,
  skills: 25 - i * 2,
  type: "Mentee",
}));

const jobCreators = Array.from({ length: 7 }, (_, i) => ({
  id: `j${i}`,
  name: `Mentor ${i + 1}`,
  jobs: 15 - i,
  type: "Mentor",
}));

const agentPicks = Array.from({ length: 7 }, (_, i) => ({
  id: `a${i}`,
  name: `${i % 2 === 0 ? "Mentor" : "Mentee"} ${i + 1}`,
  score: 95 - i * 5,
  type: i % 2 === 0 ? "Mentor" : "Mentee",
}));

function getInitials(name: string) {
  return name.split(" ")[1];
}

function getRankStyle(rank: number) {
  if (rank === 1) return "bg-yellow-500/10 text-yellow-500 font-bold";
  if (rank === 2) return "bg-gray-300/10 text-gray-300 font-semibold";
  if (rank === 3) return "bg-amber-600/10 text-amber-600 font-medium";
  return "";
}

export function Leaderboard() {
  return (
    <Tabs defaultValue="earnings" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="earnings">Top Earners</TabsTrigger>
        <TabsTrigger value="skilled">Most Skilled</TabsTrigger>
        <TabsTrigger value="jobs">Job Creators</TabsTrigger>
        <TabsTrigger value="picks">Agent's Picks</TabsTrigger>
      </TabsList>

      <TabsContent value="earnings">
        <LeaderboardTable
          data={topEarners}
          valueKey="earnings"
          valuePrefix="$"
          valueFormatter={(val) => val.toLocaleString()}
        />
      </TabsContent>

      <TabsContent value="skilled">
        <LeaderboardTable
          data={mostSkilled}
          valueKey="skills"
          valueSuffix=" skills"
        />
      </TabsContent>

      <TabsContent value="jobs">
        <LeaderboardTable
          data={jobCreators}
          valueKey="jobs"
          valueSuffix=" jobs"
        />
      </TabsContent>

      <TabsContent value="picks">
        <LeaderboardTable
          data={agentPicks}
          valueKey="score"
          valueSuffix=" pts"
        />
      </TabsContent>
    </Tabs>
  );
}

interface LeaderboardTableProps {
  data: Array<{
    id: string;
    name: string;
    type: string;
    [key: string]: any;
  }>;
  valueKey: string;
  valuePrefix?: string;
  valueSuffix?: string;
  valueFormatter?: (value: number) => string;
}

function LeaderboardTable({
  data,
  valueKey,
  valuePrefix = "",
  valueSuffix = "",
  valueFormatter = (val) => val.toString(),
}: LeaderboardTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-16">Rank</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead className="text-right">Value</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item, index) => (
          <TableRow key={item.id} className={getRankStyle(index + 1)}>
            <TableCell className="font-medium">{index + 1}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{getInitials(item.name)}</AvatarFallback>
                </Avatar>
                {item.name}
              </div>
            </TableCell>
            <TableCell>
              <Badge variant={item.type === "Mentor" ? "default" : "secondary"}>
                {item.type}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              {valuePrefix}
              {valueFormatter(item[valueKey])}
              {valueSuffix}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
