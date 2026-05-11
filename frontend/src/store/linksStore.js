export const INITIAL_LINKS = [];

export const INITIAL_BIO_PAGE = {
  username: '',
  displayName: '',
  bio: '',
  avatar: '',
  theme: 'dark-purple',
  links: []
};

export const generateId = () => Math.random().toString(36).substring(2, 9);
export const generateSlug = (url) => {
  const clean = url.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0].split('.')[0];
  return `${clean}-${Math.floor(Math.random() * 1000)}`;
};
