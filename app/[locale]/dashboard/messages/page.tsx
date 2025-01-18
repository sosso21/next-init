"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Send,
  User,
  X,
  CheckCheck,
  LoaderCircle,
  CircleDot,
  Network,
  Mail,
  Inbox,
  Phone,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { getThread, getThreads, sendMessage } from "@/server/message.action";
import { $Enums } from "@prisma/client";
import {
  dkPhtographeDark,
  dkPhtographeLight,
} from "@/app/components/icons/Icons";
import {
  MessageType,
  sendMessageInputSchema,
  SendMessageInputType,
  ThreadOutputType,
  ThreadsOutputType,
  ThreadType,
  UserType,
} from "./types";
import { parseAsInteger, useQueryState } from "nuqs";
import { cn } from "@/lib/utils";
import { formatDate, formatElapsedTime } from "@/lib/hermes-moment";
import { LocaleParamsType } from "../../types";
import { useClientTranslation } from "@/lib/use-translation/use-client-translation";
import { emailDkPhotographe, ownerApp, phoneDkPhotographe } from "@/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { useIntersection } from "@mantine/hooks";

import { toArray } from "react-emoji-render";

import { LinkItUrl } from "react-linkify-it";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

const defaultThreads: ThreadsOutputType = {
  count: 0,
  skip: 0,
  take: 0,
  hasPreviousPage: false,
  hasNextPage: false,
  data: [],
  userId: null,
  roles: [],
};

const defaultThread: ThreadOutputType = {
  count: 0,
  skip: 0,
  take: 0,
  hasPreviousPage: false,
  hasNextPage: false,
  data: null,
  userId: null,
  roles: [],
};

const ReviverAvatar = ({
  isAdmin,
  threadUser,
  className,
}: {
  isAdmin: boolean;
  threadUser?: UserType;
  className?: string;
}) => {
  return (
    <Avatar className={className}>
      {!isAdmin ? (
        <>
          <AvatarImage
            className="dark:block hidden"
            src={dkPhtographeDark}
            alt={"admin avatar dark"}
          />
          <AvatarImage
            className="block dark:hidden"
            src={dkPhtographeLight}
            alt={"admin avatar"}
          />
        </>
      ) : (
        <AvatarImage
          src={threadUser?.image ?? ""}
          alt={threadUser?.name ?? ""}
        />
      )}
      <AvatarFallback>
        {(threadUser?.name ?? "")
          .split(" ")
          .map((n: string) => n[0])
          .join("")}
      </AvatarFallback>
    </Avatar>
  );
};

export default function Page({ params }: LocaleParamsType) {
  const [threadId, setThreadId] = useQueryState("threadId", parseAsInteger);
  const [showProfile, setShowProfile] = useState<boolean>(false);

  const t = useClientTranslation("messages");
  const [toScrollMessageId, setToScrollMessageId] = useState<number | null>(
    null
  );
  const [stopRequest, setStopRequest] = useState<boolean>(true);
  const stopDelay = () => {
    new Promise((resolve) => setTimeout(resolve, 5000)).then(() => {
      setStopRequest(false);
    });
  };

  const bottomThreadRef = useRef<HTMLDivElement>(null);
  const toScrollMessageRef = useRef<HTMLDivElement>(null);
  const spierThreadRef = useRef<HTMLDivElement>(null);
  const spierMessageRef = useRef<HTMLDivElement>(null);
  const { ref: threadIntersectionRef, entry: threadEntry } = useIntersection({
    root: spierThreadRef.current,
    threshold: 0,
  });

  const { ref: messageIntersectionRef, entry: messageEntry } = useIntersection({
    root: spierMessageRef.current,
    threshold: 0,
  });

  const [threads, setThreads] = useState<ThreadType[]>([]);
  const [messages, setMessages] = useState<MessageType[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    // setError,
    getValues,
    // watch,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<SendMessageInputType>({
    resolver: zodResolver(sendMessageInputSchema),
    defaultValues: {
      threadId: threadId ?? 0,
      body: "",
    },
  });

  async function threadsQueryFn({
    infiniteScroll = false,
  }: {
    infiniteScroll?: boolean;
  }): Promise<ThreadsOutputType | null> {
    if (infiniteScroll) {
      setStopRequest(true);
    }

    const skip = infiniteScroll ? threads.length : 0;
    return await getThreads({ take: 20, skip: skip })
      .then((response) => {
        const result = response[0];

        if (result?.data) {
          if (!threadId) {
            setThreadId(result.data[0].id);
          }
          setThreads((prev) => [
            ...prev.filter(
              (thread) =>
                !result.data.some((newThread) => newThread.id === thread.id)
            ),
            ...result.data,
          ]);
        }
        if (messages.length == 0 && result?.data) {
          result.data.forEach((thread) => {
            thread.messages.forEach((message) => {
              setMessages((prev) => [...prev, message]);
            });
          });
          setToScrollMessageId(result.data[0].messages[0].id);
        }
        return result;
      })
      .catch(() => null)
      .finally(() => stopDelay());
  }

  async function messagesQueryFn({
    infiniteScroll,
  }: {
    infiniteScroll: boolean;
  }): Promise<ThreadOutputType | null> {
    const previousMessage = messages.filter(
      (message) => message.threadId === threadId
    ).length;
    if (infiniteScroll || previousMessage <= 1) {
      setStopRequest(true);
    }

    const skip = infiniteScroll ? previousMessage : 0;

    return await getThread({
      id: threadId as number,
      take: 20,
      skip: skip,
    })
      .then((response) => {
        const result = response[0];

        if (result?.data?.messages) {
          const new_messages = result.data.messages;
          setMessages((prev) => [
            ...prev.filter(
              (message) =>
                !new_messages.some((newMessage) => newMessage.id == message.id)
            ),
            ...new_messages,
          ]);
          if (previousMessage <= 1 || infiniteScroll) {
            setToScrollMessageId(
              new_messages.sort(
                (a, b) =>
                  b.createdAt.getTime() + b.id - (a.createdAt.getTime() + a.id)
              )[0].id
            );
          }
        }
        return result;
      })
      .catch(() => null)

      .finally(() => stopDelay());
  }

  const {
    data: threadsData,
    refetch: refetchThreads,
    isFetching: isFetchingThreads,
    isRefetching: isRefetchingThreads,
  } = useQuery({
    queryKey: ["threads"],
    queryFn: () =>
      threadsQueryFn({ infiniteScroll: !!threadEntry?.isIntersecting }),
    refetchInterval: 30000,
    initialData: defaultThreads,
  });

  const {
    data: MessagesData,
    refetch: refetchMessages,
    isFetching: isFetchingMessages,
    isRefetching: isRefetchingMessages,
  } = useQuery({
    queryKey: ["messages", threadId],
    queryFn: () =>
      messagesQueryFn({ infiniteScroll: !!messageEntry?.isIntersecting }),
    enabled: !!threadId,
    refetchInterval: 20000,
    initialData: defaultThread,
  });

  useEffect(() => {
    toScrollMessageRef.current?.scrollIntoView({
      // behavior: "smooth",
    });
  }, [toScrollMessageId]);

  useEffect(() => {
    if (
      !!threadEntry?.isIntersecting &&
      !stopRequest &&
      MessagesData?.hasNextPage &&
      !isFetchingThreads &&
      !isRefetchingThreads
    ) {
      refetchThreads();
    }
  }, [
    threadEntry?.isIntersecting == true,
    // refetchThreads,
    // stopRequest,
    // threadsData?.hasNextPage,
  ]);

  useEffect(() => {
    if (
      !!messageEntry?.isIntersecting &&
      !stopRequest &&
      MessagesData?.count !=
        messages.filter((message) => message.threadId === threadId).length &&
      !isFetchingMessages &&
      !isRefetchingMessages
    ) {
      refetchMessages();
    }
  }, [
    messageEntry?.isIntersecting == true,
    // refetchMessages,
    // stopRequest,
    // MessagesData?.hasNextPage,
  ]);

  const onSubmitForm: SubmitHandler<SendMessageInputType> = async (data) => {
    try {
      await sendMessage({ ...data, threadId: threadId ?? 0 });

      refetchThreads();
      refetchMessages();
      bottomThreadRef?.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });

      reset();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <main className="flex w-full h-screen">
      <div
        className={cn("border border-r md:basis-1/4", {
          hidden: !MessagesData?.count && !threadsData?.count,
        })}
      >
        <ScrollArea className={"h-screen"}>
          <div className="md:inline-block hidden p-4 border border-b">
            <h2 className="font-semibold text-xl"> {t("title")} </h2>
          </div>

          {threads
            .sort(
              (a, b) =>
                (b?.lastMessageAt as Date).getTime() -
                (a?.lastMessageAt as Date)?.getTime()
            )
            .map((thread) => {
              const isAdmin = (
                (threadsData?.roles ?? []) as $Enums.role[]
              ).includes($Enums.role.ADMIN);

              const isMyMessage = isAdmin
                ? (isAdmin && thread.messages[0].senderRole) ===
                  $Enums.role.ADMIN
                : threadsData?.userId === thread.messages[0]?.senderId;
              const isNewMessage =
                thread.messages[0]?.readAt == null && !isMyMessage;

              return (
                <div
                  key={thread.id}
                  className={cn(
                    "flex justify-center md:justify-start items-center hover:bg-secondary p-4 hover:text-secondary-foreground cursor-pointer",
                    {
                      "bg-secondary text-secondary-foreground": isNewMessage,
                      "bg-primary text-primary-foreground":
                        thread.id === threadId,
                    }
                  )}
                  onClick={() => setThreadId(thread.id)}
                >
                  <ReviverAvatar
                    threadUser={thread.users[0]}
                    isAdmin={isAdmin}
                  />

                  <div className="md:flex flex-col justify-center items-start hidden md:ml-4">
                    <p className="font-semibold">
                      {isAdmin
                        ? thread.users[0]?.name ??
                          thread.users[0]?.username ??
                          ""
                        : ownerApp}
                    </p>

                    <p
                      className={cn("max-w-40 text-sm hidden truncate", {
                        block: isNewMessage,
                      })}
                    >
                      {toArray(thread.messages[0]?.body ?? "")}
                    </p>

                    <span className="flex justify-between items-center gap-2">
                      <p className="text-xs">
                        {formatElapsedTime({
                          date: thread.lastMessageAt as Date,
                          locale: params.locale,
                        })}
                      </p>
                      <i>
                        <CheckCheck
                          className={cn({
                            hidden: !thread.messages[0]?.readAt,
                          })}
                        />
                        <CircleDot
                          size={"1rem"}
                          className={cn("my-auto hidden", {
                            "text-primary inline": isNewMessage,
                          })}
                        />
                      </i>
                    </span>
                  </div>
                </div>
              );
            })}

          <LoaderCircle
            className={cn("mx-auto hidden animate-spin", {
              block:
                !stopRequest && threadsData?.hasNextPage && !!threadsData.take,
            })}
            ref={threadIntersectionRef}
          />
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      {!MessagesData?.count && !threadsData?.count && !isFetchingThreads ? (
        <div className="flex justify-center items-center mx-auto w-full min-h-screen">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle className="font-bold text-2xl">
                {t("title-empty")}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="flex justify-center mb-4">
                <Inbox className="w-16 h-16 text-primary" />
              </div>
              <p className="mb-4 text-lg text-secondary">{t("emptyMessage")}</p>
              <p className="text-gray-500 text-sm">{t("suggestion")}</p>
            </CardContent>
            <CardFooter className="justify-center">
              <Link href={`/${params.locale}/dashboard/contact-us`}>
                <Button className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>{t("contactLink")}</span>
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      ) : (
        <div
          className={cn("flex flex-col flex-1", {
            "hidden xl:flex": showProfile,
          })}
        >
          {/* Chat Header */}
          <div className="flex justify-between items-center p-4 border border-b">
            <div className="flex items-center">
              <ReviverAvatar
                className="w-10 h-10"
                isAdmin={((threadsData?.roles ?? []) as $Enums.role[]).includes(
                  $Enums.role.ADMIN
                )}
                threadUser={MessagesData?.data?.users[0]}
              />
              <h2 className="ml-4 font-semibold text-xl">
                {((threadsData?.roles ?? []) as $Enums.role[]).includes(
                  $Enums.role.ADMIN
                )
                  ? MessagesData?.data?.users[0]?.name ??
                    MessagesData?.data?.users[0]?.username
                  : ownerApp}
              </h2>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowProfile(!showProfile)}
              >
                <User className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <ScrollArea className="flex-1 p-4">
            {
              <LoaderCircle
                className={cn("mx-auto hidden animate-spin", {
                  block:
                    !stopRequest &&
                    MessagesData?.count &&
                    MessagesData?.count !=
                      messages.filter(
                        (message) => message.threadId === threadId
                      ).length &&
                    MessagesData.take > 1,
                })}
                ref={messageIntersectionRef}
              />
            }
            {messages
              .filter((message) => message.threadId === threadId)
              .sort(
                (a, b) =>
                  a.createdAt.getTime() + a.id - (b.createdAt.getTime() + b.id)
              )
              .flatMap((message: MessageType) => {
                const isAdmin = (
                  (MessagesData?.roles ?? []) as $Enums.role[]
                ).includes($Enums.role.ADMIN);

                const isMyMessage =
                  MessagesData?.userId === message.senderId ||
                  (isAdmin && message.senderRole) === $Enums.role.ADMIN;

                //  const isNewMessage = message.readAt == null && !isMyMessage;

                return (
                  <div
                    id={`message-${message.id}`}
                    key={message.id}
                    className={cn(
                      `flex justify-start items-center gap-1 md:gap-4 mt-2`,
                      {
                        "flex-row-reverse": isMyMessage,
                      }
                    )}
                  >
                    <div
                      className={cn(
                        `max-w-[70%] p-3 rounded-lg bg-secondary text-secondary-foreground`,
                        {
                          "bg-primary text-primary-foreground": isMyMessage,
                        }
                      )}
                      ref={
                        message.id === toScrollMessageId
                          ? toScrollMessageRef
                          : null
                      }
                    >
                      {message.subject && (
                        <>
                          <p>
                            <span> {t("subject")}</span>
                            <span> {t(message.subject)}</span>
                          </p>
                          <Separator className="bg-primary my-1" />
                        </>
                      )}
                      <LinkItUrl className="block">
                        {toArray(message.body ?? "")}
                      </LinkItUrl>
                    </div>
                    <div className="opacity-0 hover:opacity-100 transition-opacity">
                      <i
                        className={cn(
                          "flex w-full justify-start items-center gap-2 opacity-70 text-xs",
                          {
                            "flex-row-reverse": isMyMessage,
                          }
                        )}
                      >
                        <Send size={"1rem"} />
                        <span>
                          {formatDate(message.createdAt, params.locale, true)}
                        </span>
                      </i>
                      {message.readAt && (
                        <i
                          className={cn(
                            "flex w-full justify-start items-center gap-2 opacity-70 text-xs",
                            {
                              "flex-row-reverse": isMyMessage,
                            }
                          )}
                        >
                          <CheckCheck size={"1rem"} />
                          <span>
                            {formatDate(message.readAt, params.locale, true)}
                          </span>
                        </i>
                      )}

                      {message.ip && (
                        <i
                          className={cn(
                            "flex w-full justify-start items-center gap-2 opacity-70 text-xs",
                            {
                              "flex-row-reverse": isMyMessage,
                            }
                          )}
                        >
                          <Network size={"1rem"} />
                          <span>{message.ip}</span>
                        </i>
                      )}
                    </div>
                  </div>
                );
              })}

            <i className="block w-full h-20" ref={bottomThreadRef} />
          </ScrollArea>

          {/* Message Input */}
          <div className="p-4 border border-t">
            <form
              onSubmit={handleSubmit(onSubmitForm)}
              className="flex space-x-2"
            >
              <Input
                {...register("body")}
                className="flex-1"
                placeholder="Type a message..."
                autoComplete="off"
              />
              <Button type="submit">
                <Send className="w-5 h-5" />
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Profile/Resume Section */}
      {showProfile && (
        <div className="p-4 border border-l w-full xl:w-1/4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-xl">Profile</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowProfile(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          <Card>
            <CardHeader>
              <ReviverAvatar
                isAdmin={(MessagesData?.roles ?? []).includes(
                  $Enums.role.ADMIN
                )}
                threadUser={MessagesData?.data?.users[0]}
                className="mx-auto w-24 h-24"
              />
              <CardTitle className="mt-2 text-center">
                {" "}
                {(MessagesData?.roles ?? []).includes($Enums.role.ADMIN)
                  ? MessagesData?.data?.users[0].name
                  : ownerApp}{" "}
              </CardTitle>
              <CardDescription className="text-center">
                {(MessagesData?.roles ?? []).includes($Enums.role.ADMIN)
                  ? MessagesData?.data?.users[0].username
                  : ""}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">{t("coordinate")}</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {[
                      MessagesData?.roles?.includes($Enums.role.ADMIN)
                        ? MessagesData?.data?.users[0].email
                        : emailDkPhotographe,
                    ].map((email) => (
                      <Link key={email} href={`mailto:${email}`}>
                        {" "}
                        <Badge>
                          <Mail className="mx-2" size={"1rem"} /> {email}
                        </Badge>
                      </Link>
                    ))}

                    {MessagesData?.roles?.includes($Enums.role.ADMIN) ? (
                      [...(MessagesData?.data?.users[0]?.phones ?? [])].map(
                        (phone: any) => (
                          <Link
                            key={phone.number}
                            href={`tel:${phone.code}${phone.number
                              .split("-")
                              .join("")
                              .split(" ")
                              .join("")}`}
                          >
                            {" "}
                            <Badge>
                              {" "}
                              <Phone className="mx-2" size={"1rem"} />
                              {`${phone.code} ${phone.number
                                .split("-")
                                .join("")
                                .split(" ")
                                .join("")
                                .replace(
                                  /(\d{1})(\d{2})(\d{2})(\d{2})(\d{2})/,
                                  "$1 $2 $3 $4 $5"
                                )}`}
                            </Badge>
                          </Link>
                        )
                      )
                    ) : (
                      <Link href={`tel:${phoneDkPhotographe}`}>
                        {" "}
                        <Badge>
                          <Phone className="mx-2" size={"1rem"} />{" "}
                          {phoneDkPhotographe}
                        </Badge>
                      </Link>
                    )}
                  </div>
                </div>
                <div>
                  {MessagesData?.roles?.includes($Enums.role.ADMIN) && (
                    <>
                      <h3 className="font-semibold">{t("profile-info")}</h3>
                      <ul className="text-sm list-disc list-inside">
                        {[
                          `${t("createdAt")}${formatDate(
                            MessagesData?.data?.users[0]?.createdAt as Date,
                            params.locale,
                            true
                          )}`,
                        ].map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </main>
  );
}
