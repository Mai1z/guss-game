import { memo } from 'react';
import { Button } from 'antd';
import { RoundStatus } from '@/types/enums';
import styles from './GooseButton.module.scss';

interface GooseButtonProps {
  status: RoundStatus;
  onTap: () => void;
  loading?: boolean;
}

export const GooseButton = memo(function GooseButton({ 
  status, 
  onTap, 
}: GooseButtonProps) {
  const isDisabled = status !== RoundStatus.ACTIVE;

  return (
    <Button
      type="primary"
      size="large"
      disabled={isDisabled} 
      onClick={onTap}
      className={styles.gooseButton}
    >
      🦆
    </Button>
  );
});