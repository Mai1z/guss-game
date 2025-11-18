import { useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, Typography, Statistic, Space, Tag, Button, Spin, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Layout, GooseButton, RoundTimer } from '@/components';
import { getRoundById, tap } from '@/api/endpoints';
import { formatDateTime } from '@/utils/format';
import { RoundStatus } from '@/types/enums';
import { ROUND_STATUS_COLORS, ROUND_STATUS_LABELS } from '@/constants';
import styles from './RoundPage.module.scss';
import { AxiosError } from 'axios';

const { Title, Text } = Typography;

export function RoundPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  // Получаем детали раунда с автообновлением
  const { data: round, isLoading } = useQuery({
    queryKey: ['round', id],
    queryFn: () => getRoundById(id!),
    enabled: !!id,
    refetchInterval: (query) => {
      // Если раунд активен - обновляем каждую секунду для актуальной статистики
      const status = query.state.data?.status;
      return status === RoundStatus.ACTIVE ? 1000 : 5000;
    },
  });

  const tapMutation = useMutation({
    mutationFn: () => tap(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['round', id] });
    },
    onError: (error: AxiosError<{ error: string }>) => {
      const errorMessage = error.response?.data?.error || 'Ошибка тапа';
      message.error(errorMessage);
    },
  });

  const handleTap = useCallback(() => {
    tapMutation.mutate();
  }, [tapMutation]);

  const handleBack = useCallback(() => {
    navigate('/rounds');
  }, [navigate]);

  const handleTimerComplete = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['round', id] });
  }, [queryClient, id]);

  const formatNumber = useCallback((num: number) => {
    return num.toLocaleString('ru-RU');
  }, []);

  const roundState = useMemo(() => {
    if (!round) return null;

    return {
      isCooldown: round.status === RoundStatus.COOLDOWN,
      isActive: round.status === RoundStatus.ACTIVE,
      isFinished: round.status === RoundStatus.FINISHED,
    };
  }, [round]);

  if (isLoading || !round || !roundState) {
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
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={handleBack}
          className={styles.backButton}
        >
          К списку раундов
        </Button>

        <Card className={styles.card}>
          <div className={styles.header}>
            <Title level={3}>Раунд {round.id.slice(0, 8)}...</Title>
            <Tag color={ROUND_STATUS_COLORS[round.status]} className={styles.statusTag}>
              {ROUND_STATUS_LABELS[round.status]}
            </Tag>
          </div>

          <div className={styles.gooseContainer}>
            <GooseButton
              status={round.status}
              onTap={handleTap}
            />
          </div>

          {/* COOLDOWN состояние */}
          {roundState.isCooldown && (
            <div className={styles.stateContainer}>
              <Title level={4}>Cooldown</Title>
              <RoundTimer
                targetDate={round.startAt}
                label="До начала раунда"
                onComplete={handleTimerComplete}
              />
            </div>
          )}

          {/* ACTIVE состояние */}
          {roundState.isActive && (
            <div className={styles.stateContainer}>
              <Title level={4}>Раунд активен!</Title>
              <RoundTimer
                targetDate={round.endAt}
                label="До конца осталось"
                onComplete={handleTimerComplete}
              />
              <Statistic
                title="Мои очки"
                value={round.myStats.score}
                formatter={(value) => formatNumber(Number(value))}
                className={styles.myScore}
              />
            </div>
          )}

          {/* FINISHED состояние */}
          {roundState.isFinished && (
            <div className={styles.stateContainer}>
              <Title level={4}>Раунд завершен</Title>
              
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <div className={styles.statsGrid}>
                  <Statistic
                    title="Всего"
                    value={round.totalScore}
                    formatter={(value) => formatNumber(Number(value))}
                  />
                  
                  {round.winner && (
                    <Statistic
                      title={`Победитель - ${round.winner.username}`}
                      value={round.winner.score}
                      formatter={(value) => formatNumber(Number(value))}
                      valueStyle={{ color: '#52c41a' }}
                    />
                  )}
                  
                  <Statistic
                    title="Мои очки"
                    value={round.myStats.score}
                    formatter={(value) => formatNumber(Number(value))}
                  />
                </div>
              </Space>
            </div>
          )}

          {/* Даты раунда */}
          <div className={styles.dates}>
            <Text type="secondary">Start: {formatDateTime(round.startAt)}</Text>
            <Text type="secondary">End: {formatDateTime(round.endAt)}</Text>
          </div>
        </Card>
      </div>
    </Layout>
  );
}