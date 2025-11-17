import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from '@/hooks/useAuth';
import { login as loginApi } from '@/api/endpoints';
import styles from './LoginPage.module.scss';
import { AxiosError } from 'axios';

const { Title } = Typography;

interface LoginForm {
  username: string;
  password: string;
}

export function LoginPage() {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = useCallback(async (values: LoginForm) => {
    setLoading(true);
    try {
      const response = await loginApi(values);
      login(response.token, response.user);
      message.success('Добро пожаловать!');
      navigate('/rounds');
    } catch (error) {
      const errorMessage = (error as AxiosError<{ error: string }>)?.response?.data?.error || 'Ошибка входа';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [login, navigate]);

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <Title level={3} className={styles.title}>
          Войти
        </Title>
        
        <Form
          name="login"
          onFinish={handleSubmit}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            label="Имя пользователя"
            name="username"
            rules={[
              { required: true, message: 'Введите имя пользователя' },
              { min: 1, max: 50, message: 'От 1 до 50 символов' }
            ]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="Введите имя"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Пароль"
            name="password"
            rules={[
              { required: true, message: 'Введите пароль' },
              { min: 3, message: 'Минимум 3 символа' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Введите пароль"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              size="large"
              block
            >
              Войти
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}