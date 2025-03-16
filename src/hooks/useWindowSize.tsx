//https://dev.to/kunalukey/how-to-create-your-own-usewindowsize-hook-in-reactjs-4g02
import { useState, useEffect } from "react";

function useWindowSize() {
  // Initial screen width and height
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [screenHeight, setScreenHeight] = useState(window.innerHeight);

  // Will run after mount
  useEffect(() => {
    // function to update screenWidth & screenHeight states
    function handleResize() {
      setScreenWidth(window.innerWidth);
      setScreenHeight(window.innerHeight);
    }

    // listen to resize event and update states
    window.addEventListener("resize", handleResize);

    // cleanup function to safely remove eventListener
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return { screenWidth, screenHeight };
}

export default useWindowSize;
