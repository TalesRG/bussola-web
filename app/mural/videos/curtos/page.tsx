import { SHORTS } from "../_lib/data";
import { ShortVideos } from "./short-videos";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ video?: string }>;
}) {
  const { video } = await searchParams;
  const index = SHORTS.findIndex((item) => item.id === video);
  return <ShortVideos key={video} initialIndex={index >= 0 ? index : 1} />;
}
