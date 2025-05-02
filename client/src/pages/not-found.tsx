import { Card, Result } from 'antd';

export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Card style={{ width: '100%', maxWidth: '500px' }}>
        <Result
          status="404"
          title="404"
          subTitle="Sorry, the page you visited does not exist."
        />
      </Card>
    </div>
  );
}
