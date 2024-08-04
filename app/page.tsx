import { NextUIProvider } from "@nextui-org/react";
import HomePage from "./pages"; // Renaming 'home' to 'HomePage' for better readability and consistency
import { Bounce, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  weight: ['300','400','500','600','700'],
  subsets: ['latin']
})

export default function Home() {
  return (
    <NextUIProvider>
      <div className={poppins.className}>
      <HomePage/>
      </div>  
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </NextUIProvider>
  );
}
