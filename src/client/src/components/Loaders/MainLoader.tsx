import { useEffect } from "react";
import { cardio } from "ldrs";

const MainLoader = () => {
  useEffect(() => {
    cardio.register();
  }, []);

  return (
    <section className="w-full h-screen bg-gradient-to-r from-teal-500 to-emerald-500 flex items-center justify-center">
      <l-cardio size="50" stroke="4" speed="2" color="white"></l-cardio>
    </section>
  );
};

export default MainLoader;