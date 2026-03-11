import {
  ArrowRight,
  BookOpen,
  ExternalLink,
  MessageSquare,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { Suspense, ViewTransition } from "react";
import { AnimatedNumber } from "@/components/animated-number";
import { FormattedTime } from "@/components/formatted-time";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { typeConfig } from "@/config/type-config";
import {
  getAnalyticsData,
  getDashboardStats,
  getRecentActions,
} from "@/data/queries/activity";
import { config } from "@/lib/config";
import { AnalyticsChart } from "./_components/analytics-chart";
import { DashboardLive } from "./_components/dashboard-live";
import { Route } from "next";

export const instant = {
  prefetch: "runtime" as const,
  samples: [
    {
      cookies: [{ name: "better-auth.session_token", value: "sample" }],
    },
  ],
};

const PROTOCOL_RE = /^https?:\/\//;

export default function OverviewPage() {
  const analyticsPromise = getAnalyticsData();

  return (
    <>
      <Header
        description={`${config.communityName} dashboard`}
        title="Overview"
      />
      <div className="flex-1 space-y-4 p-4">
        <DashboardLive />
        {config.savoirApiUrl && (
          <div className="flex items-center gap-2 rounded-lg border border-info/20 bg-info/5 px-3 py-2 text-xs">
            <BookOpen className="h-3.5 w-3.5 text-info" />
            <span>
              Knowledge base:{" "}
              <a
                className="font-medium text-info hover:underline"
                href={config.savoirApiUrl}
                rel="noopener noreferrer"
                target="_blank"
              >
                {config.savoirApiUrl.replace(PROTOCOL_RE, "")}
                <ExternalLink className="ml-1 inline h-3 w-3" />
              </a>
            </span>
          </div>
        )}
        <Suspense
          fallback={
            <ViewTransition>
              <StatsCardsSkeleton />
            </ViewTransition>
          }
        >
          <ViewTransition>
            <StatsCards />
          </ViewTransition>
        </Suspense>
        <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
          <Suspense
            fallback={
              <ViewTransition>
                <AnalyticsChartSkeleton />
              </ViewTransition>
            }
          >
            <ViewTransition>
              <AnalyticsChart dataPromise={analyticsPromise} />
            </ViewTransition>
          </Suspense>
          <Suspense
            fallback={
              <ViewTransition>
                <RecentActivitySkeleton />
              </ViewTransition>
            }
          >
            <ViewTransition>
              <RecentActivityCard />
            </ViewTransition>
          </Suspense>
        </div>
      </div>
    </>
  );
}

async function StatsCards() {
  const { counts, thisWeek } = await getDashboardStats();

  const cards = [
    {
      title: "Questions answered",
      value: String(counts.answered || 0),
      type: "answered" as const,
      href: "/activity?type=answered",
      weekly: thisWeek.answered || 0,
    },
    {
      title: "Questions routed",
      value: String(counts.routed || 0),
      type: "routed" as const,
      href: "/activity?type=routed",
      weekly: thisWeek.routed || 0,
    },
    {
      title: "Members welcomed",
      value: String(counts.welcomed || 0),
      type: "welcomed" as const,
      href: "/activity?type=welcomed",
      weekly: thisWeek.welcomed || 0,
    },
    {
      title: "Questions surfaced",
      value: String(counts.surfaced || 0),
      type: "surfaced" as const,
      href: "/activity?type=surfaced",
      weekly: thisWeek.surfaced || 0,
    },
    {
      title: "Issues flagged",
      value: String(counts.flagged || 0),
      type: "flagged" as const,
      href: "/activity?type=flagged",
      weekly: thisWeek.flagged || 0,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 lg:grid-cols-3">
      {cards.map((stat) => {
        const cfg = typeConfig[stat.type];
        return (
          <Link href={stat.href as Route} key={stat.title}>
            <Card className="gap-1 py-2.5 transition-colors hover:bg-accent/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:gap-1.5 sm:py-3">
              <CardHeader className="flex flex-row items-center justify-between px-3 pb-0">
                <CardTitle className="font-medium text-muted-foreground text-xs">
                  {stat.title}
                </CardTitle>
                <div
                  className={`hidden h-5 w-5 items-center justify-center rounded-full sm:flex ${cfg.bgColor}`}
                >
                  <cfg.icon className={`h-2.5 w-2.5 ${cfg.iconColor}`} />
                </div>
              </CardHeader>
              <CardContent className="px-3">
                <AnimatedNumber
                  className="font-bold text-xl"
                  value={stat.value}
                />
                {stat.weekly > 0 ? (
                  <p className="hidden items-center gap-1 text-success text-xs sm:flex">
                    <TrendingUp className="h-3 w-3" />+{stat.weekly} this week
                  </p>
                ) : (
                  <p className="hidden text-muted-foreground text-xs sm:block">
                    No activity this week
                  </p>
                )}
              </CardContent>
            </Card>
          </Link>
        );
      })}
      <Link href="/activity">
        <Card className="gap-1 py-2.5 transition-colors hover:bg-accent/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:gap-1.5 sm:py-3">
          <CardHeader className="flex flex-row items-center justify-between px-3 pb-0">
            <CardTitle className="font-medium text-muted-foreground text-xs">
              Total actions
            </CardTitle>
            <div className="hidden h-5 w-5 items-center justify-center rounded-full bg-muted sm:flex">
              <MessageSquare className="h-2.5 w-2.5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="px-3">
            <AnimatedNumber
              className="font-bold text-xl"
              value={String(counts.total)}
            />
            {thisWeek.total > 0 ? (
              <p className="hidden items-center gap-1 text-success text-xs sm:flex">
                <TrendingUp className="h-3 w-3" />+{thisWeek.total} this week
              </p>
            ) : (
              <p className="hidden text-muted-foreground text-xs sm:block">
                No activity this week
              </p>
            )}
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}

async function RecentActivityCard() {
  const actions = await getRecentActions();
  const recent = actions.slice(0, 4);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm">Recent activity</CardTitle>
        <Button asChild size="sm" variant="outline">
          <Link href="/activity">
            View all <ArrowRight className="ml-1 h-3 w-3" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {recent.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No activity yet—stats will appear as the bot handles messages.
          </p>
        ) : (
          <div className="space-y-1">
            {recent.map((action) => {
              const cfg = typeConfig[action.type];
              const Icon = cfg.icon;
              const href =
                action.type === "answered"
                  ? `/activity/${action.id}`
                  : `/activity?type=${action.type}`;
              return (
                <Link
                  className="-mx-2 flex items-start gap-2.5 rounded-md px-2 py-1.5 transition-colors hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  href={href as Route}
                  key={action.id}
                >
                  <div
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${cfg.bgColor}`}
                  >
                    <Icon className={`h-2.5 w-2.5 ${cfg.iconColor}`} />
                  </div>
                  <div className="min-w-0 flex-1 text-sm">
                    <p className="text-foreground">{action.description}</p>
                    <p className="text-muted-foreground text-xs">
                      {action.channel} &middot;{" "}
                      <FormattedTime timestamp={action.timestamp} />
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function RecentActivitySkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-8 w-20" />
      </CardHeader>
      <CardContent className="space-y-1">
        {[1, 2, 3, 4].map((i) => (
          <div className="-mx-2 flex items-start gap-2.5 px-2 py-1.5" key={i}>
            <Skeleton className="mt-0.5 h-5 w-5 shrink-0 rounded-full" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function AnalyticsChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-14" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[240px] w-full" />
      </CardContent>
    </Card>
  );
}

function StatsCardsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card className="gap-1 py-3 sm:gap-1.5 sm:py-3.5" key={i}>
          <CardHeader className="flex flex-row items-center justify-between px-3 pb-0">
            <Skeleton className="h-3 w-16 sm:w-20" />
            <Skeleton className="hidden h-5 w-5 rounded-full sm:block" />
          </CardHeader>
          <CardContent className="px-3">
            <Skeleton className="mb-1 h-6 w-8" />
            <Skeleton className="hidden h-3 w-20 sm:block" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
