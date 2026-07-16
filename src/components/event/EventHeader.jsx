import { motion } from "framer-motion";
import JCTitle1 from "./JCTitle1.png"

export default function EventHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <img
        src={JCTitle1}
        alt="Jittany Classic 2026 - The Spooky Jittany"
        className="w-full rounded-2xl object-cover"
      />
    </motion.div>
  );
}