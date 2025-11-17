import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Card, Typography, Tag, Space, message, Spin } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Layout } from '@/components';
import { useAuth } from '@/hooks/useAuth';
import { getRounds, createRound } from '@/api/endpoints';
import { formatDateTime } from '@/utils/format';
import { UserRole } from '@/types/enums';
import { ROUND_STATUS_COLORS, ROUND_STATUS_LABELS } from '@/constants';
import styles from './RoundsListPage.module.scss';
import { AxiosError } from 'axios';

const { Title, Text } = Typography;

export function RoundsListPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: rounds, isLoading } = useQuery({
    queryKey: ['rounds'],
    queryFn: getRounds,
    refetchInterval: 5000,
  });

  const createMutation = useMutation({
    mutationFn: createRound,
    onSuccess: (newRound) => {
      queryClient.invalidateQueries({ queryKey: ['rounds'] });
      message.success('Раунд создан!');
      navigate(`/rounds/${newRound.id}`);
    },
    onError: (error: AxiosError<{ error: string }>) => {
      const errorMessage = error.response?.data?.error || 'Ошибка создания раунда';
      message.error(errorMessage);
    },
  });

  const handleCreateRound = useCallback(() => {
    createMutation.mutate();
  }, [createMutation]);

  const handleRoundClick = useCallback((roundId: string) => {
    navigate(`/rounds/${roundId}`);
  }, [navigate]);

  if (isLoading) {
    return (
      <Layout>
        <div className={styles.loader}>
          <Spin size="large" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.header}>
          <Title level={2}>Список раундов</Title>
          
          {user?.role === UserRole.ADMIN && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreateRound}
              loading={createMutation.isPending}
              size="large"
            >
              Создать раунд
            </Button>
          )}
        </div>

        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          {rounds?.map((round) => (
            <Card
              key={round.id}
              hoverable
              onClick={() => handleRoundClick(round.id)}
              className={styles.roundCard}
            >
              <div className={styles.roundInfo}>
                <Text strong>Round ID: {round.id}</Text>
                <Tag color={ROUND_STATUS_COLORS[round.status]}>
                  {ROUND_STATUS_LABELS[round.status]}
                </Tag>
              </div>
              
              <div className={styles.roundDates}>
                <Text type="secondary">
                  Start: {formatDateTime(round.startAt)}
                </Text>
                <Text type="secondary">
                  End: {formatDateTime(round.endAt)}
                </Text>
              </div>
            </Card>
          ))}

          {rounds?.length === 0 && (
            <Card>
              <Text type="secondary">Нет активных или запланированных раундов</Text>
            </Card>
          )}
        </Space>
      </div>
    </Layout>
  );
}