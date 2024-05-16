declare global {
  interface Window {
    ReactNativeWebView: any;
  }
}

export interface Message {
  message: string;
}
export const sendMessage = (data: Message) => {
  try {
    if (
      typeof window !== undefined &&
      window.hasOwnProperty("ReactNativeWebView")
    )
      window.ReactNativeWebView?.postMessage(JSON.stringify(data));
  } catch (error) {}
};
