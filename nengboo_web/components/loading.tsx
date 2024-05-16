import React from "react";
import loading from "@/public/loading.svg";
import Image from "next/image";

const Loading = () => {
  return (
    <Image
      src={loading}
      width={30}
      height={30}
      alt={"loading"}
      className="animate-spin infinite"
    />
  );
};

export default Loading;
