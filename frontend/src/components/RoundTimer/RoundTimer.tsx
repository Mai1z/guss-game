import { useState, useEffect, memo } from 'react';
import { Typography } from 'antd';
import { getSecondsUntil, formatTimer } from '@/utils/format';
import styles from './RoundTimer.module.scss';

const { Text } = Typography;

interface RoundTimerProps {
  targetDate: string;
  label: string;
  onComplete?: () => void;
}

export const RoundTimer = memo(function RoundTimer({ 
  targetDate, 
  label, 
  onComplete 
}: RoundTimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(() => getSecondsUntil(targetDate));

  useEffect(() => {
    setSecondsLeft(getSecondsUntil(targetDate));
  }, [targetDate]);

  useEffect(() => {
    const interval = setInterval(() => {
      const seconds = getSecondsUntil(targetDate);
      setSecondsLeft(seconds);

      if (seconds === 0 && onComplete) {
        onComplete();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate, onComplete]);

  return (
    <div className={styles.timerContainer}>
      <Text className={styles.label}>
        {label}
      </Text>
      <br />
      <Text className={styles.time}>
        {formatTimer(secondsLeft)}
      </Text>
    </div>
  );
});