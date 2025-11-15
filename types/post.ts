export type PostType = {
  id?: string;
  title: string;
  slug: string;
  description: string;
  date: string;
  updated?: string;
  tags?: string[];
  coverImage?: string;
  readingTime?: string;
  content?: string;
  series?: string;
  draft?: boolean;
};

export type Heading = {
  id: string;
  level: number;
  text: string;
};
