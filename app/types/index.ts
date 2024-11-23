export interface Visualization {
    title: string;
    type: 'wordcloud' | 'pie';
    data: Array<{
      text?: string;
      value: number;
      name?: string;
    }>;
  }
  
  export interface Keyword {
    label: string;
    score: number;
  }