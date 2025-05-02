import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight, Copy } from 'lucide-react';

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
    return <span className="text-gray-500">null</span>;
  }
  
  if (data === undefined) {
    return <span className="text-gray-500">undefined</span>;
  }
  
  if (typeof data === 'boolean') {
    return <span className="text-purple-600">{data.toString()}</span>;
  }
  
  if (typeof data === 'number') {
    return <span className="text-blue-600">{data}</span>;
  }
  
  if (typeof data === 'string') {
    return <span className="text-green-600">"{data}"</span>;
  }
  
  if (Array.isArray(data)) {
    if (data.length === 0) {
      return <span className="text-gray-500">[]</span>;
    }
    
    return (
      <div>
        <div className="flex items-center cursor-pointer" onClick={() => setExpanded(!expanded)}>
          {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          <span className="text-gray-500">[{data.length}]</span>
        </div>
        
        {expanded && (
          <div className="ml-4 border-l-2 border-gray-200 pl-2">
            {data.map((item, index) => (
              <div key={index} style={indent(1)}>
                <span className="text-gray-400">{index}: </span>
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
    return <span className="text-gray-500">{}</span>;
  }
  
  return (
    <div className="font-mono text-sm">
      <div className="flex justify-between items-center">
        <div 
          className="flex items-center cursor-pointer" 
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          <span className="text-gray-500">{'{}'}</span>
        </div>
        
        {level === 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => copyToClipboard(JSON.stringify(data, null, 2))}
          >
            <Copy className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {expanded && (
        <div className="ml-4 border-l-2 border-gray-200 pl-2">
          {keys.map(key => (
            <div key={key} style={indent(1)}>
              <span className="text-red-600">"{key}"</span>: <JsonView data={data[key]} level={level + 1} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
