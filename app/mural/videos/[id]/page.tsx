import { notFound, redirect } from "next/navigation";
import { VIDEOS, videoHref } from "../_lib/data";
import { VideoPlayer } from "./video-player";

export function generateStaticParams() {
  return VIDEOS.filter((video) => !video.short).map(({ id }) => ({ id }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const video = VIDEOS.find((item) => item.id === id);
  if (!video) notFound();
  if (video.short) redirect(videoHref(video));
  return <VideoPlayer key={video.id} video={video} />;
}
