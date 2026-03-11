import { Bot, ExternalLink, Lock, MessageSquare, User } from "lucide-react";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Suspense, ViewTransition } from "react";
import Markdown from "react-markdown";
import { BackButton } from "@/components/back-button";
import { FormattedTime } from "@/components/formatted-time";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getActionById, getConversationDetail } from "@/data/queries/activity";
import { cleanSlackText, cn } from "@/lib/utils";
import { LiveStreamIndicator } from "./_components/live-stream-indicator";

export const unstable_instant = {
  prefetch: "runtime",
  samples: [{}],
};

export default function ConversationPage({
  params,
}: PageProps<"/activity/[id]">) {
  return (
    <>
      <Header description="Full conversation thread" title="Conversation" />
      <div className="flex-1 space-y-4 p-4">
        <BackButton fallbackHref="/activity">Activity</BackButton>
        <Suspense
          fallback={
            <ViewTransition>
              <ActionDetailSkeleton />
            </ViewTransition>
          }
        >
          <ViewTransition>
            <ActionDetail params={params} />
          </ViewTransition>
        </Suspense>
        <Suspense
          fallback={
            <ViewTransition>
              <MessagesSkeleton />
            </ViewTransition>
          }
        >
          <ViewTransition default="none" enter="slide-up">
            <ConversationMessages params={params} />
          </ViewTransition>
        </Suspense>
      </div>
    </>
  );
}

async function ActionDetail({
  params,
}: Pick<PageProps<"/activity/[id]">, "params">) {
  await connection();
  const { id: actionId } = await params;

  const action = await getActionById(actionId);
  if (!action) {
    notFound();
  }

  return (
    <Card>
      <CardContent className="flex items-center justify-between py-3">
        <span className="text-muted-foreground text-sm">
          {action.description} &middot; {action.channel} &middot;{" "}
          <FormattedTime timestamp={action.timestamp} />
        </span>
        {action.metadata?.permalink && (
          <a
            href={action.metadata.permalink}
            rel="noopener noreferrer"
            target="_blank"
          >
            <Button
              className="h-8 w-8 shrink-0 sm:hidden"
              size="icon"
              variant="outline"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </Button>
            <Button
              className="hidden sm:inline-flex"
              size="sm"
              variant="outline"
            >
              <ExternalLink className="mr-1 h-3 w-3" />
              View in Slack
            </Button>
          </a>
        )}
      </CardContent>
    </Card>
  );
}

async function ConversationMessages({
  params,
}: Pick<PageProps<"/activity/[id]">, "params">) {
  await connection();
  const { id: actionId } = await params;

  const detail = await getConversationDetail(actionId);
  if (!detail) {
    return null;
  }

  const { messages, threadKey, dmRestricted } = detail;

  if (dmRestricted) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center gap-2.5 py-6 text-muted-foreground">
          <Lock className="h-4 w-4" />
          <span className="text-sm">
            DM conversations are only visible to the community lead.
          </span>
        </CardContent>
      </Card>
    );
  }

  if (messages.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
          <MessageSquare className="h-8 w-8 text-muted-foreground/50" />
          <h3 className="mt-3 font-medium text-base">
            No conversation content
          </h3>
          <p className="mt-1 text-muted-foreground text-sm">
            This action was logged without a conversation thread.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {messages.map((msg) => (
        <ViewTransition
          enter="slide-up"
          key={`msg-${msg.role}-${msg.timestamp ?? msg.content.slice(0, 20)}`}
        >
          <div
            className={cn(
              "flex gap-3",
              msg.role === "assistant" && "flex-row-reverse"
            )}
          >
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted">
              {msg.role === "user" ? (
                <User className="h-3.5 w-3.5 text-muted-foreground" />
              ) : (
                <Bot className="h-3.5 w-3.5 text-muted-foreground" />
              )}
            </div>
            <Card
              className={cn(
                "max-w-[85%] gap-0 py-0 sm:max-w-[75%]",
                msg.role === "assistant" && "bg-muted/50"
              )}
            >
              <CardContent className="wrap-break-word px-4 py-2 text-sm">
                {msg.role === "assistant" ? (
                  <div className="prose prose-sm dark:prose-invert prose-headings:my-1 prose-li:my-0.5 prose-ol:my-1 prose-p:my-1 prose-ul:my-1 max-w-none prose-headings:font-semibold prose-headings:text-sm">
                    <Markdown>{cleanSlackText(msg.content)}</Markdown>
                  </div>
                ) : (
                  <span className="whitespace-pre-wrap">
                    {cleanSlackText(msg.content)}
                  </span>
                )}
                {msg.timestamp && (
                  <div className="mt-1 text-muted-foreground text-xs">
                    <FormattedTime timestamp={msg.timestamp} />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </ViewTransition>
      ))}
      {threadKey && <LiveStreamIndicator threadKey={threadKey} />}
    </div>
  );
}

function ActionDetailSkeleton() {
  return (
    <Card>
      <CardContent className="flex items-center justify-between py-3">
        <Skeleton className="h-4 w-64" />
        <Skeleton className="h-8 w-28" />
      </CardContent>
    </Card>
  );
}

function MessagesSkeleton() {
  return (
    <div className="space-y-3">
      <div className="flex items-start gap-3">
        <Skeleton className="h-7 w-7 shrink-0 rounded-full" />
        <Skeleton className="h-12 w-3/5 rounded-xl" />
      </div>
      <div className="flex flex-row-reverse items-start gap-3">
        <Skeleton className="h-7 w-7 shrink-0 rounded-full" />
        <Skeleton className="h-16 w-3/5 rounded-xl" />
      </div>
      <div className="flex items-start gap-3">
        <Skeleton className="h-7 w-7 shrink-0 rounded-full" />
        <Skeleton className="h-10 w-2/5 rounded-xl" />
      </div>
      <div className="flex flex-row-reverse items-start gap-3">
        <Skeleton className="h-7 w-7 shrink-0 rounded-full" />
        <Skeleton className="h-14 w-3/5 rounded-xl" />
      </div>
    </div>
  );
}
