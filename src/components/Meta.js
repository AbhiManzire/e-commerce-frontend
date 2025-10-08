import React from 'react';
import { Helmet } from 'react-helmet';

const Meta = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
    </Helmet>
  );
};

Meta.defaultProps = {
  title: 'MearnSneakers - Premium Sneaker Store',
  description: 'Your premier destination for authentic sneakers, exclusive releases, and unbeatable deals.',
  keywords: 'sneakers, shoes, nike, adidas, jordan, yeezy, new balance, authentic, exclusive'
};

export default Meta;
