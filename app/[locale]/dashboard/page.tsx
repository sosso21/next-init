import { LocaleParamsType } from "../types";
import { useServerTranslation } from "@/lib/use-translation/use-server-translation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDate } from "@/lib/hermes-moment";
import { PhoneManagement, PhonesType } from "@/app/components/PhoneManagement";
import { prisma } from "@/lib/prisma";
import { auth, signOut } from "@/auth";
import { UsernameManagement } from "@/app/components/UsernameManagement";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CardType, FocusCards } from "@/components/ui/focus-cards";
import { $Enums } from "@prisma/client";
import Link from "next/link";
import { LogOut } from "lucide-react";

export default async function Home({ params }: LocaleParamsType) {
  const t = useServerTranslation(params.locale, "dashboard");

  const ctx = await auth();

  const handleAddReview = (review: string) => {
    //
  };

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: (ctx as any)?.user?.id as string,
    },
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      role: true,
      phones: true,
      image: true,
      createdAt: true,
      Review: {
        select: {
          id: true,
        },
      },
    },
  });

  const galleries = await prisma.gallery
    .findMany({
      where: {
        users: {
          some: {
            id: user?.id,
          },
        },
      },
      select: {
        id: true,
        slug: true,
        profilePicture: true,
        tumblrProfilePicture: true,
        private: true,
        category: true,
        createdAt: true,
        users: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },

        images: {
          select: {
            id: true,
            webp: true,
            tumblr: true,
            host: true,
          },
        },
      },
      orderBy: {
        id: "desc",
      },
    })
    .then((res): CardType[] =>
      res.map(
        (gallery): CardType => ({
          id: gallery.id,
          title: gallery.slug,
          src: gallery?.profilePicture ?? "",

          href: `/${params.locale}/gallery/${gallery.slug}/1`,
          blurDataURL: gallery?.tumblrProfilePicture ?? "",
          private: gallery.private,
          category: gallery.category,
          imagesCount: gallery.images.length,
          images: gallery.images,
          users: gallery.users,
        })
      )
    );

  return user ? (
    <main className="mx-auto px-4 sm:px-6 lg:px-8 py-8 container">
      <h1 className="mb-6 font-bold text-3xl text-center sm:text-left">
        {t("user-dashboard")}
      </h1>

      <Card className="mx-auto w-full max-w-4xl">
        <CardHeader className="flex">
          <div className="flex flex-wrap items-center gap-4">
            <Avatar className="w-24 h-24">
              <AvatarImage src={user.image ?? ""} alt={user.name ?? ""} />
              <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{user.name}</CardTitle>
              <UsernameManagement
                username={user.username ?? ""}
                defaultShowOpenButton={user.role.includes($Enums.role.ADMIN)}
              />
            </div>
            <form
              className="flex flex-1 justify-end justify-self-end"
              action={async () => {
                "use server";
                await signOut();
              }}
            >
              <Button
                size={"sm"}
                variant="destructive"
                className="flex gap-2 self-end"
                type="submit"
              >
                <span>{t("logout")}</span>
                <LogOut size={"1rem"} />
              </Button>
            </form>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-6">
            <div className="flex-1 min-w-[250px]">
              <h3 className="mb-2 font-semibold text-lg">
                {t("general-information")}
              </h3>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">{t("email")}:</span>{" "}
                  {user.email}
                </p>
                {user.role.includes($Enums.role.ADMIN) ? (
                  <span>
                    <span className="font-medium">{t("role")}:</span>{" "}
                    {user.role.map((roleItem) => (
                      <Badge key={roleItem}>{roleItem} </Badge>
                    ))}
                  </span>
                ) : (
                  <></>
                )}
                <p>
                  <span className="font-medium">{t("id")}:</span> {user.id}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <p className="text-muted-foreground text-sm">
                  {t("member-since")} :
                </p>
                <p className="font-medium">
                  {formatDate(new Date(user.createdAt), params.locale)}
                </p>
              </div>
            </div>
            <div className="flex-1 min-w-[250px]">
              <h3 className="mb-2 font-semibold text-lg">
                {t("phone-numbers")}
              </h3>
              <PhoneManagement
                phones={user.phones.map((p: any) => p as PhonesType) ?? []}
              />
            </div>
          </div>
          <div className="flex justify-center mt-6">
            {user.Review.length ? (
              <></>
            ) : (
              <Link
                href={`/${params.locale}/dashboard/create-review`}
                aria-label="leave a review"
              >
                <Button className="shadow-2xl"> {t("leave-a-review")}</Button>
              </Link>
            )}
          </div>
          <section className="flex flex-col justify-center gap-4 mt-6">
            <h3 className="mb-2 font-semibold text-lg">{t("my-galleries")}</h3>

            <FocusCards cards={galleries} className="justify-center" />
          </section>
        </CardContent>
      </Card>
    </main>
  ) : (
    <></>
  );
}
