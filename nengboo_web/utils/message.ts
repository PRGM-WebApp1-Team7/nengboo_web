declare global {
  interface Window {
    ReactNativeWebView: any;
  }
}

export interface Message {
  message: string;
}
export const sendMessage = (data: Message) => {
  if (
    typeof window !== undefined &&
    window.hasOwnProperty("ReactNativeWebView")
  )
    window.ReactNativeWebView?.postMessage(JSON.stringify(data));
};
