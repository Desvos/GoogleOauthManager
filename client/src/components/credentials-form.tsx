import { useState } from "react";
import { Form, Input, Button, Row, Col } from "antd";

interface CredentialsFormProps {
  onSubmit: (clientId: string, clientSecret: string) => void;
}

export default function CredentialsForm({ onSubmit }: CredentialsFormProps) {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  // Set default values from localStorage
  const initialValues = {
    clientId: localStorage.getItem("clientId") || "",
    clientSecret: localStorage.getItem("clientSecret") || ""
  };
  
  const handleSubmit = (values: { clientId: string; clientSecret: string }) => {
    setLoading(true);
    // Simulate a small delay to show loading state
    setTimeout(() => {
      onSubmit(values.clientId, values.clientSecret);
      setLoading(false);
    }, 500);
  };
  
  return (
    <Form 
      form={form}
      initialValues={initialValues}
      onFinish={handleSubmit}
      layout="vertical"
    >
      <Form.Item
        name="clientId"
        label="Client ID"
        rules={[{ required: true, message: 'Please enter your Google Client ID' }]}
      >
        <Input placeholder="Your Google API Client ID" />
      </Form.Item>
      
      <Form.Item
        name="clientSecret"
        label="Client Secret"
        rules={[{ required: true, message: 'Please enter your Google Client Secret' }]}
      >
        <Input.Password placeholder="Your Google API Client Secret" />
      </Form.Item>
      
      <Form.Item>
        <Button 
          type="primary" 
          htmlType="submit" 
          loading={loading}
          block
        >
          {loading ? "Processing..." : "Authenticate with Google"}
        </Button>
      </Form.Item>
    </Form>
  );
}
