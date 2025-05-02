import { useState } from 'react';
import { Button } from 'antd';
import { DownOutlined, RightOutlined, CopyOutlined } from '@ant-design/icons';

interface JsonViewProps {
  data: any;
  level?: number;
  isExpanded?: boolean;
}

export default function JsonView({ data, level = 0, isExpanded = true }: JsonViewProps) {
  const [expanded, setExpanded] = useState(isExpanded);
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };
  
  const indent = (level: number) => {
    return { paddingLeft: `${level * 20}px` };
  };
  
  if (data === null) {
    return <span style={{ color: '#999' }}>null</span>;
  }
  
  if (data === undefined) {
    return <span style={{ color: '#999' }}>undefined</span>;
  }
  
  if (typeof data === 'boolean') {
    return <span style={{ color: '#9370db' }}>{data.toString()}</span>;
  }
  
  if (typeof data === 'number') {
    return <span style={{ color: '#3498db' }}>{data}</span>;
  }
  
  if (typeof data === 'string') {
    return <span style={{ color: '#2ecc71' }}>"{data}"</span>;
  }
  
  if (Array.isArray(data)) {
    if (data.length === 0) {
      return <span style={{ color: '#999' }}>[]</span>;
    }
    
    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => setExpanded(!expanded)}>
          {expanded ? <DownOutlined style={{ fontSize: '12px' }} /> : <RightOutlined style={{ fontSize: '12px' }} />}
          <span style={{ color: '#666' }}>[{data.length}]</span>
        </div>
        
        {expanded && (
          <div style={{ marginLeft: '16px', borderLeft: '2px solid #eee', paddingLeft: '8px' }}>
            {data.map((item, index) => (
              <div key={index} style={indent(1)}>
                <span style={{ color: '#999' }}>{index}: </span>
                <JsonView data={item} level={level + 1} />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
  
  // Object
  const keys = Object.keys(data);
  
  if (keys.length === 0) {
    return <span style={{ color: '#999' }}>{}</span>;
  }
  
  return (
    <div style={{ fontFamily: 'monospace', fontSize: '14px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div 
          style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} 
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? <DownOutlined style={{ fontSize: '12px' }} /> : <RightOutlined style={{ fontSize: '12px' }} />}
          <span style={{ color: '#666' }}>{'{}'}</span>
        </div>
        
        {level === 0 && (
          <Button 
            type="text"
            size="small"
            icon={<CopyOutlined />}
            onClick={() => copyToClipboard(JSON.stringify(data, null, 2))}
          />
        )}
      </div>
      
      {expanded && (
        <div style={{ marginLeft: '16px', borderLeft: '2px solid #eee', paddingLeft: '8px' }}>
          {keys.map(key => (
            <div key={key} style={indent(1)}>
              <span style={{ color: '#f56' }}>"{key}"</span>: <JsonView data={data[key]} level={level + 1} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
