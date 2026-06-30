import { motion } from 'motion/react';

interface WordRevealProps {
  text: string;
  delay?: number;
  className?: string;
}

export const WordReveal = ({ text, delay = 0, className = "" }: WordRevealProps) => {
  const words = text.split(" ");
  return (
    <span aria-label={text} className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            delay: delay + i * 0.06,
            duration: 0.4,
            ease: [0.16, 1, 0.3, 1]
          }}
          style={{ display: "inline-block", marginRight: "0.25em" }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
};
