import "./index.css";
import { createRoot } from "react-dom/client";
import App from "./App";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import UserInfoProvider from "./components/userInfo/UserInfoProvider";
import ToastInfoProvider from "./components/toaster/ToastInfoProvider";
import { ServerFacade } from "./network/ServerFacade";

declare global {
  interface Window {
    __TWEETER_API_URL__?: string;
  }
}

if (typeof window !== "undefined") {
  window.__TWEETER_API_URL__ =
    window.__TWEETER_API_URL__ ?? import.meta.env?.VITE_TWEETER_API_URL;
  ServerFacade.configure({ baseUrl: window.__TWEETER_API_URL__ });
}

library.add(fab);

const container = document.getElementById("root")!;
const root = createRoot(container);

root.render(
  <UserInfoProvider>
    <ToastInfoProvider>
      <App />
    </ToastInfoProvider>
  </UserInfoProvider>
);
