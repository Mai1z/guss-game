import { ReactNode, useCallback } from 'react';
import { Layout as AntLayout, Typography, Button } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import styles from './Layout.module.scss';

const { Header, Content } = AntLayout;
const { Text } = Typography;

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    logout();
    navigate('/login');
  }, [logout, navigate]);

  return (
    <AntLayout className={styles.layout}>
      <Header className={styles.header}>
        <Link to="/rounds" className={styles.logo}>
          🦆 The Last of Guss
        </Link>
        
        <div className={styles.userSection}>
          <Text className={styles.username}>
            {user?.username}
          </Text>
          <Button type="link" onClick={handleLogout} className={styles.logoutButton}>
            Выйти
          </Button>
        </div>
      </Header>
      
      <Content className={styles.content}>
        {children}
      </Content>
    </AntLayout>
  );
}