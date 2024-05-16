import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <div
        id="container"
        className="relative mx-auto h-[200dvh] w-full max-w-[430px] overflow-y-hidden bg-[#ffffff]"
      >
        <Head>
          <meta content="width=device-width, initial-scale=1" name="viewport" />
        </Head>

        <body>
          <Main />
          <NextScript />
        </body>
      </div>
    </Html>
  );
}
