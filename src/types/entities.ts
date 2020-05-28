export type PostEntity = {
  data: {
    title?: string;
    description?: string;
    date?: string;
    image?: string;
    github?: string;
    npm?: string;
    author?: string;
  };
  url: string;
  path: string;
  html: string;
};
