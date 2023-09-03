import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const config = {
  runtime: "edge",
};

export default async function handler(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const hasImage = searchParams.has("image");
  const image = hasImage
    ? searchParams.get("image")
    : "https://dadgippity.com/_next/image?url=%2Fdad2.png&w=256&q=100";

  const hasQuestion = searchParams.has("question");
  const question = hasQuestion
    ? searchParams.get("question")?.slice(0, 100)
    : "DadGippity";

  const hasAnswer = searchParams.has("answer");
  const answer = hasAnswer
    ? searchParams.get("answer")?.slice(0, 100)
    : "When dad is not around to answer your questions";

  // if (!image) {
  //   return new ImageResponse(<>Visit with &quot;?image=vercel&quot;</>, {
  //     width: 1200,
  //     height: 630,
  //   });
  // }

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          fontSize: 50,
          width: "100%",
          height: "100%",
          color: "black",
          background: "#f6f6f6",
          paddingTop: 50,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img width={200} height={200} src={image} />
        <div style={{ fontWeight: "bolder" }}>{question}</div>
        <div style={{ fontSize: 30 }}>{answer}</div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
